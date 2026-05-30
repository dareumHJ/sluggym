import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)';
import { useHeadcountHistory } from '../src/hooks/useHeadcountHistory';
import { useLiveOccupancy } from '../src/hooks/useLiveOccupancy';
import { useEquipment } from '../src/hooks/useEquipment';
import { useExercises } from '../src/hooks/useExercises';
import { useWorkouts } from '../src/hooks/useWorkouts';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Sangwoo' } }),
}));

jest.mock('../src/hooks/useLiveOccupancy', () => ({
  useLiveOccupancy: jest.fn(),
}));

jest.mock('../src/hooks/useHeadcountHistory', () => ({
  useHeadcountHistory: jest.fn(),
}));

jest.mock('../src/hooks/useEquipment', () => ({
  useEquipment: jest.fn(),
}));

jest.mock('../src/hooks/useExercises', () => ({
  useExercises: jest.fn(),
}));

jest.mock('../src/hooks/useWorkouts', () => ({
  useWorkouts: jest.fn(),
}));

jest.mock('../src/components/Occupancy', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    OccupancyBar: ({ count, capacity }: { count: number; capacity: number }) => React.createElement(Text, null, `occupancy:${count}/${capacity}`),
    PopularTimes: ({ data }: { data: number[] }) => React.createElement(Text, null, `popular-times:${data.join(',')}`),
  };
});

jest.mock('../src/components/AnimatedSection', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    AnimatedSection: ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children),
  };
});

const mockUseLiveOccupancy = useLiveOccupancy as jest.MockedFunction<typeof useLiveOccupancy>;
const mockUseHeadcountHistory = useHeadcountHistory as jest.MockedFunction<typeof useHeadcountHistory>;
const mockUseEquipment = useEquipment as jest.MockedFunction<typeof useEquipment>;
const mockUseExercises = useExercises as jest.MockedFunction<typeof useExercises>;
const mockUseWorkouts = useWorkouts as jest.MockedFunction<typeof useWorkouts>;

const liveOccupancyState = {
  data: { count: 42, location: 'East Gym', source: 'api', timestamp: '2026-05-20T09:00:00Z' },
  error: null,
  loading: false,
  refreshing: false,
  reload: jest.fn(),
} as ReturnType<typeof useLiveOccupancy>;

function mockHistory(overrides: Partial<ReturnType<typeof useHeadcountHistory>> = {}) {
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
    ...overrides,
  } as ReturnType<typeof useHeadcountHistory>);
}

describe('Home Popular Times history integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLiveOccupancy.mockReturnValue(liveOccupancyState);
    mockUseEquipment.mockReturnValue({
      equipment: [],
      filteredEquipment: [],
      categories: ['All'],
      loading: false,
      error: null,
      connectionState: 'live',
      refresh: jest.fn(async () => undefined),
      simulateRealtimeDisconnect: jest.fn(),
    } as ReturnType<typeof useEquipment>);
    mockUseWorkouts.mockReturnValue({
      workouts: [],
      activeWorkout: null,
      loading: false,
      error: null,
      refresh: jest.fn(async () => undefined),
      createWorkout: jest.fn(async () => { throw new Error('not used'); }),
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
      getExercisesForWorkout: jest.fn(async () => []),
      getActiveExercise: jest.fn(async () => null),
      hydrateActiveExercise: jest.fn(async () => null),
    } as ReturnType<typeof useExercises>);
  });

  it('renders live aggregated history instead of static mock data when samples exist', () => {
    mockHistory({
      empty: false,
      popularTimes: Array.from({ length: 24 }, (_, hour) => (hour === 18 ? 99 : hour)),
      buckets: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        averageCount: hour === 18 ? 99 : hour,
        sampleCount: 1,
        capacity: 150,
      })),
    });

    render(<HomeScreen />);

    expect(screen.getByText(/popular-times:0,1,2,3,4,5/)).toBeTruthy();
    expect(screen.getByText('Busiest recent hour: 18:00')).toBeTruthy();
    expect(screen.queryByText('Typically busy between 5–7pm')).toBeNull();
  });

  it('shows safe fallback copy when history is empty', () => {
    mockHistory({ empty: true });

    render(<HomeScreen />);

    expect(screen.getByText('Not enough historical samples yet; showing safe fallback trends.')).toBeTruthy();
    expect(screen.getByText('Typically busy between 5–7pm')).toBeTruthy();
  });
});
