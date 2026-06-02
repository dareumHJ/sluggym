import { renderHook, waitFor } from '@testing-library/react-native';
import { supabase } from '../src/lib/supabase';
import { useHeadcountHistory } from '../src/hooks/useHeadcountHistory';

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const fromMock = supabase.from as jest.Mock;

type HistoryResult = {
  data: Array<{ count: number | null; capacity: number | null; sampled_at: string | null }> | null;
  error: Error | null;
};

function mockHistoryQuery(result: HistoryResult) {
  const limit = jest.fn(async () => result);
  const order = jest.fn(() => ({ limit }));
  const gte = jest.fn(() => ({ order }));
  const select = jest.fn(() => ({ gte }));
  fromMock.mockReturnValue({ select });
  return { select, gte, order, limit };
}

describe('useHeadcountHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads hourly history from Supabase and aggregates it', async () => {
    const query = mockHistoryQuery({
      data: [
        { count: 40, capacity: 150, sampled_at: '2026-05-20T09:00:00' },
        { count: 80, capacity: 150, sampled_at: '2026-05-20T09:30:00' },
        { count: 30, capacity: 150, sampled_at: '2026-05-20T10:00:00' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useHeadcountHistory());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fromMock).toHaveBeenCalledWith('gym_headcount_history');
    expect(query.select).toHaveBeenCalledWith('count, sampled_at');
    expect(result.current.empty).toBe(false);
    expect(result.current.popularTimes[9]).toBe(60);
    expect(result.current.popularTimes[10]).toBe(30);
    expect(result.current.error).toBeNull();
  });

  it('reports empty state when Supabase returns no samples', async () => {
    mockHistoryQuery({ data: [], error: null });

    const { result } = renderHook(() => useHeadcountHistory());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.empty).toBe(true);
    expect(result.current.popularTimes).toEqual(Array(24).fill(0));
  });

  it('keeps deterministic fallback buckets when the query fails', async () => {
    mockHistoryQuery({ data: null, error: new Error('permission denied') });

    const { result } = renderHook(() => useHeadcountHistory());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('permission denied');
    expect(result.current.empty).toBe(true);
    expect(result.current.popularTimes).toEqual(Array(24).fill(0));
  });
});
