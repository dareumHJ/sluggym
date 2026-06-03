/**
 * useExercises hook — per-exercise lifecycle for workout sessions.
 *
 * Replaces the previous batch-save useExercises with a per-exercise
 * tracking design that lets the database reflect equipment usage in
 * real time (per the architecture decision in Sprint 2's team meeting).
 *
 * Key features:
 * - addExercise() / endExercise() through workout_exercises lifecycle rows
 * - Set logging (addSet, updateSet, deleteSet) with auto-renumbering on delete
 * - Read functions (getExercisesForWorkout, getActiveExercise) with nested sets
 * - hydrateActiveExercise() for restoring in-progress workout state on app load
 * - Enforces "one active exercise per workout" at the hook level
 *
 * Related Supabase changes (see backend/db/sprint2-policies-and-functions.sql):
 * - equipment availability triggers on workout_exercises lifecycle changes
 * - RLS policies on workout_exercises and exercise_sets restricting access to workout owner
 *
 * Note: This hook intentionally has a different API from the previous useExercises
 * (which only had saveWorkoutExercises). Components using the old API will need
 * to be refactored — that's a separate PR for the FE team.
 */

import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * A row from the `workout_exercises` table representing a single exercise
 * performed (or being performed) within a workout session.
 */
export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  equipment_id: string;
  order_index: number;
  /** ISO timestamp when the user started using this equipment. */
  started_at: string;
  /** ISO timestamp when the user finished, or null if still active. */
  ended_at: string | null;
  created_at: string;
}

/**
 * A row from the `exercise_sets` table representing one set
 * (e.g. "10 reps at 50kg") within a workout_exercise.
 */
export interface ExerciseSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  weight: number;
  reps: number;
  is_completed: boolean;
  created_at: string;
}

/**
 * Minimal exercise metadata joined from the `exercises` table.
 * Provides human-readable display fields for the history detail UI.
 */
export interface ExerciseInfo {
  id: string;
  name: string;
  target_muscle: string;
  exercise_type: string;
}

/**
 * Minimal equipment metadata joined from the `gym_equipment` table.
 */
export interface EquipmentInfo {
  id: string;
  name: string;
  category: string;
}

/**
 * A workout_exercise row joined with all its exercise_sets.
 * Returned by getExercisesForWorkout and getActiveExercise.
 */
export interface WorkoutExerciseWithSets extends WorkoutExercise {
  sets: ExerciseSet[];
  exercise: ExerciseInfo | null;
  equipment: EquipmentInfo | null;
}

interface AddExerciseInput {
  workoutId: string;
  exerciseId: string;
  equipmentId: string;
  orderIndex: number;
}

interface AddSetInput {
  workoutExerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted?: boolean;
}

interface UpdateSetInput {
  setId: string;
  weight?: number;
  reps?: number;
  isCompleted?: boolean;
}

interface UseExercisesReturn {
  /** The currently in-progress exercise (ended_at is null), or null if none. */
  activeExercise: WorkoutExercise | null;
  /** Sets for the active exercise, ordered by set_number ascending. */
  setsForActiveExercise: ExerciseSet[];
  /** True while a hook operation is in progress. */
  loading: boolean;
  /** Error message from the most recent failed operation, or null. */
  error: string | null;
  /** Start a new exercise; DB triggers reserve equipment. */
  addExercise: (input: AddExerciseInput) => Promise<WorkoutExercise>;
  /** End an active exercise; DB triggers release equipment. */
  endExercise: (workoutExerciseId: string, equipmentId: string) => Promise<WorkoutExercise>;
  /** Add a set to an exercise. */
  addSet: (input: AddSetInput) => Promise<ExerciseSet>;
  /** Update fields on an existing set. */
  updateSet: (input: UpdateSetInput) => Promise<ExerciseSet>;
  /** Delete a set; renumbers remaining sets to stay contiguous. */
  deleteSet: (setId: string) => Promise<void>;
  /**
   * Hard-delete an exercise (workout_exercises row) along with all its sets
   * via the FK cascade. If the exercise was still active (ended_at IS NULL),
   * DB triggers release the equipment.
   */
  deleteExercise: (workoutExerciseId: string) => Promise<void>;
  /**
   * Fetch all exercises for a workout, with their sets nested.
   * Sorted by exercise order_index, then set_number within each exercise.
   * Does not affect local state.
   */
  getExercisesForWorkout: (workoutId: string) => Promise<WorkoutExerciseWithSets[]>;
  /**
   * Fetch the active (in-progress) exercise for a workout, with its sets.
   * Returns null if no exercise is active. Does not affect local state.
   */
  getActiveExercise: (workoutId: string) => Promise<WorkoutExerciseWithSets | null>;
  /**
   * Convenience function: calls getActiveExercise and populates local state
   * (activeExercise + setsForActiveExercise). Use when the app loads to
   * restore in-progress workout state.
   */
  hydrateActiveExercise: (workoutId: string) => Promise<WorkoutExerciseWithSets | null>;
}

