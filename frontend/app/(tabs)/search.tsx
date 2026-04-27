// app/(tabs)/search.tsx — live equipment + exercise catalog search/filter
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useTheme, Space, Radius, Size, withAlpha } from '../../src/constants/theme';
import { Button, Card } from '../../src/components/primitives';
import { useEquipment } from '../../src/hooks/useEquipment';
import { useExerciseCatalog } from '../../src/hooks/useExerciseCatalog';

type SearchMode = 'equipment' | 'exercises';

type FilterChipsProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function pretty(value: string) {
  if (value === 'All') return 'All';
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(' ');
}

export default function SearchScreen() {
  const t = useTheme();
  const [mode, setMode] = useState<SearchMode>('equipment');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [exerciseEquipment, setExerciseEquipment] = useState('All');
  const [exerciseMuscle, setExerciseMuscle] = useState('All');
  const [exerciseLevel, setExerciseLevel] = useState('All');
  const { equipment, filteredEquipment, categories, error, loading, refresh } = useEquipment(q, category);
  const {
    exercises,
    filteredExercises,
    equipmentOptions,
    muscleOptions,
    levelOptions,
    error: exerciseError,
    loading: exerciseLoading,
    refresh: refreshExercises,
  } = useExerciseCatalog(q, {
    equipment: exerciseEquipment,
    muscle: exerciseMuscle,
    level: exerciseLevel,
  });

  const hasEquipmentFilters = q.trim() !== '' || category !== 'All';
  const hasExerciseFilters = q.trim() !== '' || exerciseEquipment !== 'All' || exerciseMuscle !== 'All' || exerciseLevel !== 'All';

  const clearEquipmentFilters = () => {
    setQ('');
    setCategory('All');
  };

  const clearExerciseFilters = () => {
    setQ('');
    setExerciseEquipment('All');
    setExerciseMuscle('All');
    setExerciseLevel('All');
  };

  const chipStyle = (active: boolean) => ({
    minHeight: 38,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: active ? t.primary : t.surface2,
    borderWidth: 1,
    borderColor: active ? t.primary : t.borderLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexShrink: 0,
  });

  const chipTextStyle = (active: boolean) => ({
    color: active ? t.onPrimary : t.text,
    fontSize: Size.sm,
    fontWeight: '700' as const,
    lineHeight: 16,
    includeFontPadding: false,
  });

  const renderStateCard = ({
    title,
    body,
    actionTitle,
    onAction,
    tone = 'neutral',
    loading: showSpinner = false,
  }: {
    title: string;
    body?: string;
    actionTitle?: string;
    onAction?: () => void;
    tone?: 'neutral' | 'error';
    loading?: boolean;
  }) => (
    <Card style={{ marginTop: Space.lg, alignItems: 'center', gap: Space.sm }}>
      {showSpinner ? <ActivityIndicator color={t.primary} /> : null}
      <Text style={{ color: tone === 'error' ? t.error : t.text, fontSize: Size.md, fontWeight: '800', textAlign: 'center' }}>{title}</Text>
      {body ? (
        <Text style={{ color: t.textMuted, fontSize: Size.xs, lineHeight: 18, textAlign: 'center' }}>{body}</Text>
      ) : null}
      {actionTitle && onAction ? <Button title={actionTitle} variant="secondary" onPress={onAction} /> : null}
    </Card>
  );

  const renderWarningBanner = (message: string, onRetry: () => void) => (
    <Card style={{ borderColor: withAlpha(t.warning, 0.35), backgroundColor: withAlpha(t.warning, 0.08), gap: Space.xs }}>
      <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '800' }}>Using the last loaded data</Text>
      <Text style={{ color: t.textSecondary, fontSize: Size.xs, lineHeight: 18 }}>{message}</Text>
      <Button title="Retry" variant="secondary" onPress={onRetry} />
    </Card>
  );

  const renderFilterChips = ({ label, options, value, onChange }: FilterChipsProps) => (
    <View>
      <Text style={{ color: t.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase', paddingHorizontal: Space.lg, marginTop: Space.sm }}>
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ minHeight: 56, maxHeight: 56 }}
        contentContainerStyle={{ paddingHorizontal: Space.lg, gap: 8, paddingVertical: Space.sm, alignItems: 'center' }}
      >
        {options.map((option) => {
          const active = value === option;
          return (
            <Pressable key={option} onPress={() => onChange(option)} style={chipStyle(active)}>
              <Text numberOfLines={1} style={chipTextStyle(active)}>{option === 'All' ? `All ${label.toLowerCase()}` : pretty(option)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderEquipmentBody = () => {
    if (loading && equipment.length === 0) {
      return renderStateCard({
        title: 'Loading live equipment…',
        body: 'Fetching availability from Supabase.',
        loading: true,
      });
    }

    if (error && equipment.length === 0) {
      return renderStateCard({
        title: 'Could not load equipment',
        body: `${error}\nThe catalog uses the live Supabase dataset.`,
        actionTitle: 'Retry',
        onAction: () => void refresh(),
        tone: 'error',
      });
    }

    if (equipment.length === 0) {
      return renderStateCard({
        title: 'No live equipment rows are available yet.',
        body: 'Search is wired to the live catalog, but the configured dataset is currently empty.',
        actionTitle: 'Reload',
        onAction: () => void refresh(),
      });
    }

    if (filteredEquipment.length === 0) {
      return renderStateCard({
        title: 'No live machines match those filters.',
        body: hasEquipmentFilters ? 'Clear the search or category filter to see all available equipment again.' : undefined,
        actionTitle: hasEquipmentFilters ? 'Clear filters' : undefined,
        onAction: hasEquipmentFilters ? clearEquipmentFilters : undefined,
      });
    }

    return (
      <>
        {error ? renderWarningBanner(error, () => void refresh()) : null}
        {loading ? <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>Refreshing live equipment…</Text> : null}
        {filteredEquipment.map((item) => (
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
                <Text style={{ color: t.textMuted, fontSize: 10 }}>available</Text>
              </View>
            </View>
            {item.description ? (
              <Text style={{ color: t.textMuted, fontSize: 10, lineHeight: 16 }}>{item.description}</Text>
            ) : null}
          </Card>
        ))}
      </>
    );
  };

  const renderExerciseBody = () => {
    if (exerciseLoading && exercises.length === 0) {
      return renderStateCard({
        title: 'Loading exercise catalog…',
        body: 'Fetching exercises, muscle groups, and equipment tags from Supabase.',
        loading: true,
      });
    }

    if (exerciseError && exercises.length === 0) {
      return renderStateCard({
        title: 'Could not load exercises',
        body: `${exerciseError}\nExercise search uses the Supabase exercises table.`,
        actionTitle: 'Retry',
        onAction: () => void refreshExercises(),
        tone: 'error',
      });
    }

    if (exercises.length === 0) {
      return renderStateCard({
        title: 'No exercises found.',
        body: 'The exercise catalog table returned no rows.',
        actionTitle: 'Reload',
        onAction: () => void refreshExercises(),
      });
    }

    if (filteredExercises.length === 0) {
      return renderStateCard({
        title: 'No exercises match those filters.',
        body: hasExerciseFilters ? 'Clear the search, equipment, muscle, or level filters to broaden the catalog.' : undefined,
        actionTitle: hasExerciseFilters ? 'Clear filters' : undefined,
        onAction: hasExerciseFilters ? clearExerciseFilters : undefined,
      });
    }

    return (
      <>
        {exerciseError ? renderWarningBanner(exerciseError, () => void refreshExercises()) : null}
        {exerciseLoading ? <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>Refreshing exercises…</Text> : null}
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} style={{ gap: Space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{exercise.name}</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 3 }}>
                  {[pretty(exercise.equipmentRequired ?? 'No equipment'), pretty(exercise.level ?? 'Any level'), pretty(exercise.category ?? 'Exercise')].join(' · ')}
                </Text>
              </View>
              {exercise.targetMuscle ? (
                <View style={{ backgroundColor: withAlpha(t.primary, 0.15), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>{pretty(exercise.targetMuscle)}</Text>
                </View>
              ) : null}
            </View>
            {exercise.primaryMuscles.length > 0 ? (
              <Text style={{ color: t.textMuted, fontSize: 10, lineHeight: 16 }}>
                Primary: {exercise.primaryMuscles.map(pretty).join(', ')}
              </Text>
            ) : null}
            {exercise.secondaryMuscles.length > 0 ? (
              <Text style={{ color: t.textMuted, fontSize: 10, lineHeight: 16 }}>
                Secondary: {exercise.secondaryMuscles.slice(0, 4).map(pretty).join(', ')}
              </Text>
            ) : null}
          </Card>
        ))}
      </>
    );
  };

  return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingHorizontal: Space.lg, paddingTop: Space['4xl'], paddingBottom: Space.sm }}>
        <Text style={{ color: t.text, fontSize: Size['2xl'], fontWeight: '800', marginBottom: Space.md }}>
          {mode === 'equipment' ? 'Search Equipment' : 'Find Exercises'}
        </Text>
        <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.md }}>
          {(['equipment', 'exercises'] as SearchMode[]).map((value) => {
            const active = mode === value;
            return (
              <Pressable key={value} onPress={() => setMode(value)} style={{ flex: 1, paddingVertical: 10, borderRadius: Radius.full, alignItems: 'center', backgroundColor: active ? t.primary : t.surface2, borderWidth: 1, borderColor: active ? t.primary : t.borderLight }}>
                <Text style={{ color: active ? t.onPrimary : t.text, fontSize: Size.sm, fontWeight: '800' }}>
                  {value === 'equipment' ? 'Equipment' : 'Exercises'}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
            placeholder={mode === 'equipment' ? 'Bench, rower, cardio…' : 'Squat, abs, barbell…'}
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

      {mode === 'equipment' ? (
        renderFilterChips({ label: 'Categories', options: categories, value: category, onChange: setCategory })
      ) : (
        <>
          {renderFilterChips({ label: 'Equipment', options: equipmentOptions, value: exerciseEquipment, onChange: setExerciseEquipment })}
          {renderFilterChips({ label: 'Muscles', options: muscleOptions, value: exerciseMuscle, onChange: setExerciseMuscle })}
          {renderFilterChips({ label: 'Levels', options: levelOptions, value: exerciseLevel, onChange: setExerciseLevel })}
        </>
      )}

      <Text style={{ color: t.textSecondary, fontSize: Size.xs, paddingHorizontal: Space.lg, marginTop: 4, marginBottom: Space.sm }}>
        {mode === 'equipment'
          ? `${filteredEquipment.length} visible · ${equipment.length} live rows`
          : `${filteredExercises.length} visible · ${exercises.length} exercises`}
      </Text>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: Space.lg, paddingBottom: 120, gap: Space.sm, flexGrow: 1 }}>
        {mode === 'equipment' ? renderEquipmentBody() : renderExerciseBody()}
      </ScrollView>
      </View>
  );
}
