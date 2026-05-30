// app/routines.tsx — routine create/edit screen (push from workout tab)
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme, Space, Radius, Size, withAlpha } from '../src/constants/theme';
import { Button, Card } from '../src/components/primitives';
import { useRoutines } from '../src/hooks/useRoutines';

export default function RoutineEditorScreen() {
  const t = useTheme();
  const { id: editingIdParam } = useLocalSearchParams<{ id?: string }>();
  const editingId = typeof editingIdParam === 'string' && editingIdParam.length > 0 ? editingIdParam : null;

  const { routines, loading, error, createRoutine, updateRoutine, deleteRoutine } = useRoutines();
  const editingRoutine = editingId ? routines.find((routine) => routine.id === editingId) ?? null : null;

  const [routineName, setRoutineName] = useState('');
  const [routineGoal, setRoutineGoal] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate form once when editing target arrives
  useEffect(() => {
    if (hasHydrated) return;
    if (editingId === null) {
      setRoutineName('');
      setRoutineGoal('');
      setHasHydrated(true);
      return;
    }
    if (editingRoutine) {
      setRoutineName(editingRoutine.name);
      setRoutineGoal(editingRoutine.goal ?? '');
      setHasHydrated(true);
    }
  }, [editingId, editingRoutine, hasHydrated]);

  const handleSave = async () => {
    if (routineName.trim().length === 0) {
      setMessage('Add a routine name before saving.');
      return;
    }

    setSaving(true);
    setMessage(null);

    if (editingId) {
      const updated = await updateRoutine(editingId, {
        name: routineName,
        goal: routineGoal,
      });
      setSaving(false);
      if (updated) {
        router.back();
      } else {
        setMessage(error ?? 'Failed to update routine. Please try again.');
      }
      return;
    }

    const created = await createRoutine({ name: routineName, goal: routineGoal });
    setSaving(false);

    if (created) {
      router.back();
    } else {
      setMessage(error ?? 'Failed to create routine. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;

    setSaving(true);
    const ok = await deleteRoutine(editingId);
    setSaving(false);

    if (ok) {
      router.back();
    } else {
      setMessage(error ?? 'Failed to delete routine. Please try again.');
    }
  };

  const isLoadingForEdit = loading && editingId !== null && !editingRoutine && !hasHydrated;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: Space.lg,
          paddingTop: Space.lg,
          paddingBottom: Space.sm,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.surface2,
          }}
        >
          <Text style={{ color: t.text, fontSize: Size.lg }}>‹</Text>
        </Pressable>
        <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>
          {editingId ? 'Edit routine' : 'New routine'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: Space.lg, paddingBottom: 120, gap: Space.md }}>
        {isLoadingForEdit ? (
          <Card style={{ alignItems: 'center', gap: Space.sm }}>
            <ActivityIndicator color={t.primary} />
            <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading routine…</Text>
          </Card>
        ) : (
          <Card style={{ gap: Space.md }}>
            <Text
              style={{
                color: t.textSecondary,
                fontSize: Size.xs,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontWeight: '800',
              }}
            >
              Routine
            </Text>
            <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '900' }}>
              {editingId ? 'Update routine details' : 'Name your new routine'}
            </Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
              Exercises, sets, and reps are recorded when you start a workout from this routine.
              The most recent completed workout becomes the routine's current contents.
            </Text>

            <TextInput
              value={routineName}
              onChangeText={setRoutineName}
              placeholder="Routine name (e.g. Push day)"
              placeholderTextColor={t.textMuted}
              style={{
                color: t.text,
                backgroundColor: t.surface2,
                borderRadius: Radius.lg,
                paddingHorizontal: Space.lg,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: t.borderLight,
                fontWeight: '700',
              }}
            />
            <TextInput
              value={routineGoal}
              onChangeText={setRoutineGoal}
              placeholder="Goal (optional, e.g. Strength, Hypertrophy)"
              placeholderTextColor={t.textMuted}
              style={{
                color: t.text,
                backgroundColor: t.surface2,
                borderRadius: Radius.lg,
                paddingHorizontal: Space.lg,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: t.borderLight,
              }}
            />
          </Card>
        )}

        {message ? (
          <Card>
            <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '700' }}>{message}</Text>
          </Card>
        ) : null}

        {error && !message ? (
          <Card style={{ gap: Space.sm }}>
            <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '800' }}>
              Something went wrong
            </Text>
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>{error}</Text>
          </Card>
        ) : null}

        <View style={{ flexDirection: 'row', gap: Space.sm }}>
          <View style={{ flex: 1 }}>
            <Button
              title={saving ? 'Saving…' : editingId ? 'Update routine' : 'Save routine'}
              onPress={handleSave}
              disabled={saving || isLoadingForEdit}
            />
          </View>
          {editingId ? (
            <Pressable
              onPress={handleDelete}
              disabled={saving || isLoadingForEdit}
              style={{
                paddingHorizontal: Space.lg,
                paddingVertical: Space.md,
                borderRadius: Radius.lg,
                backgroundColor: withAlpha(t.error, 0.14),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: t.error, fontSize: Size.sm, fontWeight: '900' }}>Delete</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
