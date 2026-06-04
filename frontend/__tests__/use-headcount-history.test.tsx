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
  const range = jest.fn(async () => result);
  const order = jest.fn(() => ({ range }));
  const lt = jest.fn(() => ({ order }));
  const gte = jest.fn(() => ({ lt }));
  const historyEq = jest.fn(() => ({ gte }));
  const select = jest.fn(() => ({ eq: historyEq }));
  const gymEq = jest.fn(async () => ({ data: [{ id: 'test-gym-uuid' }], error: null }));
  const gymSelect = jest.fn(() => ({ eq: gymEq }));

  fromMock.mockImplementation((table: string) => {
    if (table === 'gyms') return { select: gymSelect };
    return { select };
  });

  return { select, historyEq, gte, lt, order, range, gymSelect, gymEq };
}

describe('useHeadcountHistory', () => {
  const targetDate = new Date('2026-05-20T17:00:00Z');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads hourly history from Supabase and aggregates it', async () => {
    const query = mockHistoryQuery({
      data: [
        { count: 40, capacity: 150, sampled_at: '2026-05-20T09:00:00-07:00' },
        { count: 80, capacity: 150, sampled_at: '2026-05-27T09:30:00-07:00' },
        { count: 90, capacity: 150, sampled_at: '2026-05-13T18:00:00-07:00' },
        { count: 30, capacity: 150, sampled_at: '2026-05-21T10:00:00-07:00' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useHeadcountHistory(28, targetDate));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fromMock).toHaveBeenCalledWith('gym_headcount_history');
    expect(query.select).toHaveBeenCalledWith('count, sampled_at');
    expect(query.gte).toHaveBeenCalledWith('sampled_at', '2026-05-13T07:00:00.000Z');
    expect(query.lt).toHaveBeenCalledWith('sampled_at', '2026-05-14T07:00:00.000Z');
    expect(query.range).toHaveBeenCalledWith(0, 1999);
    expect(result.current.empty).toBe(false);
    expect(result.current.popularTimes[9]).toBe(60);
    expect(result.current.popularTimes[18]).toBe(90);
    expect(result.current.popularTimes[10]).toBe(0);
    expect(result.current.weekdayName).toBe('Wednesday');
    expect(result.current.error).toBeNull();
  });

  it('reports empty state when Supabase returns no samples', async () => {
    mockHistoryQuery({ data: [], error: null });

    const { result } = renderHook(() => useHeadcountHistory(28, targetDate));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.empty).toBe(true);
    expect(result.current.popularTimes).toEqual(Array(24).fill(0));
  });

  it('keeps deterministic fallback buckets when the query fails', async () => {
    mockHistoryQuery({ data: null, error: new Error('permission denied') });

    const { result } = renderHook(() => useHeadcountHistory(28, targetDate));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('permission denied');
    expect(result.current.empty).toBe(true);
    expect(result.current.popularTimes).toEqual(Array(24).fill(0));
  });
});
