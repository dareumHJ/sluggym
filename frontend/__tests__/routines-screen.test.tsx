import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import RoutinesScreen from '../app/routines';
import { useExerciseCatalog } from '../src/hooks/useExerciseCatalog';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));

jest.mock('../src/hooks/useExerciseCatalog', () => ({
  useExerciseCatalog: jest.fn(),
}));

const mockUseExerciseCatalog = useExerciseCatalog as jest.MockedFunction<typeof useExerciseCatalog>;

describe('RoutinesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExerciseCatalog.mockReturnValue({
      exercises: [
        {
          id: 'ex-1',
          name: 'Barbell Squat',
          category: 'strength',
          level: 'beginner',
          equipmentRequired: 'barbell',
          exerciseType: 'Barbell',
          targetMuscle: 'quads',
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
          equipmentRequired: 'barbell',
          exerciseType: 'Barbell',
          targetMuscle: 'quads',
          primaryMuscles: ['quadriceps'],
          secondaryMuscles: ['glutes'],
        },
      ],
      equipmentOptions: ['All', 'barbell'],
      muscleOptions: ['All', 'quads'],
      levelOptions: ['All', 'beginner'],
      loading: false,
      error: null,
      refresh: jest.fn(async () => undefined),
    });
  });

  it('builds a routine draft from live catalog exercises', () => {
    render(<RoutinesScreen />);

    expect(screen.getByText('Routine Builder')).toBeTruthy();
    expect(screen.getByText('No exercises added yet')).toBeTruthy();

    fireEvent.press(screen.getByText('Barbell Squat'));

    expect(screen.getByText('1. Barbell Squat')).toBeTruthy();
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);

    fireEvent.press(screen.getByText('+ Add set'));
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);

    fireEvent.press(screen.getByText('Save routine draft'));
    expect(screen.getByText('Routine draft ready. Persistence can connect once the saved-routine schema is finalized.')).toBeTruthy();
  });

  it('requires at least one exercise before saving', () => {
    render(<RoutinesScreen />);

    fireEvent.press(screen.getByText('Save routine draft'));

    expect(screen.getByText('Add at least one exercise to this routine.')).toBeTruthy();
  });
});
