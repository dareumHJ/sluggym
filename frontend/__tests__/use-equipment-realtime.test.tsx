import { AppState } from 'react-native';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { supabase } from '../src/lib/supabase';
import { useEquipment } from '../src/hooks/useEquipment';

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

type FetchResult = {
  data: Array<{
    id: number;
    name: string;
    category: string;
    location: string | null;
    total_count: number;
    available_count: number;
    description: string | null;
  }> | null;
  error: { message: string } | null;
};

type RealtimeStatus = 'SUBSCRIBED' | 'CHANNEL_ERROR' | 'TIMED_OUT' | 'CLOSED';
type MockChannel = {
  on: jest.Mock;
  subscribe: jest.Mock;
};

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const fromMock = mockSupabase.from as jest.Mock;
const channelMock = mockSupabase.channel as jest.Mock;
const removeChannelMock = mockSupabase.removeChannel as jest.Mock;

const appStateRemoveMock = jest.fn();
let appStateHandler: ((state: string) => void) | undefined;
let realtimeHandler: (() => void) | undefined;
let subscriptionStatusHandler: ((status: RealtimeStatus) => void) | undefined;
let fetchQueue: FetchResult[] = [];

const benchRow = (availableCount: number) => ({
  id: 1,
  name: 'Bench Press',
  category: 'Free Weights',
  location: '2nd floor',
  total_count: 3,
  available_count: availableCount,
  description: 'Flat bench station',
});

function setupSupabaseMocks() {
  fromMock.mockImplementation(() => {
    const secondOrder = jest.fn(async () => fetchQueue.shift() ?? { data: [], error: null });
    const firstOrder = jest.fn(() => ({ order: secondOrder }));
    const select = jest.fn(() => ({ order: firstOrder }));
    return { select };
  });

  const channel: MockChannel = {
    on: jest.fn((_event, _filter, callback: () => void) => {
      realtimeHandler = callback;
      return channel;
    }),
    subscribe: jest.fn((callback: (status: RealtimeStatus) => void) => {
      subscriptionStatusHandler = callback;
      return channel;
    }),
  };
  channelMock.mockReturnValue(channel);
  removeChannelMock.mockResolvedValue(undefined);

  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, handler) => {
    appStateHandler = handler as (state: string) => void;
    return { remove: appStateRemoveMock } as never;
  });
}

describe('useEquipment realtime subscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    appStateRemoveMock.mockClear();
    fetchQueue = [];
    realtimeHandler = undefined;
    subscriptionStatusHandler = undefined;
    appStateHandler = undefined;
    setupSupabaseMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('refreshes equipment when a realtime update arrives', async () => {
    fetchQueue = [
      { data: [benchRow(2)], error: null },
      { data: [benchRow(1)], error: null },
    ];

    const { result } = renderHook(() => useEquipment());

    await waitFor(() => expect(result.current.equipment[0]?.quantity).toBe(2));
    expect(channelMock.mock.calls[0][0]).toMatch(/^gym-equipment-ui-refresh-/);
    expect(realtimeHandler).toBeDefined();

    act(() => {
      realtimeHandler?.();
    });

    await waitFor(() => expect(result.current.equipment[0]?.quantity).toBe(1));
    expect(fromMock).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
  });

  it('uses a distinct realtime channel topic for each hook instance', async () => {
    fetchQueue = [
      { data: [benchRow(2)], error: null },
      { data: [benchRow(3)], error: null },
    ];

    const first = renderHook(() => useEquipment());
    const second = renderHook(() => useEquipment());

    await waitFor(() => expect(first.result.current.loading).toBe(false));
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    const topics = channelMock.mock.calls.map(([topic]) => topic);
    expect(topics).toHaveLength(2);
    expect(new Set(topics).size).toBe(2);
    expect(topics[0]).toMatch(/^gym-equipment-ui-refresh-/);
    expect(topics[1]).toMatch(/^gym-equipment-ui-refresh-/);

    first.unmount();
    second.unmount();
  });

  it('preserves stale data and reports an error when subscription recovery refresh fails', async () => {
    fetchQueue = [
      { data: [benchRow(2)], error: null },
      { data: null, error: { message: 'Network unavailable' } },
    ];

    const { result } = renderHook(() => useEquipment());

    await waitFor(() => expect(result.current.equipment[0]?.quantity).toBe(2));
    expect(subscriptionStatusHandler).toBeDefined();

    act(() => {
      subscriptionStatusHandler?.('CHANNEL_ERROR');
    });

    await waitFor(() => expect(result.current.error).toBe('Network unavailable'));
    expect(result.current.equipment[0]?.quantity).toBe(2);
    expect(result.current.connectionState).toBe('reconnecting');
  });

  it('explicitly re-subscribes with backoff after a realtime timeout', async () => {
    jest.useFakeTimers();
    fetchQueue = [
      { data: [benchRow(2)], error: null },
      { data: [benchRow(2)], error: null },
    ];

    const { result } = renderHook(() => useEquipment());

    await waitFor(() => expect(result.current.equipment[0]?.quantity).toBe(2));
    act(() => {
      subscriptionStatusHandler?.('SUBSCRIBED');
    });
    expect(result.current.connectionState).toBe('live');
    expect(channelMock).toHaveBeenCalledTimes(1);

    act(() => {
      subscriptionStatusHandler?.('TIMED_OUT');
    });

    await waitFor(() => expect(result.current.connectionState).toBe('reconnecting'));
    expect(result.current.equipment[0]?.quantity).toBe(2);

    act(() => {
      jest.advanceTimersByTime(1_000);
    });

    await waitFor(() => expect(channelMock).toHaveBeenCalledTimes(2));
    expect(removeChannelMock).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('surfaces offline state when the realtime channel closes', async () => {
    fetchQueue = [
      { data: [benchRow(2)], error: null },
      { data: [benchRow(2)], error: null },
    ];

    const { result } = renderHook(() => useEquipment());

    await waitFor(() => expect(result.current.equipment[0]?.quantity).toBe(2));
    act(() => {
      subscriptionStatusHandler?.('SUBSCRIBED');
    });
    await waitFor(() => expect(result.current.connectionState).toBe('live'));

    act(() => {
      subscriptionStatusHandler?.('CLOSED');
    });

    await waitFor(() => expect(result.current.connectionState).toBe('offline'));
    expect(result.current.equipment[0]?.quantity).toBe(2);
  });

  it('refreshes when the app returns to the foreground', async () => {
    fetchQueue = [
      { data: [benchRow(2)], error: null },
      { data: [benchRow(3)], error: null },
    ];

    const { result } = renderHook(() => useEquipment());

    await waitFor(() => expect(result.current.equipment[0]?.quantity).toBe(2));
    expect(appStateHandler).toBeDefined();

    act(() => {
      appStateHandler?.('active');
    });

    await waitFor(() => expect(result.current.equipment[0]?.quantity).toBe(3));
    expect(fromMock).toHaveBeenCalledTimes(2);
  });

  it('cleans up the realtime channel and app state listener on unmount', async () => {
    fetchQueue = [{ data: [benchRow(2)], error: null }];

    const { result, unmount } = renderHook(() => useEquipment());
    await waitFor(() => expect(result.current.loading).toBe(false));

    unmount();

    expect(removeChannelMock).toHaveBeenCalledTimes(1);
    expect(appStateRemoveMock).toHaveBeenCalledTimes(1);
  });
});
