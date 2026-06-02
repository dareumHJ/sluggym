// app/workout-summary.tsx — post-session summary screen
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme, Space, Size } from '../src/constants/theme';
import { Button, Card, StatTile } from '../src/components/primitives';

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function parseParam(value: string | string[] | undefined, fallback = 0) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function WorkoutSummaryScreen() {
  const t = useTheme();
  const params = useLocalSearchParams<{
    durationSec?: string;
    exerciseCount?: string;
    sets?: string;
    volume?: string;
  }>();

  const durationSec = parseParam(params.durationSec);
  const exerciseCount = parseParam(params.exerciseCount);
  const sets = parseParam(params.sets);
  const volume = parseParam(params.volume);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}>
      <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>
        Workout saved
      </Text>
      <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>
        Nice session.
      </Text>
      <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20, marginTop: Space.sm }}>
        Your equipment is marked available again and this summary is ready to appear in session history once the Workouts hook is wired.
      </Text>

      <View style={{ flexDirection: 'row', gap: Space.sm, marginTop: Space.xl }}>
        <StatTile value={fmt(durationSec)} label="Duration" accent />
        <StatTile value={sets} label="Sets" />
      </View>
      <View style={{ flexDirection: 'row', gap: Space.sm, marginTop: Space.sm }}>
        <StatTile value={exerciseCount} label="Exercises" />
        <StatTile value={volume.toLocaleString()} label="Volume kg" />
      </View>

      <Card style={{ marginTop: Space.xl, gap: Space.sm }}>
        <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>Next up</Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
          The UI flow is in place. The next implementation step is persisting this summary through the Workouts hook and showing saved rows on the history screen.
        </Text>
      </Card>

      <View style={{ gap: Space.sm, marginTop: Space.xl }}>
        <Button title="Back to home" size="lg" onPress={() => router.replace('/(tabs)')} />
        <Button title="View stats" variant="secondary" size="lg" onPress={() => router.push('/(tabs)/stats')} />
      </View>
    </ScrollView>
  );
}
