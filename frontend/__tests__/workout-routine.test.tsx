import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import WorkoutScreen from '../app/(tabs)/workout';
import { useEquipment } from '../src/hooks/useEquipment';
import { useExerciseCatalog } from '../src/hooks/useExerciseCatalog';
import { useExercises } from '../src/hooks/useExercises';
import { useWorkouts } from '../src/hooks/useWorkouts';
import { useRoutines } from '../src/hooks/useRoutines';

const mockPush = jest.fn();
const mockSetParams = jest.fn();
const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock('expo-router', () => ({
  router: {
    push: (...args: unknown[]) => mockPush(...args),
    replace: (...args: unknown[]) => mockReplace(...args),
    setParams: (...args: unknown[]) => mockSetParams(...args),
  },
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('../src/hooks/useEquipment', () => ({
  useEquipment: jest.fn(),
}));

jest.mock('../src/hooks/useExerciseCatalog', () => ({
  useExerciseCatalog: jest.fn(),
}));

jest.mock('../src/hooks/useExercises', () => ({
  useExercises: jest.fn(),
}));

jest.mock('../src/hooks/useWorkouts', () => ({
  useWorkouts: jest.fn(),
}));

jest.mock('../src/hooks/useRoutines', () => ({
  useRoutines: jest.fn(),
}));

const mockUseEquipment = useEquipment as jest.MockedFunction<typeof useEquipment>;
const mockUseExerciseCatalog = useExerciseCatalog as jest.MockedFunction<typeof useExerciseCatalog>;
const mockUseExercises = useExercises as jest.MockedFunction<typeof useExercises>;
const mockUseWorkouts = useWorkouts as jest.MockedFunction<typeof useWorkouts>;
const mockUseRoutines = useRoutines as jest.MockedFunction<typeof useRoutines>;

const createWorkout = jest.fn(async () => ({
  id: 'w-new',
  user_id: 'u-1',
  name: 'Push day',
  target_muscle: ['Chest'],
  routine_id: 'r-1',
  started_at: '2026-05-30T01:00:00.000Z',
  ended_at: null,
  duration_min: null,
  created_at: '2026-05-30T01:00:00.000Z',
}));

const getExercisesForWorkout = jest.fn(async () => [
  {
    id: 'we-1',
    workout_id: 'w-1',
    exercise_id: 'ex-1',
    equipment_id: 'eq-1',
    order_index: 1,
    started_at: '2026-05-10T01:05:00.000Z',
    ended_at: '2026-05-10T01:30:00.000Z',
    created_at: '2026-05-10T01:05:00.000Z',
    exercise: { id: 'ex-1', name: 'Barbell Bench Press', target_muscle: 'Chest', exercise_type: 'Strength' },
    equipment: { id: 'eq-1', name: 'Bench Press', category: 'Free Weights' },
    sets: [
      {
        id: 'set-1',
        workout_exercise_id: 'we-1',
        set_number: 1,
        weight: 80,
        reps: 8,
        is_completed: true,
        created_at: '2026-05-10T01:10:00.000Z',
      },
    ],
  },
]);

const sampleRoutine = {
  id: 'r-1',
  name: 'Push day',
  goal: 'Strength',
  targetMuscles: ['chest'],
  createdAt: '2026-05-01T00:00:00Z',
  lastUsedAt: '2026-05-25T00:00:00Z',
};

const otherRoutine = {
  id: 'r-2',
  name: 'Leg day',
  goal: 'Hypertrophy',
  targetMuscles: ['quads'],
  createdAt: '2026-05-02T00:00:00Z',
  lastUsedAt: null,
};

function setupMocks({
  withHistory = false,
  routines = [] as typeof sampleRoutine[],
  routinesLoading = false,
  routinesError = null as string | null,
} = {}) {
  createWorkout.mockClear();
  getExercisesForWorkout.mockClear();
  mockPush.mockClear();
  mockSetParams.mockClear();
  mockReplace.mockClear();

  mockUseEquipment.mockReturnValue({
    equipment: [
      {
        id: 'eq-1',
        name: 'Bench Press',
        category: 'Free Weights',
        location: '2nd floor',
        quantity: 2,
        description: null,
      },
    ],
    filteredEquipment: [],
    categories: ['All', 'Free Weights'],
    loading: false,
    error: null,
    connectionState: 'live',
    refresh: jest.fn(async () => undefined),
    simulateRealtimeDisconnect: jest.fn(),
  } as ReturnType<typeof useEquipment>);

  mockUseExerciseCatalog.mockReturnValue({
    exercises: [
      {
        id: 'ex-1',
        name: 'Barbell Bench Press',
        category: 'strength',
        level: 'beginner',
        equipmentOptions: [],
        exerciseType: 'Barbell',
        targetMuscle: 'Chest',
        primaryMuscles: ['Chest'],
        secondaryMuscles: ['Triceps'],
      },
    ],
    filteredExercises: [],
    equipmentOptions: ['All', 'Bench Press'],
    muscleOptions: ['All', 'Chest'],
    levelOptions: ['All', 'beginner'],
    loading: false,
    error: null,
    refresh: jest.fn(async () => undefined),
  } as ReturnType<typeof useExerciseCatalog>);

  mockUseWorkouts.mockReturnValue({
    workouts: withHistory
      ? [
          {
            id: 'w-1',
            user_id: 'u-1',
            name: 'Push day',
            target_muscle: ['Chest'],
            routine_id: 'r-1',
            started_at: '2026-05-10T01:00:00.000Z',
            ended_at: '2026-05-10T02:00:00.000Z',
            duration_min: 60,
            created_at: '2026-05-10T01:00:00.000Z',
          },
        ]
      : [],
    activeWorkout: null,
    loading: false,
    error: null,
    refresh: jest.fn(async () => undefined),
    createWorkout,
    endWorkout: jest.fn(async () => { throw new Error('not used'); }),
    getWorkout: jest.fn(async () => { throw new Error('not used'); }),
  } as ReturnType<typeof useWorkouts>);

  mockUseExercises.mockReturnValue({
    activeExercise: null,
    setsForActiveExercise: [],
    loading: false,
    error: null,
    addExercise: jest.fn(async () => { throw new Error('not used'); }),
    endExercise: jest.fn(async () => { throw new Error('not used'); }),
    addSet: jest.fn(async () => { throw new Error('not used'); }),
    updateSet: jest.fn(async () => { throw new Error('not used'); }),
    deleteSet: jest.fn(async () => undefined),
    getExercisesForWorkout,
    getActiveExercise: jest.fn(async () => null),
    hydrateActiveExercise: jest.fn(async () => null),
  } as ReturnType<typeof useExercises>);

  mockUseRoutines.mockReturnValue({
    routines,
    loading: routinesLoading,
    error: routinesError,
    refresh: jest.fn(async () => undefined),
    createRoutine: jest.fn(),
    updateRoutine: jest.fn(),
    deleteRoutine: jest.fn(),
  } as ReturnType<typeof useRoutines>);
}

describe('Workout screen — routine list (no routine selected)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({});
  });

  it('shows an empty state and create button when the user has no routines', () => {
    setupMocks({ routines: [] });

    render(<WorkoutScreen />);

    expect(screen.getByText('Pick a routine')).toBeTruthy();
    expect(screen.getByText('No routines yet')).toBeTruthy();
    expect(screen.getByText('Create your first routine')).toBeTruthy();
  });

  it('navigates to the routine editor when create is pressed in the empty state', () => {
    setupMocks({ routines: [] });

    render(<WorkoutScreen />);

    fireEvent.press(screen.getByText('Create your first routine'));

    expect(mockPush).toHaveBeenCalledWith('/routines');
  });

  it('renders each routine in the list with last-used summary', () => {
    setupMocks({ routines: [sampleRoutine, otherRoutine] });

    render(<WorkoutScreen />);

    expect(screen.getByText('Push day')).toBeTruthy();
    expect(screen.getByText('Strength')).toBeTruthy();
    expect(screen.getByText('Leg day')).toBeTruthy();
    expect(screen.getByText('Hypertrophy')).toBeTruthy();
    expect(screen.getByText('Never used')).toBeTruthy();
  });

  it('selects a routine via setParams when tapped', () => {
    setupMocks({ routines: [sampleRoutine] });

    render(<WorkoutScreen />);

    fireEvent.press(screen.getByText('Push day'));

    expect(mockSetParams).toHaveBeenCalledWith({ id: 'r-1' });
  });

  it('navigates to the routine editor for editing when the Edit button is tapped', () => {
    setupMocks({ routines: [sampleRoutine] });

    render(<WorkoutScreen />);

    fireEvent.press(screen.getByText('Edit'));

    expect(mockPush).toHaveBeenCalledWith('/routines?id=r-1');
  });

  it('shows a retry control when routines fail to load', () => {
    setupMocks({ routines: [], routinesError: 'Network unavailable' });

    render(<WorkoutScreen />);

    expect(screen.getByText('Could not load routines')).toBeTruthy();
    expect(screen.getByText('Network unavailable')).toBeTruthy();
    expect(screen.getByText('Retry')).toBeTruthy();
  });
});

