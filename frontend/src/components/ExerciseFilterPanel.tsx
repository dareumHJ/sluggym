// src/components/ExerciseFilterPanel.tsx
// Shared exercise search/filter UI used by both the Search tab (view mode)
// and the Workout add-exercise modal (add mode).
//
// Modes:
//   - 'view': result rows are not selectable (Search tab)
//   - 'add' : result rows are selectable; user must pick equipment when
//             multiple options exist, or accepts "No equipment needed" when
//             the exercise has no mapping.

import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Radius, Size, Space, useTheme, withAlpha } from '../constants/theme';
import { Card } from './primitives';
import type {
  ExerciseCatalogItem,
  ExerciseEquipmentOption,
} from '../hooks/useExerciseCatalog';
import { getExerciseImageFrameUrls } from '../lib/exerciseImages';

export type ExerciseFilterMode = 'view' | 'add';

interface ExerciseFilterPanelProps {
  mode: ExerciseFilterMode;
  // Catalog state (provided by parent)
  exercises: ExerciseCatalogItem[];
  filteredExercises: ExerciseCatalogItem[];
  equipmentOptions: string[];
  muscleOptions: string[];
  levelOptions: string[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  // Controlled search/filter values
  query: string;
  onQueryChange: (value: string) => void;
  equipmentFilter: string;
  onEquipmentFilterChange: (value: string) => void;
  muscleFilter: string;
  onMuscleFilterChange: (value: string) => void;
  levelFilter: string;
  onLevelFilterChange: (value: string) => void;
  // Add-mode callback
  onAddExercise?: (exercise: ExerciseCatalogItem, equipment: ExerciseEquipmentOption | null) => void;
}

function pretty(value: string) {
  if (value === 'All') return 'All';
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(' ');
}

function FilterChips({
  label,
  options,
  value,
  onChange,
  theme,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: theme.textSecondary, fontSize: Size.xs, fontWeight: '800', letterSpacing: 0.6 }}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={{
                minHeight: 32,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: Radius.full,
                backgroundColor: active ? theme.primary : theme.surface2,
                borderWidth: 1,
                borderColor: active ? theme.primary : theme.borderLight,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: active ? theme.onPrimary : theme.text, fontSize: Size.xs, fontWeight: '800' }}>
                {pretty(option)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

interface ResultRowProps {
  exercise: ExerciseCatalogItem;
  mode: ExerciseFilterMode;
  frameTick: number;
  selectedEquipmentId: string | null;
  onPickEquipment: (equipmentId: string) => void;
  onAdd: () => void;
  theme: ReturnType<typeof useTheme>;
}

function ExerciseThumbnail({ name, frameTick, theme }: { name: string; frameTick: number; theme: ReturnType<typeof useTheme> }) {
  const frameUrls = useMemo(() => getExerciseImageFrameUrls(name), [name]);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [loadedUrls, setLoadedUrls] = useState<Record<string, boolean>>({});
  const availableFrameUrls = frameUrls.filter((url) => !failedUrls[url]);
  const preferredImageUrl = availableFrameUrls.length > 0 ? availableFrameUrls[frameTick % availableFrameUrls.length] : null;
  const fallbackLoadedUrl = availableFrameUrls.find((url) => loadedUrls[url]) ?? null;
  const visibleImageUrl = preferredImageUrl && loadedUrls[preferredImageUrl]
    ? preferredImageUrl
    : fallbackLoadedUrl ?? preferredImageUrl;

  useEffect(() => {
    setFailedUrls({});
    setLoadedUrls({});
  }, [name]);

  return (
    <View
      style={{
        width: 58,
        height: 58,
        borderRadius: Radius.md,
        backgroundColor: theme.surface2,
        borderWidth: 1,
        borderColor: theme.borderLight,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {availableFrameUrls.map((imageUrl) => (
        <Image
          key={imageUrl}
          source={{ uri: imageUrl, cache: 'force-cache' }}
          accessibilityElementsHidden={imageUrl !== visibleImageUrl}
          accessibilityLabel={imageUrl === visibleImageUrl ? `${name} exercise image` : undefined}
          importantForAccessibility={imageUrl === visibleImageUrl ? 'auto' : 'no-hide-descendants'}
          onLoad={() => setLoadedUrls((current) => ({ ...current, [imageUrl]: true }))}
          onError={() => setFailedUrls((current) => ({ ...current, [imageUrl]: true }))}
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: imageUrl === visibleImageUrl ? 1 : 0,
          }}
        />
      ))}
    </View>
  );
}

function ResultRow({ exercise, mode, frameTick, selectedEquipmentId, onPickEquipment, onAdd, theme }: ResultRowProps) {
  const hasEquipmentOptions = exercise.equipmentOptions.length > 0;
  const requiresPick = mode === 'add' && hasEquipmentOptions && selectedEquipmentId === null;

  return (
    <Card style={{ gap: Space.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
          <ExerciseThumbnail name={exercise.name} frameTick={frameTick} theme={theme} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: Size.md, fontWeight: '800' }}>{exercise.name}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: Size.xs, marginTop: 3 }}>
              {[pretty(exercise.level ?? 'Any level'), pretty(exercise.category ?? 'Exercise'), pretty(exercise.targetMuscle ?? '')]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>
        </View>
        {mode === 'add' ? (
          <Pressable
            onPress={onAdd}
            disabled={requiresPick}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: Radius.full,
              backgroundColor: requiresPick ? theme.surface2 : withAlpha(theme.primary, 0.16),
              opacity: requiresPick ? 0.6 : 1,
            }}
          >
            <Text style={{ color: requiresPick ? theme.textMuted : theme.primary, fontSize: Size.xs, fontWeight: '900' }}>
              Add
            </Text>
          </Pressable>
        ) : null}
      </View>

