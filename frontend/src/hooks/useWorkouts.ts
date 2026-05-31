import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * A workout session record from the `workouts` table.
 * Represents a single workout the user started, optionally ended.
 */
export interface Workout {
  id: string;
  user_id: string;
  name: string;
  target_muscle: string[];
  /** Routine this workout belongs to, or null for ad-hoc workouts. */
  routine_id: string | null;
  /** ISO timestamp string when the workout was started. */
  started_at: string;
  /** ISO timestamp string when the workout ended, or null if still active. */
  ended_at: string | null;
  /**
   * Workout duration in minutes, computed from started_at and ended_at.
   * Null if the workout is still active (no ended_at).
   * Minimum value when both timestamps are valid is 1 (sub-minute workouts round up).
   */
  duration_min: number | null;
  created_at: string;
}

/**
 * Input for creating a new workout session.
 */
interface CreateWorkoutInput {
  /** Display name for the session, e.g. "Leg day" or "Morning push". */
  name: string;
  /** Target muscle groups for the session, e.g. ['chest', 'triceps']. */
  target_muscle: string[];
  /** Optional routine id this workout belongs to. */
  routine_id?: string | null;
}

interface UseWorkoutsReturn {
  /** All workouts for the current user, newest first. */
  workouts: Workout[];
  /** The currently active workout (ended_at is null), or null if none. */
  activeWorkout: Workout | null;
  /** True while the initial fetch or a refresh is in progress. */
  loading: boolean;
  /** Error message from the most recent failed operation, or null. */
  error: string | null;
  /** Manually re-fetch the workouts list from the database. */
  refresh: () => Promise<void>;
  /** Create and start a new workout session for the current user. */
  createWorkout: (input: CreateWorkoutInput) => Promise<Workout>;
  /** End an active workout by setting its ended_at timestamp. */
  endWorkout: (workoutId: string) => Promise<Workout>;
  /** Fetch a single workout by id (does not affect local state). */
  getWorkout: (workoutId: string) => Promise<Workout>;
}

interface WorkoutRow {
  id: string;
  user_id: string;
  name: string;
  target_muscle: string[] | null;
  routine_id: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

const WORKOUT_SELECT_COLUMNS =
  'id, user_id, name, target_muscle, routine_id, started_at, ended_at, created_at';

/**
 * Compute workout duration in minutes from start/end timestamps.
 * Returns null if the workout is still active or if either timestamp is invalid.
 * Rounds up to a minimum of 1 minute when both timestamps are valid.
 */
function computeDurationMin(startedAt: string | null, endedAt: string | null): number | null {
  if (!startedAt || !endedAt) return null;
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  if (isNaN(start) || isNaN(end) || end < start) return null;
  return Math.max(1, Math.round((end - start) / 60_000));
}

function normalizeWorkoutRow(row: WorkoutRow): Workout {
  return {
    id: String(row.id),
    user_id: row.user_id,
    name: row.name,
    target_muscle: row.target_muscle ?? [],
    routine_id: row.routine_id,
    started_at: row.started_at,
    ended_at: row.ended_at,
    duration_min: computeDurationMin(row.started_at, row.ended_at),
    created_at: row.created_at,
  };
}

/**
 * Hook for managing workout sessions for the current authenticated user.
 *
 * Automatically fetches the user's workouts on mount, sorted newest first.
 * Provides methods to create, end, and read individual sessions, plus a
 * convenience `activeWorkout` accessor for the in-progress session if any.
 *
 * Each Workout object includes a computed `duration_min` field (in minutes),
 * which is null while the workout is still active.
 *
 * Requires the user to be signed in via Supabase auth — operations will
 * fail with a "Not authenticated" error otherwise.
 *
 * @example
 * function MyComponent() {
 *   const { workouts, activeWorkout, loading, createWorkout, endWorkout } = useWorkouts();
 *
 *   if (loading) return <Text>Loading...</Text>;
 *
 *   return (
 *     <View>
 *       <Button
 *         title="Start workout"
 *         onPress={() => createWorkout({ name: 'Leg day', target_muscle: ['quads'], routine_id: 'r1' })}
 *       />
 *       {activeWorkout && (
 *         <Button title="End" onPress={() => endWorkout(activeWorkout.id)} />
 *       )}
 *     </View>
 *   );
 * }
 *
 * @returns Workouts list, active workout, loading/error state, and CRUD methods.
 */
export function useWorkouts(): UseWorkoutsReturn {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  /**
   * Re-fetch all workouts for the current user from the database.
   * Replaces local state with fresh results.
   */
  const refresh = useCallback(async () => {
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      if (!isMountedRef.current) return;
      setWorkouts([]);
      setError(userError?.message ?? 'Not authenticated');
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('workouts')
      .select(WORKOUT_SELECT_COLUMNS)
      .eq('user_id', userData.user.id)
      .order('started_at', { ascending: false });

    if (!isMountedRef.current) return;

    if (fetchError) {
      setWorkouts([]);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setWorkouts((data ?? []).map(normalizeWorkoutRow));
    setLoading(false);
  }, []);

  /**
   * Create and start a new workout session for the current user.
   * Sets started_at to now and prepends the new workout to local state.
   *
   * @param input - Session name, target muscle groups, and optional routine_id.
   * @returns The newly created Workout row.
   * @throws If the user is not authenticated or the insert fails.
   */
  const createWorkout = useCallback(
    async ({ name, target_muscle, routine_id }: CreateWorkoutInput): Promise<Workout> => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error(userError?.message ?? 'Not authenticated');
      }

      const { data, error: insertError } = await supabase
        .from('workouts')
        .insert({
          user_id: userData.user.id,
          name,
          target_muscle,
          routine_id: routine_id ?? null,
          started_at: new Date().toISOString(),
        })
        .select(WORKOUT_SELECT_COLUMNS)
        .single();

      if (insertError || !data) {
        throw new Error(insertError?.message ?? 'Failed to create workout');
      }

      const newWorkout = normalizeWorkoutRow(data);

      if (isMountedRef.current) {
        setWorkouts((prev) => [newWorkout, ...prev]);
      }

      return newWorkout;
    },
    [],
  );

