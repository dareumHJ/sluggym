import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { OptimalTimeRecommendation } from '../src/components/OptimalTimeRecommendation';

describe('OptimalTimeRecommendation', () => {
  it('renders the UI-only best time recommendation preview', () => {
    render(<OptimalTimeRecommendation />);

    expect(screen.getByText('Optimal Time Recommendation')).toBeTruthy();
    expect(screen.getByText('Best overall')).toBeTruthy();
    expect(screen.getAllByText('9:00–10:30 AM').length).toBeGreaterThan(0);
    expect(screen.getByText('82%')).toBeTruthy();
    expect(screen.getByText('Low crowd')).toBeTruthy();
    expect(screen.getByText(/UI-only preview/)).toBeTruthy();
  });

  it('renders an empty state when scoring data has no recommendation', () => {
    render(<OptimalTimeRecommendation recommendations={[]} />);

    expect(screen.getByText('No recommendation available yet')).toBeTruthy();
    expect(screen.getByText('Once scoring data is connected, this card will show the best time to visit.')).toBeTruthy();
  });

  it('calls refresh when provided', () => {
    const onRefresh = jest.fn();
    render(<OptimalTimeRecommendation onRefresh={onRefresh} />);

    fireEvent.press(screen.getByText('Refresh'));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
