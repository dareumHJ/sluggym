// app/(tabs)/index.tsx — Home screen
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useTheme, Space, Size } from '../../src/constants/theme';
import { Card } from '../../src/components/primitives';
import { OccupancyBar, PopularTimes } from '../../src/components/Occupancy';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { OptimalTimeRecommendation } from '../../src/components/OptimalTimeRecommendation';
import { WeeklyCongestionHeatmap } from '../../src/components/WeeklyCongestionHeatmap';
import { useAuth } from '../../src/contexts/AuthContext';
import { GYM_CAPACITY } from '../../src/lib/gymCapacity';
import { busiestHourlyWindow, getGymLocalHour } from '../../src/lib/headcountHistory';
import { useHeadcountHistory } from '../../src/hooks/useHeadcountHistory';
import { useLiveOccupancy } from '../../src/hooks/useLiveOccupancy';
import { DEFAULT_HOURLY_HEADCOUNT } from '../../src/data/defaultOccupancy';
import { DEFAULT_GYM_LOCATION } from '../../src/hooks/useHeadcountHistory';
import { useWeeklyCongestion } from '../../src/hooks/useWeeklyCongestion';
import { useRoutineRecommendations } from '../../src/hooks/useRoutineRecommendations';

const WEEKDAY_TO_SHORT: Record<string, string> = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
};

const HEATMAP_HOUR_STARTS: Record<string, number> = {
  '6a': 6,
  '9a': 9,
  '12p': 12,
  '3p': 15,
  '6p': 18,
  '9p': 21,
};

function backfillPopularTimesFromCongestion({
  base,
  buckets,
  congestionData,
  fallback,
  weekdayName,
}: {
  base: number[];
  buckets: ReturnType<typeof useHeadcountHistory>['buckets'];
  congestionData: ReturnType<typeof useWeeklyCongestion>['data'];
  fallback: number[];
  weekdayName: string;
}) {
  const filled = [...base];
  const day = WEEKDAY_TO_SHORT[weekdayName];
  if (!day) return filled;

  for (const cell of congestionData) {
    if (cell.day !== day || cell.intensity === null) continue;

    const startHour = HEATMAP_HOUR_STARTS[cell.hourLabel];
    if (startHour === undefined) continue;

    const estimatedCount = Math.round((cell.intensity / 100) * GYM_CAPACITY);
    for (let hour = startHour; hour < startHour + 3 && hour < filled.length; hour += 1) {
      const currentCount = filled[hour] ?? 0;
      if (buckets[hour]?.sampleCount === 0 || estimatedCount > currentCount) {
        filled[hour] = estimatedCount;
      }
    }
  }

  for (let hour = 6; hour < Math.min(filled.length, 24); hour += 1) {
    if ((filled[hour] ?? 0) <= 0) {
      filled[hour] = fallback[hour] ?? 0;
    }
  }

  return filled;
}

function busiestHourFromPopularTimes(popularTimes: number[]) {
  let bestHour: number | null = null;
  let bestCount = -1;

  for (let hour = 6; hour < Math.min(popularTimes.length, 24); hour += 1) {
    const count = popularTimes[hour] ?? 0;
    if (count > bestCount) {
      bestCount = count;
      bestHour = hour;
    }
  }

  return bestCount > 0 ? bestHour : null;
}

