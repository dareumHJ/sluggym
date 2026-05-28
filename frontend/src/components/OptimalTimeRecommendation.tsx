import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Radius, Size, Space, useTheme, withAlpha } from '../constants/theme';
import { Card, SectionLabel } from './primitives';

export type TimeRecommendation = {
  id: string;
  label: string;
  timeRange: string;
  congestion: 'low' | 'moderate' | 'high';
  confidence: number;
  reason: string;
};

type OptimalTimeRecommendationProps = {
  recommendations?: TimeRecommendation[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
};

export const MOCK_TIME_RECOMMENDATIONS: TimeRecommendation[] = [
  {
    id: 'morning-quiet',
    label: 'Best overall',
    timeRange: '9:00–10:30 AM',
    congestion: 'low',
    confidence: 82,
    reason: 'Usually quieter than the afternoon rush and good for full-body routines.',
  },
  {
    id: 'early-afternoon',
    label: 'Good backup',
    timeRange: '1:00–2:30 PM',
    congestion: 'moderate',
    confidence: 68,
    reason: 'Likely workable if morning is not possible; expect some equipment sharing.',
  },
];

function congestionCopy(congestion: TimeRecommendation['congestion']) {
  if (congestion === 'low') return { label: 'Low crowd', tone: 'success' as const };
  if (congestion === 'moderate') return { label: 'Moderate', tone: 'warning' as const };
  return { label: 'Busy', tone: 'error' as const };
}

export function OptimalTimeRecommendation({ recommendations = MOCK_TIME_RECOMMENDATIONS, loading = false, error = null, onRefresh }: OptimalTimeRecommendationProps) {
  const t = useTheme();
  const best = recommendations[0] ?? null;

  return (
    <View style={{ gap: Space.sm }}>
      <SectionLabel
        action={
          onRefresh ? (
            <Pressable onPress={onRefresh}>
              <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>Refresh</Text>
            </Pressable>
          ) : undefined
        }
      >
        Optimal Time Recommendation
      </SectionLabel>

      <Card style={{ gap: Space.md }}>
        {loading ? (
          <View style={{ alignItems: 'center', gap: Space.sm, paddingVertical: Space.md }}>
            <ActivityIndicator color={t.primary} />
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, fontWeight: '700' }}>Loading recommendations…</Text>
          </View>
        ) : error ? (
          <View style={{ gap: Space.sm }}>
            <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '900' }}>Recommendation unavailable</Text>
            <Text style={{ color: t.warning, fontSize: Size.sm, lineHeight: 20 }}>{error}</Text>
            {onRefresh ? (
              <Pressable onPress={onRefresh} style={{ alignSelf: 'flex-start', paddingHorizontal: Space.md, paddingVertical: Space.sm, borderRadius: Radius.full, backgroundColor: withAlpha(t.primary, 0.12) }}>
                <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '900' }}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : best ? (
          <View style={{ gap: Space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: '800' }}>
                  {best.label}
                </Text>
                <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '900', marginTop: 4 }}>{best.timeRange}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: t.primary, fontSize: Size.xl, fontWeight: '900' }}>{best.confidence}%</Text>
                <Text style={{ color: t.textMuted, fontSize: Size.xs, fontWeight: '800' }}>confidence</Text>
              </View>
            </View>

            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>{best.reason}</Text>

            <View style={{ flexDirection: 'row', gap: Space.sm }}>
              {recommendations.map((item) => {
                const copy = congestionCopy(item.congestion);
                const toneColor = copy.tone === 'success' ? t.success : copy.tone === 'warning' ? t.warning : t.error;
                const active = item.id === best.id;

                return (
                  <View
                    key={item.id}
                    style={{
                      flex: 1,
                      padding: Space.md,
                      borderRadius: Radius.lg,
                      backgroundColor: active ? withAlpha(t.primary, 0.12) : t.surface2,
                      borderWidth: 1,
                      borderColor: active ? withAlpha(t.primary, 0.38) : t.border,
                      gap: Space.xs,
                    }}
                  >
                    <Text style={{ color: active ? t.primary : t.text, fontSize: Size.sm, fontWeight: '900' }}>{item.timeRange}</Text>
                    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: withAlpha(toneColor, 0.14) }}>
                      <Text style={{ color: toneColor, fontSize: Size.xs, fontWeight: '900' }}>{copy.label}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={{ gap: Space.sm }}>
            <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '900' }}>No recommendation available yet</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
              Once scoring data is connected, this card will show the best time to visit.
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
}
