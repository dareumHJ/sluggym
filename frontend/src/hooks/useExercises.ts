import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';

export type ExerciseLogInput = {
  id: string;
  equipmentId?: string | null;
  name: string;
  sets: {
    kg: string | number | null;
    reps: string | number | null;
    completed: boolean;
  }[];
};

type SaveWorkoutExercisesInput = {
  workoutId: string | null | undefined;
  exercises: ExerciseLogInput[];
};

type WorkoutExerciseRow = {
  id: string | number;
};

function toOptionalNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function toRequiredNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function useExercises() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveWorkoutExercises = useCallback(async ({ workoutId, exercises }: SaveWorkoutExercisesInput) => {
    setSaving(true);
    setError(null);

    if (!workoutId || workoutId.startsWith('local-')) {
      setSaving(false);
      return { source: 'local' as const, savedExercises: 0, savedSets: 0 };
    }

    let savedExercises = 0;
    let savedSets = 0;

    for (const [exerciseIndex, exercise] of exercises.entries()) {
      const workoutExercisePayload: Record<string, string | number | null> = {
        workout_id: workoutId,
        order_index: exerciseIndex + 1,
      };

      const exerciseId = toOptionalNumber(exercise.id);
      const equipmentId = toOptionalNumber(exercise.equipmentId);
      if (exerciseId !== null) workoutExercisePayload.exercise_id = exerciseId;
      if (equipmentId !== null) workoutExercisePayload.equipment_id = equipmentId;

      const { data: workoutExercise, error: exerciseError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercisePayload)
        .select('id')
        .single();

      if (exerciseError) {
        setError(exerciseError.message);
        setSaving(false);
        throw exerciseError;
      }

      savedExercises++;
      const workoutExerciseId = String((workoutExercise as WorkoutExerciseRow).id);
      const setPayloads = exercise.sets
        .map((set, setIndex) => {
          const weight = toRequiredNumber(set.kg);
          const reps = toOptionalNumber(set.reps);
          if (!set.completed || weight === null || reps === null) return null;

          return {
            workout_exercise_id: workoutExerciseId,
            set_number: setIndex + 1,
            weight,
            reps,
            is_completed: true,
          };
        })
        .filter((payload): payload is NonNullable<typeof payload> => payload !== null);

      if (setPayloads.length === 0) continue;

      const { error: setsError } = await supabase.from('exercise_sets').insert(setPayloads);

      if (setsError) {
        setError(setsError.message);
        setSaving(false);
        throw setsError;
      }

      savedSets += setPayloads.length;
    }

    setSaving(false);
    return { source: 'supabase' as const, savedExercises, savedSets };
  }, []);

  return {
    saving,
    error,
    saveWorkoutExercises,
  };
}
