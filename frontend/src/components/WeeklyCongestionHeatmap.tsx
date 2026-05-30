import React from 'react';
import { Text, View } from 'react-native';
import { Radius, Size, Space, useTheme, withAlpha } from '../constants/theme';
import { Card, SectionLabel } from './primitives';

export type WeeklyCongestionCell = {
  day: string;
  hourLabel: string;
  intensity: number | null;
};

const DEFAULT_DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_HOUR_ORDER = ['6a', '9a', '12p', '3p', '6p', '9p'];
const DAY_LABEL_WIDTH = 32;
const CELL_HEIGHT = 24;

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function cellColor(intensity: number | null, primary: string) {
  if (intensity === null) return 'rgba(128,128,140,0.16)';
  const normalized = clamp(intensity) / 100;
  return withAlpha(primary, 0.14 + normalized * 0.72);
}

function getQuietestPeriods(data: WeeklyCongestionCell[]) {
  const populated = data.filter((cell) => cell.intensity !== null);
  if (populated.length === 0) return [] as WeeklyCongestionCell[];

  const sorted = [...populated].sort((a, b) => (a.intensity ?? 101) - (b.intensity ?? 101));
  const quietest = sorted.slice(0, 3);
  const deduped = new Map<string, WeeklyCongestionCell>();
  for (const cell of quietest) {
    deduped.set(`${cell.day}-${cell.hourLabel}`, cell);
  }
  return Array.from(deduped.values());
}

function hasEnoughData(data: WeeklyCongestionCell[]) {
  const populated = data.filter((cell) => cell.intensity !== null);
  return populated.length >= Math.max(6, Math.floor(data.length * 0.35));
}

export function WeeklyCongestionHeatmap({
  title = 'Weekly Congestion Heatmap',
  data,
}: {
  title?: string;
  data: WeeklyCongestionCell[];
}) {
  const t = useTheme();
  const days = DEFAULT_DAY_ORDER.filter((day) => data.some((cell) => cell.day === day));
  const hours = DEFAULT_HOUR_ORDER.filter((hour) => data.some((cell) => cell.hourLabel === hour));
  const quietest = getQuietestPeriods(data);
  const enoughData = hasEnoughData(data);

  return (
    <View style={{ gap: Space.md }}>
      <SectionLabel>{title}</SectionLabel>
      <Card style={{ gap: Space.md }}>
        {!enoughData ? (
          <View style={{ gap: Space.sm }}>
            <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>Not enough weekly traffic data yet</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
              We’ll show clearer quiet-hour recommendations once more check-in data accumulates. For now, treat this as an early preview only.
            </Text>
          </View>
        ) : null}

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 2 }}>
            <View style={{ width: DAY_LABEL_WIDTH }} />
            {hours.map((hour) => (
              <Text
                key={hour}
                style={{ color: t.textSecondary, flex: 1, fontSize: Size.xs, fontWeight: '700', textAlign: 'center' }}
              >
                {hour}
              </Text>
            ))}
          </View>
          {days.map((day) => (
            <View key={day} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text
                style={{
                  color: t.textSecondary,
                  fontSize: Size.sm,
                  fontWeight: '700',
                  height: CELL_HEIGHT,
                  lineHeight: CELL_HEIGHT,
                  width: DAY_LABEL_WIDTH,
                }}
              >
                {day}
              </Text>
              {hours.map((hour) => {
                const cell = data.find((entry) => entry.day === day && entry.hourLabel === hour) ?? null;
                const intensity = cell?.intensity ?? null;
                return (
                  <View
                    key={`${day}-${hour}`}
                    style={{
                      flex: 1,
                      height: CELL_HEIGHT,
                      borderRadius: Radius.sm,
                      backgroundColor: cellColor(intensity, t.primary),
                      borderWidth: 1,
                      borderColor: intensity === null ? t.border : withAlpha(t.primary, 0.28),
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.md }}>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm, flex: 1 }}>
            Darker cells mean busier periods. Grey cells mean we do not have enough data for that slot yet.
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700' }}>Quiet</Text>
            {[0.2, 0.4, 0.65, 0.9].map((alpha) => (
              <View
                key={alpha}
                style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: withAlpha(t.primary, alpha) }}
              />
            ))}
            <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700' }}>Busy</Text>
          </View>
        </View>

        {enoughData ? (
          <View style={{ gap: Space.xs }}>
            <Text style={{ color: t.text, fontSize: Size.sm, fontWeight: '800' }}>Best bets for a quieter session</Text>
            {quietest.map((cell) => (
              <Text key={`${cell.day}-${cell.hourLabel}`} style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                - {cell.day} at {cell.hourLabel}
              </Text>
            ))}
          </View>
        ) : null}
      </Card>
    </View>
  );
}
