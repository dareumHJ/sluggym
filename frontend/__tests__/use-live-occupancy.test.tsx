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
});
