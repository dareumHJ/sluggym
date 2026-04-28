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
  /** ISO timestamp string when the workout was started. */
  started_at: string;
  /** ISO timestamp string when the workout ended, or null if still active. */
  ended_at: string | null;
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

/**
 * Hook for managing workout sessions for the current authenticated user.
 *
 * Automatically fetches the user's workouts on mount, sorted newest first.
 * Provides methods to create, end, and read individual sessions, plus a
 * convenience `activeWorkout` accessor for the in-progress session if any.
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
 *         onPress={() => createWorkout({ name: 'Leg day', target_muscle: ['quads'] })}
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

  /**
   * Create and start a new workout session for the current user.
   * Sets started_at to now and prepends the new workout to local state.
   *
   * @param input - Session name and target muscle groups.
   * @returns The newly created Workout row.
   * @throws If the user is not authenticated or the insert fails.
   */
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

  /**
   * End an active workout by setting its ended_at timestamp to now.
   * Updates the matching workout in local state.
   *
   * Note: this does not currently update gym_equipment.available_count —
   * that integration will be added when BE2's count-decrement logic lands.
   *
   * @param workoutId - The id of the workout to end.
   * @returns The updated Workout row.
   * @throws If the update fails.
   */
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

  /**
   * Fetch a single workout by id directly from the database.
   * Does not affect or rely on local state — useful for screens that
   * load a specific workout outside the cached list.
   *
   * @param workoutId - The id of the workout to fetch.
   * @returns The Workout row.
   * @throws If the workout is not found or the fetch fails.
   */
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
