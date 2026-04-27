// app/(tabs)/index.tsx — Home screen
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Size, withAlpha } from '../../src/constants/theme';
import { Card, SectionLabel } from '../../src/components/primitives';
import { OccupancyBar, PopularTimes } from '../../src/components/Occupancy';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { useAuth } from '../../src/contexts/AuthContext';
import { useLiveOccupancy } from '../../src/hooks/useLiveOccupancy';
import { HOURLY, ZONES } from '../../src/data/mock';

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
  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Athlete';
  const firstName = displayName.split(' ')[0];
  const hour = new Date().getHours();
  const occupancyCapacity = 150;

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
                  API connection failed
                </Text>
              ) : null}
            </View>
          )}

        </Card>
      </AnimatedSection>

      <AnimatedSection delay={120} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <SectionLabel>Popular Times · Today</SectionLabel>
        <Card>
          <PopularTimes data={HOURLY} currentHour={hour} />
          <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: Space.md, textAlign: 'center' }}>
            Typically busy between 5–7pm
          </Text>
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={120} style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <SectionLabel>By Zone</SectionLabel>
        <View style={{ gap: Space.sm }}>
          {ZONES.map((zone) => {
            const zonePct = Math.round((zone.count / zone.capacity) * 100);
            return (
              <Pressable key={zone.id} onPress={() => router.push('/(tabs)/search')}>
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: withAlpha(t.primary, 0.15),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: t.primary, fontSize: Size.lg, fontWeight: '800' }}>{zone.id}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{zone.name}</Text>
                    <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>
                      {zone.count}/{zone.capacity} people · {zonePct}%
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 80,
                      height: 6,
                      borderRadius: 6,
                      backgroundColor: withAlpha(t.text, 0.08),
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        width: `${zonePct}%`,
                        height: '100%',
                        backgroundColor: zonePct > 80 ? t.warning : t.primary,
                      }}
                    />
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </AnimatedSection>
    </ScrollView>
  );
}
