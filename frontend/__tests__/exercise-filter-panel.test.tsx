import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ExerciseFilterPanel } from '../src/components/ExerciseFilterPanel';
import type { ExerciseCatalogItem } from '../src/hooks/useExerciseCatalog';
import { UNASSIGNED_EQUIPMENT_FILTER } from '../src/lib/exerciseFilters';

// Component is pure presentational — no need to mock supabase/auth.

const benchPress: ExerciseCatalogItem = {
  id: 'ex-bench',
  name: 'Barbell Bench Press',
  category: 'strength',
  level: 'beginner',
  exerciseType: 'Barbell',
  targetMuscle: 'chest',
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps'],
  equipmentOptions: [
    { id: 'eq-flat', name: 'Flat Bench', category: 'Free Weights', location: '2nd', quantity: 2, description: null },
    { id: 'eq-smith', name: 'Smith Machine', category: 'Machine', location: '2nd', quantity: 1, description: null },
  ],
};

const pushUp: ExerciseCatalogItem = {
  id: 'ex-pushup',
  name: 'Push Up',
  category: 'strength',
  level: 'beginner',
  exerciseType: 'Body only',
  targetMuscle: 'chest',
  primaryMuscles: ['chest'],
  secondaryMuscles: [],
  equipmentOptions: [], // bodyweight, no mapping
};

const dumbbellCurl: ExerciseCatalogItem = {
  id: 'ex-curl',
  name: 'Dumbbell Curl',
  category: 'strength',
  level: 'beginner',
  exerciseType: 'Dumbbell',
  targetMuscle: 'biceps',
  primaryMuscles: ['biceps'],
  secondaryMuscles: [],
  equipmentOptions: [
    { id: 'eq-db', name: 'Adjustable Dumbbell', category: 'Free Weights', location: '1st', quantity: 6, description: null },
  ],
};

function setup(overrides: Partial<React.ComponentProps<typeof ExerciseFilterPanel>> = {}) {
  const defaults: React.ComponentProps<typeof ExerciseFilterPanel> = {
    mode: 'view',
    exercises: [benchPress, pushUp, dumbbellCurl],
    filteredExercises: [benchPress, pushUp, dumbbellCurl],
    equipmentOptions: ['All', UNASSIGNED_EQUIPMENT_FILTER, 'Flat Bench', 'Smith Machine', 'Adjustable Dumbbell'],
    muscleOptions: ['All', 'chest', 'biceps', 'triceps'],
    levelOptions: ['All', 'beginner'],
    loading: false,
    error: null,
    query: '',
    onQueryChange: jest.fn(),
    equipmentFilter: 'All',
    onEquipmentFilterChange: jest.fn(),
    muscleFilter: 'All',
    onMuscleFilterChange: jest.fn(),
    levelFilter: 'All',
    onLevelFilterChange: jest.fn(),
  };
  return render(<ExerciseFilterPanel {...defaults} {...overrides} />);
}

describe('ExerciseFilterPanel — view mode', () => {
  it('renders all exercises with their equipment chips', async () => {
    setup();

    expect(screen.getByText('Barbell Bench Press')).toBeTruthy();
    await waitFor(() => expect(screen.getByLabelText('Barbell Bench Press exercise image')).toBeTruthy());
    expect(screen.getByText('Push Up')).toBeTruthy();
    expect(screen.getByText('Dumbbell Curl')).toBeTruthy();
    // Equipment names appear in BOTH the top filter chips and the per-row equipment chips,
    // so we just confirm at least one occurrence of each.
    expect(screen.getAllByText('Flat Bench').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Smith Machine').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Adjustable Dumbbell').length).toBeGreaterThan(0);
  });

  it('shows "No equipment needed" for exercises without mappings', () => {
    setup();

    expect(screen.getByText('Push Up')).toBeTruthy();
    expect(screen.getByText('No equipment needed')).toBeTruthy();
  });

  it('does not render Add buttons in view mode', () => {
    setup();

    expect(screen.queryByText('Add')).toBeNull();
  });

  it('calls filter change handlers when chips are tapped', () => {
    const onMuscleFilterChange = jest.fn();
    setup({ onMuscleFilterChange });

    fireEvent.press(screen.getByText('Biceps'));
    expect(onMuscleFilterChange).toHaveBeenCalledWith('biceps');
  });

  it('offers a filter for exercises without assigned equipment', () => {
    const onEquipmentFilterChange = jest.fn();
    setup({ onEquipmentFilterChange });

    fireEvent.press(screen.getByText('No equipment assigned'));

    expect(onEquipmentFilterChange).toHaveBeenCalledWith(UNASSIGNED_EQUIPMENT_FILTER);
  });
});