      {hasEquipmentOptions ? (
        <View style={{ gap: 6 }}>
          <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 }}>
            EQUIPMENT
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {exercise.equipmentOptions.map((option) => {
              const active = selectedEquipmentId === option.id;
              const interactive = mode === 'add';
              return (
                <Pressable
                  key={option.id}
                  disabled={!interactive}
                  onPress={() => onPickEquipment(option.id)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: Radius.full,
                    backgroundColor: active ? theme.primary : theme.surface2,
                    borderWidth: 1,
                    borderColor: active ? theme.primary : theme.borderLight,
                  }}
                >
                  <Text
                    style={{
                      color: active ? theme.onPrimary : theme.text,
                      fontSize: 10,
                      fontWeight: '800',
                    }}
                  >
                    {option.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : (
        <Text style={{ color: theme.textMuted, fontSize: 10, fontStyle: 'italic' }}>No equipment needed</Text>
      )}
    </Card>
  );
}

export function ExerciseFilterPanel({
  mode,
  exercises,
  filteredExercises,
  equipmentOptions,
  muscleOptions,
  levelOptions,
  loading,
  error,
  onRetry,
  query,
  onQueryChange,
  equipmentFilter,
  onEquipmentFilterChange,
  muscleFilter,
  onMuscleFilterChange,
  levelFilter,
  onLevelFilterChange,
  onAddExercise,
}: ExerciseFilterPanelProps) {
  const t = useTheme();
  // Local selection state for equipment chip within each result row.
  const [selectedEquipmentByExercise, setSelectedEquipmentByExercise] = useState<Record<string, string>>({});
  const [frameTick, setFrameTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameTick((current) => current + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Auto-select the only option when an exercise has exactly one equipment.
  // This removes a click for the common case while still requiring an explicit
  // pick for ambiguous (1:N) cases.
  React.useEffect(() => {
    if (mode !== 'add') return;
    setSelectedEquipmentByExercise((prev) => {
      let next = prev;
      for (const exercise of filteredExercises) {
        if (exercise.equipmentOptions.length === 1 && !(exercise.id in prev)) {
          if (next === prev) next = { ...prev };
          next[exercise.id] = exercise.equipmentOptions[0].id;
        }
      }
      return next;
    });
  }, [mode, filteredExercises]);

  const handleAdd = (exercise: ExerciseCatalogItem) => {
    if (!onAddExercise) return;

    const selectedId = selectedEquipmentByExercise[exercise.id] ?? null;
    if (exercise.equipmentOptions.length === 0) {
      // No mapping — add without equipment.
      onAddExercise(exercise, null);
      return;
    }
    const chosen = exercise.equipmentOptions.find((option) => option.id === selectedId) ?? null;
    if (!chosen) return; // UI prevents add until selected; guard for safety
    onAddExercise(exercise, chosen);
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    equipmentFilter !== 'All' ||
    muscleFilter !== 'All' ||
    levelFilter !== 'All';

  const clearFilters = () => {
    onQueryChange('');
    onEquipmentFilterChange('All');
    onMuscleFilterChange('All');
    onLevelFilterChange('All');
  };

  return (
    <View style={{ gap: Space.md }}>
      <TextInput
        value={query}
        onChangeText={onQueryChange}
        placeholder="Search exercises…"
        placeholderTextColor={t.textMuted}
        style={{
          color: t.text,
          backgroundColor: t.surface2,
          borderRadius: Radius.full,
          paddingHorizontal: Space.lg,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: t.borderLight,
        }}
      />

      <View style={{ gap: Space.sm }}>
        <FilterChips
          label="Equipment"
          options={equipmentOptions}
          value={equipmentFilter}
          onChange={onEquipmentFilterChange}
          theme={t}
        />
        <FilterChips
          label="Muscle"
          options={muscleOptions}
          value={muscleFilter}
          onChange={onMuscleFilterChange}
          theme={t}
        />
        <FilterChips
          label="Level"
          options={levelOptions}
          value={levelFilter}
          onChange={onLevelFilterChange}
          theme={t}
        />
        {hasActiveFilters ? (
          <Pressable onPress={clearFilters} style={{ alignSelf: 'flex-start' }}>
            <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '800' }}>Clear filters</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Card style={{ gap: Space.xs }}>
          <Text style={{ color: t.warning, fontSize: Size.sm, fontWeight: '800' }}>Could not load exercises</Text>
          <Text style={{ color: t.textSecondary, fontSize: Size.xs }}>{error}</Text>
          {onRetry ? (
            <Pressable
              onPress={onRetry}
              style={{
                alignSelf: 'flex-start',
                paddingHorizontal: Space.md,
                paddingVertical: 6,
                borderRadius: Radius.full,
                backgroundColor: withAlpha(t.primary, 0.12),
              }}
            >
              <Text style={{ color: t.primary, fontSize: Size.xs, fontWeight: '900' }}>Retry</Text>
            </Pressable>
          ) : null}
        </Card>
      ) : null}

      {loading && exercises.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: Space.lg }}>
          <ActivityIndicator color={t.primary} />
          <Text style={{ color: t.textMuted, fontSize: Size.xs, marginTop: Space.sm }}>Loading live catalog…</Text>
        </View>
      ) : (
        <View style={{ gap: Space.sm }}>
          <Text style={{ color: t.textMuted, fontSize: Size.xs }}>
            {filteredExercises.length} of {exercises.length} exercises
          </Text>
          {filteredExercises.length === 0 ? (
            <Card style={{ alignItems: 'center', gap: Space.sm }}>
              <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No exercises found</Text>
              <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center' }}>
                Try a different search or clear filters.
              </Text>
            </Card>
          ) : (
            filteredExercises.map((exercise) => (
              <ResultRow
                key={exercise.id}
                exercise={exercise}
                mode={mode}
                frameTick={frameTick}
                selectedEquipmentId={selectedEquipmentByExercise[exercise.id] ?? null}
                onPickEquipment={(equipmentId) =>
                  setSelectedEquipmentByExercise((prev) => ({ ...prev, [exercise.id]: equipmentId }))
                }
                onAdd={() => handleAdd(exercise)}
                theme={t}
              />
            ))
          )}
        </View>
      )}
    </View>
  );
}
