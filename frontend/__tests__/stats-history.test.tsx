import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import StatsScreen from '../app/(tabs)/stats';
import { useWorkouts } from '../src/hooks/useWorkouts';
import { useExercises } from '../src/hooks/useExercises';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('../src/components/EquipmentAvailabilityMap', () => ({
  EquipmentAvailabilityMap: () => null,
}));

jest.mock('../src/hooks/useWorkouts', () => ({
  useWorkouts: jest.fn(),
}));

jest.mock('../src/hooks/useExercises', () => ({
  useExercises: jest.fn(),
}));

const mockUseWorkouts = useWorkouts as jest.MockedFunction<typeof useWorkouts>;
const mockUseExercises = useExercises as jest.MockedFunction<typeof useExercises>;
const mockPush = router.push as jest.Mock;

function makeHookReturn(overrides: Partial<ReturnType<typeof useWorkouts>> = {}): ReturnType<typeof useWorkouts> {
  return {
    workouts: [
      {
        id: 'w-1',
        user_id: 'u-1',
        name: 'Leg Day',
        target_muscle: ['Quads'],
        routine_id: null,
        started_at: '2026-05-10T01:00:00.000Z',
        ended_at: '2026-05-10T02:00:00.000Z',
        duration_min: 60,
        created_at: '2026-05-10T01:00:00.000Z',
      },
    ],
    activeWorkout: null,
    loading: false,
    error: null,
    refresh: jest.fn(async () => undefined),
    createWorkout: jest.fn(async () => { throw new Error('not used'); }),
    endWorkout: jest.fn(async () => { throw new Error('not used'); }),
    getWorkout: jest.fn(async () => { throw new Error('not used'); }),
    ...overrides,
  } as ReturnType<typeof useWorkouts>;
}

describe('StatsScreen session history states', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      deleteExercise: jest.fn(async () => undefined),
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
          exercise: { id: '12', name: 'Back Squat', target_muscle: 'Quads', exercise_type: 'Strength' },
          equipment: { id: '88', name: 'Squat Rack', category: 'Free Weights' },
          sets: [
            {
              id: 'set-1',
              workout_exercise_id: 'we-1',
              set_number: 1,
              weight: 100,
              reps: 5,
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

  it('renders a completed workout summary and opens its detail screen', async () => {
    mockUseWorkouts.mockReturnValue(makeHookReturn());

    render(<StatsScreen />);

    await waitFor(() => expect(screen.getByText('Back Squat')).toBeTruthy());

    expect(screen.getByText('Total Weight Lifted')).toBeTruthy();
    expect(screen.getByText('Personal Bests')).toBeTruthy();
    expect(screen.getByText('Leg Day')).toBeTruthy();
    expect(screen.getByText(/60 min · Quads/)).toBeTruthy();
    expect(screen.getByText('Tap to view details')).toBeTruthy();
    expect(screen.getByText('500 kg in the last 7 weeks')).toBeTruthy();

    fireEvent.press(screen.getByText('Leg Day'));

    expect(mockPush).toHaveBeenCalledWith('/workout-history/w-1');
  });

  it('renders the history loading state', () => {
    mockUseWorkouts.mockReturnValue(makeHookReturn({ workouts: [], loading: true }));

    render(<StatsScreen />);

    expect(screen.getByText('Loading saved sessions…')).toBeTruthy();
  });

  it('renders the history error state', () => {
    mockUseWorkouts.mockReturnValue(makeHookReturn({ workouts: [], error: 'Failed to load history.' }));

    render(<StatsScreen />);

    expect(screen.getByText('Failed to load history.')).toBeTruthy();
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('renders the history empty state', () => {
    mockUseWorkouts.mockReturnValue(makeHookReturn({ workouts: [] }));

    render(<StatsScreen />);

    expect(screen.getByText('No saved sessions yet')).toBeTruthy();
  });

  it('does not render the congestion heatmap in stats', async () => {
    mockUseWorkouts.mockReturnValue(makeHookReturn());

    render(<StatsScreen />);

    await waitFor(() => expect(screen.getByText('Back Squat')).toBeTruthy());

    expect(screen.queryByText('Weekly Congestion Heatmap')).toBeNull();
  });
});
