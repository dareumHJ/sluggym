// app/(tabs)/stats.tsx
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme, Space, Size, withAlpha } from '../../src/constants/theme';
import { Button, Card, SectionLabel, StatTile } from '../../src/components/primitives';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { PR_HISTORY } from '../../src/data/mock';
import { useWorkouts, type WorkoutSession } from '../../src/hooks/useWorkouts';

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

function workoutMeta(workout: WorkoutSession) {
  const pieces = [formatWorkoutDate(workout.endedAt ?? workout.startedAt)];
  if (workout.durationMin) pieces.push(`${workout.durationMin} min`);
  if (workout.totalSets > 0) pieces.push(`${workout.totalSets} sets`);
  if (workout.totalVolumeKg > 0) pieces.push(`${workout.totalVolumeKg.toLocaleString()} kg`);
  return pieces.join(' · ');
}

export default function StatsScreen() {
  const t = useTheme();
  const { history, loading, error, loadHistory } = useWorkouts();

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const summary = useMemo(
    () => ({
      workouts: history.length,
      totalSets: history.reduce((sum, workout) => sum + workout.totalSets, 0),
      totalVolumeKg: history.reduce((sum, workout) => sum + workout.totalVolumeKg, 0),
    }),
    [history],
  );

  return (
      <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}>
      <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.md }}>Your progress</Text>

      <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg }}>
        <StatTile value={summary.workouts} label="Workouts" accent />
        <StatTile value={summary.totalSets} label="Sets" />
        <StatTile value={summary.totalVolumeKg.toLocaleString()} label="Volume kg" />
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
            <Pressable onPress={() => void loadHistory()}>
              <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>Refresh</Text>
            </Pressable>
          }
        >
          Session History
        </SectionLabel>
        <View style={{ gap: Space.sm }}>
          {loading && history.length === 0 ? (
            <Card style={{ alignItems: 'center', gap: Space.sm }}>
              <ActivityIndicator color={t.primary} />
              <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading saved sessions…</Text>
            </Card>
          ) : null}

          {error ? (
            <Card style={{ gap: Space.sm }}>
              <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>{error}</Text>
              <Button title="Retry" variant="secondary" onPress={() => void loadHistory()} />
            </Card>
          ) : null}

          {!loading && !error && history.length === 0 ? (
            <Card style={{ gap: Space.sm }}>
              <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No saved sessions yet</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                Start and end a workout from the Workout tab to save your first session here.
              </Text>
            </Card>
          ) : null}

          {history.map((workout) => (
            <Card key={workout.id} style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{workout.name}</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{workoutMeta(workout)}</Text>
              </View>
              {workout.exerciseCount > 0 ? (
                <View style={{ backgroundColor: withAlpha(t.primary, 0.15), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>{workout.exerciseCount} ex</Text>
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      </AnimatedSection>
    </ScrollView>
  );
}
