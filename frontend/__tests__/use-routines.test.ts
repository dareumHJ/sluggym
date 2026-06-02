import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useRoutines } from '../src/hooks/useRoutines';
import { supabase } from '../src/lib/supabase';

const mockUser = { id: 'user-1' };

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('useRoutines', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sorts routines by most recent activity, using created_at for new routines', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn(async () => ({
        data: [
          {
            id: 'older-used',
            name: 'Older used',
            goal: null,
            target_muscles: [],
            created_at: '2026-05-01T00:00:00.000Z',
            last_used_at: '2026-05-02T00:00:00.000Z',
          },
          {
            id: 'new-never-used',
            name: 'New never used',
            goal: null,
            target_muscles: [],
            created_at: '2026-05-30T00:00:00.000Z',
            last_used_at: null,
          },
        ],
        error: null,
      })),
    } as never);

    const { result, unmount } = renderHook(() => useRoutines());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.routines.map((routine) => routine.id)).toEqual(['new-never-used', 'older-used']);
    unmount();
  });

  it('syncs created routines across mounted hook instances', async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'routines_with_last_used') {
        return {
          select: jest.fn(async () => ({ data: [], error: null })),
        } as never;
      }

      return {
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(async () => ({
              data: {
                id: 'routine-new',
                name: 'Push day',
                goal: 'Strength',
                target_muscles: [],
                created_at: '2026-05-30T00:00:00.000Z',
              },
              error: null,
            })),
          })),
        })),
      } as never;
    });

    const first = renderHook(() => useRoutines());
    const second = renderHook(() => useRoutines());

    await waitFor(() => expect(first.result.current.loading).toBe(false));
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    await act(async () => {
      await first.result.current.createRoutine({ name: 'Push day', goal: 'Strength' });
    });

    await waitFor(() => expect(second.result.current.routines).toHaveLength(1));
    expect(second.result.current.routines[0]).toMatchObject({
      id: 'routine-new',
      name: 'Push day',
      goal: 'Strength',
    });

    first.unmount();
    second.unmount();
  });
});
