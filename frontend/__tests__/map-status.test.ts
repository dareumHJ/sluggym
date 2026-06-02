import { getEquipmentMapStatus } from '../src/lib/mapLogic';
import { useEquipmentMap } from '../src/hooks/useEquipmentMap';
import { useEquipment } from '../src/hooks/useEquipment';
import { renderHook } from '@testing-library/react-native';
import type { LiveEquipment } from '../src/types';

// Mock the base hook to ensure we aren't creating a duplicate subscription path
jest.mock('../src/hooks/useEquipment', () => ({
  useEquipment: jest.fn(),
}));

describe('getEquipmentMapStatus (SLU-141 / SLU-142)', () => {
  const mockEquipment: LiveEquipment[] = [
    { id: 1, name: 'Squat Rack', category: 'Free Weights', location: 'A', quantity: 2 },
    { id: 2, name: 'Bench Press', category: 'Free Weights', location: 'B', quantity: 0 },
    { id: 3, name: 'Broken Machine', category: 'Machines', location: 'C', quantity: null as any },
  ];

  it('handles loading state correctly', () => {
    const result = getEquipmentMapStatus([], true, null);
    expect(result.globalState).toBe('loading');
    expect(result.statuses).toEqual({});
  });

  it('handles error state correctly', () => {
    const result = getEquipmentMapStatus([], false, 'Connection lost');
    expect(result.globalState).toBe('error');
    expect(result.statuses).toEqual({});
  });

  it('handles empty state correctly', () => {
    const result = getEquipmentMapStatus([], false, null);
    expect(result.globalState).toBe('empty');
    expect(result.statuses).toEqual({});
  });

  it('maps equipment to free, occupied, and unknown statuses', () => {
    const result = getEquipmentMapStatus(mockEquipment, false, null);

    expect(result.globalState).toBe('ready');

    // Squat rack has 2 available -> free
    expect(result.statuses['1']).toBe('free');

    // Bench press has 0 available -> occupied
    expect(result.statuses['2']).toBe('occupied');

    // Broken machine has null quantity -> unknown
    expect(result.statuses['3']).toBe('unknown');
  });
});

describe('useEquipmentMap Hook (SLU-141)', () => {
  const mockUseEquipment = useEquipment as jest.MockedFunction<typeof useEquipment>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reuses the existing useEquipment hook and transforms its output', () => {
    mockUseEquipment.mockReturnValue({
      equipment: [
        { id: 1, name: 'Squat Rack', category: 'Free Weights', location: 'A', quantity: 1, description: null },
      ] as any,
      filteredEquipment: [],
      categories: [],
      loading: false,
      error: null,
      refresh: jest.fn(async () => undefined),
    });

    const { result } = renderHook(() => useEquipmentMap());

    expect(mockUseEquipment).toHaveBeenCalled();

    expect(result.current.globalState).toBe('ready');
    expect(result.current.statuses['1']).toBe('free');
  });
});
