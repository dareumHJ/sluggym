import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)';
import { useHeadcountHistory } from '../src/hooks/useHeadcountHistory';
import { useLiveOccupancy } from '../src/hooks/useLiveOccupancy';

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
