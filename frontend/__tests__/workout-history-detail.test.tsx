import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import WorkoutHistoryDetailScreen from '../app/workout-history/[id]';
import { useWorkouts } from '../src/hooks/useWorkouts';
import { useExercises } from '../src/hooks/useExercises';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  router: { back: mockBack },
  useLocalSearchParams: () => ({ id: 'w-1' }),
}));

jest.mock('../src/hooks/useWorkouts', () => ({
  useWorkouts: jest.fn(),
}));

jest.mock('../src/hooks/useExercises', () => ({
  useExercises: jest.fn(),
}));

const mockUseWorkouts = useWorkouts as jest.MockedFunction<typeof useWorkouts>;
const mockUseExercises = useExercises as jest.MockedFunction<typeof useExercises>;

describe('WorkoutHistoryDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseWorkouts.mockReturnValue({
      workouts: [],
      activeWorkout: null,
      loading: false,
      error: null,
      refresh: jest.fn(async () => undefined),
      createWorkout: jest.fn(async () => { throw new Error('not used'); }),
      endWorkout: jest.fn(async () => { throw new Error('not used'); }),
      getWorkout: jest.fn(async () => ({
        id: 'w-1',
        user_id: 'u-1',
        name: 'Push Day',
        target_muscle: ['Chest', 'Triceps'],
        started_at: '2026-05-10T01:00:00.000Z',
        ended_at: '2026-05-10T02:05:00.000Z',
        duration_min: 65,
        created_at: '2026-05-10T01:00:00.000Z',
      })),
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
      getExercisesForWorkout: jest.fn(async () => [
        {
          id: 'we-1',
          workout_id: 'w-1',
          exercise_id: '12',
          equipment_id: '88',
          order_index: 1,
          started_at: '2026-05-10T01:05:00.000Z',
          ended_at: '2026-05-10T01:25:00.000Z',
          created_at: '2026-05-10T01:05:00.000Z',
          exercise: null,
          equipment: null,
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
      ]),
      getActiveExercise: jest.fn(async () => null),
      hydrateActiveExercise: jest.fn(async () => null),
    } as ReturnType<typeof useExercises>);
  });

  it('renders saved exercise details with fallback labels', async () => {
    render(<WorkoutHistoryDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Push Day')).toBeTruthy();
    });

    expect(screen.getByText('Exercise #12')).toBeTruthy();
    expect(screen.getByText('Equipment #88')).toBeTruthy();
    expect(screen.getByText('Set 1')).toBeTruthy();
    expect(screen.getByText('80 kg × 8 reps')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('renders joined exercise and equipment names when available', async () => {
    mockUseExercises.mockReturnValue({
      ...mockUseExercises.mock.results[0]?.value,
      getExercisesForWorkout: jest.fn(async () => [
        {
          id: 'we-joined',
          workout_id: 'w-1',
          exercise_id: '12',
          equipment_id: '88',
          order_index: 1,
          started_at: '2026-05-10T01:05:00.000Z',
          ended_at: '2026-05-10T01:25:00.000Z',
          created_at: '2026-05-10T01:05:00.000Z',
          exercise: { id: '12', name: 'Barbell Bench Press', target_muscle: 'Chest', exercise_type: 'Strength' },
          equipment: { id: '88', name: 'Flat Bench', category: 'Free Weights' },
          sets: [],
        },
      ]),
    } as ReturnType<typeof useExercises>);

    render(<WorkoutHistoryDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Barbell Bench Press')).toBeTruthy();
    });

    expect(screen.getByText('Flat Bench · Free Weights')).toBeTruthy();
    expect(screen.getByText('No completed sets were saved for this exercise.')).toBeTruthy();
  });

  it('renders a missing-detail fallback when no exercises were saved', async () => {
    mockUseExercises.mockReturnValue({
      ...mockUseExercises.mock.results[0]?.value,
      getExercisesForWorkout: jest.fn(async () => []),
    } as ReturnType<typeof useExercises>);

    render(<WorkoutHistoryDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('No detail rows saved yet')).toBeTruthy();
    });
  });
});