describe('ExerciseFilterPanel — add mode', () => {
  it('renders Add buttons for each exercise', () => {
    setup({ mode: 'add', onAddExercise: jest.fn() });

    const addButtons = screen.getAllByText('Add');
    expect(addButtons.length).toBe(3);
  });

  it('auto-selects the equipment when only one option exists', () => {
    const onAddExercise = jest.fn();
    setup({
      mode: 'add',
      filteredExercises: [dumbbellCurl],
      onAddExercise,
    });

    // 1:1 mapping — Add should fire immediately with the only option
    fireEvent.press(screen.getByText('Add'));

    expect(onAddExercise).toHaveBeenCalledTimes(1);
    const [, equipment] = onAddExercise.mock.calls[0];
    expect(equipment?.id).toBe('eq-db');
  });

  it('requires the user to pick an equipment when multiple options exist', () => {
    const onAddExercise = jest.fn();
    setup({
      mode: 'add',
      filteredExercises: [benchPress],
      // Narrow the top filter chips so "Smith Machine" only appears in the result row,
      // making the press target unambiguous.
      equipmentOptions: ['All'],
      onAddExercise,
    });

    // First press: no equipment selected, callback should not fire
    fireEvent.press(screen.getByText('Add'));
    expect(onAddExercise).not.toHaveBeenCalled();

    // Pick Smith Machine, then Add
    fireEvent.press(screen.getByText('Smith Machine'));
    fireEvent.press(screen.getByText('Add'));

    expect(onAddExercise).toHaveBeenCalledTimes(1);
    const [, equipment] = onAddExercise.mock.calls[0];
    expect(equipment?.id).toBe('eq-smith');
  });

  it('allows adding an exercise with no equipment mapping immediately', () => {
    const onAddExercise = jest.fn();
    setup({
      mode: 'add',
      filteredExercises: [pushUp],
      onAddExercise,
    });

    fireEvent.press(screen.getByText('Add'));

    expect(onAddExercise).toHaveBeenCalledTimes(1);
    const [, equipment] = onAddExercise.mock.calls[0];
    expect(equipment).toBeNull();
  });
});

describe('ExerciseFilterPanel — non-data states', () => {
  it('shows a loading state when loading and no exercises yet', () => {
    setup({ loading: true, exercises: [], filteredExercises: [] });

    expect(screen.getByText('Loading live catalog…')).toBeTruthy();
  });

  it('shows an error state with a Retry control', () => {
    const onRetry = jest.fn();
    setup({ error: 'Network unavailable', onRetry });

    expect(screen.getByText('Could not load exercises')).toBeTruthy();
    expect(screen.getByText('Network unavailable')).toBeTruthy();

    fireEvent.press(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows an empty state when filters return no exercises', () => {
    setup({ filteredExercises: [] });

    expect(screen.getByText('No exercises found')).toBeTruthy();
  });

  it('shows the Clear filters action only when filters are active', () => {
    const { rerender } = setup();
    expect(screen.queryByText('Clear filters')).toBeNull();

    rerender(
      <ExerciseFilterPanel
        mode="view"
        exercises={[benchPress]}
        filteredExercises={[benchPress]}
        equipmentOptions={['All', 'Flat Bench']}
        muscleOptions={['All', 'chest']}
        levelOptions={['All', 'beginner']}
        loading={false}
        error={null}
        query="bench"
        onQueryChange={jest.fn()}
        equipmentFilter="All"
        onEquipmentFilterChange={jest.fn()}
        muscleFilter="All"
        onMuscleFilterChange={jest.fn()}
        levelFilter="All"
        onLevelFilterChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Clear filters')).toBeTruthy();
  });
});
