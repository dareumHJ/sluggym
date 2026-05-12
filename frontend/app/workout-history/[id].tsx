import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Space, Size, Radius, useTheme, withAlpha } from '../../src/constants/theme';
import { Button, Card, SectionLabel, StatTile } from '../../src/components/primitives';
import { useWorkouts, type Workout } from '../../src/hooks/useWorkouts';
import { useExercises, type WorkoutExerciseWithSets } from '../../src/hooks/useExercises';

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatWorkoutDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const today = new Date();
  const diffMs = startOfDay(today).getTime() - startOfDay(date).getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function workoutMeta(workout: Workout) {
  const pieces = [formatWorkoutDate(workout.ended_at ?? workout.started_at)];
  if (workout.duration_min) pieces.push(`${workout.duration_min} min`);
  if (workout.target_muscle.length > 0) pieces.push(workout.target_muscle.join(', '));
  return pieces.join(' · ');
}

function getExerciseLabel(exercise: WorkoutExerciseWithSets) {
  return `Exercise #${exercise.exercise_id}`;
}

function getEquipmentLabel(exercise: WorkoutExerciseWithSets) {
  return `Equipment #${exercise.equipment_id}`;
}

export default function WorkoutHistoryDetailScreen() {
  const t = useTheme();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const workoutId = useMemo(() => {
    const value = params.id;
    return Array.isArray(value) ? value[0] : value;
  }, [params.id]);

  const { getWorkout } = useWorkouts();
  const { getExercisesForWorkout } = useExercises();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<WorkoutExerciseWithSets[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!workoutId) {
      setError('Missing workout id.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [workoutResult, exerciseResult] = await Promise.all([
        getWorkout(workoutId),
        getExercisesForWorkout(workoutId),
      ]);
      setWorkout(workoutResult);
      setExercises(exerciseResult);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load workout details.');
      setWorkout(null);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [getExercisesForWorkout, getWorkout, workoutId]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalSets = useMemo(
    () => exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0),
    [exercises],
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.lg }}>
        <View style={{ flex: 1, paddingRight: Space.md }}>
          <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>
            Session history
          </Text>
          <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginTop: 4 }}>
            {workout?.name ?? 'Workout detail'}
          </Text>
          {workout ? (
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4 }}>{workoutMeta(workout)}</Text>
          ) : null}
        </View>
        <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border }}>
          <Text style={{ color: t.text, fontSize: Size.sm, fontWeight: '700' }}>Back</Text>
        </Pressable>
      </View>

      {loading ? (
        <Card style={{ alignItems: 'center', gap: Space.sm }}>
          <ActivityIndicator color={t.primary} />
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading workout details…</Text>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card style={{ gap: Space.sm }}>
          <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>{error}</Text>
          <Button title="Retry" variant="secondary" onPress={() => void load()} />
        </Card>
      ) : null}

      {!loading && !error && workout ? (
        <>
          <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.xl }}>
            <StatTile value={exercises.length} label="Exercises" accent />
            <StatTile value={totalSets} label="Sets" />
            <StatTile value={workout.duration_min ?? '—'} label="Minutes" />
          </View>

          <SectionLabel>Exercise details</SectionLabel>
          <View style={{ gap: Space.sm }}>
            {exercises.length === 0 ? (
              <Card style={{ gap: Space.sm }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No detail rows saved yet</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                  This session exists in history, but no exercise detail rows were saved for it yet.
                </Text>
              </Card>
            ) : null}

            {exercises.map((exercise, index) => (
              <Card key={exercise.id} style={{ gap: Space.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{getExerciseLabel(exercise)}</Text>
                    <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{getEquipmentLabel(exercise)}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: withAlpha(t.primary, 0.15) }}>
                    <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>#{index + 1}</Text>
                  </View>
                </View>

                {exercise.sets.length === 0 ? (
                  <View style={{ padding: Space.md, borderRadius: Radius.md, backgroundColor: t.surface2 }}>
                    <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>No completed sets were saved for this exercise.</Text>
                  </View>
                ) : (
                  <View style={{ gap: Space.xs }}>
                    {exercise.sets.map((set) => (
                      <View key={set.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Space.md, borderRadius: Radius.md, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border }}>
                        <View>
                          <Text style={{ color: t.text, fontSize: Size.sm, fontWeight: '700' }}>Set {set.set_number}</Text>
                          <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{set.weight} kg × {set.reps} reps</Text>
                        </View>
                        <Text style={{ color: set.is_completed ? t.success : t.warning, fontSize: Size.xs, fontWeight: '800' }}>
                          {set.is_completed ? 'Completed' : 'Pending'}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}
