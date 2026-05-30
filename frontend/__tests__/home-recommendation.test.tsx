import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/index';
import { useAuth } from '../src/contexts/AuthContext';
import { useEquipment } from '../src/hooks/useEquipment';
import { useExercises } from '../src/hooks/useExercises';
import { useHeadcountHistory } from '../src/hooks/useHeadcountHistory';
import { useLiveOccupancy } from '../src/hooks/useLiveOccupancy';
import { useWorkouts } from '../src/hooks/useWorkouts';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../src/hooks/useEquipment', () => ({
  useEquipment: jest.fn(),
}));

jest.mock('../src/hooks/useExercises', () => ({
  useExercises: jest.fn(),
}));

jest.mock('../src/hooks/useLiveOccupancy', () => ({
  useLiveOccupancy: jest.fn(),
}));

jest.mock('../src/hooks/useHeadcountHistory', () => ({
  useHeadcountHistory: jest.fn(),
}));

jest.mock('../src/hooks/useWorkouts', () => ({
  useWorkouts: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseEquipment = useEquipment as jest.MockedFunction<typeof useEquipment>;
const mockUseExercises = useExercises as jest.MockedFunction<typeof useExercises>;
const mockUseHeadcountHistory = useHeadcountHistory as jest.MockedFunction<typeof useHeadcountHistory>;
const mockUseLiveOccupancy = useLiveOccupancy as jest.MockedFunction<typeof useLiveOccupancy>;
const mockUseWorkouts = useWorkouts as jest.MockedFunction<typeof useWorkouts>;

function setupMocks(overrides: {
  equipment?: Partial<ReturnType<typeof useEquipment>>;
  workouts?: Partial<ReturnType<typeof useWorkouts>>;
  exercises?: Partial<ReturnType<typeof useExercises>>;
  occupancy?: Partial<ReturnType<typeof useLiveOccupancy>>;
} = {}) {
  mockUseAuth.mockReturnValue({
    user: { id: 'u-1', email: 'alex@example.com', name: 'Alex Rivera' },
    loading: false,
    signInWithGoogle: jest.fn(async () => undefined),
    signInWithEmail: jest.fn(async () => undefined),
    signUpWithEmail: jest.fn(async () => undefined),
    signOut: jest.fn(async () => undefined),
  } as ReturnType<typeof useAuth>);

  mockUseLiveOccupancy.mockReturnValue({
    data: {
      count: 42,
      location: 'East Gym',
      source: 'api',
      timestamp: '2026-05-30T12:00:00.000Z',
    },
    error: null,
    loading: false,
    refreshing: false,
    reload: jest.fn(async () => undefined),
    ...overrides.occupancy,
  } as ReturnType<typeof useLiveOccupancy>);

  mockUseEquipment.mockReturnValue({
    equipment: [
      {
        id: 'eq-1',
        name: 'Bench Press',
        category: 'Free Weights',
        location: '2nd floor',
        quantity: 2,
        description: 'Flat bench station',
      },
    ],
    filteredEquipment: [],
    categories: ['All', 'Free Weights'],
    loading: false,
    error: null,
    connectionState: 'live',
    refresh: jest.fn(async () => undefined),
    simulateRealtimeDisconnect: jest.fn(),
    ...overrides.equipment,
  } as ReturnType<typeof useEquipment>);

  mockUseHeadcountHistory.mockReturnValue({
    buckets: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      averageCount: null,
      sampleCount: 0,
      capacity: null,
    })),
    popularTimes: Array(24).fill(0),
    loading: false,
    error: null,
    empty: true,
    reload: jest.fn(async () => undefined),
  } as ReturnType<typeof useHeadcountHistory>);

  mockUseWorkouts.mockReturnValue({
    workouts: [
      {
        id: 'w-1',
        user_id: 'u-1',
        name: 'Push Day',
        target_muscle: ['Chest'],
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
    ...overrides.workouts,
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
        exercise_id: 'ex-1',
        equipment_id: 'eq-1',
        order_index: 1,
        started_at: '2026-05-10T01:05:00.000Z',
        ended_at: '2026-05-10T01:30:00.000Z',
        created_at: '2026-05-10T01:05:00.000Z',
        sets: [],
      },
    ]),
    getActiveExercise: jest.fn(async () => null),
    hydrateActiveExercise: jest.fn(async () => null),
    ...overrides.exercises,
  } as ReturnType<typeof useExercises>);
}

describe('HomeScreen recommendation UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('renders a recommendation from saved workout history and live equipment', async () => {
    render(<HomeScreen />);

    await waitFor(() => expect(screen.getByText('Best fit for Chest')).toBeTruthy());

    expect(screen.getByText(/Bench Press is available and appears in your saved session history/)).toBeTruthy();
    expect(screen.getByText('History + live equipment')).toBeTruthy();
    expect(screen.getByText('Weekly Congestion Heatmap')).toBeTruthy();
    expect(screen.queryByText('Available Equipment')).toBeNull();
  });

  it('shows a visible fallback when recommendation inputs fail', async () => {
    setupMocks({
      equipment: { equipment: [], error: 'Failed to load equipment.' },
      workouts: { workouts: [], error: 'Failed to load history.' },
    });

    render(<HomeScreen />);

    await waitFor(() => expect(screen.getByText('No live station recommendation yet')).toBeTruthy());

    expect(screen.getByText('Fallback data in use')).toBeTruthy();
    expect(screen.getByText('Failed to load equipment.')).toBeTruthy();
    expect(screen.getByText('Failed to load history.')).toBeTruthy();
  });
});
