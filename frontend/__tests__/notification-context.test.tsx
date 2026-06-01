// __tests__/notification-context.test.tsx
// Integration tests for NotificationContext: watchlist + toast queue.
// Mocks useEquipment to simulate realtime availability changes without
// hitting Supabase. No external push service is involved.

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';
import { NotificationProvider, useNotifications } from '../src/contexts/NotificationContext';
import { useEquipment } from '../src/hooks/useEquipment';

// Mock supabase to avoid env errors during module load
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: { getUser: jest.fn() },
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

jest.mock('../src/hooks/useEquipment', () => ({
  useEquipment: jest.fn(),
}));

const mockUseEquipment = useEquipment as jest.MockedFunction<typeof useEquipment>;

function makeEquipment(quantity: number) {
  return [
    {
      id: 'eq-bench',
      name: 'Bench Press',
      category: 'Free Weights',
      location: '2nd floor',
      quantity,
      description: null,
    },
  ];
}

function setEquipment(quantity: number) {
  mockUseEquipment.mockReturnValue({
    equipment: makeEquipment(quantity),
    filteredEquipment: makeEquipment(quantity),
    categories: ['All'],
    loading: false,
    error: null,
    connectionState: 'live',
    refresh: jest.fn(async () => undefined),
    simulateRealtimeDisconnect: jest.fn(),
  } as unknown as ReturnType<typeof useEquipment>);
}

// A minimal harness component that exposes the context via on-screen buttons
// and renders toasts so tests can read them.
function Harness() {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, toasts, onToastTap } = useNotifications();
  const watching = isInWatchlist('eq-bench');

  return (
    <View>
      <Pressable testID="toggle" onPress={() => (watching ? removeFromWatchlist('eq-bench') : addToWatchlist('eq-bench'))}>
        <Text>{watching ? 'WATCHING' : 'NOT_WATCHING'}</Text>
      </Pressable>
      <View testID="toast-list">
        {toasts.map((toast) => (
          <Pressable key={toast.id} testID={`toast-${toast.equipmentId}`} onPress={() => onToastTap(toast)}>
            <Text>{toast.equipmentName}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function renderWithProvider() {
  return render(
    <NotificationProvider>
      <Harness />
    </NotificationProvider>,
  );
}

describe('NotificationContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not show a toast when the user is not watching the equipment', () => {
    setEquipment(0);
    const { rerender } = renderWithProvider();

    // Equipment becomes available, but user hasn't opted in.
    setEquipment(1);
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );

    expect(screen.queryByTestId('toast-eq-bench')).toBeNull();
  });

  it('shows a toast when watched equipment transitions from busy to free', () => {
    setEquipment(0);
    const { rerender } = renderWithProvider();

    // Opt in to notifications.
    fireEvent.press(screen.getByTestId('toggle'));
    expect(screen.getByText('WATCHING')).toBeTruthy();

    // Equipment becomes available.
    setEquipment(1);
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );

    expect(screen.getByTestId('toast-eq-bench')).toBeTruthy();
    expect(screen.getByText('Bench Press')).toBeTruthy();
  });

  it('persists the toast until the user taps it (no auto-dismiss)', () => {
    setEquipment(0);
    const { rerender } = renderWithProvider();

    fireEvent.press(screen.getByTestId('toggle'));

    setEquipment(1);
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );

    expect(screen.getByTestId('toast-eq-bench')).toBeTruthy();

    // Advancing time should NOT dismiss the toast — it persists until tapped.
    act(() => {
      jest.advanceTimersByTime(60_000); // 60 seconds
    });

    expect(screen.getByTestId('toast-eq-bench')).toBeTruthy();
  });

  it('tapping the toast dismisses it and removes the equipment from the watchlist', () => {
    setEquipment(0);
    const { rerender } = renderWithProvider();

    fireEvent.press(screen.getByTestId('toggle'));
    expect(screen.getByText('WATCHING')).toBeTruthy();

    setEquipment(1);
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );

    fireEvent.press(screen.getByTestId('toast-eq-bench'));

    expect(screen.queryByTestId('toast-eq-bench')).toBeNull();
    expect(screen.getByText('NOT_WATCHING')).toBeTruthy();
  });

  it('does not double-fire when the same equipment transitions twice within the debounce window', () => {
    setEquipment(0);
    const { rerender } = renderWithProvider();

    fireEvent.press(screen.getByTestId('toggle'));

    // First transition 0 -> 1
    setEquipment(1);
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );
    expect(screen.getAllByTestId('toast-eq-bench')).toHaveLength(1);

    // Tap to dismiss the first toast — this also removes the equipment from
    // the watchlist (decision D), so re-add it for the second transition.
    fireEvent.press(screen.getByTestId('toast-eq-bench'));
    expect(screen.queryByTestId('toast-eq-bench')).toBeNull();
    fireEvent.press(screen.getByTestId('toggle')); // re-add to watchlist

    // Equipment goes back to occupied, then free again — within the 2-min debounce.
    setEquipment(0);
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );
    setEquipment(1);
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );

    // Debounce should prevent the second notification.
    expect(screen.queryByTestId('toast-eq-bench')).toBeNull();
  });

  it('does not fire on first mount even if equipment is already free', () => {
    // Equipment is available before the user opens the app.
    setEquipment(1);
    const { rerender } = renderWithProvider();

    fireEvent.press(screen.getByTestId('toggle'));

    // No transition has occurred — just opening the app with available equipment
    // should not trigger a toast.
    rerender(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );

    expect(screen.queryByTestId('toast-eq-bench')).toBeNull();
  });
});
