import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  target_muscle: string[];
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

interface CreateWorkoutInput {
  name: string;
  target_muscle: string[];
}

interface UseWorkoutsReturn {
  workouts: Workout[];
  activeWorkout: Workout | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createWorkout: (input: CreateWorkoutInput) => Promise<Workout>;
  endWorkout: (workoutId: string) => Promise<Workout>;
  getWorkout: (workoutId: string) => Promise<Workout>;
}

interface WorkoutRow {
  id: string;
  user_id: string;
  name: string;
  target_muscle: string[] | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

function normalizeWorkoutRow(row: WorkoutRow): Workout {
  return {
    id: String(row.id),
    user_id: row.user_id,
    name: row.name,
    target_muscle: row.target_muscle ?? [],
    started_at: row.started_at,
    ended_at: row.ended_at,
    created_at: row.created_at,
  };
}

export function useWorkouts(): UseWorkoutsReturn {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

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
      .select('id, user_id, name, target_muscle, started_at, ended_at, created_at')
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

  const createWorkout = useCallback(
    async ({ name, target_muscle }: CreateWorkoutInput): Promise<Workout> => {
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
          started_at: new Date().toISOString(),
        })
        .select('id, user_id, name, target_muscle, started_at, ended_at, created_at')
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

  const endWorkout = useCallback(async (workoutId: string): Promise<Workout> => {
    const { data, error: updateError } = await supabase
      .from('workouts')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', workoutId)
      .select('id, user_id, name, target_muscle, started_at, ended_at, created_at')
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

  const getWorkout = useCallback(async (workoutId: string): Promise<Workout> => {
    const { data, error: fetchError } = await supabase
      .from('workouts')
      .select('id, user_id, name, target_muscle, started_at, ended_at, created_at')
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
