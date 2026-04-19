// src/components/Occupancy.tsx — ring / dots / bar visualizations
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useTheme, withAlpha, Size, Space } from '../constants/theme';

export function OccupancyRing({ pct, size = 220, label = 'people here now' }: { pct: number; size?: number; label?: string }) {
  const t = useTheme();
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size/2} cy={size/2} r={r} stroke={withAlpha(t.text, 0.08)} strokeWidth={stroke} fill="none" />
        <Circle cx={size/2} cy={size/2} r={r} stroke={t.primary} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={`${circ}`} strokeDashoffset={offset} />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ color: t.text, fontSize: Size['5xl'], fontWeight: '800', letterSpacing: -1 }}>{Math.round(pct)}</Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700', marginTop: -4 }}>% full</Text>
        <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: 8 }}>{label}</Text>
      </View>
    </View>
  );
}

export function OccupancyDots({ pct }: { pct: number }) {
  const t = useTheme();
  const total = 48;
  const filled = Math.round((pct/100) * total);
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, width: 8*14+7*6, justifyContent: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={{ width: 14, height: 14, borderRadius: 14, backgroundColor: i < filled ? t.primary : withAlpha(t.text, 0.08) }} />
        ))}
      </View>
      <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', marginTop: Space.lg }}>{pct}% full</Text>
      <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: 2 }}>{filled} of {total} stations in use</Text>
    </View>
  );
}

export function OccupancyBar({ pct }: { pct: number }) {
  const t = useTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: Space.sm }}>
        <Text style={{ color: t.text, fontSize: Size['4xl'], fontWeight: '800', letterSpacing: -1 }}>{pct}<Text style={{ fontSize: Size.lg, color: t.textSecondary }}>% full</Text></Text>
        <Text style={{ color: t.success, fontSize: Size.sm, fontWeight: '600' }}>Moderate</Text>
      </View>
      <View style={{ height: 12, borderRadius: 12, backgroundColor: withAlpha(t.text, 0.06), overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: t.primary, borderRadius: 12 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={{ color: t.textMuted, fontSize: 10 }}>EMPTY</Text>
        <Text style={{ color: t.textMuted, fontSize: 10 }}>PACKED</Text>
      </View>
    </View>
  );
}

export function PopularTimes({ data, currentHour }: { data: number[]; currentHour: number }) {
  const t = useTheme();
  const max = Math.max(...data);
  const w = 280, h = 80, gap = 2;
  const barW = (w - gap*(data.length-1)) / data.length;
  return (
    <View>
      <Svg width={w} height={h}>
        {data.map((v, i) => {
          const bh = Math.max(2, (v / max) * (h - 4));
          const isNow = i === currentHour;
          return (
            <Rect key={i} x={i*(barW+gap)} y={h - bh} width={barW} height={bh} rx={2}
              fill={isNow ? t.primary : withAlpha(t.text, 0.18)} />
          );
        })}
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        {['6a','9a','12p','3p','6p','9p'].map(l => (
          <Text key={l} style={{ color: t.textMuted, fontSize: 10 }}>{l}</Text>
        ))}
      </View>
    </View>
  );
}
