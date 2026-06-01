import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import SearchScreen from '../app/(tabs)/search';
import { useEquipment } from '../src/hooks/useEquipment';
import { useExerciseCatalog } from '../src/hooks/useExerciseCatalog';

jest.mock('../src/hooks/useEquipment', () => ({
  useEquipment: jest.fn(),
}));
jest.mock('../src/hooks/useExerciseCatalog', () => ({
  useExerciseCatalog: jest.fn(),
}));

const mockUseEquipment = useEquipment as jest.MockedFunction<typeof useEquipment>;
const mockUseExerciseCatalog = useExerciseCatalog as jest.MockedFunction<typeof useExerciseCatalog>;
type EquipmentHookReturn = ReturnType<typeof useEquipment>;
type ExerciseCatalogHookReturn = ReturnType<typeof useExerciseCatalog>;

function setupMocks(overrides: { equipment?: Partial<EquipmentHookReturn>; exercises?: Partial<ExerciseCatalogHookReturn> } = {}) {
  mockUseEquipment.mockReturnValue({
    equipment: [
      {
        id: 'eq-1',
        name: 'Bench Press',
        category: 'Free Weights',
        location: '2nd floor',
        quantity: 2,
        description: 'Flat bench station',
      },
    ],
    filteredEquipment: [
      {
        id: 'eq-1',
        name: 'Bench Press',
        category: 'Free Weights',
        location: '2nd floor',
        quantity: 2,
        description: 'Flat bench station',
      },
    ],
    categories: ['All', 'Free Weights'],
    loading: false,
    error: null,
    connectionState: 'live',
    refresh: jest.fn(async () => undefined),
    simulateRealtimeDisconnect: jest.fn(),
    ...overrides.equipment,
  });

  mockUseExerciseCatalog.mockReturnValue({
    exercises: [
      {
        id: 'ex-1',
        name: 'Barbell Squat',
        category: 'strength',
        level: 'beginner',
        equipmentOptions: [],
        exerciseType: 'Barbell',
        targetMuscle: 'Quads',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['glutes'],
      },
    ],
    filteredExercises: [
      {
        id: 'ex-1',
        name: 'Barbell Squat',
        category: 'strength',
        level: 'beginner',
        equipmentOptions: [],
        exerciseType: 'Barbell',
        targetMuscle: 'Quads',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['glutes'],
      },
    ],
    equipmentOptions: ['All', 'barbell'],
    muscleOptions: ['All', 'Quads', 'quadriceps', 'glutes'],
    levelOptions: ['All', 'beginner'],
    loading: false,
    error: null,
    refresh: jest.fn(async () => undefined),
    ...overrides.exercises,
  });
}

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('renders equipment results by default', () => {
    render(<SearchScreen />);

    expect(screen.getByText('Search Equipment')).toBeTruthy();
    expect(screen.getByText('Bench Press')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('available')).toBeTruthy();
    expect(screen.getByText('1 visible · 1 live rows')).toBeTruthy();
  });

  it('switches to exercise filtering mode', () => {
    render(<SearchScreen />);

    fireEvent.press(screen.getByText('Exercises'));

    expect(screen.getByText('Find Exercises')).toBeTruthy();
    expect(screen.getAllByText('Equipment').length).toBeGreaterThan(0);
    expect(screen.getByText('Muscle')).toBeTruthy();
    expect(screen.getByText('Level')).toBeTruthy();
    expect(screen.getByText('Barbell Squat')).toBeTruthy();
    expect(screen.getByText('1 of 1 exercises')).toBeTruthy();
  });

  it('instantly updates UI when hook state changes due to realtime event', () => {
    const { rerender } = render(<SearchScreen />);
    
    // Initial render shows 2 available
    expect(screen.getByText('2')).toBeTruthy();

    // Simulate Realtime websocket updating the hook state
    mockUseEquipment.mockReturnValue({
      equipment: [
        {
          id: 'eq-1',
          name: 'Bench Press',
          category: 'Free Weights',
          location: '2nd floor',
          quantity: 1, // <--- COUNT DROPS
          description: 'Flat bench station',
        },
      ],
      filteredEquipment: [
        {
          id: 'eq-1',
          name: 'Bench Press',
          category: 'Free Weights',
          location: '2nd floor',
          quantity: 1, // <--- COUNT DROPS
          description: 'Flat bench station',
        },
      ],
      categories: ['All', 'Free Weights'],
      loading: false,
      error: null,
      connectionState: 'live',
      refresh: jest.fn(async () => undefined),
      simulateRealtimeDisconnect: jest.fn(),
    });

    // Re-render the component with the new hook state
    rerender(<SearchScreen />);

    // Verify UI immediately reflects the new quantity
    expect(screen.queryByText('2')).toBeNull();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('available')).toBeTruthy();
  });
  it('keeps stale equipment visible while showing realtime refresh errors', () => {
    const refresh = jest.fn(async () => undefined);
    setupMocks({
      equipment: {
        error: 'Realtime connection interrupted. Pulling latest equipment data…',
        refresh,
      },
    });

    render(<SearchScreen />);

    expect(screen.getByText('Using the last loaded data')).toBeTruthy();
    expect(screen.getByText('Realtime connection interrupted. Pulling latest equipment data…')).toBeTruthy();
    expect(screen.getByText('Bench Press')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();

    fireEvent.press(screen.getByText('Retry'));
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('shows realtime connection status for reconnecting equipment updates', () => {
    setupMocks({
      equipment: {
        connectionState: 'reconnecting',
      },
    });

    render(<SearchScreen />);

    expect(screen.getByText('Reconnecting live equipment updates…')).toBeTruthy();
  });
});
