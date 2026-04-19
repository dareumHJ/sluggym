// src/components/primitives.tsx — shared UI atoms
import React from 'react';
import { View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import { useTheme, Space, Radius, Size, withAlpha } from '../constants/theme';

export function Card({ children, style, padded = true }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean }) {
  const t = useTheme();
  return (
    <View style={[{ backgroundColor: t.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: t.border, padding: padded ? Space.lg : 0 }, style]}>
      {children}
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', size = 'md', style, disabled, icon }: {
  title: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>; disabled?: boolean; icon?: React.ReactNode;
}) {
  const t = useTheme();
  const pad = size === 'sm' ? { py: 8, px: 14, fs: Size.sm } : size === 'lg' ? { py: 16, px: 20, fs: Size.md } : { py: 12, px: 18, fs: Size.md };
  const bg = variant === 'primary' ? t.primary : variant === 'secondary' ? t.surface2 : variant === 'danger' ? withAlpha(t.error, 0.14) : 'transparent';
  const color = variant === 'primary' ? t.onPrimary : variant === 'danger' ? t.error : t.text;
  const borderColor = variant === 'secondary' ? t.borderLight : variant === 'ghost' ? t.border : 'transparent';
  return (
    <Pressable
      onPress={onPress} disabled={disabled}
      style={({ pressed }) => [{
        backgroundColor: bg, borderWidth: 1, borderColor, borderRadius: Radius.full,
        paddingVertical: pad.py, paddingHorizontal: pad.px,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
      }, style]}
    >
      {icon}
      <Text style={{ color, fontSize: pad.fs, fontWeight: '700', letterSpacing: 0.2 }}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={{
      paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.full,
      backgroundColor: active ? t.primary : t.surface2,
      borderWidth: 1, borderColor: active ? t.primary : t.borderLight,
    }}>
      <Text style={{ color: active ? t.onPrimary : t.text, fontSize: Size.sm, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export function AvailDot({ available, size = 8 }: { available: boolean; size?: number }) {
  const t = useTheme();
  const c = available ? t.success : t.warning;
  return <View style={{ width: size, height: size, borderRadius: size, backgroundColor: c, shadowColor: c, shadowOpacity: 0.7, shadowRadius: 6 }} />;
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[0,1,2,3,4].map(i => (
        <Text key={i} style={{ fontSize: size, color: i < Math.round(rating) ? t.primary : t.textMuted }}>★</Text>
      ))}
    </View>
  );
}

export function Divider() {
  const t = useTheme();
  return <View style={{ height: 1, backgroundColor: t.border, marginVertical: Space.lg }} />;
}

export function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.md }}>
      <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>{children}</Text>
      {action}
    </View>
  );
}

export function StatTile({ value, label, accent }: { value: string | number; label: string; accent?: boolean }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.surface2, borderRadius: Radius.lg, padding: Space.md, borderWidth: 1, borderColor: t.border }}>
      <Text style={{ color: accent ? t.primary : t.text, fontSize: Size['2xl'], fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

export function ScreenHeader({ title, right, left }: { title: string; right?: React.ReactNode; left?: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Space.lg, paddingVertical: Space.md }}>
      <View style={{ width: 40 }}>{left}</View>
      <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '700' }}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
