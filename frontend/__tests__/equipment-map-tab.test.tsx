import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import TabsLayout from '../app/(tabs)/_layout';
import EquipmentMapScreen from '../app/(tabs)/map';
import { useEquipmentMap } from '../src/hooks/useEquipmentMap';
import { useNotifications } from '../src/contexts/NotificationContext';

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

jest.mock('../src/contexts/NotificationContext', () => ({
  useNotifications: jest.fn(),
}));

const mockUseEquipmentMap = useEquipmentMap as jest.MockedFunction<typeof useEquipmentMap>;
const mockUseNotifications = useNotifications as jest.MockedFunction<typeof useNotifications>;

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
    mockUseNotifications.mockReturnValue({
      isInWatchlist: jest.fn(() => false),
      addToWatchlist: jest.fn(),
      removeFromWatchlist: jest.fn(),
      watchlist: new Set(),
      toasts: [],
      dismissToast: jest.fn(),
      onToastTap: jest.fn(),
    });
  });

  it('registers a dedicated Map bottom tab', () => {
    render(<TabsLayout />);

    expect(screen.getByText('map:Map')).toBeTruthy();
  });

  it('renders the dedicated map screen with first-floor numbered zones', () => {
    mockMapHook();

    render(<EquipmentMapScreen />);

    expect(screen.getByText('Equipment Map')).toBeTruthy();
    expect(screen.getByText('Check mapped machines by floor and see live availability without leaving the main tabs.')).toBeTruthy();
    expect(screen.getByText('Equipment Availability Map')).toBeTruthy();
    expect(screen.getAllByText('Power Rack Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bench Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Plate-loaded Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });

  it('switches to second-floor numbered zones from the provided map', () => {
    mockMapHook({
      equipment: [
        { id: 'cable-1', name: 'Cable Row', category: 'Cables', location: '2nd floor', quantity: 0, description: null },
        { id: 'treadmill-1', name: 'Treadmill', category: 'Cardio', location: '2nd floor', quantity: 2, description: null },
        { id: 'machine-1', name: 'Leg Extension', category: 'Selectorized Machine', location: '2nd floor', quantity: 1, description: null },
        { id: 'box-1', name: 'Plyometric Box', category: 'Functional', location: '2nd floor', quantity: 1, description: null },
      ],
      statuses: { 'cable-1': 'occupied', 'treadmill-1': 'free', 'machine-1': 'free', 'box-1': 'free' },
    });

    render(<EquipmentMapScreen />);
    fireEvent.press(screen.getByText('2nd floor'));

    expect(screen.getAllByText('Cable Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cardio Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Machine Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Functional Area').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    expect(screen.getAllByText('6').length).toBeGreaterThan(0);
    expect(screen.getAllByText('7').length).toBeGreaterThan(0);
  });

  it('keeps the loading state available in the dedicated tab', () => {
    mockMapHook({ equipment: [], statuses: {}, globalState: 'loading' });

    render(<EquipmentMapScreen />);

    expect(screen.getByText('Loading the equipment map…')).toBeTruthy();
  });

  it('keeps the error state available in the dedicated tab', () => {
    const refresh = jest.fn(async () => undefined);
    mockMapHook({ equipment: [], statuses: {}, globalState: 'error', refresh });

    render(<EquipmentMapScreen />);
    fireEvent.press(screen.getByText('Retry'));

    expect(screen.getByText('Could not load the equipment map')).toBeTruthy();
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('keeps the empty state available in the dedicated tab', () => {
    mockMapHook({ equipment: [], statuses: {}, globalState: 'empty' });

    render(<EquipmentMapScreen />);

    expect(screen.getByText('No mapped equipment is available yet')).toBeTruthy();
  });
});
