import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { EquipmentAvailabilityMap } from '../src/components/EquipmentAvailabilityMap';
import { useEquipmentMap } from '../src/hooks/useEquipmentMap';
import { useNotifications } from '../src/contexts/NotificationContext';

jest.mock('../src/hooks/useEquipmentMap', () => ({
  useEquipmentMap: jest.fn(),
}));

jest.mock('../src/contexts/NotificationContext', () => ({
  useNotifications: jest.fn(),
}));

const mockUseEquipmentMap = useEquipmentMap as jest.MockedFunction<typeof useEquipmentMap>;
const mockUseNotifications = useNotifications as jest.MockedFunction<typeof useNotifications>;

function mockHook(overrides: Partial<ReturnType<typeof useEquipmentMap>> = {}) {
  mockUseEquipmentMap.mockReturnValue({
    equipment: [
      { id: '1', name: 'Squat Rack', category: 'Free Weights', location: '1st floor', quantity: 1, description: 'Heavy compound station' },
      { id: '2', name: 'Bench Press', category: 'Free Weights', location: '1st floor', quantity: 0, description: 'Flat bench press setup' },
      { id: '4', name: 'Leg Press', category: 'Plate Loaded', location: '1st floor', quantity: 1, description: 'Plate-loaded lower-body station' },
      { id: '3', name: 'Treadmill 1', category: 'Cardio', location: '2nd floor', quantity: 2, description: 'Cardio line' },
    ],
    statuses: { '1': 'free', '2': 'occupied', '3': 'free' },
    globalState: 'ready',
    refresh: jest.fn(async () => undefined),
    ...overrides,
  } as ReturnType<typeof useEquipmentMap>);
}

describe('EquipmentAvailabilityMap', () => {
  const addToWatchlist = jest.fn();
  const removeFromWatchlist = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotifications.mockReturnValue({
      isInWatchlist: jest.fn(() => false),
      addToWatchlist,
      removeFromWatchlist,
      watchlist: new Set(),
      toasts: [],
      dismissToast: jest.fn(),
      onToastTap: jest.fn(),
    });
  });

  it('renders loading state', () => {
    mockHook({ equipment: [], statuses: {}, globalState: 'loading' });
    render(<EquipmentAvailabilityMap />);
    expect(screen.getByText('Loading the equipment map…')).toBeTruthy();
  });

  it('renders error state with retry', () => {
    const refresh = jest.fn(async () => undefined);
    mockHook({ equipment: [], statuses: {}, globalState: 'error', refresh });
    render(<EquipmentAvailabilityMap />);
    fireEvent.press(screen.getByText('Retry'));
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('renders map zones and opens zone equipment in a popup', async () => {
    mockHook();
    render(<EquipmentAvailabilityMap />);

    expect(screen.getByText('Equipment Availability Map')).toBeTruthy();
    expect(screen.getAllByText('Power Rack Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bench Zone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Plate-loaded Zone').length).toBeGreaterThan(0);
    expect(screen.getByText('1 of 3 mapped stations currently open')).toBeTruthy();
    expect(screen.getByText('1/1 · Open')).toBeTruthy();
    expect(screen.getByText('0/1 · Busy')).toBeTruthy();
    expect(screen.getByText('0/1 · Unknown')).toBeTruthy();
    expect(screen.queryByText('Squat Rack')).toBeNull();

    fireEvent.press(screen.getAllByLabelText('Open Power Rack Zone equipment popup')[0]);
    expect(screen.getByText('Squat Rack')).toBeTruthy();
    expect(screen.getByText('Heavy compound station')).toBeTruthy();
    expect(screen.getByText('Available')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Close equipment zone popup'));
    await waitFor(() => expect(screen.queryByText('Squat Rack')).toBeNull());

    fireEvent.press(screen.getAllByLabelText('Open Bench Zone equipment popup')[0]);
    expect(screen.getByText('Bench Press')).toBeTruthy();
    expect(screen.getByText('Occupied')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Enable free notification for Bench Press'));
    expect(addToWatchlist).toHaveBeenCalledWith('2');

    fireEvent.press(screen.getByLabelText('Close equipment zone popup'));
    await waitFor(() => expect(screen.queryByText('Bench Press')).toBeNull());

    fireEvent.press(screen.getAllByLabelText('Open Plate-loaded Zone equipment popup')[0]);
    expect(screen.getByText('Leg Press')).toBeTruthy();
    expect(screen.getByText('Unknown')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Close equipment zone popup'));
    await waitFor(() => expect(screen.queryByText('Leg Press')).toBeNull());

    fireEvent.press(screen.getByText('2nd floor'));
    expect(screen.getByText('Cardio Zone')).toBeTruthy();
    expect(screen.queryByText('Functional Area')).toBeNull();
  });
});
