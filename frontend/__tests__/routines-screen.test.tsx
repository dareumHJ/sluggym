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

const benchPress = {
  id: 'ex-1',
  name: 'Barbell Bench Press - Medium Grip',
  category: 'strength',
  level: 'beginner',
  equipmentRequired: 'barbell',
  exerciseType: 'Barbell',
  targetMuscle: 'chest',
  primaryMuscles: ['chest'],
  secondaryMuscles: ['shoulders', 'triceps'],
};

describe('RoutinesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExerciseCatalog.mockReturnValue({
      exercises: [benchPress],
      filteredExercises: [benchPress],
      equipmentOptions: ['All', 'barbell'],
      muscleOptions: ['All', 'chest'],
      levelOptions: ['All', 'beginner'],
      loading: false,
      error: null,
      refresh: jest.fn(async () => undefined),
    });
  });

  it('builds a new routine draft from live catalog exercises', () => {
    render(<RoutinesScreen />);

    expect(screen.getByText('Routine Builder')).toBeTruthy();
    expect(screen.getByText('No exercises added yet')).toBeTruthy();

    fireEvent.press(screen.getByText('Barbell Bench Press - Medium Grip'));

    expect(screen.getByText('1. Barbell Bench Press - Medium Grip')).toBeTruthy();
    expect(screen.getByText('Flat Bench Rack')).toBeTruthy();
    expect(screen.getByText('Power Rack (squat Rack)')).toBeTruthy();
    expect(screen.getByText('Smith Machine')).toBeTruthy();
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);

    fireEvent.press(screen.getByText('+ Add set'));
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);

    fireEvent.press(screen.getByText('Save new routine'));
    expect(screen.getByText('New routine created.')).toBeTruthy();
  });

  it('loads and updates an existing routine draft', () => {
    render(<RoutinesScreen />);

    fireEvent.press(screen.getByText('Push day'));

    expect(screen.getByDisplayValue('Push day')).toBeTruthy();
    expect(screen.getByText('1. Barbell Bench Press - Medium Grip')).toBeTruthy();

    fireEvent.press(screen.getByText('Smith Machine'));
    fireEvent.press(screen.getByText('Update routine'));

    expect(screen.getByText('Existing routine updated.')).toBeTruthy();
  });

  it('requires at least one exercise before saving', () => {
    render(<RoutinesScreen />);

    fireEvent.press(screen.getByText('Save new routine'));

    expect(screen.getByText('Add at least one exercise to this routine.')).toBeTruthy();
  });
});
