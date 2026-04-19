// app/(tabs)/search.tsx — machine list with filters
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Radius, Size } from '../../src/constants/theme';
import { Card, Chip, AvailDot, Stars } from '../../src/components/primitives';
import { EQUIPMENT } from '../../src/data/mock';

const CATS = ['All', 'Free Weights', 'Cables', 'Machines', 'Cardio'];

export default function SearchScreen() {
  const t = useTheme();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [availOnly, setAvailOnly] = useState(false);

  const filtered = useMemo(() => EQUIPMENT.filter(e => {
    if (cat !== 'All' && e.category !== cat) return false;
    if (availOnly && !e.available) return false;
    if (q && !e.name.toLowerCase().includes(q.toLowerCase()) && !e.muscles.join(' ').toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, cat, availOnly]);

  const availCount = filtered.filter(e => e.available).length;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingHorizontal: Space.lg, paddingTop: Space.lg, paddingBottom: Space.sm }}>
        <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.md }}>Find equipment</Text>
        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.surface2, borderRadius: Radius.full, paddingHorizontal: Space.lg, borderWidth: 1, borderColor: t.borderLight }}>
          <Text style={{ color: t.textMuted, fontSize: Size.md, marginRight: 8 }}>⌕</Text>
          <TextInput value={q} onChangeText={setQ} placeholder="Bench, lat pull, squat…" placeholderTextColor={t.textMuted}
            style={{ flex: 1, color: t.text, paddingVertical: 12, fontSize: Size.md }} />
          {q !== '' && <Pressable onPress={() => setQ('')}><Text style={{ color: t.textMuted, fontSize: Size.lg }}>✕</Text></Pressable>}
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Space.lg, gap: 8, paddingVertical: Space.sm }}>
        <Chip label={availOnly ? '● Available only' : '○ Available only'} active={availOnly} onPress={() => setAvailOnly(v => !v)} />
        {CATS.map(c => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
      </ScrollView>

      <Text style={{ color: t.textSecondary, fontSize: Size.xs, paddingHorizontal: Space.lg, marginTop: 4, marginBottom: Space.sm }}>
        {filtered.length} items · {availCount} available now
      </Text>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Space.lg, paddingBottom: 120, gap: Space.sm }}>
        {filtered.map(e => (
          <Pressable key={e.id} onPress={() => router.push(`/equipment/${e.id}`)}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
              <View style={{ width: 48, height: 48, borderRadius: Radius.md, backgroundColor: t.surface3, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, fontWeight: '700', letterSpacing: 1 }}>{e.zone}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <AvailDot available={e.available} />
                  <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{e.name}</Text>
                </View>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 2 }}>{e.muscles.join(' · ')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Stars rating={e.rating} />
                  <Text style={{ color: t.textMuted, fontSize: 11 }}>{e.rating.toFixed(1)}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {e.available
                  ? <Text style={{ color: t.success, fontSize: Size.xs, fontWeight: '700' }}>OPEN</Text>
                  : <Text style={{ color: t.warning, fontSize: Size.xs, fontWeight: '700' }}>~{e.waitMin}m</Text>}
                <Text style={{ color: t.textMuted, fontSize: 10, marginTop: 2 }}>{e.category}</Text>
              </View>
            </Card>
          </Pressable>
        ))}
        {filtered.length === 0 && (
          <Text style={{ color: t.textMuted, textAlign: 'center', marginTop: Space['3xl'] }}>No matches. Try fewer filters.</Text>
        )}
      </ScrollView>
    </View>
  );
}
