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
  equipment: string;
  targetMuscle?: string | null;
  sets: RoutineSet[];
};

const DEFAULT_SET: RoutineSet = { reps: '10', weight: '' };

function pretty(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(' ');
}

function toRoutineExercise(exercise: ExerciseCatalogItem): RoutineExercise {
  return {
    id: `${exercise.id}:${Date.now()}`,
    exerciseId: exercise.id,
    name: exercise.name,
    equipment: exercise.equipmentRequired ?? 'No equipment',
    targetMuscle: exercise.targetMuscle,
    sets: [{ ...DEFAULT_SET }, { ...DEFAULT_SET }, { ...DEFAULT_SET }],
  };
}

export default function RoutinesScreen() {
  const t = useTheme();
  const [routineName, setRoutineName] = useState('My routine');
  const [routineGoal, setRoutineGoal] = useState('Strength');
  const [query, setQuery] = useState('');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { filteredExercises, exercises, loading, error, refresh } = useExerciseCatalog(query);

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

  const saveDraft = () => {
    if (routineName.trim().length === 0) {
      setMessage('Add a routine name before saving.');
      return;
    }

    if (routineExercises.length === 0) {
      setMessage('Add at least one exercise to this routine.');
      return;
    }

    setMessage('Routine draft ready. Persistence can connect once the saved-routine schema is finalized.');
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
            Build the UI first with live exercise catalog data. Saving stays as a draft until SLU-161 finalizes the persistence schema.
          </Text>
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
                  {pretty(exercise.equipment)}{exercise.targetMuscle ? ` · ${pretty(exercise.targetMuscle)}` : ''}
                </Text>
              </View>
              <Pressable onPress={() => removeExercise(exercise.id)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: withAlpha(t.error, 0.14) }}>
                <Text style={{ color: t.error, fontSize: Size.xs, fontWeight: '900' }}>Remove</Text>
              </Pressable>
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
        {message ? <Text style={{ color: message.startsWith('Routine draft') ? t.success : t.error, fontSize: Size.sm, fontWeight: '800', textAlign: 'center' }}>{message}</Text> : null}
        <Button title="Save routine draft" size="lg" onPress={saveDraft} />
      </View>
    </View>
  );
}
