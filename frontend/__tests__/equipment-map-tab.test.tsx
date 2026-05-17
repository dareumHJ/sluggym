import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TabsLayout from '../app/(tabs)/_layout';
import EquipmentMapScreen from '../app/(tabs)/map';
import { useEquipmentMap } from '../src/hooks/useEquipmentMap';

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');

  function Tabs({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  Tabs.Screen = ({ name, options }: { name: string; options: { title: string } }) => (
    <Text>{`${name}:${options.title}`}</Text>
  );

  return { Tabs };
});

jest.mock('../src/hooks/useEquipmentMap', () => ({
  useEquipmentMap: jest.fn(),
}));

const mockUseEquipmentMap = useEquipmentMap as jest.MockedFunction<typeof useEquipmentMap>;

function mockMapHook(overrides: Partial<ReturnType<typeof useEquipmentMap>> = {}) {
  mockUseEquipmentMap.mockReturnValue({
    equipment: [
      { id: 'rack-1', name: 'Squat Rack', category: 'Free Weights', location: '1st floor', quantity: 1, description: null },
      { id: 'bench-1', name: 'Bench Press', category: 'Free Weights', location: '1st floor', quantity: 0, description: null },
      { id: 'treadmill-1', name: 'Treadmill', category: 'Cardio', location: '2nd floor', quantity: 2, description: null },
    ],
    statuses: { 'rack-1': 'free', 'bench-1': 'occupied', 'treadmill-1': 'free' },
    globalState: 'ready',
    refresh: jest.fn(async () => undefined),
    ...overrides,
  } as ReturnType<typeof useEquipmentMap>);
}

describe('Equipment map tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a dedicated Map bottom tab', () => {
    render(<TabsLayout />);

    expect(screen.getByText('map:Map')).toBeTruthy();
  });

  it('renders the dedicated map screen with ready map content', () => {
    mockMapHook();

    render(<EquipmentMapScreen />);

    expect(screen.getByText('Equipment Map')).toBeTruthy();
    expect(screen.getByText('Check mapped machines by floor and see live availability without leaving the main tabs.')).toBeTruthy();
    expect(screen.getByText('Equipment Availability Map')).toBeTruthy();
    expect(screen.getAllByText('Power Rack Zone').length).toBeGreaterThan(0);
  });

  it('keeps the loading state available in the dedicated tab', () => {
    mockMapHook({ equipment: [], statuses: {}, globalState: 'loading' });

    render(<EquipmentMapScreen />);

    expect(screen.getByText('Loading the equipment map…')).toBeTruthy();
  });

  it('keeps the empty state available in the dedicated tab', () => {
    mockMapHook({ equipment: [], statuses: {}, globalState: 'empty' });

    render(<EquipmentMapScreen />);

    expect(screen.getByText('No mapped equipment is available yet')).toBeTruthy();
  });
});
