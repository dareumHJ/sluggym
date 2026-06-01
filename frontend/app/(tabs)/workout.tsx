// app/(tabs)/workout.tsx — multi-routine workout logger with Supabase persistence
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme, Space, Radius, Size, withAlpha } from '../../src/constants/theme';
import { Card, Button, StatTile } from '../../src/components/primitives';
import { ExerciseFilterPanel } from '../../src/components/ExerciseFilterPanel';
import { useEquipment, type EquipmentListItem } from '../../src/hooks/useEquipment';
import {
  useExerciseCatalog,
  type ExerciseCatalogItem,
  type ExerciseEquipmentOption,
} from '../../src/hooks/useExerciseCatalog';
import { useExercises, type WorkoutExerciseWithSets } from '../../src/hooks/useExercises';
import { useWorkouts } from '../../src/hooks/useWorkouts';
import { useRoutines, type Routine } from '../../src/hooks/useRoutines';
import { validateWorkoutReps, validateWorkoutSetCount, validateWorkoutWeight } from '../../src/lib/validation';

function fmt(sec: number) { const m = Math.floor(sec/60), s = sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }

type WorkoutSet = { previous: string; kg: string; reps: string; completed: boolean };
type WorkoutExercise = {
  id: string;
  exerciseId: string;
  /** Null for exercises with no equipment mapping (e.g., bodyweight). */
  equipmentId: string | null;
  name: string;
  equipmentName: string;
  notes?: string;
  sets: WorkoutSet[];
};
type FieldName = 'kg' | 'reps';

const DEFAULT_WORKOUT_NAME = 'Workout Session';
const DEFAULT_ROUTINE_GOAL = 'Build consistency with a repeatable strength session.';
const EMPTY_SET: WorkoutSet = { previous: '—', kg: '', reps: '', completed: false };
const fieldKey = (exerciseId: string, setIndex: number, field: FieldName) => `${exerciseId}:${setIndex}:${field}`;

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function pretty(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(' ');
}

function formatLastUsed(lastUsedAt: string | null): string {
  if (!lastUsedAt) return 'Never used';
  const date = new Date(lastUsedAt);
  if (isNaN(date.getTime())) return 'Never used';

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 60) return diffMin <= 1 ? 'Just now' : `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

function createWorkoutExercise(
  exercise: ExerciseCatalogItem,
  equipment: ExerciseEquipmentOption | null,
): WorkoutExercise {
  return {
    id: `${exercise.id}:${equipment?.id ?? 'none'}:${Date.now()}`,
    exerciseId: exercise.id,
    equipmentId: equipment?.id ?? null,
    name: exercise.name,
    equipmentName: equipment?.name ?? 'No equipment needed',
    notes: exercise.targetMuscle ? pretty(exercise.targetMuscle) : undefined,
    sets: [{ ...EMPTY_SET }],
  };
}

function createRoutineWorkoutExercise(
  savedExercise: { id: string; exercise_id: string; equipment_id: string | null; sets: { weight: number; reps: number }[] },
  catalogExercises: ExerciseCatalogItem[],
  equipment: EquipmentListItem[],
): WorkoutExercise {
  const catalogExercise = catalogExercises.find((item) => item.id === savedExercise.exercise_id);
  const matchedEquipment = savedExercise.equipment_id
    ? equipment.find((item) => item.id === savedExercise.equipment_id) ?? null
    : null;
  const savedSets = savedExercise.sets.length > 0 ? savedExercise.sets : [{ weight: 0, reps: 0 }];

  return {
    id: `${savedExercise.exercise_id}:${savedExercise.equipment_id ?? 'none'}:${Date.now()}:${savedExercise.id}`,
    exerciseId: savedExercise.exercise_id,
    equipmentId: savedExercise.equipment_id,
    name: catalogExercise?.name ?? `Exercise #${savedExercise.exercise_id}`,
    equipmentName: matchedEquipment?.name ?? (savedExercise.equipment_id ? `Equipment #${savedExercise.equipment_id}` : 'No equipment needed'),
    notes: catalogExercise?.targetMuscle ? pretty(catalogExercise.targetMuscle) : undefined,
    sets: savedSets.map((set) => ({
      previous: set.weight > 0 && set.reps > 0 ? `${set.weight} kg × ${set.reps}` : '—',
      kg: '',
      reps: '',
      completed: false,
    })),
  };
}

