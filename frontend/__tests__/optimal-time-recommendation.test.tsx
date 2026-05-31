import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  OptimalTimeRecommendation,
  type TimeRecommendation,
} from '../src/components/OptimalTimeRecommendation';

const sampleRecommendations: TimeRecommendation[] = [
  {
    id: 'r-push',
    label: 'Best for Push day',
    timeRange: 'Wed 9:00 AM–12:00 PM',
    congestion: 'low',
    confidence: 82,
    reason: 'Based on your equipment availability history. Watch out for Bench Press.',
  },
  {
    id: 'r-leg',
    label: 'Also good: Leg day',
    timeRange: 'Mon 6:00 AM–9:00 AM',
    congestion: 'moderate',
    confidence: 68,
    reason: 'Equipment data limited — using gym headcount history.',
  },
];

describe('OptimalTimeRecommendation', () => {
  it('renders the provided recommendations as the top pick', () => {
    render(<OptimalTimeRecommendation recommendations={sampleRecommendations} />);

    expect(screen.getByText('Optimal Time Recommendation')).toBeTruthy();
    expect(screen.getByText('Best for Push day')).toBeTruthy();
    expect(screen.getAllByText('Wed 9:00 AM–12:00 PM').length).toBeGreaterThan(0);
    expect(screen.getByText('82%')).toBeTruthy();
    expect(screen.getByText('Low crowd')).toBeTruthy();
    expect(screen.getByText('Moderate')).toBeTruthy();
  });

  it('renders a loading state', () => {
    render(<OptimalTimeRecommendation loading />);

    expect(screen.getByText('Loading recommendations…')).toBeTruthy();
  });

  it('renders an error state with retry', () => {
    const onRefresh = jest.fn();
    render(
      <OptimalTimeRecommendation
        error="Unable to load recommendation data."
        onRefresh={onRefresh}
      />,
    );

    expect(screen.getByText('Recommendation unavailable')).toBeTruthy();
    expect(screen.getByText('Unable to load recommendation data.')).toBeTruthy();

    fireEvent.press(screen.getByText('Try again'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renders the empty state with the default copy when no recommendations exist', () => {
    render(<OptimalTimeRecommendation />);

    expect(screen.getByText('No recommendation available yet')).toBeTruthy();
    expect(
      screen.getByText('Log your first session to receive smart time recommendations.'),
    ).toBeTruthy();
  });

  it('uses the provided emptyHint copy when supplied', () => {
    render(
      <OptimalTimeRecommendation
        recommendations={[]}
        emptyHint="Create a routine and log at least one workout to unlock smart time recommendations."
      />,
    );

    expect(
      screen.getByText(
        'Create a routine and log at least one workout to unlock smart time recommendations.',
      ),
    ).toBeTruthy();
  });

  it('calls refresh when the Refresh action is pressed', () => {
    const onRefresh = jest.fn();
    render(
      <OptimalTimeRecommendation
        recommendations={sampleRecommendations}
        onRefresh={onRefresh}
      />,
    );

    fireEvent.press(screen.getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('does not depend on any internal mock data when no props are passed', () => {
    // Sanity guard: the component used to default to MOCK_TIME_RECOMMENDATIONS.
    // After the refactor, calling with no props must NOT render mock copy.
    render(<OptimalTimeRecommendation />);

    expect(screen.queryByText('Best overall')).toBeNull();
    expect(screen.queryByText('9:00–10:30 AM')).toBeNull();
  });
});
