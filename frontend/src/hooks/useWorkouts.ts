import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export type WorkoutSession = {
  id: string;
  name: string;
  startedAt: string;
  endedAt: string | null;
  durationMin: number | null;
  exerciseCount: number;
  totalSets: number;
  totalVolumeKg: number;
  source: 'supabase' | 'local';
};

type WorkoutRow = {
  id: string | number;
  name: string | null;
  started_at: string | null;
  ended_at: string | null;
};

type WorkoutExerciseRow = {
  id: string | number;
  workout_id: string | number;
};

type ExerciseSetRow = {
  workout_exercise_id: string | number;
  weight: number | null;
  reps: number | null;
  is_completed: boolean | null;
};

type WorkoutStats = {
  exerciseCount: number;
  totalSets: number;
  totalVolumeKg: number;
};

const emptyStats: WorkoutStats = {
  exerciseCount: 0,
  totalSets: 0,
  totalVolumeKg: 0,
};

function getDurationMin(startedAt: string | null, endedAt: string | null) {
  if (!startedAt || !endedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;

  return Math.max(1, Math.round((end - start) / 60_000));
}

function mapWorkoutRow(row: WorkoutRow, stats: WorkoutStats = emptyStats): WorkoutSession {
  return {
    id: String(row.id),
    name: row.name ?? 'Workout',
    startedAt: row.started_at ?? new Date().toISOString(),
    endedAt: row.ended_at ?? null,
    durationMin: getDurationMin(row.started_at, row.ended_at),
    exerciseCount: stats.exerciseCount,
    totalSets: stats.totalSets,
    totalVolumeKg: stats.totalVolumeKg,
    source: 'supabase',
  };
}

function localWorkout(name: string): WorkoutSession {
  return {
    id: `local-${Date.now()}`,
    name,
    startedAt: new Date().toISOString(),
    endedAt: null,
    durationMin: null,
    exerciseCount: 0,
    totalSets: 0,
    totalVolumeKg: 0,
    source: 'local',
  };
}

async function loadWorkoutStats(workoutIds: string[]) {
  const statsByWorkout = new Map<string, WorkoutStats>();
  workoutIds.forEach((id) => statsByWorkout.set(id, { ...emptyStats }));

  if (workoutIds.length === 0) return statsByWorkout;

  const { data: workoutExercises, error: exercisesError } = await supabase
    .from('workout_exercises')
    .select('id, workout_id')
    .in('workout_id', workoutIds);

  if (exercisesError) throw exercisesError;

  const exerciseRows = (workoutExercises ?? []) as WorkoutExerciseRow[];
  const workoutByExercise = new Map<string, string>();

  for (const row of exerciseRows) {
    const workoutId = String(row.workout_id);
    const exerciseId = String(row.id);
    workoutByExercise.set(exerciseId, workoutId);

    const current = statsByWorkout.get(workoutId) ?? { ...emptyStats };
    statsByWorkout.set(workoutId, { ...current, exerciseCount: current.exerciseCount + 1 });
  }

  const workoutExerciseIds = Array.from(workoutByExercise.keys());
  if (workoutExerciseIds.length === 0) return statsByWorkout;

  const { data: exerciseSets, error: setsError } = await supabase
    .from('exercise_sets')
    .select('workout_exercise_id, weight, reps, is_completed')
    .in('workout_exercise_id', workoutExerciseIds)
    .eq('is_completed', true);

  if (setsError) throw setsError;

  for (const set of (exerciseSets ?? []) as ExerciseSetRow[]) {
    const workoutId = workoutByExercise.get(String(set.workout_exercise_id));
    if (!workoutId) continue;

    const current = statsByWorkout.get(workoutId) ?? { ...emptyStats };
    const weight = set.weight ?? 0;
    const reps = set.reps ?? 0;
    statsByWorkout.set(workoutId, {
      ...current,
      totalSets: current.totalSets + 1,
      totalVolumeKg: current.totalVolumeKg + weight * reps,
    });
  }

  return statsByWorkout;
}

export function useWorkouts() {
  const { user } = useAuth();
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startWorkout = useCallback(
    async (name = 'Workout') => {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        const session = localWorkout(name);
        setActiveWorkout(session);
        setLoading(false);
        return session;
      }

      const startedAt = new Date().toISOString();
      const { data, error: insertError } = await supabase
        .from('workouts')
        .insert({ user_id: user.id, name, started_at: startedAt })
        .select('id,name,started_at,ended_at')
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        throw insertError;
      }

      const session = mapWorkoutRow(data as WorkoutRow);
      setActiveWorkout(session);
      setLoading(false);
      return session;
    },
    [user?.id],
  );

  const endWorkout = useCallback(
    async (session = activeWorkout) => {
      if (!session) return null;

      setLoading(true);
      setError(null);
      const endedAt = new Date().toISOString();

      if (session.source === 'local') {
        const endedSession = { ...session, endedAt, durationMin: getDurationMin(session.startedAt, endedAt) };
        setActiveWorkout(null);
        setHistory((prev) => [endedSession, ...prev]);
        setLoading(false);
        return endedSession;
      }

      const { data, error: updateError } = await supabase
        .from('workouts')
        .update({ ended_at: endedAt })
        .eq('id', session.id)
        .select('id,name,started_at,ended_at')
        .single();

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        throw updateError;
      }

      const endedSession = mapWorkoutRow(data as WorkoutRow);
      setActiveWorkout(null);
      setHistory((prev) => [endedSession, ...prev]);
      setLoading(false);
      return endedSession;
    },
    [activeWorkout],
  );

  const loadHistory = useCallback(
    async (limit = 20) => {
      if (!user?.id) return [];

      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('workouts')
        .select('id,name,started_at,ended_at')
        .eq('user_id', user.id)
        .not('ended_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        throw fetchError;
      }

      try {
        const rows = (data ?? []) as WorkoutRow[];
        const ids = rows.map((row) => String(row.id));
        const statsByWorkout = await loadWorkoutStats(ids);
        const sessions = rows.map((row) => mapWorkoutRow(row, statsByWorkout.get(String(row.id)) ?? emptyStats));
        setHistory(sessions);
        setLoading(false);
        return sessions;
      } catch (statsError) {
        const message = statsError instanceof Error ? statsError.message : 'Failed to load workout stats';
        setError(message);
        setLoading(false);
        throw statsError;
      }
    },
    [user?.id],
  );

  return {
    activeWorkout,
    history,
    loading,
    error,
    startWorkout,
    endWorkout,
    loadHistory,
  };
}