interface WorkoutExerciseRow {
  id: string | number;
  workout_id: string;
  exercise_id: string | number;
  equipment_id: string | number;
  order_index: number;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

interface ExerciseSetRow {
  id: string | number;
  workout_exercise_id: string | number;
  set_number: number;
  weight: number | string | null;
  reps: number | null;
  is_completed: boolean | null;
  created_at: string;
}

/**
 * Row shape returned by Supabase nested select.
 * The exercise_sets are nested as an array.
 */
interface WorkoutExerciseWithSetsRow extends WorkoutExerciseRow {
  exercise_sets: ExerciseSetRow[];
  exercise: ExerciseInfoRow | null;
  equipment: EquipmentInfoRow | null;
}

interface ExerciseInfoRow {
  id: string | number;
  name: string;
  target_muscle: string | null;
  exercise_type: string | null;
}

interface EquipmentInfoRow {
  id: string | number;
  name: string;
  category: string | null;
}

function normalizeWorkoutExerciseRow(row: WorkoutExerciseRow): WorkoutExercise {
  return {
    id: String(row.id),
    workout_id: row.workout_id,
    exercise_id: String(row.exercise_id),
    equipment_id: String(row.equipment_id),
    order_index: row.order_index,
    started_at: row.started_at,
    ended_at: row.ended_at,
    created_at: row.created_at,
  };
}

function normalizeExerciseSetRow(row: ExerciseSetRow): ExerciseSet {
  return {
    id: String(row.id),
    workout_exercise_id: String(row.workout_exercise_id),
    set_number: row.set_number,
    weight: typeof row.weight === 'string' ? parseFloat(row.weight) : (row.weight ?? 0),
    reps: row.reps ?? 0,
    is_completed: row.is_completed ?? false,
    created_at: row.created_at,
  };
}

/**
 * Combine a workout_exercise row with its sets into a single object
 * with sets sorted ascending by set_number.
 */
function normalizeWorkoutExerciseWithSets(row: WorkoutExerciseWithSetsRow): WorkoutExerciseWithSets {
  const exercise = normalizeWorkoutExerciseRow(row);
  const sets = (row.exercise_sets ?? [])
    .map(normalizeExerciseSetRow)
    .sort((a, b) => a.set_number - b.set_number);

  const exerciseInfo: ExerciseInfo | null = row.exercise
    ? {
        id: String(row.exercise.id),
        name: row.exercise.name,
        target_muscle: row.exercise.target_muscle ?? '',
        exercise_type: row.exercise.exercise_type ?? '',
      }
    : null;

  const equipmentInfo: EquipmentInfo | null = row.equipment
    ? {
        id: String(row.equipment.id),
        name: row.equipment.name,
        category: row.equipment.category ?? '',
      }
    : null;
  
  return { ...exercise, sets, exercise: exerciseInfo, equipment: equipmentInfo };
}

/**
 * Hook for managing per-exercise lifecycle within a workout session.
 *
 * Tracks individual exercises in real time so the database always reflects
 * which equipment is currently in use. Availability changes are handled by
 * database triggers when workout_exercises rows start, finish, or delete.
 *
 * Also tracks sets (weight, reps) for the currently active exercise, and
 * provides read functions for fetching exercises (with sets) for any workout.
 *
 * Requires the user to be signed in via AuthContext — operations will fail
 * with a "Not authenticated" error otherwise.
 *
 * @example
 * function ExerciseLogger({ workoutId }) {
 *   const {
 *     activeExercise,
 *     setsForActiveExercise,
 *     addExercise,
 *     endExercise,
 *     addSet,
 *     hydrateActiveExercise,
 *   } = useExercises();
 *
 *   // Restore active exercise when component mounts
 *   useEffect(() => {
 *     hydrateActiveExercise(workoutId);
 *   }, [workoutId]);
 *
 *   const startBenchPress = async () => {
 *     await addExercise({ workoutId, exerciseId: '875', equipmentId: '143', orderIndex: 1 });
 *   };
 * }
 */
export function useExercises(): UseExercisesReturn {
  const { user } = useAuth();
  const [activeExercise, setActiveExercise] = useState<WorkoutExercise | null>(null);
  const [setsForActiveExercise, setSetsForActiveExercise] = useState<ExerciseSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExercise = useCallback(
    async ({ workoutId, exerciseId, equipmentId, orderIndex }: AddExerciseInput): Promise<WorkoutExercise> => {
      if (!user?.id) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      
      // Enforce one active exercise per workout
      const { data: existingActive, error: checkError } = await supabase
        .from('workout_exercises')
        .select('id')
        .eq('workout_id', workoutId)
        .is('ended_at', null);

      if (checkError) {
        setError(checkError.message);
        setLoading(false);
        throw new Error(checkError.message);
      }

      if (existingActive && existingActive.length > 0) {
        const message = 'Cannot start a new exercise while another is still active. End the current exercise first.';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const { data, error: insertError } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: workoutId,
          exercise_id: Number(exerciseId),
          equipment_id: Number(equipmentId),
          order_index: orderIndex,
          started_at: new Date().toISOString(),
        })
        .select('id, workout_id, exercise_id, equipment_id, order_index, started_at, ended_at, created_at')
        .single();

      if (insertError || !data) {
        // violation of the equipment count check constraint returns a 23514 error code
        if (insertError.code === '23514') {
          const message = 'This equipment was just claimed by someone else. Please choose another option.';
          setError(message);
          setLoading(false);
          throw new Error(message);
        }
        const message = insertError.message ?? 'Failed to add exercise';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const newExercise = normalizeWorkoutExerciseRow(data as WorkoutExerciseRow);

      setActiveExercise(newExercise);
      setSetsForActiveExercise([]);
      setLoading(false);
      return newExercise;
    },
    [user?.id],
  );

  const endExercise = useCallback(
    async (workoutExerciseId: string, equipmentId: string): Promise<WorkoutExercise> => {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('workout_exercises')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', Number(workoutExerciseId))
        .select('id, workout_id, exercise_id, equipment_id, order_index, started_at, ended_at, created_at')
        .single();

      if (updateError || !data) {
        const message = updateError?.message ?? 'Failed to end exercise';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const updated = normalizeWorkoutExerciseRow(data as WorkoutExerciseRow);

      if (activeExercise?.id === workoutExerciseId) {
        setActiveExercise(null);
        setSetsForActiveExercise([]);
      }

      setLoading(false);
      return updated;
    },
    [activeExercise?.id],
  );

  const addSet = useCallback(
    async ({ workoutExerciseId, setNumber, weight, reps, isCompleted = false }: AddSetInput): Promise<ExerciseSet> => {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('exercise_sets')
        .insert({
          workout_exercise_id: Number(workoutExerciseId),
          set_number: setNumber,
          weight,
          reps,
          is_completed: isCompleted,
        })
        .select('id, workout_exercise_id, set_number, weight, reps, is_completed, created_at')
        .single();

      if (insertError || !data) {
        const message = insertError?.message ?? 'Failed to add set';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const newSet = normalizeExerciseSetRow(data as ExerciseSetRow);

      if (activeExercise?.id === workoutExerciseId) {
        setSetsForActiveExercise((prev) =>
          [...prev, newSet].sort((a, b) => a.set_number - b.set_number),
        );
      }

      setLoading(false);
      return newSet;
    },
    [activeExercise?.id],
  );

  const updateSet = useCallback(
    async ({ setId, weight, reps, isCompleted }: UpdateSetInput): Promise<ExerciseSet> => {
      setLoading(true);
      setError(null);

      const updates: Record<string, number | boolean> = {};
      if (weight !== undefined) updates.weight = weight;
      if (reps !== undefined) updates.reps = reps;
      if (isCompleted !== undefined) updates.is_completed = isCompleted;

      if (Object.keys(updates).length === 0) {
        const message = 'No set fields provided to update';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const { data, error: updateError } = await supabase
        .from('exercise_sets')
        .update(updates)
        .eq('id', Number(setId))
        .select('id, workout_exercise_id, set_number, weight, reps, is_completed, created_at')
        .single();

      if (updateError || !data) {
        const message = updateError?.message ?? 'Failed to update set';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const updated = normalizeExerciseSetRow(data as ExerciseSetRow);

      setSetsForActiveExercise((prev) =>
        prev.map((s) => (s.id === setId ? updated : s)),
      );

      setLoading(false);
      return updated;
    },
    [],
  );

  const deleteSet = useCallback(
    async (setId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      const { data: setData, error: fetchError } = await supabase
        .from('exercise_sets')
        .select('id, workout_exercise_id, set_number, weight, reps, is_completed, created_at')
        .eq('id', Number(setId))
        .single();

      if (fetchError || !setData) {
        const message = fetchError?.message ?? 'Set not found';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const deletedSet = normalizeExerciseSetRow(setData as ExerciseSetRow);

      const { error: deleteError } = await supabase
        .from('exercise_sets')
        .delete()
        .eq('id', Number(setId));

      if (deleteError) {
        const message = deleteError.message;
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const { data: higherSets, error: higherFetchError } = await supabase
        .from('exercise_sets')
        .select('id, set_number')
        .eq('workout_exercise_id', deletedSet.workout_exercise_id)
        .gt('set_number', deletedSet.set_number);

      if (higherFetchError) {
        const message = `Set deleted but failed to renumber remaining: ${higherFetchError.message}`;
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      for (const row of higherSets ?? []) {
        const { error: renumberError } = await supabase
          .from('exercise_sets')
          .update({ set_number: row.set_number - 1 })
          .eq('id', row.id);

        if (renumberError) {
          const message = `Renumbering failed at set ${row.set_number}: ${renumberError.message}`;
          setError(message);
          setLoading(false);
          throw new Error(message);
        }
      }

      if (activeExercise?.id === deletedSet.workout_exercise_id) {
        setSetsForActiveExercise((prev) =>
          prev
            .filter((s) => s.id !== setId)
            .map((s) =>
              s.set_number > deletedSet.set_number
                ? { ...s, set_number: s.set_number - 1 }
                : s,
            )
            .sort((a, b) => a.set_number - b.set_number),
        );
      }

      setLoading(false);
    },
    [activeExercise?.id],
  );

  /**
   * Hard-delete a workout_exercises row. Cascades to exercise_sets via FK.
   * If the row was still active (ended_at IS NULL), DB triggers release
   * the equipment.
   */
  const deleteExercise = useCallback(
    async (workoutExerciseId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      const { data: existingRow, error: fetchError } = await supabase
        .from('workout_exercises')
        .select('id, equipment_id, ended_at')
        .eq('id', Number(workoutExerciseId))
        .single();

      if (fetchError || !existingRow) {
        const message = fetchError?.message ?? 'Exercise not found';
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const { error: deleteError } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('id', Number(workoutExerciseId));

      if (deleteError) {
        const message = deleteError.message;
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      // Clear local active-exercise state if we just deleted the active one.
      if (activeExercise?.id === workoutExerciseId) {
        setActiveExercise(null);
        setSetsForActiveExercise([]);
      }

      setLoading(false);
    },
    [activeExercise?.id],
  );

  /**
   * Fetch all exercises for a workout, with their sets nested inside.
   *
   * Returns an array sorted by order_index. Within each exercise, sets are
   * sorted by set_number ascending. Does not affect hook local state.
   *
   * @param workoutId - The id of the workout to fetch exercises for
   * @returns Array of exercises with sets, possibly empty
   * @throws If the fetch fails
   */
  const getExercisesForWorkout = useCallback(
    async (workoutId: string): Promise<WorkoutExerciseWithSets[]> => {
      setLoading(true);
      setError(null);

      // Supabase nested select syntax: foreign-table-name(columns)
      // This joins exercise_sets via the foreign key relationship
      const { data, error: fetchError } = await supabase
        .from('workout_exercises')
        .select(`
          id, workout_id, exercise_id, equipment_id, order_index,
          started_at, ended_at, created_at,
          exercise:exercises (id, name, target_muscle, exercise_type),
          equipment:gym_equipment (id, name, category),
          exercise_sets (
            id, workout_exercise_id, set_number, weight, reps, is_completed, created_at
          )
        `)
        .eq('workout_id', workoutId)
        .order('order_index', { ascending: true });

      if (fetchError) {
        const message = fetchError.message;
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      const exercises = (data ?? []).map((row) =>
        normalizeWorkoutExerciseWithSets(row as unknown as WorkoutExerciseWithSetsRow),
      );

      setLoading(false);
      return exercises;
    },
    [],
  );

  /**
   * Fetch the active (in-progress) exercise for a workout, with its sets.
   *
   * Returns null if no exercise has ended_at = null in this workout.
   * Does not affect hook local state — use hydrateActiveExercise to also
   * populate state.
   *
   * @param workoutId - The id of the workout to check for active exercise
   * @returns The active exercise with sets, or null
   * @throws If the fetch fails
   */
  const getActiveExercise = useCallback(
    async (workoutId: string): Promise<WorkoutExerciseWithSets | null> => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('workout_exercises')
        .select(`
          id, workout_id, exercise_id, equipment_id, order_index,
          started_at, ended_at, created_at,
          exercise:exercises (id, name, target_muscle, exercise_type),
          equipment:gym_equipment (id, name, category),
          exercise_sets (
            id, workout_exercise_id, set_number, weight, reps, is_completed, created_at
          )
        `)
        .eq('workout_id', workoutId)
        .is('ended_at', null)
        .maybeSingle();

      if (fetchError) {
        const message = fetchError.message;
        setError(message);
        setLoading(false);
        throw new Error(message);
      }

      setLoading(false);
      if (!data) return null;
      return normalizeWorkoutExerciseWithSets(data as unknown as WorkoutExerciseWithSetsRow);
    },
    [],
  );

  /**
   * Fetch the active exercise for a workout AND populate local state.
   *
   * Call this on app load (or when entering a workout screen) to restore
   * in-progress state. If an active exercise is found, it becomes the new
   * activeExercise and its sets become setsForActiveExercise. If none is
   * found, local state is cleared.
   *
   * @param workoutId - The id of the workout to hydrate from
   * @returns The hydrated active exercise, or null
   * @throws If the fetch fails
   */
  const hydrateActiveExercise = useCallback(
    async (workoutId: string): Promise<WorkoutExerciseWithSets | null> => {
      const result = await getActiveExercise(workoutId);
      if (result) {
        const { sets, ...exerciseFields } = result;
        setActiveExercise(exerciseFields);
        setSetsForActiveExercise(sets);
      } else {
        setActiveExercise(null);
        setSetsForActiveExercise([]);
      }
      return result;
    },
    [getActiveExercise],
  );

  return {
    activeExercise,
    setsForActiveExercise,
    loading,
    error,
    addExercise,
    endExercise,
    addSet,
    updateSet,
    deleteSet,
    deleteExercise,
    getExercisesForWorkout,
    getActiveExercise,
    hydrateActiveExercise,
  };
}
