// app/(tabs)/stats.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme, Space, Size, withAlpha } from '../../src/constants/theme';
import { Card, SectionLabel, StatTile } from '../../src/components/primitives';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { RECENT_WORKOUTS, PR_HISTORY } from '../../src/data/mock';

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

export default function StatsScreen() {
  const t = useTheme();
  return (
      <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}>
      <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.md }}>Your progress</Text>

      <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg }}>
        <StatTile value="47" label="Workouts" accent />
        <StatTile value="5" label="Day Streak" />
        <StatTile value="82.5" label="Bench PR (kg)" />
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
        <SectionLabel>Recent Workouts</SectionLabel>
        <View style={{ gap: Space.sm }}>
          {RECENT_WORKOUTS.map(w => (
            <Card key={w.id} style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{w.name}</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{w.date} · {w.durationMin} min · {w.volumeKg.toLocaleString()} kg</Text>
              </View>
              {w.prs > 0 && (
                <View style={{ backgroundColor: withAlpha(t.primary, 0.15), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>{w.prs} PR</Text>
                </View>
              )}
            </Card>
          ))}
        </View>
      </AnimatedSection>
    </ScrollView>
  );
}