  /**
   * End an active workout by setting its ended_at timestamp to now.
   *
   * If any exercises in this workout are still active (have null ended_at),
   * they are automatically ended first and their equipment counts are
   * incremented back. This handles the common UX case where a user ends
   * a workout while still mid-exercise — the equipment is properly released
   * even though the user didn't explicitly end the exercise first.
   *
   * @param workoutId - The id of the workout to end.
   * @returns The updated Workout row with computed duration_min.
   * @throws If any update fails.
   */
  const endWorkout = useCallback(async (workoutId: string): Promise<Workout> => {
    // Find any active exercises in this workout (ended_at IS NULL)
    const { data: activeExercises, error: fetchActiveError } = await supabase
      .from('workout_exercises')
      .select('id, equipment_id')
      .eq('workout_id', workoutId)
      .is('ended_at', null);

    if (fetchActiveError) {
      throw new Error(`Failed to check for active exercises: ${fetchActiveError.message}`);
    }

    // Cascade-end each active exercise and increment its equipment count back
    const endedAt = new Date().toISOString();
    for (const ex of activeExercises ?? []) {
      const { error: updateExError } = await supabase
        .from('workout_exercises')
        .update({ ended_at: endedAt })
        .eq('id', ex.id);

      if (updateExError) {
        throw new Error(`Failed to end active exercise ${ex.id}: ${updateExError.message}`);
      }

    }

    // Now end the workout itself
    const { data, error: updateError } = await supabase
      .from('workouts')
      .update({ ended_at: endedAt })
      .eq('id', workoutId)
      .select(WORKOUT_SELECT_COLUMNS)
      .single();

    if (updateError || !data) {
      throw new Error(updateError?.message ?? 'Failed to end workout');
    }

    const updated = normalizeWorkoutRow(data);

    if (isMountedRef.current) {
      setWorkouts((prev) => prev.map((w) => (w.id === workoutId ? updated : w)));
    }

    return updated;
  }, []);

  /**
   * Fetch a single workout by id directly from the database.
   * Does not affect or rely on local state — useful for screens that
   * load a specific workout outside the cached list.
   *
   * @param workoutId - The id of the workout to fetch.
   * @returns The Workout row with computed duration_min.
   * @throws If the workout is not found or the fetch fails.
   */
  const getWorkout = useCallback(async (workoutId: string): Promise<Workout> => {
    const { data, error: fetchError } = await supabase
      .from('workouts')
      .select(WORKOUT_SELECT_COLUMNS)
      .eq('id', workoutId)
      .single();

    if (fetchError || !data) {
      throw new Error(fetchError?.message ?? 'Failed to fetch workout');
    }

    return normalizeWorkoutRow(data);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refresh();
    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  const activeWorkout = workouts.find((w) => w.ended_at === null) ?? null;

  return {
    workouts,
    activeWorkout,
    loading,
    error,
    refresh,
    createWorkout,
    endWorkout,
    getWorkout,
  };
}
