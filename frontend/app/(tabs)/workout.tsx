// app/(tabs)/workout.tsx — Hevy-style logger with rest timer
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Radius, Size, withAlpha } from '../../src/constants/theme';
import { Card, Button, StatTile } from '../../src/components/primitives';
import { ACTIVE_WORKOUT } from '../../src/data/mock';
import type { Exercise, ExerciseSet } from '../../src/types';
import { useExercises } from '../../src/hooks/useExercises';
import { useWorkouts } from '../../src/hooks/useWorkouts';
import { validateWorkoutReps, validateWorkoutSetCount, validateWorkoutWeight } from '../../src/lib/validation';

function fmt(sec: number) { const m = Math.floor(sec/60), s = sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }

type WorkoutSet = Omit<ExerciseSet, 'kg' | 'reps'> & { kg: string; reps: string };
type WorkoutExercise = Omit<Exercise, 'sets'> & { sets: WorkoutSet[] };
type FieldName = 'kg' | 'reps';

const toWorkoutExercises = (resetCompleted = true): WorkoutExercise[] =>
  ACTIVE_WORKOUT.exercises.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({
      ...set,
      kg: set.kg?.toString() ?? '',
      reps: set.reps?.toString() ?? '',
      completed: resetCompleted ? false : set.completed,
    })),
  }));

const fieldKey = (exerciseId: string, setIndex: number, field: FieldName) => `${exerciseId}:${setIndex}:${field}`;

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export default function WorkoutScreen() {
  const t = useTheme();
  const { activeWorkout, startWorkout, endWorkout, loading: workoutLoading, error: workoutError } = useWorkouts();
  const { saveWorkoutExercises, saving: savingExercises, error: exerciseSaveError } = useExercises();
  const [exercises, setExercises] = useState<WorkoutExercise[]>(toWorkoutExercises);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [restSec, setRestSec] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [finishAttempted, setFinishAttempted] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [endError, setEndError] = useState<string | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [ending, setEnding] = useState(false);
  const endingInFlight = ending || savingExercises;

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
    setExercises(toWorkoutExercises(true));
    setStartedAt(Date.now());
    setNow(Date.now());

    try {
      await startWorkout(ACTIVE_WORKOUT.name);
    } catch (error) {
      setFormMessage(getErrorMessage(error));
    }
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

  const confirmEndSession = async () => {
    if (!activeWorkout) return;

    setEnding(true);
    setEndError(null);

    try {
      await saveWorkoutExercises({ workoutId: activeWorkout.id, exercises });
      await endWorkout(activeWorkout);
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
            This creates a workout row first, then exercise sets can be saved when you end the session.
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
        {exercises.map((ex, exIdx) => (
          <Card key={ex.id} style={{ marginBottom: Space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.sm }}>
              <Pressable onPress={() => router.push(`/equipment/${ex.equipmentId}`)}>
                <Text style={{ color: t.primary, fontSize: Size.md, fontWeight: '800' }}>{ex.name}</Text>
              </Pressable>
              <Pressable><Text style={{ color: t.textMuted, fontSize: Size.lg }}>⋯</Text></Pressable>
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

        <Button title="+ Add exercise" variant="secondary" size="lg" onPress={() => router.push('/(tabs)/search')} />
      </ScrollView>

      <Modal transparent visible={showEndModal} animationType="fade" onRequestClose={() => setShowEndModal(false)}>
        <Pressable onPress={() => !endingInFlight && setShowEndModal(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.58)', alignItems: 'center', justifyContent: 'center', padding: Space.lg }}>
          <Pressable onPress={(event) => event.stopPropagation()} style={{ width: '100%', maxWidth: 420 }}>
            <Card style={{ gap: Space.md }}>
              <Text style={{ color: t.text, fontSize: Size.xl, fontWeight: '800' }}>End your session?</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                Your workout will be saved and the equipment will be marked as available for others.
              </Text>
              <View style={{ flexDirection: 'row', gap: Space.sm, marginTop: Space.sm }}>
                <StatTile value={fmt(elapsed)} label="Duration" />
                <StatTile value={totals.sets} label="Sets" accent />
              </View>
              {endError || exerciseSaveError || workoutError ? (
                <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>
                  {endError ?? exerciseSaveError ?? workoutError}
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
