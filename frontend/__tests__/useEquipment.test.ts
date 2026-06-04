import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useEquipment } from '../src/hooks/useEquipment';
import { supabase } from '../src/lib/supabase';

// 1. Mock the Supabase client
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('useEquipment', () => {
  let mockPostgresChangesCallback: () => void;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the .from('gym_equipment').select() chain
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(function (this: any) {
        return this; // handle multiple order calls
      }),
      then: (resolve: any) =>
        resolve({
          data: [
            {
              id: '1',
              name: 'Squat Rack',
              category: 'Free Weights',
              location: '1st floor',
              total_count: 5,
              available_count: 4,
              description: 'Standard rack',
            },
          ],
          error: null,
        }),
    } as any);

    // Mock the realtime channel chain to capture the callback
    mockSupabase.channel.mockReturnValue({
      on: jest.fn().mockImplementation((event, filter, callback) => {
        if (event === 'postgres_changes') {
          mockPostgresChangesCallback = callback;
        }
        return {
          subscribe: jest.fn().mockImplementation((cb) => {
            if (cb) cb('SUBSCRIBED');
          }),
        };
      }),
    } as any);
  });

  it('fetches and normalizes equipment on initial load', async () => {
    const { result } = renderHook(() => useEquipment());

    // Wait for the async refresh() inside useEffect to finish
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.equipment).toHaveLength(1);
    expect(result.current.equipment[0]).toEqual({
      id: '1',
      name: 'Squat Rack',
      category: 'Free Weights',
      location: '1st floor',
      quantity: 4, // available_count is mapped to quantity
      description: 'Standard rack',
    });
  });

  it('updates state when a realtime postgres_changes event fires', async () => {
    const { result } = renderHook(() => useEquipment());

    await waitFor(() => {
      expect(result.current.equipment[0].quantity).toBe(4);
    });

    // Simulate someone checking out a squat rack (database available_count drops to 3)
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(function (this: any) {
        return this;
      }),
      then: (resolve: any) =>
        resolve({
          data: [
            {
              id: '1',
              name: 'Squat Rack',
              category: 'Free Weights',
              location: '1st floor',
              total_count: 5,
              available_count: 3, // <--- COUNT DROPPED
              description: 'Standard rack',
            },
          ],
          error: null,
        }),
    } as any);

    // Manually trigger the WebSocket broadcast callback inside act()
    act(() => {
      mockPostgresChangesCallback();
    });

    // The hook should call refresh() again and update the state
    await waitFor(() => {
      expect(result.current.equipment[0].quantity).toBe(3);
    });
  });
});
