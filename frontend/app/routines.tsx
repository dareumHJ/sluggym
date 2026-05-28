// app/routines.tsx — routine creation/editing UI shell
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Radius, Size, withAlpha } from '../src/constants/theme';
import { Button, Card, SectionLabel } from '../src/components/primitives';
import { useExerciseCatalog, type ExerciseCatalogItem } from '../src/hooks/useExerciseCatalog';

type RoutineSet = { reps: string; weight: string };
type RoutineExercise = {
  id: string;
  exerciseId: string;
  name: string;
  selectedEquipment: string;
  equipmentOptions: string[];
  targetMuscle?: string | null;
  sets: RoutineSet[];
};

type RoutineDraft = {
  id: string;
  name: string;
  goal: string;
  exercises: RoutineExercise[];
};

const DEFAULT_SET: RoutineSet = { reps: '10', weight: '' };

const SAMPLE_ROUTINES: RoutineDraft[] = [
  {
    id: 'push-day',
    name: 'Push day',
    goal: 'Chest + triceps',
    exercises: [
      {
        id: 'push-day:bench',
        exerciseId: 'bench-press',
        name: 'Barbell Bench Press - Medium Grip',
        selectedEquipment: 'Flat bench rack',
        equipmentOptions: ['Flat bench rack', 'Power rack (squat rack)', 'Smith machine'],
        targetMuscle: 'chest',
        sets: [{ reps: '8', weight: '' }, { reps: '8', weight: '' }, { reps: '8', weight: '' }],
      },
    ],
  },
];

function pretty(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(' ');
}

