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

export function OccupancyBar({ count, capacity }: { count: number; capacity: number }) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(100, Math.round((count / capacity) * 100)));
  const status = pct >= 85 ? 'Busy' : pct >= 60 ? 'Moderate' : 'Open';
  const statusColor = pct >= 85 ? t.warning : pct >= 60 ? t.success : t.primary;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: Space.sm }}>
        <Text style={{ color: t.text, fontSize: Size['4xl'], fontWeight: '800', letterSpacing: -1 }}>
          {count}
          <Text style={{ fontSize: Size.lg, color: t.textSecondary }}>/{capacity}</Text>
        </Text>
        <Text style={{ color: statusColor, fontSize: Size.sm, fontWeight: '600' }}>{status}</Text>
      </View>
      <View style={{ height: 12, borderRadius: 12, backgroundColor: withAlpha(t.text, 0.06), overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: t.primary, borderRadius: 12 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={{ color: t.textMuted, fontSize: 10 }}>0</Text>
        <Text style={{ color: t.textMuted, fontSize: 10 }}>{capacity}</Text>
      </View>
    </View>
  );
}

export function PopularTimes({ data, currentHour }: { data: number[]; currentHour: number }) {
  const t = useTheme();
  const w = 280, h = 80, gap = 2, labelW = 32;
  const visibleHours = Array.from({ length: 18 }, (_, index) => index + 6);
  const visibleData = visibleHours.map((hour) => data[hour] ?? 0);
  const max = Math.max(1, ...visibleData);
  const barW = (w - gap*(visibleData.length-1)) / visibleData.length;
  const labels = [
    { hour: 6, label: '6a' },
    { hour: 9, label: '9a' },
    { hour: 12, label: '12p' },
    { hour: 15, label: '3p' },
    { hour: 18, label: '6p' },
    { hour: 21, label: '9p' },
  ];
  return (
    <View style={{ width: w, alignSelf: 'center', overflow: 'visible' }}>
      <Svg width={w} height={h}>
        {visibleData.map((v, i) => {
          const hour = visibleHours[i];
          const bh = Math.max(2, (v / max) * (h - 4));
          const isNow = hour === currentHour;
          return (
            <Rect key={i} x={i*(barW+gap)} y={h - bh} width={barW} height={bh} rx={2}
              fill={isNow ? t.primary : withAlpha(t.text, 0.18)} />
          );
        })}
      </Svg>
      <View style={{ position: 'relative', width: w, height: 16, marginTop: 6, overflow: 'visible' }}>
        {labels.map(({ hour, label }) => {
          const index = hour - 6;
          const centerX = index * (barW + gap) + barW / 2;
          return (
            <Text
              key={label}
              style={{
                position: 'absolute',
                left: centerX - labelW / 2,
                width: labelW,
                color: t.textMuted,
                fontSize: 10,
                textAlign: 'center',
              }}
            >
              {label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}
