// app/(tabs)/workout.tsx — Hevy-style logger with Supabase workout/exercise persistence
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Radius, Size, withAlpha } from '../../src/constants/theme';
import { Card, Button, StatTile } from '../../src/components/primitives';
import { useEquipment, type EquipmentListItem } from '../../src/hooks/useEquipment';
import { useExerciseCatalog, type ExerciseCatalogItem } from '../../src/hooks/useExerciseCatalog';
import { useExercises } from '../../src/hooks/useExercises';
import { useWorkouts } from '../../src/hooks/useWorkouts';
import { validateWorkoutReps, validateWorkoutSetCount, validateWorkoutWeight } from '../../src/lib/validation';

function fmt(sec: number) { const m = Math.floor(sec/60), s = sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }

type WorkoutSet = { previous: string; kg: string; reps: string; completed: boolean };
type WorkoutExercise = {
  id: string;
  exerciseId: string;
  equipmentId: string;
  name: string;
  equipmentName: string;
  notes?: string;
  sets: WorkoutSet[];
};
type FieldName = 'kg' | 'reps';

const DEFAULT_WORKOUT_NAME = 'Workout Session';
const EMPTY_SET: WorkoutSet = { previous: '—', kg: '', reps: '', completed: false };
const normalize = (value: string | null | undefined) => (value ?? '').trim().toLowerCase();

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

function matchEquipmentForExercise(exercise: ExerciseCatalogItem, equipment: EquipmentListItem[]) {
  const required = normalize(exercise.equipmentRequired);
  if (!required) return null;

  return (
    equipment.find((item) => normalize(item.name) === required) ??
    equipment.find((item) => normalize(item.name).includes(required) || required.includes(normalize(item.name))) ??
    equipment.find((item) => normalize(item.category) === required) ??
    equipment.find((item) => normalize(item.category).includes(required) || required.includes(normalize(item.category))) ??
    null
  );
}

function createWorkoutExercise(exercise: ExerciseCatalogItem, equipment: EquipmentListItem): WorkoutExercise {
  return {
    id: `${exercise.id}:${equipment.id}:${Date.now()}`,
    exerciseId: exercise.id,
    equipmentId: equipment.id,
    name: exercise.name,
    equipmentName: equipment.name,
    notes: exercise.targetMuscle ? pretty(exercise.targetMuscle) : undefined,
    sets: [{ ...EMPTY_SET }],
  };
}