function formatTimestamp(timestamp?: string | null) {
  if (!timestamp) return 'Waiting for a live update';

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Waiting for a live update';

  return `Updated ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

export default function HomeScreen() {
  const t = useTheme();
  const { user } = useAuth();
  const { data, error, loading, refreshing } = useLiveOccupancy();
  const headcountHistory = useHeadcountHistory();
  const {
    uiRecommendations,
    loading: recsLoading,
    error: recsError,
    empty: recsEmpty,
    refresh: refreshRecommendations,
  } = useRoutineRecommendations();
  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Athlete';
  const firstName = displayName.split(' ')[0];
  const hour = getGymLocalHour(new Date());
  const occupancyCapacity = GYM_CAPACITY;
  const { data: congestionData, loading: congestionLoading, error: congestionError } = useWeeklyCongestion(DEFAULT_GYM_LOCATION);
  const basePopularTimesData = headcountHistory.empty ? DEFAULT_HOURLY_HEADCOUNT : headcountHistory.popularTimes;
  const popularTimesData = backfillPopularTimesFromCongestion({
    base: basePopularTimesData,
    buckets: headcountHistory.buckets,
    congestionData,
    fallback: DEFAULT_HOURLY_HEADCOUNT,
    weekdayName: headcountHistory.weekdayName,
  });
  const busiestHour = headcountHistory.empty
    ? busiestHourlyWindow(headcountHistory.buckets)
    : busiestHourFromPopularTimes(popularTimesData);

  return (
      <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ paddingHorizontal: Space.lg, paddingTop: Space['2xl'], paddingBottom: Space.md }}>
        <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Good morning,</Text>
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>{firstName}</Text>
      </View>

      <AnimatedSection delay={40} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <Card style={{ paddingVertical: Space['2xl'] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Space.md }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 6,
                backgroundColor: error ? t.warning : t.success,
              }}
            />
            <Text
              style={{
                color: t.textSecondary,
                fontSize: Size.xs,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                fontWeight: '700',
              }}
            >
              Live headcount · {data.location}
            </Text>
          </View>

          {loading && data.count === 0 && data.source === 'fallback' && !data.timestamp ? (
            <View style={{ alignItems: 'center', gap: Space.md }}>
              <ActivityIndicator color={t.primary} />
              <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading live headcount…</Text>
            </View>
          ) : (
            <View style={{ gap: Space.sm }}>
              <OccupancyBar count={data.count} capacity={occupancyCapacity} />
              <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>
                {formatTimestamp(data.timestamp)} · refreshes every minute
              </Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, textAlign: 'center' }}>
                {data.count}/{occupancyCapacity} people here now
              </Text>
              {refreshing ? (
                <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>Refreshing…</Text>
              ) : null}
              {error ? (
                <Text style={{ color: t.warning, fontSize: Size.xs, textAlign: 'center' }}>
                  {error}
                </Text>
              ) : null}
            </View>
          )}

        </Card>
      </AnimatedSection>

      {/* Best Time to Go — moved up to fill the slot vacated by the old "Go Now?" card.
          Sits just below Live Headcount so the user sees the actionable recommendation
          right after the current status. */}
      <AnimatedSection delay={100} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <OptimalTimeRecommendation
          recommendations={uiRecommendations}
          loading={recsLoading}
          error={recsError}
          emptyHint={
            recsEmpty
              ? 'Create a routine and log at least one workout to unlock smart time recommendations.'
              : null
          }
          onRefresh={() => void refreshRecommendations()}
        />
      </AnimatedSection>

      <AnimatedSection delay={140} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        {headcountHistory.loading ? (
          <View style={{ alignItems: 'center', gap: Space.sm, marginBottom: Space.sm }}>
            <ActivityIndicator color={t.primary} />
            <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading headcount history…</Text>
          </View>
        ) : null}
        {headcountHistory.error ? (
          <Text style={{ color: t.warning, fontSize: Size.xs, marginBottom: Space.sm, textAlign: 'center' }}>
            Headcount history unavailable; showing fallback trends.
          </Text>
        ) : null}
        {!headcountHistory.loading && !headcountHistory.error && headcountHistory.empty ? (
          <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginBottom: Space.sm, textAlign: 'center' }}>
            Not enough historical samples yet; showing safe fallback trends.
          </Text>
        ) : null}
        <Text style={{ color: t.textSecondary, fontSize: Size.sm, fontWeight: '800', marginBottom: Space.sm, textAlign: 'center' }}>
          <Text style={{ color: t.primary }}>{headcountHistory.weekdayName}</Text> Average Headcount
        </Text>
        <PopularTimes data={popularTimesData} currentHour={hour} />
        <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: Space.md, textAlign: 'center' }}>
          {headcountHistory.empty || busiestHour === null
            ? 'Typically busy between 5–7pm'
            : `Busiest hour: ${busiestHour}:00`}
        </Text>
      </AnimatedSection>

      <AnimatedSection delay={200} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        {congestionLoading ? (
          <View style={{ alignItems: 'center', gap: Space.sm, marginBottom: Space.sm }}>
            <ActivityIndicator color={t.primary} />
            <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading weekly congestion…</Text>
          </View>
        ) : null}
        {congestionError ? (
          <Text style={{ color: t.warning, fontSize: Size.xs, marginBottom: Space.sm, textAlign: 'center' }}>
            {congestionError}
          </Text>
        ) : null}
        <WeeklyCongestionHeatmap data={congestionData} />
      </AnimatedSection>
    </ScrollView>
  );
}