function unique(values: string[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    if (!value) return false;
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function equipmentChoicesFor(exercise: ExerciseCatalogItem) {
  const lowerName = exercise.name.toLowerCase();

  if (lowerName.includes('bench press') && exercise.equipmentRequired === 'barbell') {
    return ['Flat bench rack', 'Power rack (squat rack)', 'Smith machine'];
  }

  return unique([exercise.equipmentRequired ?? 'No equipment', exercise.exerciseType ?? '']);
}

function toRoutineExercise(exercise: ExerciseCatalogItem): RoutineExercise {
  const equipmentOptions = equipmentChoicesFor(exercise);

  return {
    id: `${exercise.id}:${Date.now()}`,
    exerciseId: exercise.id,
    name: exercise.name,
    selectedEquipment: equipmentOptions[0] ?? 'No equipment',
    equipmentOptions,
    targetMuscle: exercise.targetMuscle,
    sets: [{ ...DEFAULT_SET }, { ...DEFAULT_SET }, { ...DEFAULT_SET }],
  };
}

export default function RoutinesScreen() {
  const t = useTheme();
  const [savedRoutines, setSavedRoutines] = useState<RoutineDraft[]>(SAMPLE_ROUTINES);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [routineName, setRoutineName] = useState('My routine');
  const [routineGoal, setRoutineGoal] = useState('Strength');
  const [query, setQuery] = useState('');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { filteredExercises, exercises, loading, error, refresh } = useExerciseCatalog(query);

  const editingExistingRoutine = selectedRoutineId !== null;

  const totalSets = useMemo(
    () => routineExercises.reduce((sum, exercise) => sum + exercise.sets.length, 0),
    [routineExercises],
  );

  const addExercise = (exercise: ExerciseCatalogItem) => {
    setRoutineExercises((prev) => [...prev, toRoutineExercise(exercise)]);
    setQuery('');
    setMessage(null);
  };

  const removeExercise = (exerciseId: string) => {
    setRoutineExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
    setMessage(null);
  };

  const updateSet = (exerciseId: string, setIndex: number, patch: Partial<RoutineSet>) => {
    setRoutineExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set, index) => (index === setIndex ? { ...set, ...patch } : set)),
        };
      }),
    );
    setMessage(null);
  };

  const addSet = (exerciseId: string) => {
    setRoutineExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        const previous = exercise.sets[exercise.sets.length - 1] ?? DEFAULT_SET;
        return { ...exercise, sets: [...exercise.sets, { reps: previous.reps, weight: previous.weight }] };
      }),
    );
    setMessage(null);
  };

  const selectRoutine = (routine: RoutineDraft | null) => {
    if (!routine) {
      setSelectedRoutineId(null);
      setRoutineName('My routine');
      setRoutineGoal('Strength');
      setRoutineExercises([]);
      setMessage(null);
      return;
    }

    setSelectedRoutineId(routine.id);
    setRoutineName(routine.name);
    setRoutineGoal(routine.goal);
    setRoutineExercises(routine.exercises.map((exercise) => ({ ...exercise, sets: exercise.sets.map((set) => ({ ...set })) })));
    setMessage(null);
  };

  const updateExerciseEquipment = (exerciseId: string, selectedEquipment: string) => {
    setRoutineExercises((prev) =>
      prev.map((exercise) => (exercise.id === exerciseId ? { ...exercise, selectedEquipment } : exercise)),
    );
    setMessage(null);
  };

  const moveExercise = (exerciseId: string, direction: -1 | 1) => {
    setRoutineExercises((prev) => {
      const index = prev.findIndex((exercise) => exercise.id === exerciseId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
    setMessage(null);
  };

  const saveDraft = () => {
    if (routineName.trim().length === 0) {
      setMessage('Add a routine name before saving.');
      return;
    }

    if (routineExercises.length === 0) {
      setMessage('Add at least one exercise to this routine.');
      return;
    }

    if (editingExistingRoutine) {
      setSavedRoutines((prev) =>
        prev.map((routine) =>
          routine.id === selectedRoutineId
            ? { ...routine, name: routineName.trim(), goal: routineGoal.trim(), exercises: routineExercises }
            : routine,
        ),
      );
      setMessage('Existing routine updated.');
      return;
    }

    const id = `routine:${Date.now()}`;
    setSavedRoutines((prev) => [
      ...prev,
      { id, name: routineName.trim(), goal: routineGoal.trim(), exercises: routineExercises },
    ]);
    setSelectedRoutineId(id);
    setMessage('New routine created.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Space.lg, paddingTop: Space.lg, paddingBottom: Space.sm }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface2 }}>
          <Text style={{ color: t.text, fontSize: Size.lg }}>‹</Text>
        </Pressable>
        <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>Routine Builder</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: Space.lg, paddingBottom: 120, gap: Space.md }}>
        <Card style={{ gap: Space.md }}>
          <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '800' }}>SLU-163</Text>
          <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '900' }}>Create or edit a routine</Text>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
            Pick an existing routine to edit, or start a new routine and choose ordered exercises with equipment options.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm }}>
            <Pressable
              onPress={() => selectRoutine(null)}
              style={{ paddingHorizontal: Space.md, paddingVertical: Space.sm, borderRadius: Radius.full, backgroundColor: selectedRoutineId === null ? t.primary : t.surface2, borderWidth: 1, borderColor: selectedRoutineId === null ? t.primary : t.border }}
            >
              <Text style={{ color: selectedRoutineId === null ? t.onPrimary : t.text, fontSize: Size.xs, fontWeight: '900' }}>+ New routine</Text>
            </Pressable>
            {savedRoutines.map((routine) => (
              <Pressable
                key={routine.id}
                onPress={() => selectRoutine(routine)}
                style={{ paddingHorizontal: Space.md, paddingVertical: Space.sm, borderRadius: Radius.full, backgroundColor: selectedRoutineId === routine.id ? t.primary : t.surface2, borderWidth: 1, borderColor: selectedRoutineId === routine.id ? t.primary : t.border }}
              >
                <Text style={{ color: selectedRoutineId === routine.id ? t.onPrimary : t.text, fontSize: Size.xs, fontWeight: '900' }}>{routine.name}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={routineName}
            onChangeText={setRoutineName}
            placeholder="Routine name"
            placeholderTextColor={t.textMuted}
            style={{ color: t.text, backgroundColor: t.surface2, borderRadius: Radius.lg, paddingHorizontal: Space.lg, paddingVertical: 12, borderWidth: 1, borderColor: t.borderLight, fontWeight: '700' }}
          />
          <TextInput
            value={routineGoal}
            onChangeText={setRoutineGoal}
            placeholder="Goal, e.g. strength, hypertrophy, recovery"
            placeholderTextColor={t.textMuted}
            style={{ color: t.text, backgroundColor: t.surface2, borderRadius: Radius.lg, paddingHorizontal: Space.lg, paddingVertical: 12, borderWidth: 1, borderColor: t.borderLight }}
          />
          <View style={{ flexDirection: 'row', gap: Space.sm }}>
            <View style={{ flex: 1, backgroundColor: t.surface2, borderRadius: Radius.lg, padding: Space.md, borderWidth: 1, borderColor: t.border }}>
              <Text style={{ color: t.primary, fontSize: Size.lg, fontWeight: '900' }}>{routineExercises.length}</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '800' }}>Exercises</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: t.surface2, borderRadius: Radius.lg, padding: Space.md, borderWidth: 1, borderColor: t.border }}>
              <Text style={{ color: t.primary, fontSize: Size.lg, fontWeight: '900' }}>{totalSets}</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '800' }}>Planned sets</Text>
            </View>
          </View>
        </Card>

        <SectionLabel>Exercises in routine</SectionLabel>
        {routineExercises.length === 0 ? (
          <Card style={{ gap: Space.sm }}>
            <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No exercises added yet</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>Search the live catalog below and add movements to start the routine.</Text>
          </Card>
        ) : null}

        {routineExercises.map((exercise, exerciseIndex) => (
          <Card key={exercise.id} style={{ gap: Space.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: Space.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '900' }}>{exerciseIndex + 1}. {exercise.name}</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 3 }}>
                  {pretty(exercise.selectedEquipment)}{exercise.targetMuscle ? ` · ${pretty(exercise.targetMuscle)}` : ''}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable disabled={exerciseIndex === 0} onPress={() => moveExercise(exercise.id, -1)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: exerciseIndex === 0 ? t.surface2 : withAlpha(t.primary, 0.12) }}>
                    <Text style={{ color: exerciseIndex === 0 ? t.textMuted : t.primary, fontSize: Size.xs, fontWeight: '900' }}>Up</Text>
                  </Pressable>
                  <Pressable disabled={exerciseIndex === routineExercises.length - 1} onPress={() => moveExercise(exercise.id, 1)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: exerciseIndex === routineExercises.length - 1 ? t.surface2 : withAlpha(t.primary, 0.12) }}>
                    <Text style={{ color: exerciseIndex === routineExercises.length - 1 ? t.textMuted : t.primary, fontSize: Size.xs, fontWeight: '900' }}>Down</Text>
                  </Pressable>
                </View>
                <Pressable onPress={() => removeExercise(exercise.id)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: withAlpha(t.error, 0.14) }}>
                  <Text style={{ color: t.error, fontSize: Size.xs, fontWeight: '900' }}>Remove</Text>
                </Pressable>
              </View>
            </View>

            <View style={{ gap: Space.xs }}>
              <Text style={{ color: t.textMuted, fontSize: 10, fontWeight: '800' }}>EQUIPMENT FOR ACTIVE WORKOUT</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.xs }}>
                {exercise.equipmentOptions.map((equipment) => {
                  const selected = exercise.selectedEquipment === equipment;
                  return (
                    <Pressable
                      key={equipment}
                      onPress={() => updateExerciseEquipment(exercise.id, equipment)}
                      style={{ paddingHorizontal: Space.sm, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: selected ? withAlpha(t.primary, 0.16) : t.surface2, borderWidth: 1, borderColor: selected ? t.primary : t.border }}
                    >
                      <Text style={{ color: selected ? t.primary : t.textSecondary, fontSize: Size.xs, fontWeight: '900' }}>{pretty(equipment)}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ flexDirection: 'row', paddingTop: Space.xs }}>
              <Text style={{ width: 38, color: t.textMuted, fontSize: 10, fontWeight: '800' }}>SET</Text>
              <Text style={{ flex: 1, color: t.textMuted, fontSize: 10, fontWeight: '800', textAlign: 'center' }}>REPS</Text>
              <Text style={{ flex: 1, color: t.textMuted, fontSize: 10, fontWeight: '800', textAlign: 'center' }}>KG</Text>
            </View>
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={{ flexDirection: 'row', alignItems: 'center', gap: Space.sm }}>
                <Text style={{ width: 30, color: t.text, fontSize: Size.sm, fontWeight: '800' }}>{setIndex + 1}</Text>
                <TextInput
                  value={set.reps}
                  onChangeText={(value) => updateSet(exercise.id, setIndex, { reps: value })}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={t.textMuted}
                  style={{ flex: 1, color: t.text, backgroundColor: t.surface2, borderRadius: Radius.md, paddingVertical: 8, textAlign: 'center', borderWidth: 1, borderColor: t.border }}
                />
                <TextInput
                  value={set.weight}
                  onChangeText={(value) => updateSet(exercise.id, setIndex, { weight: value })}
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor={t.textMuted}
                  style={{ flex: 1, color: t.text, backgroundColor: t.surface2, borderRadius: Radius.md, paddingVertical: 8, textAlign: 'center', borderWidth: 1, borderColor: t.border }}
                />
              </View>
            ))}
            <Button title="+ Add set" variant="secondary" onPress={() => addSet(exercise.id)} />
          </Card>
        ))}

        <SectionLabel>Exercise catalog</SectionLabel>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercises to add…"
          placeholderTextColor={t.textMuted}
          style={{ color: t.text, backgroundColor: t.surface2, borderRadius: Radius.full, paddingHorizontal: Space.lg, paddingVertical: 12, borderWidth: 1, borderColor: t.borderLight }}
        />

        {error ? (
          <Card style={{ borderColor: withAlpha(t.warning, 0.35), backgroundColor: withAlpha(t.warning, 0.08), gap: Space.sm }}>
            <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '900' }}>Could not refresh the exercise catalog</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>{error}</Text>
            <Button title="Retry" variant="secondary" onPress={() => void refresh()} />
          </Card>
        ) : null}

        {loading && exercises.length === 0 ? (
          <Card style={{ alignItems: 'center', gap: Space.sm }}>
            <ActivityIndicator color={t.primary} />
            <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading live exercises…</Text>
          </Card>
        ) : (
          <View style={{ gap: Space.sm }}>
            {filteredExercises.slice(0, 12).map((exercise) => (
              <Pressable key={exercise.id} onPress={() => addExercise(exercise)}>
                <Card style={{ gap: Space.xs }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.md }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{exercise.name}</Text>
                      <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 3 }}>
                        {[pretty(exercise.equipmentRequired ?? 'No equipment'), pretty(exercise.level ?? 'Any level'), pretty(exercise.category ?? 'Exercise')].join(' · ')}
                      </Text>
                    </View>
                    <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '900' }}>Add</Text>
                  </View>
                </Card>
              </Pressable>
            ))}
            {filteredExercises.length === 0 ? (
              <Card style={{ alignItems: 'center', gap: Space.sm }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No exercises match this search</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.sm, textAlign: 'center' }}>Try a broader term or clear the search.</Text>
              </Card>
            ) : null}
          </View>
        )}
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: Space.lg, paddingBottom: 28, backgroundColor: withAlpha(t.bg, 0.96), borderTopWidth: 1, borderTopColor: t.border, gap: Space.sm }}>
        {message ? <Text style={{ color: message.includes('draft') ? t.success : t.error, fontSize: Size.sm, fontWeight: '800', textAlign: 'center' }}>{message}</Text> : null}
        <Button title={editingExistingRoutine ? 'Update routine' : 'Save new routine'} size="lg" onPress={saveDraft} />
      </View>
    </View>
  );
}