describe('Workout screen — routine preview (routine selected)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ id: 'r-1' });
  });

  it('shows the first-workout empty state for a routine with no history', () => {
    setupMocks({ routines: [sampleRoutine] });

    render(<WorkoutScreen />);

    expect(screen.getByText('Push day')).toBeTruthy();
    expect(screen.getByText('Strength')).toBeTruthy();
    expect(
      screen.getByText('No workout history yet. Start a workout with this routine and it will fill in automatically.'),
    ).toBeTruthy();
    expect(screen.getByText('Start workout with this routine')).toBeTruthy();
    expect(getExercisesForWorkout).not.toHaveBeenCalled();
  });

  it('only loads exercises from workouts that belong to the selected routine', async () => {
    setupMocks({ withHistory: true, routines: [sampleRoutine] });

    render(<WorkoutScreen />);

    await waitFor(() => expect(screen.getByText('Barbell Bench Press')).toBeTruthy());

    expect(screen.getByText('Bench Press')).toBeTruthy();
    expect(screen.getByText('Set 1: 80 kg × 8')).toBeTruthy();
    expect(getExercisesForWorkout).toHaveBeenCalledWith('w-1');
  });

  it('starts a new workout with the selected routine_id', async () => {
    setupMocks({ withHistory: true, routines: [sampleRoutine] });

    render(<WorkoutScreen />);

    fireEvent.press(screen.getByText('Start workout with this routine'));

    await waitFor(() =>
      expect(createWorkout).toHaveBeenCalledWith({
        name: 'Push day',
        target_muscle: ['Chest'],
        routine_id: 'r-1',
      }),
    );
  });

  it('shows a not-found state when the routine id does not match any routine', () => {
    setupMocks({ routines: [otherRoutine] });

    render(<WorkoutScreen />);

    expect(screen.getByText('Routine not found')).toBeTruthy();
    expect(screen.getByText('Back to routines')).toBeTruthy();
  });

  it('clears the selected routine when Back to routines is pressed', () => {
    setupMocks({ routines: [otherRoutine] });

    render(<WorkoutScreen />);

    fireEvent.press(screen.getByText('Back to routines'));

    expect(mockSetParams).toHaveBeenCalledWith({ id: undefined });
  });
});
