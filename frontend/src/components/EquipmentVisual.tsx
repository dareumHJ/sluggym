import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  Activity,
  Bike,
  BicepsFlexed,
  Cable,
  CircleDot,
  Dumbbell,
  Footprints,
  Gauge,
  Target,
  Weight,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { Radius, Size, Space, type Theme, withAlpha } from '../constants/theme';

type EquipmentVisualKind = {
  Icon: LucideIcon;
  label: string;
  accent: string;
};

type EquipmentVisualProps = {
  name?: string | null;
  category?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const EQUIPMENT_VISUALS: { keywords: string[]; visual: EquipmentVisualKind }[] = [
  { keywords: ['treadmill', 'runner', 'running', 'walk', 'cardio'], visual: { Icon: Footprints, label: 'Treadmill', accent: '#66E0FF' } },
  { keywords: ['bike', 'bicycle', 'cycle', 'cycling', 'spin'], visual: { Icon: Bike, label: 'Bike', accent: '#7CE38B' } },
  { keywords: ['dumbbell', 'free weight', 'freeweight', 'db'], visual: { Icon: Dumbbell, label: 'Dumbbell', accent: '#B4A0FF' } },
  { keywords: ['barbell', 'bench', 'press', 'rack', 'squat', 'smith'], visual: { Icon: Weight, label: 'Strength', accent: '#E8FF54' } },
  { keywords: ['cable', 'pulley', 'lat', 'row', 'machine'], visual: { Icon: Cable, label: 'Cable', accent: '#FF9F66' } },
  { keywords: ['elliptical', 'stair', 'stepper', 'climber'], visual: { Icon: Activity, label: 'Cardio', accent: '#FF7A59' } },
  { keywords: ['leg', 'extension', 'curl', 'calf'], visual: { Icon: BicepsFlexed, label: 'Legs', accent: '#FF5FA2' } },
  { keywords: ['core', 'ab', 'abs', 'crunch'], visual: { Icon: Target, label: 'Core', accent: '#C6FF3D' } },
  { keywords: ['rower', 'rowing'], visual: { Icon: Gauge, label: 'Rower', accent: '#66E0FF' } },
];

function normalize(value?: string | null) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() ?? '';
}

export function getEquipmentVisual(name?: string | null, category?: string | null): EquipmentVisualKind {
  const haystack = `${normalize(name)} ${normalize(category)}`;

  for (const { keywords, visual } of EQUIPMENT_VISUALS) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return visual;
    }
  }

  return { Icon: CircleDot, label: 'Equipment', accent: '#A8B0BD' };
}

export function EquipmentVisual({ name, category, size = 'md', showLabel = false, color, style }: EquipmentVisualProps) {
  const visual = getEquipmentVisual(name, category);
  const iconSize = size === 'lg' ? 34 : size === 'sm' ? 20 : 26;
  const boxSize = size === 'lg' ? 58 : size === 'sm' ? 34 : 46;
  const accent = color ?? visual.accent;

  return (
    <View style={[{ alignItems: 'center', gap: Space.xs }, style]}>
      <View
        accessibilityLabel={`${visual.label} equipment icon`}
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: Radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: withAlpha(accent, 0.16),
          borderWidth: 1,
          borderColor: withAlpha(accent, 0.34),
        }}
      >
        <visual.Icon color={accent} size={iconSize} strokeWidth={2.4} />
      </View>
      {showLabel ? <Text style={{ color: accent, fontSize: Size.xs, fontWeight: '800' }}>{visual.label}</Text> : null}
    </View>
  );
}

export function EquipmentIconLegend({ theme }: { theme: Theme }) {
  const uniqueVisuals = EQUIPMENT_VISUALS.filter((entry, index, list) => list.findIndex((other) => other.visual.label === entry.visual.label) === index);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm }}>
      {uniqueVisuals.slice(0, 6).map(({ visual }) => (
        <View key={visual.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: theme.surface2, borderWidth: 1, borderColor: theme.border }}>
          <visual.Icon color={visual.accent} size={14} strokeWidth={2.4} />
          <Text style={{ color: theme.textSecondary, fontSize: Size.xs, fontWeight: '800' }}>{visual.label}</Text>
        </View>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: theme.surface2, borderWidth: 1, borderColor: theme.border }}>
        <Zap color={theme.primary} size={14} strokeWidth={2.4} />
        <Text style={{ color: theme.textSecondary, fontSize: Size.xs, fontWeight: '800' }}>Live status</Text>
      </View>
    </View>
  );
}
