// app/(tabs)/stats.tsx
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme, Space, Size, withAlpha } from '../../src/constants/theme';
import { Button, Card, SectionLabel, StatTile } from '../../src/components/primitives';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { PR_HISTORY } from '../../src/data/mock';
import { useWorkouts, type Workout } from '../../src/hooks/useWorkouts';

const VOLUME_WEEKS = [3200, 3850, 4100, 4520, 4200, 5100, 4820];

function VolumeChart() {
  const t = useTheme();
  const w = 300, h = 120, pad = 10;
  const max = Math.max(...VOLUME_WEEKS), min = Math.min(...VOLUME_WEEKS);
  const pts = VOLUME_WEEKS.map((v, i) => {
    const x = pad + (i / (VOLUME_WEEKS.length - 1)) * (w - pad * 2);
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

function workoutMeta(workout: Workout) {
  const pieces = [formatWorkoutDate(workout.ended_at ?? workout.started_at)];
  if (workout.duration_min) pieces.push(`${workout.duration_min} min`);
  if (workout.target_muscle.length > 0) pieces.push(workout.target_muscle.join(', '));
  return pieces.join(' · ');
}

export default function StatsScreen() {
  const t = useTheme();
  const { workouts, loading, error, refresh } = useWorkouts();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const summary = useMemo(
    () => ({
      workouts: workouts.length,
      active: workouts.filter((workout) => workout.ended_at === null).length,
      totalMinutes: workouts.reduce((sum, workout) => sum + (workout.duration_min ?? 0), 0),
    }),
    [workouts],
  );

  return (
      <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}>
      <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.md }}>Your progress</Text>

      <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg }}>
        <StatTile value={summary.workouts} label="Workouts" accent />
        <StatTile value={summary.active} label="Active" />
        <StatTile value={summary.totalMinutes.toLocaleString()} label="Minutes" />
      </View>

      <SectionLabel>Weekly Volume (kg)</SectionLabel>
      <AnimatedSection delay={80}>
      <Card>
        <VolumeChart />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Space.sm }}>
          {['W1','W2','W3','W4','W5','W6','W7'].map(w => <Text key={w} style={{ color: t.textMuted, fontSize: 10 }}>{w}</Text>)}
        </View>
      </Card>
      </AnimatedSection>

      <AnimatedSection delay={160} style={{ marginTop: Space.xl }}>
        <SectionLabel>Recent PRs</SectionLabel>
        <View style={{ gap: Space.sm }}>
          {PR_HISTORY.map((p, i) => (
            <Card key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: withAlpha(t.primary, 0.15), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: t.primary, fontSize: Size.lg }}>🏆</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{p.exercise}</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{p.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{p.pr}</Text>
                <Text style={{ color: t.success, fontSize: Size.xs, fontWeight: '700' }}>{p.delta} kg</Text>
              </View>
            </Card>
          ))}
        </View>
      </AnimatedSection>

      <AnimatedSection delay={240} style={{ marginTop: Space.xl }}>
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
