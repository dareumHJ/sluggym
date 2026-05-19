import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import StatsScreen from '../app/(tabs)/stats';
import { useWorkouts } from '../src/hooks/useWorkouts';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('../src/components/EquipmentAvailabilityMap', () => ({
  EquipmentAvailabilityMap: () => null,
}));

jest.mock('../src/hooks/useWorkouts', () => ({
  useWorkouts: jest.fn(),
}));

const mockUseWorkouts = useWorkouts as jest.MockedFunction<typeof useWorkouts>;
const mockPush = router.push as jest.Mock;

function makeHookReturn(overrides: Partial<ReturnType<typeof useWorkouts>> = {}): ReturnType<typeof useWorkouts> {
  return {
    workouts: [
      {
        id: 'w-1',
        user_id: 'u-1',
        name: 'Leg Day',
        target_muscle: ['Quads'],
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
  });

  it('renders a completed workout summary and opens its detail screen', () => {
    mockUseWorkouts.mockReturnValue(makeHookReturn());

    render(<StatsScreen />);

    expect(screen.getByText('Leg Day')).toBeTruthy();
    expect(screen.getByText(/60 min · Quads/)).toBeTruthy();
    expect(screen.getByText('Tap to view details')).toBeTruthy();

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
});
