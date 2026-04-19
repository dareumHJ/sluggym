// app/(tabs)/index.tsx — Home screen
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Size } from '../../src/constants/theme';
import { Button, Card } from '../../src/components/primitives';
import { useAuth } from '../../src/contexts/AuthContext';
import { useLiveOccupancy } from '../../src/hooks/useLiveOccupancy';

function formatTimestamp(timestamp?: string | null) {
  if (!timestamp) return 'Waiting for a live update';

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Waiting for a live update';

  return `Updated ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

export default function HomeScreen() {
  const t = useTheme();
  const { user } = useAuth();
  const { data, error, loading, refreshing, reload } = useLiveOccupancy();
  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Athlete';
  const firstName = displayName.split(' ')[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ paddingHorizontal: Space.lg, paddingTop: Space['2xl'], paddingBottom: Space.md }}>
        <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Good morning,</Text>
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>{firstName}</Text>
      </View>

      <View style={{ paddingHorizontal: Space.lg, marginBottom: Space.lg }}>
        <Card style={{ alignItems: 'center', paddingVertical: Space['2xl'] }}>
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
              Live headcount · {data?.location ?? 'East Field House'}
            </Text>
          </View>

          {loading && !data ? (
            <View style={{ alignItems: 'center', gap: Space.md }}>
              <ActivityIndicator color={t.primary} />
              <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading live headcount…</Text>
            </View>
          ) : data ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: t.text, fontSize: Size['5xl'], fontWeight: '800', letterSpacing: -1 }}>
                {data.count}
              </Text>
              <Text
                style={{
                  color: t.textSecondary,
                  fontSize: Size.xs,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  marginTop: -4,
                }}
              >
                people here now
              </Text>
              <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: 8 }}>
                {formatTimestamp(data.timestamp)} · refreshes every minute
              </Text>
              {refreshing ? (
                <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: 8 }}>Refreshing…</Text>
              ) : null}
              {error ? (
                <Text style={{ color: t.warning, fontSize: Size.xs, marginTop: 8, textAlign: 'center' }}>
                  {error}
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={{ alignItems: 'center', gap: Space.sm }}>
              <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '700', textAlign: 'center' }}>
                {error ?? 'Live headcount is currently unavailable.'}
              </Text>
              <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>
                Configure the backend URL, then pull to retry from this screen.
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: Space.sm, marginTop: Space.lg }}>
            <Button title="Refresh" variant="secondary" onPress={() => void reload()} />
            <Button title="See machines" onPress={() => router.push('/(tabs)/search')} />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
