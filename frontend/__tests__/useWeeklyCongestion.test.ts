import { renderHook, waitFor } from '@testing-library/react-native';
import { useWeeklyCongestion } from '../src/hooks/useWeeklyCongestion';
import { supabase } from '../src/lib/supabase';

// 1. Mock the Supabase client
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const mockFrom = mockSupabase.from as jest.Mock;

describe('useWeeklyCongestion hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('aggregates time-series samples by day-of-week and hour bucket', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'gyms') {
        const eqFn = jest.fn().mockResolvedValue({
          data: [{ id: 'test-gym-uuid' }],
          error: null,
        });
        const selectFn = jest.fn().mockReturnValue({ eq: eqFn });
        return { select: selectFn };
      }
      if (table === 'gym_headcount_history') {
        const lteFn = jest.fn().mockResolvedValue({
          data: [
            // Mon May 18 2026 14:30 UTC = Mon 7:30 AM PDT -> Mon 6a bucket
            { count: 15, sampled_at: '2026-05-18T14:30:00Z' },
            // Mon May 18 2026 15:00 UTC = Mon 8:00 AM PDT -> Mon 6a bucket
            { count: 45, sampled_at: '2026-05-18T15:00:00Z' },
            // Wed May 20 2026 23:00 UTC = Wed 4:00 PM PDT -> Wed 3p bucket
            { count: 75, sampled_at: '2026-05-20T23:00:00Z' },
          ],
          error: null,
        });
        const gteFn = jest.fn().mockReturnValue({ lte: lteFn });
        const eqFn = jest.fn().mockReturnValue({ gte: gteFn });
        const selectFn = jest.fn().mockReturnValue({ eq: eqFn });
        return { select: selectFn };
      }
      return { select: jest.fn().mockReturnThis() };
    });

    const { result } = renderHook(() => useWeeklyCongestion('East Gym'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toHaveLength(42); // 7 days * 6 hour slots

    // Mon 6a bucket: average count is (15+45)/2 = 30. Intensity is (30/150)*100 = 20%
    const mon6a = result.current.data.find((c) => c.day === 'Mon' && c.hourLabel === '6a');
    expect(mon6a).toBeDefined();
    expect(mon6a?.intensity).toBe(20);

    // Wed 3p bucket: average count is 75. Intensity is (75/150)*100 = 50%
    const wed3p = result.current.data.find((c) => c.day === 'Wed' && c.hourLabel === '3p');
    expect(wed3p).toBeDefined();
    expect(wed3p?.intensity).toBe(50);

    // Unsampled buckets should be null
    const mon9p = result.current.data.find((c) => c.day === 'Mon' && c.hourLabel === '9p');
    expect(mon9p).toBeDefined();
    expect(mon9p?.intensity).toBeNull();
  });

  it('handles missing/empty data gracefully returning all null cells', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'gyms') {
        const eqFn = jest.fn().mockResolvedValue({
          data: [{ id: 'test-gym-uuid' }],
          error: null,
        });
        const selectFn = jest.fn().mockReturnValue({ eq: eqFn });
        return { select: selectFn };
      }
      if (table === 'gym_headcount_history') {
        const lteFn = jest.fn().mockResolvedValue({
          data: [], // empty table/no records
          error: null,
        });
        const gteFn = jest.fn().mockReturnValue({ lte: lteFn });
        const eqFn = jest.fn().mockReturnValue({ gte: gteFn });
        const selectFn = jest.fn().mockReturnValue({ eq: eqFn });
        return { select: selectFn };
      }
      return { select: jest.fn().mockReturnThis() };
    });

    const { result } = renderHook(() => useWeeklyCongestion('East Gym'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toHaveLength(42);

    // Every single cell should have null intensity
    const hasAnyIntensity = result.current.data.some((c) => c.intensity !== null);
    expect(hasAnyIntensity).toBe(false);
  });

  it('reports database or lookup errors correctly', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'gyms') {
        const eqFn = jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' },
        });
        const selectFn = jest.fn().mockReturnValue({ eq: eqFn });
        return { select: selectFn };
      }
      return { select: jest.fn().mockReturnThis() };
    });

    const { result } = renderHook(() => useWeeklyCongestion('East Gym'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Database connection failed');
    expect(result.current.data).toHaveLength(0);
  });
});
