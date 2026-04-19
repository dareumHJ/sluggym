// app/(tabs)/search.tsx — live equipment list with search + basic category filter
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useTheme, Space, Radius, Size } from '../../src/constants/theme';
import { Button, Card } from '../../src/components/primitives';
import { useEquipment } from '../../src/hooks/useEquipment';

export default function SearchScreen() {
  const t = useTheme();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const { equipment, filteredEquipment, categories, error, loading, refresh } = useEquipment(q, category);

  const renderBody = () => {
    if (loading) {
      return (
        <View style={{ alignItems: 'center', marginTop: Space['4xl'], gap: Space.md }}>
          <ActivityIndicator color={t.primary} />
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading live equipment…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <Card style={{ marginTop: Space.lg, alignItems: 'center', gap: Space.sm }}>
          <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700', textAlign: 'center' }}>{error}</Text>
          <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>
            The catalog only uses the live Supabase dataset now.
          </Text>
          <Button title="Retry" variant="secondary" onPress={() => void refresh()} />
        </Card>
      );
    }

    if (equipment.length === 0) {
      return (
        <Card style={{ marginTop: Space.lg, alignItems: 'center', gap: Space.sm }}>
          <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700', textAlign: 'center' }}>
            No live equipment rows are available yet.
          </Text>
          <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>
            Search is wired to the live catalog, but the configured dataset is currently empty.
          </Text>
          <Button title="Reload" variant="secondary" onPress={() => void refresh()} />
        </Card>
      );
    }

    if (filteredEquipment.length === 0) {
      return (
        <Text style={{ color: t.textMuted, textAlign: 'center', marginTop: Space['3xl'] }}>
          No live machines match those filters.
        </Text>
      );
    }

    return filteredEquipment.map((item) => (
      <Card key={item.id} style={{ gap: Space.xs }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.md }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{item.name}</Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>
              Category: {item.category}
              {item.location ? ` · ${item.location}` : ''}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: t.primary, fontSize: Size.sm, fontWeight: '700' }}>{item.quantity}</Text>
            <Text style={{ color: t.textMuted, fontSize: 10 }}>
              {item.quantity === 1 ? 'machine' : 'machines'}
            </Text>
          </View>
        </View>
        {item.description ? (
          <Text style={{ color: t.textMuted, fontSize: 10, lineHeight: 16 }}>{item.description}</Text>
        ) : null}
        <Text style={{ color: t.textMuted, fontSize: 10, letterSpacing: 0.4 }}>
          Live detail view coming soon — list search/filter is live now.
        </Text>
      </Card>
    ));
  };

  return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingHorizontal: Space.lg, paddingTop: Space['4xl'], paddingBottom: Space.sm }}>
        <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.md }}>Search Equipment</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: t.surface2,
            borderRadius: Radius.full,
            paddingHorizontal: Space.lg,
            borderWidth: 1,
            borderColor: t.borderLight,
          }}
        >
          <Text style={{ color: t.textMuted, fontSize: Size.md, marginRight: 8 }}>⌕</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Bench, rower, cardio…"
            placeholderTextColor={t.textMuted}
            style={{ flex: 1, color: t.text, paddingVertical: 12, fontSize: Size.md }}
          />
          {q !== '' ? (
            <Text onPress={() => setQ('')} style={{ color: t.textMuted, fontSize: Size.lg }}>
              ✕
            </Text>
          ) : null}
        </View>
      </View>

      <View style={{ minHeight: 56, justifyContent: 'center' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ minHeight: 56, maxHeight: 56 }}
          contentContainerStyle={{ paddingHorizontal: Space.lg, gap: 8, paddingVertical: Space.sm, alignItems: 'center' }}
        >
        {categories.map((value) => {
          const active = category === value;
          return (
            <Pressable
              key={value}
              onPress={() => setCategory(value)}
              style={{
                minHeight: 38,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: Radius.full,
                backgroundColor: active ? t.primary : t.surface2,
                borderWidth: 1,
                borderColor: active ? t.primary : t.borderLight,
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: active ? t.onPrimary : t.text,
                  fontSize: Size.sm,
                  fontWeight: '700',
                  lineHeight: 16,
                  includeFontPadding: false,
                }}
              >
                {value === 'All' ? 'All categories' : value}
              </Text>
            </Pressable>
          );
        })}
        </ScrollView>
      </View>

      <Text style={{ color: t.textSecondary, fontSize: Size.xs, paddingHorizontal: Space.lg, marginTop: 4, marginBottom: Space.sm }}>
        {filteredEquipment.length} visible · {equipment.length} live rows
      </Text>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: Space.lg, paddingBottom: 120, gap: Space.sm, flexGrow: 1 }}>
        {renderBody()}
      </ScrollView>
      </View>
  );
}