export default function WorkoutScreen() {
  const t = useTheme();
  const { activeWorkout, createWorkout, endWorkout, loading: workoutLoading, error: workoutError } = useWorkouts();
  const {
    addExercise: persistExercise,
    addSet: persistSet,
    endExercise: finishPersistedExercise,
    loading: exerciseSaving,
    error: exerciseSaveError,
  } = useExercises();
  const { equipment, loading: equipmentLoading, error: equipmentError, refresh: refreshEquipment } = useEquipment();
  const [exerciseQuery, setExerciseQuery] = useState('');
  const {
    exercises: catalogExercises,
    filteredExercises,
    loading: catalogLoading,
    error: catalogError,
    refresh: refreshCatalog,
  } = useExerciseCatalog(exerciseQuery);

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
  const endingInFlight = ending || exerciseSaving;

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

  const exerciseMatches = useMemo(
    () => filteredExercises.slice(0, 40).map((exercise) => ({ exercise, equipment: matchEquipmentForExercise(exercise, equipment) })),
    [equipment, filteredExercises],
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

  const startNewSession = async () => {
    setFormMessage(null);
    setEndError(null);
    setTouchedFields({});
    setFinishAttempted(false);
    setExercises([]);
    setExerciseQuery('');
    setStartedAt(Date.now());
    setNow(Date.now());

    try {
      await createWorkout({ name: DEFAULT_WORKOUT_NAME, target_muscle: [] });
    } catch (error) {
      setFormMessage(getErrorMessage(error));
    }
  };

  const addSelectedExercise = (exercise: ExerciseCatalogItem, matchedEquipment: EquipmentListItem | null) => {
    if (!matchedEquipment) {
      setFormMessage('No matching live equipment row was found for this exercise.');
      return;
    }

    setExercises((prev) => [...prev, createWorkoutExercise(exercise, matchedEquipment)]);
    setTouchedFields({});
    setFormMessage(null);
    setShowExercisePicker(false);
    setExerciseQuery('');
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

  if (!activeWorkout) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, padding: Space.lg, justifyContent: 'center' }}>
        <Card style={{ gap: Space.md }}>
          <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>
            Workout
          </Text>
          <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>
            Start a new session
          </Text>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
            This creates a workout row first, then selected exercises and completed sets are saved to Supabase when you end the session.
          </Text>
          {formMessage || workoutError ? (
            <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>{formMessage ?? workoutError}</Text>
          ) : null}
          <Button
            title={workoutLoading ? 'Starting…' : 'Start new session'}
            size="lg"
            disabled={workoutLoading}
            icon={workoutLoading ? <ActivityIndicator color={t.onPrimary} /> : undefined}
            onPress={startNewSession}
          />
          <Button
            title="Build saved routine"
            variant="secondary"
            size="lg"
            onPress={() => router.push('/routines')}
          />
        </Card>
      </View>
    );
  }

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
              <Pressable onPress={() => router.push(`/equipment/${ex.equipmentId}`)}>
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
            <TextInput
              value={exerciseQuery}
              onChangeText={setExerciseQuery}
              placeholder="Search live exercises…"
              placeholderTextColor={t.textMuted}
              style={{ color: t.text, backgroundColor: t.surface2, borderRadius: Radius.full, paddingHorizontal: Space.lg, paddingVertical: 12, borderWidth: 1, borderColor: t.borderLight }}
            />
            {catalogError || equipmentError ? (
              <Card style={{ borderColor: withAlpha(t.warning, 0.35), backgroundColor: withAlpha(t.warning, 0.08), gap: Space.xs }}>
                <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '800' }}>Live catalog warning</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs }}>{catalogError ?? equipmentError}</Text>
                <Button title="Retry" variant="secondary" onPress={() => { void refreshCatalog(); void refreshEquipment(); }} />
              </Card>
            ) : null}
            {(catalogLoading && catalogExercises.length === 0) || equipmentLoading ? (
              <View style={{ alignItems: 'center', paddingVertical: Space.lg }}>
                <ActivityIndicator color={t.primary} />
                <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: Space.sm }}>Loading live catalog…</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ gap: Space.sm, paddingBottom: Space.lg }}>
                {exerciseMatches.map(({ exercise, equipment: matchedEquipment }) => (
                  <Pressable key={exercise.id} disabled={!matchedEquipment} onPress={() => addSelectedExercise(exercise, matchedEquipment)}>
                    <Card style={{ gap: Space.xs, opacity: matchedEquipment ? 1 : 0.45 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{exercise.name}</Text>
                          <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 3 }}>
                            {[pretty(exercise.equipmentRequired ?? 'No equipment'), pretty(exercise.level ?? 'Any level'), pretty(exercise.category ?? 'Exercise')].join(' · ')}
                          </Text>
                        </View>
                        <Text style={{ color: matchedEquipment ? t.primary : t.warning, fontSize: Size.xs, fontWeight: '800' }}>
                          {matchedEquipment ? 'Add' : 'No equipment match'}
                        </Text>
                      </View>
                      {matchedEquipment ? (
                        <Text style={{ color: t.textMuted, fontSize: 10 }}>Equipment row: {matchedEquipment.name}</Text>
                      ) : null}
                    </Card>
                  </Pressable>
                ))}
                {exerciseMatches.length === 0 ? (
                  <Card style={{ alignItems: 'center', gap: Space.sm }}>
                    <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No exercises found</Text>
                    <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>Try a broader search term.</Text>
                  </Card>
                ) : null}
              </ScrollView>
            )}
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