export default function WorkoutScreen() {
  const t = useTheme();
  const { id: routineIdParam } = useLocalSearchParams<{ id?: string }>();
  const selectedRoutineId =
    typeof routineIdParam === 'string' && routineIdParam.length > 0 ? routineIdParam : null;

  const { routines, loading: routinesLoading, error: routinesError, refresh: refreshRoutines } = useRoutines();
  const { workouts, activeWorkout, createWorkout, endWorkout, loading: workoutLoading, error: workoutError } = useWorkouts();
  const {
    addExercise: persistExercise,
    addSet: persistSet,
    endExercise: finishPersistedExercise,
    getExercisesForWorkout,
    loading: exerciseSaving,
    error: exerciseSaveError,
  } = useExercises();
  const { equipment, loading: equipmentLoading, error: equipmentError, refresh: refreshEquipment } = useEquipment();
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [pickerEquipment, setPickerEquipment] = useState('All');
  const [pickerMuscle, setPickerMuscle] = useState('All');
  const [pickerLevel, setPickerLevel] = useState('All');
  const {
    exercises: catalogExercises,
    filteredExercises,
    equipmentOptions,
    muscleOptions,
    levelOptions,
    loading: catalogLoading,
    error: catalogError,
    refresh: refreshCatalog,
  } = useExerciseCatalog(exerciseQuery, {
    equipment: pickerEquipment,
    muscle: pickerMuscle,
    level: pickerLevel,
  });

  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [restSec, setRestSec] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [finishAttempted, setFinishAttempted] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [endError, setEndError] = useState<string | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [ending, setEnding] = useState(false);
  const [lastRoutineExercises, setLastRoutineExercises] = useState<WorkoutExerciseWithSets[]>([]);
  const [routineLoading, setRoutineLoading] = useState(false);
  const [routineError, setRoutineError] = useState<string | null>(null);
  const endingInFlight = ending || exerciseSaving;

  // If a workout is active, pin selection to its routine_id (so navigation can't lose context mid-workout)
  const activeRoutineId = activeWorkout?.routine_id ?? selectedRoutineId;
  const selectedRoutine: Routine | null = activeRoutineId
    ? routines.find((routine) => routine.id === activeRoutineId) ?? null
    : null;

  // workout timer
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // rest timer
  useEffect(() => {
    if (!restActive) return;
    const id = setInterval(() => {
      setRestSec(s => {
        if (s <= 1) { setRestActive(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restActive]);

  const elapsed = Math.floor((now - startedAt) / 1000);

  // Last completed workout *for this routine only*
  const lastCompletedWorkout = useMemo(() => {
    if (!activeRoutineId) return null;
    return (
      workouts.find(
        (workout) => workout.ended_at !== null && workout.routine_id === activeRoutineId,
      ) ?? null
    );
  }, [workouts, activeRoutineId]);

  useEffect(() => {
    let isCurrent = true;

    if (!lastCompletedWorkout || activeWorkout) {
      setLastRoutineExercises([]);
      setRoutineError(null);
      setRoutineLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    setRoutineLoading(true);
    setRoutineError(null);

    getExercisesForWorkout(lastCompletedWorkout.id)
      .then((savedExercises) => {
        if (!isCurrent) return;
        setLastRoutineExercises(savedExercises);
      })
      .catch((error) => {
        if (!isCurrent) return;
        setLastRoutineExercises([]);
        setRoutineError(getErrorMessage(error));
      })
      .finally(() => {
        if (isCurrent) setRoutineLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeWorkout, getExercisesForWorkout, lastCompletedWorkout]);

  const routineExercises = useMemo(
    () =>
      lastRoutineExercises.map((savedExercise) =>
        createRoutineWorkoutExercise(savedExercise, catalogExercises, equipment),
      ),
    [catalogExercises, equipment, lastRoutineExercises],
  );

  const routineGoal = useMemo(() => {
    if (selectedRoutine?.goal) return selectedRoutine.goal;
    const muscles = lastCompletedWorkout?.target_muscle ?? [];
    return muscles.length > 0 ? muscles.join(', ') : DEFAULT_ROUTINE_GOAL;
  }, [selectedRoutine, lastCompletedWorkout?.target_muscle]);

  const routineDisplayName = selectedRoutine?.name ?? DEFAULT_WORKOUT_NAME;

  const routineSetCount = useMemo(
    () => lastRoutineExercises.reduce((sum, exercise) => sum + exercise.sets.length, 0),
    [lastRoutineExercises],
  );

  const totals = useMemo(() => {
    let sets = 0, volume = 0;
    for (const ex of exercises) {
      for (const s of ex.sets) {
        if (s.completed && validateSet(s).isValid) {
          sets++;
          volume += parseNumber(s.kg) * parseNumber(s.reps);
        }
      }
    }
    return { sets, volume };
  }, [exercises]);

  const completedExerciseCount = useMemo(
    () => exercises.filter((exercise) => exercise.sets.some((set) => set.completed && validateSet(set).isValid)).length,
    [exercises],
  );

  const startRoutineSession = useCallback(async () => {
    if (!selectedRoutine) {
      setFormMessage('Pick a routine before starting a workout.');
      return;
    }

    setFormMessage(null);
    setEndError(null);
    setTouchedFields({});
    setFinishAttempted(false);
    setExercises(routineExercises);
    setExerciseQuery('');
    setStartedAt(Date.now());
    setNow(Date.now());

    try {
      await createWorkout({
        name: selectedRoutine.name,
        target_muscle: lastCompletedWorkout?.target_muscle ?? selectedRoutine.targetMuscles ?? [],
        routine_id: selectedRoutine.id,
      });
    } catch (error) {
      setFormMessage(getErrorMessage(error));
    }
  }, [createWorkout, lastCompletedWorkout?.target_muscle, routineExercises, selectedRoutine]);

  const addSelectedExercise = (exercise: ExerciseCatalogItem, matchedEquipment: ExerciseEquipmentOption | null) => {
    setExercises((prev) => [...prev, createWorkoutExercise(exercise, matchedEquipment)]);
    setTouchedFields({});
    setFormMessage(null);
    setShowExercisePicker(false);
    setExerciseQuery('');
    setPickerEquipment('All');
    setPickerMuscle('All');
    setPickerLevel('All');
  };

  const updateSet = (exIdx: number, sIdx: number, patch: Partial<WorkoutSet>) => {
    setExercises(prev => prev.map((e, i) => i === exIdx ? { ...e, sets: e.sets.map((s, j) => j === sIdx ? { ...s, ...patch } : s) } : e));
    setFormMessage(null);
  };

  const markTouched = (exerciseId: string, setIndex: number, field: FieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldKey(exerciseId, setIndex, field)]: true }));
  };

  const markSetTouched = (exerciseId: string, setIndex: number) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldKey(exerciseId, setIndex, 'kg')]: true,
      [fieldKey(exerciseId, setIndex, 'reps')]: true,
    }));
  };

  const shouldShowError = (exerciseId: string, setIndex: number, field: FieldName) =>
    finishAttempted || Boolean(touchedFields[fieldKey(exerciseId, setIndex, field)]);

  const hasInvalidCompletedSet = useMemo(
    () => exercises.some((exercise) => exercise.sets.some((set) => set.completed && !validateSet(set).isValid)),
    [exercises],
  );

  const requestEndSession = () => {
    setFinishAttempted(true);
    setEndError(null);

    if (!activeWorkout) {
      setFormMessage('Start a session before ending it.');
      return;
    }

    if (hasInvalidCompletedSet) {
      setFormMessage('Fix invalid completed sets before ending this session.');
      return;
    }
    setFormMessage(null);
    setShowEndModal(true);
  };

  const persistCompletedExercises = async () => {
    if (!activeWorkout) return;

    let orderIndex = 1;
    for (const exercise of exercises) {
      const completedSets = exercise.sets.filter((set) => set.completed && validateSet(set).isValid);
      if (completedSets.length === 0) continue;

      const workoutExercise = await persistExercise({
        workoutId: activeWorkout.id,
        exerciseId: exercise.exerciseId,
        equipmentId: exercise.equipmentId,
        orderIndex,
      });

      for (const [setIndex, set] of completedSets.entries()) {
        await persistSet({
          workoutExerciseId: workoutExercise.id,
          setNumber: setIndex + 1,
          weight: parseNumber(set.kg),
          reps: parseNumber(set.reps),
          isCompleted: true,
        });
      }

      await finishPersistedExercise(workoutExercise.id, exercise.equipmentId);
      orderIndex += 1;
    }
  };

  const confirmEndSession = async () => {
    if (!activeWorkout) return;

    setEnding(true);
    setEndError(null);

    try {
      await persistCompletedExercises();
      await endWorkout(activeWorkout.id);
      setShowEndModal(false);
      // Refresh routines so last_used_at sorts this routine to the top next time
      void refreshRoutines();
      router.replace(`/workout-summary?durationSec=${elapsed}&sets=${totals.sets}&volume=${totals.volume}&exerciseCount=${completedExerciseCount}`);
    } catch (error) {
      setEndError(getErrorMessage(error));
    } finally {
      setEnding(false);
    }
  };

  const toggleComplete = (exIdx: number, sIdx: number) => {
    const s = exercises[exIdx].sets[sIdx];
    if (!s.completed && !validateSet(s).isValid) {
      markSetTouched(exercises[exIdx].id, sIdx);
      setFormMessage('Enter a valid weight and reps before completing a set.');
      return;
    }

    setFormMessage(null);
    updateSet(exIdx, sIdx, { completed: !s.completed });
    if (!s.completed) { setRestSec(90); setRestActive(true); }
  };

  const addSet = (exIdx: number) => {
    setExercises(prev => prev.map((e, i) => {
      if (i !== exIdx) return e;
      const nextCount = e.sets.length + 1;
      const countResult = validateWorkoutSetCount(nextCount);
      if (!countResult.isValid) {
        setFormMessage(countResult.message);
        return e;
      }
      const last = e.sets[e.sets.length - 1];
      return { ...e, sets: [...e.sets, { previous: last?.previous ?? '—', kg: last?.kg ?? '', reps: '', completed: false }] };
    }));
  };

  const handleSelectRoutine = (routine: Routine) => {
    router.setParams({ id: routine.id });
  };

  const handleClearSelection = () => {
    router.setParams({ id: undefined });
  };

  // ============================================================
  // Render: No active workout, no routine selected → routine list
  // ============================================================
  if (!activeWorkout && !selectedRoutineId) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: t.bg }}
        contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}
      >
        <Text
          style={{
            color: t.textSecondary,
            fontSize: Size.xs,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontWeight: '700',
            marginBottom: Space.sm,
          }}
        >
          Your routines
        </Text>
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>
          Pick a routine
        </Text>
        <Text
          style={{
            color: t.textSecondary,
            fontSize: Size.md,
            lineHeight: 22,
            marginTop: Space.sm,
            marginBottom: Space.lg,
          }}
        >
          Each routine builds itself from the workouts you log under it. Pick one to see its last session and start again.
        </Text>

        {routinesLoading && routines.length === 0 ? (
          <Card style={{ alignItems: 'center', gap: Space.sm }}>
            <ActivityIndicator color={t.primary} />
            <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading your routines…</Text>
          </Card>
        ) : routinesError ? (
          <Card style={{ gap: Space.sm }}>
            <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '800' }}>
              Could not load routines
            </Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>{routinesError}</Text>
            <Button title="Retry" variant="secondary" onPress={() => void refreshRoutines()} />
          </Card>
        ) : routines.length === 0 ? (
          <Card style={{ gap: Space.md }}>
            <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>No routines yet</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
              Create your first routine to start tracking your workouts. Exercises and sets will be recorded once you start a workout.
            </Text>
            <Button title="Create your first routine" size="lg" onPress={() => router.push('/routines')} />
          </Card>
        ) : (
          <View style={{ gap: Space.sm }}>
            {routines.map((routine) => (
              <Card key={routine.id} style={{ gap: Space.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
                  <Pressable
                    onPress={() => handleSelectRoutine(routine)}
                    style={{ flex: 1, gap: 4 }}
                  >
                    <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>{routine.name}</Text>
                    {routine.goal ? (
                      <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 18 }} numberOfLines={2}>
                        {routine.goal}
                      </Text>
                    ) : null}
                    <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: 2 }}>
                      {formatLastUsed(routine.lastUsedAt)}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push(`/routines?id=${routine.id}`)}
                    style={{
                      paddingHorizontal: Space.md,
                      paddingVertical: 8,
                      borderRadius: Radius.full,
                      backgroundColor: withAlpha(t.primary, 0.12),
                    }}
                  >
                    <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '900' }}>Edit</Text>
                  </Pressable>
                </View>
              </Card>
            ))}

            <Pressable
              onPress={() => router.push('/routines')}
              style={{
                marginTop: Space.sm,
                paddingVertical: Space.md,
                borderRadius: Radius.lg,
                backgroundColor: t.surface2,
                borderWidth: 1,
                borderColor: t.borderLight,
                borderStyle: 'dashed',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: t.primary, fontSize: Size.sm, fontWeight: '900' }}>+ New routine</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    );
  }

  // =====================================================================
  // Render: Routine selected (no active workout) → routine preview + start
  // =====================================================================
  if (!activeWorkout) {
    // Edge case: routine id in URL but routine list still loading or routine deleted
    if (routinesLoading && !selectedRoutine) {
      return (
        <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={t.primary} />
          <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: Space.sm }}>Loading routine…</Text>
        </View>
      );
    }
    if (!selectedRoutine) {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: t.bg }}
          contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}
        >
          <Card style={{ gap: Space.sm }}>
            <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>Routine not found</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
              This routine may have been deleted. Go back to your routine list.
            </Text>
            <Button title="Back to routines" onPress={handleClearSelection} />
          </Card>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.sm, marginBottom: Space.sm }}>
          <Pressable
            onPress={handleClearSelection}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.surface2,
            }}
          >
            <Text style={{ color: t.text, fontSize: Size.lg }}>‹</Text>
          </Pressable>
          <Text
            style={{
              color: t.textSecondary,
              fontSize: Size.xs,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              fontWeight: '700',
            }}
          >
            Routine
          </Text>
        </View>
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>
          {routineDisplayName}
        </Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.md, lineHeight: 22, marginTop: Space.sm, marginBottom: Space.lg }}>
          {routineGoal}
        </Text>

        <Card style={{ gap: Space.md, marginBottom: Space.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>Routine contents</Text>
              {lastCompletedWorkout ? (
                <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: 3 }}>
                  Last workout · {routineExercises.length} exercises · {routineSetCount} sets
                </Text>
              ) : null}
            </View>
            {routineLoading ? <ActivityIndicator color={t.primary} /> : null}
          </View>

          {!routineLoading && routineExercises.length === 0 ? (
            <View style={{ padding: Space.md, borderRadius: Radius.lg, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.borderLight }}>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                No workout history yet. Start a workout with this routine and it will fill in automatically.
              </Text>
            </View>
          ) : null}

          {routineExercises.map((exercise) => (
            <View key={exercise.id} style={{ padding: Space.md, borderRadius: Radius.lg, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.borderLight, gap: Space.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{exercise.name}</Text>
                  <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{exercise.equipmentName}</Text>
                </View>
                <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>{exercise.sets.length} sets</Text>
              </View>
              <Text style={{ color: t.textMuted, fontSize: Size.xs }}>
                {exercise.sets.map((set, index) => `Set ${index + 1}: ${set.previous}`).join(' · ')}
              </Text>
            </View>
          ))}

          {routineError ? (
            <Text style={{ color: t.warning, fontSize: Size.xs, fontWeight: '700' }}>
              Could not load the last workout details: {routineError}
            </Text>
          ) : null}
        </Card>

        {formMessage || workoutError ? (
          <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700', marginBottom: Space.md }}>{formMessage ?? workoutError}</Text>
        ) : null}
        <Button
          title={workoutLoading ? 'Starting…' : 'Start workout with this routine'}
          size="lg"
          disabled={workoutLoading}
          icon={workoutLoading ? <ActivityIndicator color={t.onPrimary} /> : undefined}
          onPress={startRoutineSession}
        />
      </ScrollView>
    );
  }

  // =====================================================================
  // Render: Active workout in progress (unchanged from previous version)
  // =====================================================================
  return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Space.lg, paddingTop: Space.lg, paddingBottom: Space.sm }}>
        <View>
          <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>In Progress</Text>
          <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800' }}>{activeWorkout.name}</Text>
        </View>
        <Pressable onPress={requestEndSession} style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.full, backgroundColor: withAlpha(t.error, 0.14) }}>
          <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>End Session</Text>
        </Pressable>
      </View>

      {formMessage ? (
        <View style={{ marginHorizontal: Space.lg, marginBottom: Space.sm, padding: Space.md, borderRadius: Radius.lg, backgroundColor: withAlpha(t.error, 0.12), borderWidth: 1, borderColor: withAlpha(t.error, 0.3) }}>
          <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>{formMessage}</Text>
        </View>
      ) : null}

      {/* Rest timer banner */}
      {restActive && (
        <View style={{ marginHorizontal: Space.lg, marginBottom: Space.sm, padding: Space.md, borderRadius: Radius.lg, backgroundColor: t.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: t.onPrimary, fontSize: Size.md, fontWeight: '800' }}>⏱ Rest · {fmt(restSec)}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Pressable onPress={() => setRestSec(s => s + 15)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: withAlpha(t.onPrimary, 0.15) }}>
              <Text style={{ color: t.onPrimary, fontWeight: '800', fontSize: Size.xs }}>+15</Text>
            </Pressable>
            <Pressable onPress={() => { setRestActive(false); setRestSec(0); }} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: withAlpha(t.onPrimary, 0.15) }}>
              <Text style={{ color: t.onPrimary, fontWeight: '800', fontSize: Size.xs }}>Skip</Text>
            </Pressable>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingHorizontal: Space.lg, paddingBottom: 140 }}>
        {/* Top stats */}
        <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg }}>
          <StatTile value={fmt(elapsed)} label="Duration" accent />
          <StatTile value={totals.volume.toLocaleString()} label="Volume (kg)" />
          <StatTile value={totals.sets} label="Sets" />
        </View>

        {/* Exercises */}
        {exercises.length === 0 ? (
          <Card style={{ marginBottom: Space.md, gap: Space.sm }}>
            <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>No exercises yet</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
              Add an exercise from the live catalog. Completed sets will be persisted through the Exercises hook.
            </Text>
          </Card>
        ) : null}

        {exercises.map((ex, exIdx) => (
          <Card key={ex.id} style={{ marginBottom: Space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.sm }}>
              <Pressable
                onPress={() => ex.equipmentId && router.push(`/equipment/${ex.equipmentId}`)}
                disabled={ex.equipmentId === null}
              >
                <Text style={{ color: t.primary, fontSize: Size.md, fontWeight: '800' }}>{ex.name}</Text>
                <Text style={{ color: t.textMuted, fontSize: 10, marginTop: 2 }}>{ex.equipmentName}</Text>
              </Pressable>
              <Text style={{ color: t.textMuted, fontSize: Size.xs }}>{ex.notes ?? ''}</Text>
            </View>
            {/* Column headers */}
            <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
              <Text style={[colHdr(t), { width: 32 }]}>SET</Text>
              <Text style={[colHdr(t), { flex: 1.4 }]}>PREVIOUS</Text>
              <Text style={[colHdr(t), { flex: 1, textAlign: 'center' }]}>KG</Text>
              <Text style={[colHdr(t), { flex: 1, textAlign: 'center' }]}>REPS</Text>
              <View style={{ width: 36 }} />
            </View>
            {ex.sets.map((s, sIdx) => {
              const kgResult = validateWorkoutWeight(s.kg);
              const repsResult = validateWorkoutReps(s.reps);
              const showKgError = shouldShowError(ex.id, sIdx, 'kg') && !kgResult.isValid;
              const showRepsError = shouldShowError(ex.id, sIdx, 'reps') && !repsResult.isValid;

              return (
              <View key={sIdx} style={{ paddingVertical: 8, backgroundColor: s.completed ? withAlpha(t.primary, 0.08) : 'transparent', borderRadius: Radius.sm, paddingHorizontal: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ width: 32, color: t.text, fontSize: Size.md, fontWeight: '700' }}>{sIdx + 1}</Text>
                  <Text style={{ flex: 1.4, color: t.textMuted, fontSize: Size.xs }}>{s.previous}</Text>
                  <TextInput
                    value={s.kg}
                    onChangeText={v => updateSet(exIdx, sIdx, { kg: v })}
                    onBlur={() => markTouched(ex.id, sIdx, 'kg')}
                    keyboardType="numeric"
                    placeholder="—"
                    placeholderTextColor={t.textMuted}
                    style={{ flex: 1, color: t.text, fontSize: Size.md, fontWeight: '600', textAlign: 'center', backgroundColor: t.surface2, marginHorizontal: 4, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: showKgError ? t.error : 'transparent' }}
                  />
                  <TextInput
                    value={s.reps}
                    onChangeText={v => updateSet(exIdx, sIdx, { reps: v })}
                    onBlur={() => markTouched(ex.id, sIdx, 'reps')}
                    keyboardType="numeric"
                    placeholder="—"
                    placeholderTextColor={t.textMuted}
                    style={{ flex: 1, color: t.text, fontSize: Size.md, fontWeight: '600', textAlign: 'center', backgroundColor: t.surface2, marginHorizontal: 4, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: showRepsError ? t.error : 'transparent' }}
                  />
                  <Pressable onPress={() => toggleComplete(exIdx, sIdx)}
                    style={{ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
                             backgroundColor: s.completed ? t.primary : t.surface2, borderWidth: 1, borderColor: s.completed ? t.primary : t.borderLight }}>
                    <Text style={{ color: s.completed ? t.onPrimary : t.textMuted, fontWeight: '800' }}>✓</Text>
                  </Pressable>
                </View>
                {showKgError || showRepsError ? (
                  <View style={{ marginLeft: 32, marginTop: 4, gap: 2 }}>
                    {showKgError ? <Text style={{ color: t.error, fontSize: 10 }}>{kgResult.message}</Text> : null}
                    {showRepsError ? <Text style={{ color: t.error, fontSize: 10 }}>{repsResult.message}</Text> : null}
                  </View>
                ) : null}
              </View>
              );
            })}
            <Pressable onPress={() => addSet(exIdx)} style={{ marginTop: Space.sm, paddingVertical: 10, borderRadius: Radius.md, backgroundColor: t.surface2, alignItems: 'center' }}>
              <Text style={{ color: t.text, fontWeight: '700', fontSize: Size.sm }}>+ Add set</Text>
            </Pressable>
          </Card>
        ))}

        <Button title="+ Add exercise" variant="secondary" size="lg" onPress={() => setShowExercisePicker(true)} />
      </ScrollView>

      <Modal transparent visible={showExercisePicker} animationType="slide" onRequestClose={() => setShowExercisePicker(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.58)', justifyContent: 'flex-end' }}>
          <View style={{ maxHeight: '82%', backgroundColor: t.bg, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Space.lg, gap: Space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: t.text, fontSize: Size.xl, fontWeight: '800' }}>Add exercise</Text>
              <Pressable onPress={() => setShowExercisePicker(false)}>
                <Text style={{ color: t.textMuted, fontSize: Size.xl }}>✕</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: Space.lg }}>
              <ExerciseFilterPanel
                mode="add"
                exercises={catalogExercises}
                filteredExercises={filteredExercises}
                equipmentOptions={equipmentOptions}
                muscleOptions={muscleOptions}
                levelOptions={levelOptions}
                loading={catalogLoading || equipmentLoading}
                error={catalogError ?? equipmentError}
                onRetry={() => {
                  void refreshCatalog();
                  void refreshEquipment();
                }}
                query={exerciseQuery}
                onQueryChange={setExerciseQuery}
                equipmentFilter={pickerEquipment}
                onEquipmentFilterChange={setPickerEquipment}
                muscleFilter={pickerMuscle}
                onMuscleFilterChange={setPickerMuscle}
                levelFilter={pickerLevel}
                onLevelFilterChange={setPickerLevel}
                onAddExercise={addSelectedExercise}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showEndModal} animationType="fade" onRequestClose={() => setShowEndModal(false)}>
        <Pressable onPress={() => !endingInFlight && setShowEndModal(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.58)', alignItems: 'center', justifyContent: 'center', padding: Space.lg }}>
          <Pressable onPress={(event) => event.stopPropagation()} style={{ width: '100%', maxWidth: 420 }}>
            <Card style={{ gap: Space.md }}>
              <Text style={{ color: t.text, fontSize: Size.xl, fontWeight: '800' }}>End your session?</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                Completed sets will be saved to Supabase, then the workout will be ended.
              </Text>
              <View style={{ flexDirection: 'row', gap: Space.sm, marginTop: Space.sm }}>
                <StatTile value={fmt(elapsed)} label="Duration" />
                <StatTile value={totals.sets} label="Sets" accent />
              </View>
              {endError || workoutError || exerciseSaveError ? (
                <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>
                  {endError ?? workoutError ?? exerciseSaveError}
                </Text>
              ) : null}
              <View style={{ gap: Space.sm, marginTop: Space.sm }}>
                <Button
                  title={endingInFlight ? 'Ending…' : 'End session'}
                  variant="danger"
                  size="lg"
                  disabled={endingInFlight}
                  icon={endingInFlight ? <ActivityIndicator color={t.error} /> : undefined}
                  onPress={confirmEndSession}
                />
                <Button title="Keep going" variant="secondary" size="lg" disabled={endingInFlight} onPress={() => setShowEndModal(false)} />
              </View>
            </Card>
          </Pressable>
        </Pressable>
      </Modal>
      </View>
  );
}

const colHdr = (t: any) => ({ color: t.textMuted, fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.2 });

function validateSet(set: WorkoutSet) {
  const kg = validateWorkoutWeight(set.kg);
  const reps = validateWorkoutReps(set.reps);
  return { kg, reps, isValid: kg.isValid && reps.isValid };
}
