import { renderHook, waitFor } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useLiveOccupancy } from '../src/hooks/useLiveOccupancy';

describe('useLiveOccupancy', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() } as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('surfaces backend fallback messages instead of a generic connection failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn(async () => ({
        location: 'East Gym',
        count: 0,
        timestamp: null,
        source: 'fallback',
        message: 'Live occupancy unavailable',
      })),
    });

    const { result } = renderHook(() => useLiveOccupancy());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Live occupancy unavailable');
    expect(result.current.data.message).toBe('Live occupancy unavailable');
    expect(result.current.data.source).toBe('fallback');
  });

  it('populates live data and clears error on a successful api response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn(async () => ({
        location: 'East Gym',
        count: 42,
        timestamp: '2026-06-05T10:00:00Z',
        source: 'api',
      })),
    });

    const { result } = renderHook(() => useLiveOccupancy());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data.count).toBe(42);
    expect(result.current.data.source).toBe('api');
    expect(result.current.data.location).toBe('East Gym');
  });

  it('surfaces a generic error when the server returns a non-2xx status', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });

    const { result } = renderHook(() => useLiveOccupancy());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('API connection failed');
    expect(result.current.data.source).toBe('fallback');
  });

  it('surfaces a generic error when fetch throws a network-level exception', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network request failed'));

    const { result } = renderHook(() => useLiveOccupancy());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('API connection failed');
  });

  it('normalises a space-delimited timestamp to ISO format with T separator', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn(async () => ({
        location: 'East Gym',
        count: 30,
        timestamp: '2026-06-05 10:00:00',
        source: 'api',
      })),
    });

    const { result } = renderHook(() => useLiveOccupancy());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.timestamp).toBe('2026-06-05T10:00:00');
  });

  it('leaves a null timestamp as null without throwing', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn(async () => ({
        location: 'East Gym',
        count: 25,
        timestamp: null,
        source: 'api',
      })),
    });

    const { result } = renderHook(() => useLiveOccupancy());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.timestamp).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
