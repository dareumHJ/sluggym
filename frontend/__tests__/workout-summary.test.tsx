import React from 'react';
import { render, screen } from '@testing-library/react-native';
import WorkoutSummaryScreen from '../app/workout-summary';

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  router: { replace: mockReplace, push: mockPush },
  useLocalSearchParams: () => ({
    durationSec: '3720',
    exerciseCount: '3',
    sets: '8',
    volume: '4250',
  }),
}));

describe('WorkoutSummaryScreen', () => {
  it('renders the saved workout summary metrics', () => {
    render(<WorkoutSummaryScreen />);

    expect(screen.getByText('Workout saved')).toBeTruthy();
    expect(screen.getByText('Nice session.')).toBeTruthy();
    expect(screen.getByText('62:00')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('4,250')).toBeTruthy();
  });
});
