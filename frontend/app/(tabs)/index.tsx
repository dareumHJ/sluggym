// app/(tabs)/index.tsx — Home screen
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Size, withAlpha } from '../../src/constants/theme';
import { Card, SectionLabel } from '../../src/components/primitives';
import { OccupancyBar, PopularTimes } from '../../src/components/Occupancy';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { OptimalTimeRecommendation } from '../../src/components/OptimalTimeRecommendation';
import { WeeklyCongestionHeatmap } from '../../src/components/WeeklyCongestionHeatmap';
import { useAuth } from '../../src/contexts/AuthContext';
import { busiestHourlyWindow } from '../../src/lib/headcountHistory';
import { useEquipment } from '../../src/hooks/useEquipment';
import { useExercises, type WorkoutExerciseWithSets } from '../../src/hooks/useExercises';
import { useHeadcountHistory } from '../../src/hooks/useHeadcountHistory';
import { useLiveOccupancy } from '../../src/hooks/useLiveOccupancy';
import { useWorkouts } from '../../src/hooks/useWorkouts';
import { HOURLY, WEEKLY_CONGESTION } from '../../src/data/mock';
import { buildWorkoutRecommendation } from '../../src/lib/recommendations';

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
  const { equipment, loading: equipmentLoading, error: equipmentError } = useEquipment();
  const { workouts, activeWorkout, loading: workoutsLoading, error: workoutsError } = useWorkouts();
  const { getExercisesForWorkout } = useExercises();
  const headcountHistory = useHeadcountHistory();
  const [historyExercises, setHistoryExercises] = useState<WorkoutExerciseWithSets[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Athlete';
  const firstName = displayName.split(' ')[0];
  const hour = new Date().getHours();
  const occupancyCapacity = 150;
  const popularTimesData = headcountHistory.empty ? HOURLY : headcountHistory.popularTimes;
  const busiestHour = busiestHourlyWindow(headcountHistory.buckets);
  const completedWorkoutIds = useMemo(
    () => workouts.filter((workout) => workout.ended_at !== null).slice(0, 5).map((workout) => workout.id),
    [workouts],
  );
  const completedWorkoutKey = completedWorkoutIds.join('|');

  useEffect(() => {
    let isCurrent = true;

    if (completedWorkoutIds.length === 0) {
      setHistoryExercises([]);
      setHistoryError(null);
      setHistoryLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    setHistoryLoading(true);
    setHistoryError(null);

    Promise.all(completedWorkoutIds.map((workoutId) => getExercisesForWorkout(workoutId)))
      .then((exerciseGroups) => {
        if (!isCurrent) return;
        setHistoryExercises(exerciseGroups.flat());
      })
      .catch((historyLoadError) => {
        if (!isCurrent) return;
        setHistoryExercises([]);
        setHistoryError(historyLoadError instanceof Error ? historyLoadError.message : 'Failed to load exercise history.');
      })
      .finally(() => {
        if (isCurrent) setHistoryLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [completedWorkoutIds, completedWorkoutKey, getExercisesForWorkout]);

  const recommendation = useMemo(
    () =>
      buildWorkoutRecommendation({
        activeWorkout,
        workouts,
        equipment,
        historyExercises,
        occupancyCount: data.count,
        occupancyCapacity,
        errors: [error, equipmentError, workoutsError, historyError],
      }),
    [activeWorkout, data.count, equipment, equipmentError, error, historyError, historyExercises, workouts, workoutsError],
  );

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

      <AnimatedSection delay={100} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <SectionLabel>Recommendation</SectionLabel>
        <Card style={{ gap: Space.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>{recommendation.title}</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20, marginTop: 4 }}>
                {recommendation.detail}
              </Text>
            </View>
            {recommendation.equipment ? (
              <Pressable
                onPress={() => {
                  const equipmentId = recommendation.equipment?.id;
                  if (equipmentId) router.push(`/equipment/${equipmentId}`);
                }}
                style={{ alignItems: 'center', justifyContent: 'center', width: 62, height: 62, borderRadius: 16, backgroundColor: withAlpha(t.primary, 0.14), borderWidth: 1, borderColor: withAlpha(t.primary, 0.24) }}
              >
                <Text style={{ color: t.primary, fontSize: Size['2xl'], fontWeight: '800' }}>{recommendation.equipment.quantity}</Text>
                <Text style={{ color: t.primary, fontSize: 10, fontWeight: '700' }}>open</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.xs }}>
            {[recommendation.crowdLabel, recommendation.sourceLabel, recommendation.fallbackLabel]
              .filter((label): label is string => Boolean(label))
              .map((label) => (
                <View key={label} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.borderLight }}>
                  <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700' }}>{label}</Text>
                </View>
              ))}
          </View>

          {(equipmentLoading || workoutsLoading || historyLoading) && !recommendation.equipment ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.sm }}>
              <ActivityIndicator color={t.primary} />
              <Text style={{ color: t.textMuted, fontSize: Size.xs }}>Loading saved recommendation inputs…</Text>
            </View>
          ) : null}

          {recommendation.warnings.length > 0 ? (
            <View style={{ padding: Space.md, borderRadius: 14, backgroundColor: withAlpha(t.warning, 0.1), borderWidth: 1, borderColor: withAlpha(t.warning, 0.28), gap: 4 }}>
              <Text style={{ color: t.warning, fontSize: Size.xs, fontWeight: '800' }}>Fallback data in use</Text>
              {recommendation.warnings.map((warning) => (
                <Text key={warning} style={{ color: t.textSecondary, fontSize: Size.xs }}>{warning}</Text>
              ))}
            </View>
          ) : null}
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={120} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <SectionLabel>Popular Times · Today</SectionLabel>
        <Card>
          {headcountHistory.loading ? (
            <View style={{ alignItems: 'center', gap: Space.sm, marginBottom: Space.md }}>
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
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={180} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <OptimalTimeRecommendation />
      </AnimatedSection>

      <AnimatedSection delay={240} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <WeeklyCongestionHeatmap data={[...WEEKLY_CONGESTION]} />
      </AnimatedSection>
    </ScrollView>
  );
}
