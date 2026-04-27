import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  category: string | null;
  level: string | null;
  equipmentRequired: string | null;
  exerciseType: string | null;
  targetMuscle: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

type ExerciseFilters = {
  equipment?: string;
  muscle?: string;
  level?: string;
};

interface UseExerciseCatalogReturn {
  exercises: ExerciseCatalogItem[];
  filteredExercises: ExerciseCatalogItem[];
  equipmentOptions: string[];
  muscleOptions: string[];
  levelOptions: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface ExerciseRow {
  id: number | string;
  name: string;
  category: string | null;
  level: string | null;
  equipment_required: string | null;
  exercise_type: string | null;
  target_muscle: string | null;
  primary_muscles: string[] | null;
  secondary_muscles: string[] | null;
}

function normalizeList(value: string[] | null) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeExerciseRow(row: ExerciseRow): ExerciseCatalogItem {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    level: row.level,
    equipmentRequired: row.equipment_required,
    exerciseType: row.exercise_type,
    targetMuscle: row.target_muscle,
    primaryMuscles: normalizeList(row.primary_muscles),
    secondaryMuscles: normalizeList(row.secondary_muscles),
  };
}

function uniqueSorted(values: (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b));
}

export function useExerciseCatalog(query = '', filters: ExerciseFilters = {}): UseExerciseCatalogReturn {
  const [exercises, setExercises] = useState<ExerciseCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    const { data, error: fetchError } = await supabase
      .from('exercises')
      .select('id, name, category, level, equipment_required, exercise_type, target_muscle, primary_muscles, secondary_muscles')
      .order('target_muscle', { ascending: true })
      .order('name', { ascending: true })
      .limit(500);

    if (!isMountedRef.current) return;

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setExercises(((data ?? []) as ExerciseRow[]).map(normalizeExerciseRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  const equipmentOptions = useMemo(() => ['All', ...uniqueSorted(exercises.map((exercise) => exercise.equipmentRequired))], [exercises]);
  const levelOptions = useMemo(() => ['All', ...uniqueSorted(exercises.map((exercise) => exercise.level))], [exercises]);
  const muscleOptions = useMemo(
    () => [
      'All',
      ...uniqueSorted(
        exercises.flatMap((exercise) => [exercise.targetMuscle, ...exercise.primaryMuscles, ...exercise.secondaryMuscles]),
      ),
    ],
    [exercises],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedEquipment = filters.equipment?.trim().toLowerCase() ?? 'all';
  const normalizedMuscle = filters.muscle?.trim().toLowerCase() ?? 'all';
  const normalizedLevel = filters.level?.trim().toLowerCase() ?? 'all';

  const filteredExercises = useMemo(
    () =>
      exercises.filter((exercise) => {
        const muscles = [exercise.targetMuscle, ...exercise.primaryMuscles, ...exercise.secondaryMuscles]
          .filter((value): value is string => Boolean(value))
          .map((value) => value.toLowerCase());
        const searchable = [
          exercise.name,
          exercise.category,
          exercise.level,
          exercise.equipmentRequired,
          exercise.exerciseType,
          exercise.targetMuscle,
          ...exercise.primaryMuscles,
          ...exercise.secondaryMuscles,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchesQuery = normalizedQuery === '' || searchable.includes(normalizedQuery);
        const matchesEquipment =
          normalizedEquipment === 'all' || exercise.equipmentRequired?.toLowerCase() === normalizedEquipment;
        const matchesMuscle = normalizedMuscle === 'all' || muscles.includes(normalizedMuscle);
        const matchesLevel = normalizedLevel === 'all' || exercise.level?.toLowerCase() === normalizedLevel;

        return matchesQuery && matchesEquipment && matchesMuscle && matchesLevel;
      }),
    [exercises, normalizedEquipment, normalizedLevel, normalizedMuscle, normalizedQuery],
  );

  return {
    exercises,
    filteredExercises,
    equipmentOptions,
    muscleOptions,
    levelOptions,
    loading,
    error,
    refresh,
  };
}
