import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import WorkoutScreen from '../app/(tabs)/workout';
import { useEquipment } from '../src/hooks/useEquipment';
import { useExerciseCatalog } from '../src/hooks/useExerciseCatalog';
import { useExercises } from '../src/hooks/useExercises';
import { useWorkouts } from '../src/hooks/useWorkouts';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() },
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

const mockUseEquipment = useEquipment as jest.MockedFunction<typeof useEquipment>;
const mockUseExerciseCatalog = useExerciseCatalog as jest.MockedFunction<typeof useExerciseCatalog>;
const mockUseExercises = useExercises as jest.MockedFunction<typeof useExercises>;
const mockUseWorkouts = useWorkouts as jest.MockedFunction<typeof useWorkouts>;

const createWorkout = jest.fn(async () => ({
  id: 'w-new',
  user_id: 'u-1',
  name: 'Workout Session',
  target_muscle: ['Chest'],
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

function setupMocks({ withHistory = false } = {}) {
  createWorkout.mockClear();
  getExercisesForWorkout.mockClear();

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
        equipmentRequired: 'Bench Press',
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
            name: 'Workout Session',
            target_muscle: ['Chest'],
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
}

describe('Workout routine screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the first-workout routine empty state', () => {
    setupMocks();

    render(<WorkoutScreen />);

    expect(screen.getByText('Workout Session')).toBeTruthy();
    expect(screen.getByText('Build consistency with a repeatable strength session.')).toBeTruthy();
    expect(screen.getByText('No workout history yet. Start a workout with this routine and it will fill in automatically.')).toBeTruthy();
    expect(screen.getByText('Start workout with this routine')).toBeTruthy();
    expect(getExercisesForWorkout).not.toHaveBeenCalled();
  });

  it('shows routine contents from the last completed workout', async () => {
    setupMocks({ withHistory: true });

    render(<WorkoutScreen />);

    await waitFor(() => expect(screen.getByText('Barbell Bench Press')).toBeTruthy());

    expect(screen.getByText('Chest')).toBeTruthy();
    expect(screen.getByText('Bench Press')).toBeTruthy();
    expect(screen.getByText('Set 1: 80 kg × 8')).toBeTruthy();
    expect(screen.getByText('Last workout · 1 exercises · 1 sets')).toBeTruthy();
  });

  it('starts a new workout from the routine button', async () => {
    setupMocks({ withHistory: true });

    render(<WorkoutScreen />);

    fireEvent.press(screen.getByText('Start workout with this routine'));

    await waitFor(() =>
      expect(createWorkout).toHaveBeenCalledWith({ name: 'Workout Session', target_muscle: ['Chest'] }),
    );
  });
});
