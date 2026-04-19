// app/(tabs)/workout.tsx — Hevy-style logger with rest timer
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme, Space, Radius, Size, withAlpha } from '../../src/constants/theme';
import { Card, Button, StatTile } from '../../src/components/primitives';
import { ACTIVE_WORKOUT } from '../../src/data/mock';
import type { Exercise, ExerciseSet } from '../../src/types';

function fmt(sec: number) { const m = Math.floor(sec/60), s = sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }

export default function WorkoutScreen() {
  const t = useTheme();
  const [exercises, setExercises] = useState<Exercise[]>(() => ACTIVE_WORKOUT.exercises.map(e => ({ ...e, sets: e.sets.map(s => ({ ...s })) })));
  const [startedAt] = useState(ACTIVE_WORKOUT.startedAt);
  const [now, setNow] = useState(Date.now());
  const [restSec, setRestSec] = useState(0);
  const [restActive, setRestActive] = useState(false);

  // workout timer
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // rest timer
  useEffect(() => {
    if (!restActive) return;
    const id = setInterval(() => {
      setRestSec(s => {
        if (s <= 1) { setRestActive(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restActive]);

  const elapsed = Math.floor((now - startedAt) / 1000);

  const totals = useMemo(() => {
    let sets = 0, volume = 0;
    for (const ex of exercises) for (const s of ex.sets) if (s.completed && s.kg && s.reps) { sets++; volume += s.kg * s.reps; }
    return { sets, volume };
  }, [exercises]);

  const updateSet = (exIdx: number, sIdx: number, patch: Partial<ExerciseSet>) => {
    setExercises(prev => prev.map((e, i) => i === exIdx ? { ...e, sets: e.sets.map((s, j) => j === sIdx ? { ...s, ...patch } : s) } : e));
  };
  const toggleComplete = (exIdx: number, sIdx: number) => {
    const s = exercises[exIdx].sets[sIdx];
    updateSet(exIdx, sIdx, { completed: !s.completed });
    if (!s.completed) { setRestSec(90); setRestActive(true); }
  };
  const addSet = (exIdx: number) => {
    setExercises(prev => prev.map((e, i) => {
      if (i !== exIdx) return e;
      const last = e.sets[e.sets.length - 1];
      return { ...e, sets: [...e.sets, { previous: last?.previous ?? '—', kg: last?.kg ?? null, reps: null, completed: false }] };
    }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Space.lg, paddingTop: Space.lg, paddingBottom: Space.sm }}>
        <View>
          <Text style={{ color: t.textSecondary, fontSize: Size.xs, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>In Progress</Text>
          <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800' }}>{ACTIVE_WORKOUT.name}</Text>
        </View>
        <Pressable onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.full, backgroundColor: withAlpha(t.error, 0.14) }}>
          <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '700' }}>Finish</Text>
        </Pressable>
      </View>

      {/* Rest timer banner */}
      {restActive && (
        <View style={{ marginHorizontal: Space.lg, marginBottom: Space.sm, padding: Space.md, borderRadius: Radius.lg, backgroundColor: t.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: t.onPrimary, fontSize: Size.md, fontWeight: '800' }}>⏱ Rest · {fmt(restSec)}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Pressable onPress={() => setRestSec(s => s + 15)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: withAlpha(t.onPrimary, 0.15) }}>
              <Text style={{ color: t.onPrimary, fontWeight: '800', fontSize: Size.xs }}>+15</Text>
            </Pressable>
            <Pressable onPress={() => { setRestActive(false); setRestSec(0); }} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: withAlpha(t.onPrimary, 0.15) }}>
              <Text style={{ color: t.onPrimary, fontWeight: '800', fontSize: Size.xs }}>Skip</Text>
            </Pressable>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingHorizontal: Space.lg, paddingBottom: 140 }}>
        {/* Top stats */}
        <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg }}>
          <StatTile value={fmt(elapsed)} label="Duration" accent />
          <StatTile value={totals.volume.toLocaleString()} label="Volume (kg)" />
          <StatTile value={totals.sets} label="Sets" />
        </View>

        {/* Exercises */}
        {exercises.map((ex, exIdx) => (
          <Card key={ex.id} style={{ marginBottom: Space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.sm }}>
              <Pressable onPress={() => router.push(`/equipment/${ex.equipmentId}`)}>
                <Text style={{ color: t.primary, fontSize: Size.md, fontWeight: '800' }}>{ex.name}</Text>
              </Pressable>
              <Pressable><Text style={{ color: t.textMuted, fontSize: Size.lg }}>⋯</Text></Pressable>
            </View>
            {/* Column headers */}
            <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
              <Text style={[colHdr(t), { width: 32 }]}>SET</Text>
              <Text style={[colHdr(t), { flex: 1.4 }]}>PREVIOUS</Text>
              <Text style={[colHdr(t), { flex: 1, textAlign: 'center' }]}>KG</Text>
              <Text style={[colHdr(t), { flex: 1, textAlign: 'center' }]}>REPS</Text>
              <View style={{ width: 36 }} />
            </View>
            {ex.sets.map((s, sIdx) => (
              <View key={sIdx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, backgroundColor: s.completed ? withAlpha(t.primary, 0.08) : 'transparent', borderRadius: Radius.sm, paddingHorizontal: 4 }}>
                <Text style={{ width: 32, color: t.text, fontSize: Size.md, fontWeight: '700' }}>{sIdx + 1}</Text>
                <Text style={{ flex: 1.4, color: t.textMuted, fontSize: Size.xs }}>{s.previous}</Text>
                <TextInput value={s.kg?.toString() ?? ''} onChangeText={v => updateSet(exIdx, sIdx, { kg: v ? Number(v) : null })}
                  keyboardType="numeric" placeholder="—" placeholderTextColor={t.textMuted}
                  style={{ flex: 1, color: t.text, fontSize: Size.md, fontWeight: '600', textAlign: 'center', backgroundColor: t.surface2, marginHorizontal: 4, paddingVertical: 6, borderRadius: 6 }} />
                <TextInput value={s.reps?.toString() ?? ''} onChangeText={v => updateSet(exIdx, sIdx, { reps: v ? Number(v) : null })}
                  keyboardType="numeric" placeholder="—" placeholderTextColor={t.textMuted}
                  style={{ flex: 1, color: t.text, fontSize: Size.md, fontWeight: '600', textAlign: 'center', backgroundColor: t.surface2, marginHorizontal: 4, paddingVertical: 6, borderRadius: 6 }} />
                <Pressable onPress={() => toggleComplete(exIdx, sIdx)}
                  style={{ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
                           backgroundColor: s.completed ? t.primary : t.surface2, borderWidth: 1, borderColor: s.completed ? t.primary : t.borderLight }}>
                  <Text style={{ color: s.completed ? t.onPrimary : t.textMuted, fontWeight: '800' }}>✓</Text>
                </Pressable>
              </View>
            ))}
            <Pressable onPress={() => addSet(exIdx)} style={{ marginTop: Space.sm, paddingVertical: 10, borderRadius: Radius.md, backgroundColor: t.surface2, alignItems: 'center' }}>
              <Text style={{ color: t.text, fontWeight: '700', fontSize: Size.sm }}>+ Add set</Text>
            </Pressable>
          </Card>
        ))}

        <Button title="+ Add exercise" variant="secondary" size="lg" onPress={() => router.push('/(tabs)/search')} />
      </ScrollView>
    </View>
  );
}

const colHdr = (t: any) => ({ color: t.textMuted, fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.2 });
