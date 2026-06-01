// src/hooks/useExerciseCatalog.ts
// Loads the full exercise catalog joined with the exercise_equipment mapping
// so each exercise carries its supported gym equipment options.
//
// The legacy `equipment_required` text column on `exercises` is intentionally
// not used — `exercise_equipment` is the source of truth.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { EquipmentListItem } from './useEquipment';

/**
 * One option of equipment that can be used to perform an exercise.
 * `null` quantity means the gym does not currently track availability
 * for this equipment row (still selectable).
 */
export interface ExerciseEquipmentOption {
  id: string;
  name: string;
  category: string | null;
  location: string | null;
  quantity: number | null;
  description: string | null;
}

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  category: string | null;
  level: string | null;
  exerciseType: string | null;
  targetMuscle: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  /** All gym equipment items that can be used for this exercise. May be empty. */
  equipmentOptions: ExerciseEquipmentOption[];
}

export type ExerciseFilters = {
  equipment?: string;
  muscle?: string;
  level?: string;
};

interface UseExerciseCatalogReturn {
  exercises: ExerciseCatalogItem[];
  filteredExercises: ExerciseCatalogItem[];
  /** Display options for the equipment filter chip. */
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
  exercise_type: string | null;
  target_muscle: string | null;
  primary_muscles: string[] | null;
  secondary_muscles: string[] | null;
}

interface ExerciseEquipmentRow {
  exercise_id: number | string;
  equipment_id: number | string;
  gym_equipment: {
    id: number | string;
    name: string;
    category: string | null;
    location: string | null;
    available_count: number | null;
    description: string | null;
  } | null;
}

function normalizeList(value: string[] | null) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeExerciseRow(row: ExerciseRow, equipmentOptions: ExerciseEquipmentOption[]): ExerciseCatalogItem {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    level: row.level,
    exerciseType: row.exercise_type,
    targetMuscle: row.target_muscle,
    primaryMuscles: normalizeList(row.primary_muscles),
    secondaryMuscles: normalizeList(row.secondary_muscles),
    equipmentOptions,
  };
}

function uniqueSorted(values: (string | null | undefined)[]) {
  // Case-insensitive dedup: same muscle saved as "Biceps" and "biceps" should
  // collapse to one filter chip. We normalize to lowercase, then pretty() in
  // the UI re-capitalizes for display.
  const lowered = values
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase());
  return Array.from(new Set(lowered)).sort((a, b) => a.localeCompare(b));
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

    const [
      { data: exerciseData, error: exerciseError },
      { data: mappingData, error: mappingError },
    ] = await Promise.all([
      supabase
        .from('exercises')
        .select('id, name, category, level, exercise_type, target_muscle, primary_muscles, secondary_muscles')
        .order('target_muscle', { ascending: true })
        .order('name', { ascending: true })
        .limit(500),
      // exercise_equipment is the source of truth for exercise -> equipment.
      // We join into gym_equipment so the UI gets human-readable names.
      // available_count is mapped to `quantity` to match the EquipmentListItem shape.
      supabase
        .from('exercise_equipment')
        .select('exercise_id, equipment_id, gym_equipment(id, name, category, location, available_count, description)'),
    ]);

    if (!isMountedRef.current) return;

    if (exerciseError) {
      setError(exerciseError.message);
      setLoading(false);
      return;
    }
    if (mappingError) {
      setError(mappingError.message);
      setLoading(false);
      return;
    }

    // Group equipment options by exercise_id
    const optionsByExerciseId = new Map<string, ExerciseEquipmentOption[]>();
    for (const row of (mappingData ?? []) as ExerciseEquipmentRow[]) {
      // Supabase returns the joined row as either object or array depending on cardinality
      const joined = Array.isArray(row.gym_equipment) ? row.gym_equipment[0] : row.gym_equipment;
      if (!joined) continue;
      const exerciseId = String(row.exercise_id);
      const list = optionsByExerciseId.get(exerciseId);
      const option: ExerciseEquipmentOption = {
        id: String(joined.id),
        name: joined.name,
        category: joined.category,
        location: joined.location,
        quantity: joined.available_count,
        description: joined.description,
      };
      if (list) {
        list.push(option);
      } else {
        optionsByExerciseId.set(exerciseId, [option]);
      }
    }

    setExercises(
      ((exerciseData ?? []) as ExerciseRow[]).map((row) =>
        normalizeExerciseRow(row, optionsByExerciseId.get(String(row.id)) ?? []),
      ),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  // Equipment filter chip options derive from gym_equipment.category (via exercises[].equipmentOptions).
  // Individual equipment names are still shown inside each exercise card as selectable chips.
  const equipmentOptions = useMemo(
    () => [
      'All',
      ...uniqueSorted(exercises.flatMap((exercise) => exercise.equipmentOptions.map((option) => option.category))),
    ],
    [exercises],
  );
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

        // Equipment filter matches against category (broad bucket like "Free Weights"),
        // not individual equipment names. OR semantics: any mapped equipment whose
        // category matches passes the filter.
        const equipmentCategories = exercise.equipmentOptions
          .map((option) => option.category?.toLowerCase())
          .filter((value): value is string => Boolean(value));

        const searchable = [
          exercise.name,
          exercise.category,
          exercise.level,
          exercise.exerciseType,
          exercise.targetMuscle,
          ...exercise.primaryMuscles,
          ...exercise.secondaryMuscles,
          // Both equipment names and categories are searchable so a query for
          // "Bench Press" or "Free Weights" both work.
          ...exercise.equipmentOptions.map((option) => option.name),
          ...exercise.equipmentOptions.map((option) => option.category ?? ''),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchesQuery = normalizedQuery === '' || searchable.includes(normalizedQuery);
        // OR semantics: matches if ANY mapped equipment's category matches the filter (decision 9).
        const matchesEquipment = normalizedEquipment === 'all' || equipmentCategories.includes(normalizedEquipment);
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

// Re-export type for downstream consumers that want to type-check equipment options.
export type { EquipmentListItem };
