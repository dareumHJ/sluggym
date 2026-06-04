// app/(tabs)/stats.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme, Space, Size, withAlpha } from '../../src/constants/theme';
import { Button, Card, SectionLabel, StatTile } from '../../src/components/primitives';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { ExerciseThumbnail, useExerciseImageFrameTick } from '../../src/components/ExerciseThumbnail';
import { useWorkouts, type Workout } from '../../src/hooks/useWorkouts';
import { useExercises, type WorkoutExerciseWithSets } from '../../src/hooks/useExercises';

type WorkoutDetail = {
  workout: Workout;
  exercises: WorkoutExerciseWithSets[];
};

type WeeklyVolumePoint = {
  label: string;
  volume: number;
};

type RecentPr = {
  exercise: string;
  date: string;
  pr: string;
  delta: string;
};

function VolumeChart({ points }: { points: WeeklyVolumePoint[] }) {
  const t = useTheme();
  const w = 300, h = 120, pad = 10;
  const volumes = points.map((point) => point.volume);
  const max = Math.max(...volumes, 1), min = Math.min(...volumes, 0);
  const pts = volumes.map((v, i) => {
    const x = pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const dFill = `${d} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`;
  return (
    <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
      <Path d={dFill} fill={withAlpha(t.primary, 0.15)} />
      <Path d={d} stroke={t.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <Circle key={i} cx={p[0]} cy={p[1]} r={3} fill={t.primary} />)}
    </Svg>
  );
}

function formatKg(value: number) {
  if (Number.isInteger(value)) return `${value} kg`;
  return `${Number(value.toFixed(1))} kg`;
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

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const result = startOfDay(date);
  result.setDate(result.getDate() + diff);
  return result;
}

function formatWeekLabel(date: Date) {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getWorkoutDate(workout: Workout) {
  const date = new Date(workout.ended_at ?? workout.started_at);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getCompletedSetVolume(exercise: WorkoutExerciseWithSets) {
  return exercise.sets.reduce((sum, set) => {
    if (!set.is_completed) return sum;
    return sum + set.weight * set.reps;
  }, 0);
}

function buildWeeklyVolumePoints(details: WorkoutDetail[], referenceDate = new Date()): WeeklyVolumePoint[] {
  const currentWeekStart = startOfWeek(referenceDate);
  const weekStarts = Array.from({ length: 7 }, (_, index) => {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - (6 - index) * 7);
    return weekStart;
  });

  return weekStarts.map((weekStart) => {
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(weekStart.getDate() + 7);

    const volume = details.reduce((sum, detail) => {
      const workoutDate = getWorkoutDate(detail.workout);
      if (!workoutDate || workoutDate < weekStart || workoutDate >= nextWeekStart) return sum;
      return sum + detail.exercises.reduce((exerciseSum, exercise) => exerciseSum + getCompletedSetVolume(exercise), 0);
    }, 0);

    return {
      label: formatWeekLabel(weekStart),
      volume,
    };
  });
}

function buildRecentPrs(details: WorkoutDetail[]): RecentPr[] {
  const workoutBestSets = details
    .flatMap((detail) => {
      const workoutDate = getWorkoutDate(detail.workout);
      if (!workoutDate) return [];

      return detail.exercises.flatMap((exercise) => {
        const exerciseName = exercise.exercise?.name ?? `Exercise #${exercise.exercise_id}`;
        const completedSets = exercise.sets.filter((set) => set.is_completed && set.weight > 0);
        const bestSet = completedSets.reduce<typeof completedSets[number] | null>(
          (best, set) => (!best || set.weight > best.weight ? set : best),
          null,
        );

        return bestSet
          ? [{
              exerciseName,
              weight: bestSet.weight,
              date: workoutDate,
            }]
          : [];
      });
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const previousBestByExercise = new Map<string, number>();
  const latestPrByExercise = new Map<string, RecentPr & { timestamp: number }>();

  for (const set of workoutBestSets) {
    const previousBest = previousBestByExercise.get(set.exerciseName);
    if (previousBest === undefined || set.weight > previousBest) {
      latestPrByExercise.set(set.exerciseName, {
        exercise: set.exerciseName,
        date: formatWorkoutDate(set.date.toISOString()),
        pr: formatKg(set.weight),
        delta: previousBest === undefined ? 'New' : `+${formatKg(set.weight - previousBest)}`,
        timestamp: set.date.getTime(),
      });
      previousBestByExercise.set(set.exerciseName, set.weight);
    }
  }

  return Array.from(latestPrByExercise.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3)
    .map(({ timestamp, ...pr }) => pr);
}

function workoutMeta(workout: Workout) {
  const pieces = [formatWorkoutDate(workout.ended_at ?? workout.started_at)];
  if (workout.duration_min) pieces.push(`${workout.duration_min} min`);
  if (workout.target_muscle.length > 0) pieces.push(workout.target_muscle.join(', '));
  return pieces.join(' · ');
}

export default function StatsScreen() {
  const t = useTheme();
  const { workouts, loading, error, refresh } = useWorkouts();
  const { getExercisesForWorkout } = useExercises();
  const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetail[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const completedWorkouts = useMemo(
    () => workouts.filter((workout) => workout.ended_at !== null),
    [workouts],
  );
  const completedWorkoutKey = useMemo(
    () => completedWorkouts.map((workout) => workout.id).join('|'),
    [completedWorkouts],
  );

  useEffect(() => {
    let isCurrent = true;

    if (completedWorkouts.length === 0) {
      setWorkoutDetails([]);
      setMetricsError(null);
      setMetricsLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    setMetricsLoading(true);
    setMetricsError(null);

    Promise.all(
      completedWorkouts.map(async (workout) => ({
        workout,
        exercises: await getExercisesForWorkout(workout.id),
      })),
    )
      .then((details) => {
        if (!isCurrent) return;
        setWorkoutDetails(details);
      })
      .catch((detailError) => {
        if (!isCurrent) return;
        setWorkoutDetails([]);
        setMetricsError(detailError instanceof Error ? detailError.message : 'Failed to load workout metrics.');
      })
      .finally(() => {
        if (isCurrent) setMetricsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [completedWorkoutKey, completedWorkouts, getExercisesForWorkout]);

  const summary = useMemo(
    () => ({
      workouts: workouts.length,
      active: workouts.filter((workout) => workout.ended_at === null).length,
      totalMinutes: workouts.reduce((sum, workout) => sum + (workout.duration_min ?? 0), 0),
    }),
    [workouts],
  );
  const weeklyVolume = useMemo(() => buildWeeklyVolumePoints(workoutDetails), [workoutDetails]);
  const recentPrs = useMemo(() => buildRecentPrs(workoutDetails), [workoutDetails]);
  const recentPrFrameTick = useExerciseImageFrameTick(recentPrs.map((pr) => pr.exercise));
  const totalWeeklyVolume = weeklyVolume.reduce((sum, point) => sum + point.volume, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}>
      <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.md }}>Your progress</Text>

      <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg }}>
        <StatTile value={summary.workouts} label="Workouts" accent />
        <StatTile value={summary.active} label="Active" />
        <StatTile value={summary.totalMinutes.toLocaleString()} label="Minutes" />
      </View>

      <AnimatedSection delay={80}>
        <SectionLabel>Total Weight Lifted</SectionLabel>
        <Card>
          {metricsLoading && workoutDetails.length === 0 ? (
            <View style={{ alignItems: 'center', gap: Space.sm, marginBottom: Space.md }}>
              <ActivityIndicator color={t.primary} />
              <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading saved lifting totals…</Text>
            </View>
          ) : null}
          {metricsError ? (
            <Text style={{ color: t.error, fontSize: Size.xs, marginBottom: Space.sm, textAlign: 'center' }}>
              {metricsError}
            </Text>
          ) : null}
          <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800', marginBottom: Space.sm }}>
            {totalWeeklyVolume.toLocaleString()} kg in the last 7 weeks
          </Text>
          <VolumeChart points={weeklyVolume} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Space.sm }}>
            {weeklyVolume.map((week) => (
              <Text key={week.label} style={{ color: t.textSecondary, fontSize: 10, fontWeight: '600' }}>
                {week.label}
              </Text>
            ))}
          </View>
          {!metricsLoading && !metricsError && totalWeeklyVolume === 0 ? (
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20, marginTop: Space.md, textAlign: 'center' }}>
              Log completed sets to build your weight-lifted chart.
            </Text>
          ) : null}
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={240} style={{ marginTop: Space.xl }}>
        <SectionLabel>Personal Bests</SectionLabel>
        <View style={{ gap: Space.sm }}>
          {metricsLoading && workoutDetails.length === 0 ? (
            <Card style={{ alignItems: 'center', gap: Space.sm }}>
              <ActivityIndicator color={t.primary} />
              <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading saved personal bests…</Text>
            </Card>
          ) : null}

          {!metricsLoading && !metricsError && recentPrs.length === 0 ? (
            <Card style={{ gap: Space.sm }}>
              <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No personal bests yet</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                Complete weighted sets in a saved workout to track your best lifts here.
              </Text>
            </Card>
          ) : null}

          {recentPrs.map((p) => (
            <Card key={`${p.exercise}-${p.date}-${p.pr}`} style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
              <ExerciseThumbnail name={p.exercise} frameTick={recentPrFrameTick} size={48} theme={t} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{p.exercise}</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{p.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{p.pr}</Text>
                <Text style={{ color: t.success, fontSize: Size.xs, fontWeight: '700' }}>{p.delta}</Text>
              </View>
            </Card>
          ))}
        </View>
      </AnimatedSection>

      <AnimatedSection delay={320} style={{ marginTop: Space.xl }}>
        <SectionLabel
          action={
            <Pressable onPress={() => void refresh()}>
              <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>Refresh</Text>
            </Pressable>
          }
        >
          Session History
        </SectionLabel>
        <View style={{ gap: Space.sm }}>
          {loading && workouts.length === 0 ? (
            <Card style={{ alignItems: 'center', gap: Space.sm }}>
              <ActivityIndicator color={t.primary} />
              <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading saved sessions…</Text>
            </Card>
          ) : null}

          {error ? (
            <Card style={{ gap: Space.sm }}>
              <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>{error}</Text>
              <Button title="Retry" variant="secondary" onPress={() => void refresh()} />
            </Card>
          ) : null}

          {!loading && !error && workouts.length === 0 ? (
            <Card style={{ gap: Space.sm }}>
              <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No saved sessions yet</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                Start and end a workout from the Workout tab to save your first session here.
              </Text>
            </Card>
          ) : null}

          {workouts.map((workout) => {
            const isCompleted = workout.ended_at !== null;

            return (
              <Pressable
                key={workout.id}
                disabled={!isCompleted}
                onPress={() => router.push(`/workout-history/${workout.id}`)}
              >
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md, opacity: isCompleted ? 1 : 0.72 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{workout.name}</Text>
                    <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{workoutMeta(workout)}</Text>
                    {isCompleted ? (
                      <Text style={{ color: t.primary, fontSize: 10, fontWeight: '700', marginTop: 6 }}>Tap to view details</Text>
                    ) : null}
                  </View>
                  {workout.ended_at === null ? (
                    <View style={{ backgroundColor: withAlpha(t.primary, 0.15), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>Active</Text>
                    </View>
                  ) : (
                    <Text style={{ color: t.textMuted, fontSize: Size.sm }}>›</Text>
                  )}
                </Card>
              </Pressable>
            );
          })}
        </View>
      </AnimatedSection>
    </ScrollView>
  );
}
