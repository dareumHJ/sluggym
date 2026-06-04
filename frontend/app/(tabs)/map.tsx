// app/(tabs)/map.tsx — dedicated equipment availability map tab
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AnimatedSection } from '../../src/components/AnimatedSection';
import { EquipmentAvailabilityMap } from '../../src/components/EquipmentAvailabilityMap';
import { Space, Size, useTheme } from '../../src/constants/theme';

export default function EquipmentMapScreen() {
  const t = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg }}
      contentContainerStyle={{ padding: Space.lg, paddingTop: Space['4xl'], paddingBottom: 120 }}
    >
      <View style={{ marginBottom: Space.lg }}>
        <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.xs }}>
          Equipment Map
        </Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
          Check mapped machines by floor and see live availability without leaving the main tabs.
        </Text>
      </View>

      <AnimatedSection delay={80}>
        <EquipmentAvailabilityMap />
      </AnimatedSection>
    </ScrollView>
  );
}
