// app/(tabs)/index.tsx — Home screen
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme, useTweaks, Space, Size, withAlpha } from '../../src/constants/theme';
import { Card, SectionLabel, Button } from '../../src/components/primitives';
import { OccupancyRing, OccupancyDots, OccupancyBar, PopularTimes } from '../../src/components/Occupancy';
import { ZONES, HOURLY } from '../../src/data/mock';
import { useAuth } from '../../src/contexts/AuthContext';

export default function HomeScreen() {
  const t = useTheme();
  const { tweaks } = useTweaks();
  const { user } = useAuth();
  const pct = tweaks.currentOccupancy;
  const hour = new Date().getHours();
  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Athlete';
  const firstName = displayName.split(' ')[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Greeting */}
      <View style={{ paddingHorizontal: Space.lg, paddingTop: Space['2xl'], paddingBottom: Space.md }}>
        <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Good morning,</Text>
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>{firstName}</Text>
      </View>

      {/* Hero occupancy card */}
      <View style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <Card style={{ alignItems: 'center', paddingVertical: Space['2xl'] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Space.md }}>
            <View style={{ width: 6, height: 6, borderRadius: 6, backgroundColor: t.success }} />
            <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '700' }}>Live · East Field House</Text>
          </View>
          {tweaks.occupancyStyle === 'ring' && <OccupancyRing pct={pct} />}
          {tweaks.occupancyStyle === 'dots' && <OccupancyDots pct={pct} />}
          {tweaks.occupancyStyle === 'bar' && <OccupancyBar pct={pct} />}
          <View style={{ flexDirection: 'row', gap: Space.sm, marginTop: Space.lg }}>
            <Button title="Start workout" onPress={() => router.push('/(tabs)/workout')} />
            <Button title="See machines" variant="secondary" onPress={() => router.push('/(tabs)/search')} />
          </View>
        </Card>
      </View>

      {/* Zones */}
      <View style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <SectionLabel>By Zone</SectionLabel>
        <View style={{ gap: Space.sm }}>
          {ZONES.map(z => {
            const zPct = Math.round((z.count / z.capacity) * 100);
            return (
              <Pressable key={z.id} onPress={() => router.push('/(tabs)/search')}>
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: withAlpha(t.primary, 0.15), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: t.primary, fontSize: Size.lg, fontWeight: '800' }}>{z.id}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{z.name}</Text>
                    <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{z.count}/{z.capacity} people · {zPct}%</Text>
                  </View>
                  <View style={{ width: 80, height: 6, borderRadius: 6, backgroundColor: withAlpha(t.text, 0.08), overflow: 'hidden' }}>
                    <View style={{ width: `${zPct}%`, height: '100%', backgroundColor: zPct > 80 ? t.warning : t.primary }} />
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Popular times */}
      <View style={{ paddingHorizontal: Space.lg }}>
        <SectionLabel>Popular Times · Today</SectionLabel>
        <Card>
          <PopularTimes data={HOURLY} currentHour={hour} />
          <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: Space.md, textAlign: 'center' }}>
            Typically busy between 5–7pm
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}
