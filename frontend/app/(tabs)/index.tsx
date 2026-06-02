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
import { busiestHourlyWindow } from '../../src/lib/headcountHistory';
import { useHeadcountHistory } from '../../src/hooks/useHeadcountHistory';
import { useLiveOccupancy } from '../../src/hooks/useLiveOccupancy';
import { HOURLY, WEEKLY_CONGESTION } from '../../src/data/mock';
import { useRoutineRecommendations } from '../../src/hooks/useRoutineRecommendations';


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
  const hour = new Date().getHours();
  const occupancyCapacity = 150;
  const popularTimesData = headcountHistory.empty ? HOURLY : headcountHistory.popularTimes;
  const busiestHour = busiestHourlyWindow(headcountHistory.buckets);

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
        <PopularTimes data={popularTimesData} currentHour={hour} />
        <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: Space.md, textAlign: 'center' }}>
          {headcountHistory.empty || busiestHour === null
            ? 'Typically busy between 5–7pm'
            : `Busiest recent hour: ${busiestHour}:00`}
        </Text>
      </AnimatedSection>

      <AnimatedSection delay={200} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <WeeklyCongestionHeatmap data={[...WEEKLY_CONGESTION]} />
      </AnimatedSection>
    </ScrollView>
  );
}
