// src/hooks/useRoutineRecommendations.ts
// Fetches the data needed for the routine time recommendation feature and
// runs the pure scoring algorithm. See src/lib/routineRecommendations.ts.

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  buildRoutineRecommendations,
  toUITimeRecommendations,
  type EquipmentAvailabilitySample,
  type HeadcountSample,
  type RoutineInput,
  type RoutineTimeRecommendation,
  type UITimeRecommendation,
} from '../lib/routineRecommendations';

interface UseRoutineRecommendationsReturn {
  /** Algorithm-native recommendations (top N routines), already sorted by score desc. */
  recommendations: RoutineTimeRecommendation[];
  /** Same recommendations mapped to the UI component shape. */
  uiRecommendations: UITimeRecommendation[];
  loading: boolean;
  error: string | null;
  /** True when the user has no routines, or no routine has a logged workout yet. */
  empty: boolean;
  refresh: () => Promise<void>;
}

const WINDOW_DAYS = 30;
const TOP_N_ROUTINES = 3;

interface RoutineRow {
  id: string;
  name: string;
  goal: string | null;
  target_muscles: string[] | null;
  created_at: string;
}

interface RoutineWithLastUsedRow extends RoutineRow {
  last_used_at: string | null;
}

interface WorkoutRow {
  id: string;
  routine_id: string;
  ended_at: string | null;
}

interface WorkoutExerciseRow {
  workout_id: string;
  equipment_id: string;
  gym_equipment: { name: string } | { name: string }[] | null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Failed to load recommendation inputs.';
}

/** Compute ISO timestamp WINDOW_DAYS ago, used as the lower bound on history queries. */
function windowStart(): string {
  const now = new Date();
  const start = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return start.toISOString();
}

export function useRoutineRecommendations(): UseRoutineRecommendationsReturn {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RoutineTimeRecommendation[]>([]);
  const [uiRecommendations, setUiRecommendations] = useState<UITimeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setRecommendations([]);
      setUiRecommendations([]);
      setLoading(false);
      setError(null);
      setEmpty(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch the user's routines (with last_used_at for tie-breaking).
      const { data: routineRows, error: routinesError } = await supabase
        .from('routines_with_last_used')
        .select('id, name, goal, target_muscles, created_at, last_used_at');

      if (routinesError) throw routinesError;

      if (!routineRows || routineRows.length === 0) {
        setRecommendations([]);
        setUiRecommendations([]);
        setEmpty(true);
        setLoading(false);
        return;
      }

      // 2. For each routine, find its most recent completed workout.
      //    A routine with no completed workout cannot receive a recommendation.
      const { data: workoutRows, error: workoutsError } = await supabase
        .from('workouts')
        .select('id, routine_id, ended_at')
        .eq('user_id', user.id)
        .not('routine_id', 'is', null)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false });

      if (workoutsError) throw workoutsError;

      const latestWorkoutByRoutine = new Map<string, string>();
      for (const row of (workoutRows ?? []) as WorkoutRow[]) {
        if (row.routine_id && !latestWorkoutByRoutine.has(row.routine_id)) {
          latestWorkoutByRoutine.set(row.routine_id, row.id);
        }
      }

      const workoutIdsOfInterest = Array.from(latestWorkoutByRoutine.values());

      if (workoutIdsOfInterest.length === 0) {
        // Routines exist but none have a completed workout yet.
        setRecommendations([]);
        setUiRecommendations([]);
        setEmpty(true);
        setLoading(false);
        return;
      }

      // 3. Resolve equipment names for those workouts. The join walks
      //    workout_exercises.equipment_id -> gym_equipment.name.
      const { data: exerciseRows, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select('workout_id, equipment_id, gym_equipment(name)')
        .in('workout_id', workoutIdsOfInterest);

      if (exercisesError) throw exercisesError;

      const equipmentNamesByWorkout = new Map<string, Set<string>>();
      for (const row of (exerciseRows ?? []) as WorkoutExerciseRow[]) {
        // Supabase's PostgREST returns the joined row as either an object or array
        // depending on the relationship cardinality; both shapes are supported below.
        const joined = Array.isArray(row.gym_equipment) ? row.gym_equipment[0] : row.gym_equipment;
        const equipmentName = joined?.name;
        if (!equipmentName) continue;

        let set = equipmentNamesByWorkout.get(row.workout_id);
        if (!set) {
          set = new Set();
          equipmentNamesByWorkout.set(row.workout_id, set);
        }
        set.add(equipmentName);
      }

      // 4. Build RoutineInput[] for the algorithm.
      const routineInputs: RoutineInput[] = (routineRows as RoutineWithLastUsedRow[])
        .map((routine) => {
          const latestWorkoutId = latestWorkoutByRoutine.get(routine.id);
          const equipmentNames = latestWorkoutId
            ? Array.from(equipmentNamesByWorkout.get(latestWorkoutId) ?? [])
            : [];
          return {
            routineId: routine.id,
            routineName: routine.name,
            targetMuscles: routine.target_muscles ?? [],
            equipmentNames,
            lastUsedAt: routine.last_used_at,
          };
        });

      const eligibleRoutines = routineInputs.filter((routine) => routine.equipmentNames.length > 0);

      if (eligibleRoutines.length === 0) {
        // Routines exist with completed workouts, but none yielded equipment names
        // (very unusual — likely an unreferenced equipment_id). Treat as empty.
        setRecommendations([]);
        setUiRecommendations([]);
        setEmpty(true);
        setLoading(false);
        return;
      }

      // 5. Fetch historical samples within the 30-day window.
      const sinceIso = windowStart();
      const requiredEquipment = Array.from(
        new Set(eligibleRoutines.flatMap((routine) => routine.equipmentNames)),
      );

      const [{ data: availabilityRows, error: availabilityError }, { data: headcountRows, error: headcountError }] =
        await Promise.all([
          supabase
            .from('equipment_availability_history')
            .select('equipment_name, available_count, total_count, sampled_at')
            .in('equipment_name', requiredEquipment)
            .gte('sampled_at', sinceIso),
          supabase
            .from('gym_headcount_history')
            .select('count, sampled_at')
            .gte('sampled_at', sinceIso),
        ]);

      if (availabilityError) throw availabilityError;
      if (headcountError) throw headcountError;

      const availabilitySamples: EquipmentAvailabilitySample[] = (availabilityRows ?? []) as EquipmentAvailabilitySample[];
      const headcountSamples: HeadcountSample[] = (headcountRows ?? []) as HeadcountSample[];

      // 6. Run the algorithm.
      const result = buildRoutineRecommendations(
        eligibleRoutines,
        availabilitySamples,
        headcountSamples,
        TOP_N_ROUTINES,
      );

      setRecommendations(result);
      setUiRecommendations(toUITimeRecommendations(result));
      setEmpty(result.length === 0);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setRecommendations([]);
      setUiRecommendations([]);
      setEmpty(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    recommendations,
    uiRecommendations,
    loading,
    error,
    empty,
    refresh,
  };
}
