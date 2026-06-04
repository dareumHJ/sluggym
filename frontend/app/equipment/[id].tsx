// app/equipment/[id].tsx — equipment detail with muscle diagram + steps
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme, Space, Radius, Size, withAlpha } from '../../src/constants/theme';
import { Card, Chip, Stars, AvailDot, Button, SectionLabel } from '../../src/components/primitives';
import { MuscleDiagram } from '../../src/components/MuscleDiagram';
import { EQUIPMENT, EXERCISES } from '../../src/data/mock';

export default function EquipmentDetail() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const eq = EQUIPMENT.find(e => e.id === id);
  const manual = eq ? EXERCISES[eq.id] ?? EXERCISES['bench-1'] : EXERCISES['bench-1'];
  if (!eq) return <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: t.text }}>Not found</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Space.lg, paddingTop: 12, paddingBottom: Space.sm }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface2 }}>
          <Text style={{ color: t.text, fontSize: Size.lg }}>‹</Text>
        </Pressable>
        <Pressable style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: t.surface2 }}>
          <Text style={{ color: t.text, fontSize: Size.md }}>☆</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Space.lg, paddingBottom: 140 }}>
        {/* Title */}
        <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>{eq.category} · Zone {eq.zone}</Text>
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>{manual.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md, marginTop: Space.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <AvailDot available={eq.available} />
            <Text style={{ color: eq.available ? t.success : t.warning, fontSize: Size.sm, fontWeight: '700' }}>
              {eq.available ? 'Available now' : `~${eq.waitMin} min wait`}
            </Text>
          </View>
          <Text style={{ color: t.textMuted }}>·</Text>
          <Stars rating={manual.rating} />
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>{manual.rating.toFixed(1)} ({manual.ratingCount})</Text>
        </View>

        {/* Demo placeholder + muscles */}
        <Card style={{ marginTop: Space.lg, flexDirection: 'row', gap: Space.lg, alignItems: 'center' }}>
          <View style={{ flex: 1, aspectRatio: 1, backgroundColor: t.surface3, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: t.textMuted, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>Animated Demo</Text>
            <Text style={{ color: t.textMuted, fontSize: 10, marginTop: 4 }}>▶ tap to play</Text>
          </View>
          <MuscleDiagram primary={manual.primary} secondary={manual.secondary} size={90} />
        </Card>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: Space.sm, marginTop: Space.md }}>
          <View style={{ flex: 1, backgroundColor: t.surface2, borderRadius: Radius.lg, padding: Space.md, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ color: t.textSecondary, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700' }}>Level</Text>
            <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700', marginTop: 2 }}>{manual.difficulty}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: t.surface2, borderRadius: Radius.lg, padding: Space.md, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ color: t.textSecondary, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700' }}>Volume</Text>
            <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700', marginTop: 2 }}>{manual.duration}</Text>
          </View>
        </View>

        {/* Muscles */}
        <SectionLabel><Text> </Text></SectionLabel>
        <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: Space.xl, marginBottom: Space.sm }}>Muscles</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {manual.primary.map(m => <Chip key={m} label={`● ${m}`} active />)}
          {manual.secondary.map(m => <Chip key={m} label={m} />)}
        </View>

        {/* Steps */}
        <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: Space.xl, marginBottom: Space.sm }}>How to</Text>
        <View style={{ gap: Space.sm }}>
          {manual.steps.map((s, i) => (
            <Card key={i} style={{ flexDirection: 'row', gap: Space.md }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: withAlpha(t.primary, 0.18), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: t.primary, fontWeight: '800' }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, color: t.text, fontSize: Size.sm, lineHeight: 20 }}>{s}</Text>
            </Card>
          ))}
        </View>

        {/* Tips */}
        <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: Space.xl, marginBottom: Space.sm }}>Tips</Text>
        <Card>
          {manual.tips.map((tip, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: Space.sm, marginBottom: i === manual.tips.length - 1 ? 0 : Space.sm }}>
              <Text style={{ color: t.primary, fontSize: Size.md, marginTop: -2 }}>•</Text>
              <Text style={{ flex: 1, color: t.text, fontSize: Size.sm, lineHeight: 20 }}>{tip}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: Space.lg, paddingBottom: 28, backgroundColor: withAlpha(t.bg, 0.95), borderTopWidth: 1, borderTopColor: t.border }}>
        <Button title="Add to workout" onPress={() => router.push('/(tabs)/workout')} size="lg" />
      </View>
    </View>
  );
}
