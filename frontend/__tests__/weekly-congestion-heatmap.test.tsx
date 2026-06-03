import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WeeklyCongestionHeatmap } from '../src/components/WeeklyCongestionHeatmap';
import { SPARSE_WEEKLY_CONGESTION, WEEKLY_CONGESTION } from '../src/data/mock';

describe('WeeklyCongestionHeatmap', () => {
  it('renders quiet-hour recommendations when enough data exists', () => {
    render(<WeeklyCongestionHeatmap data={[...WEEKLY_CONGESTION]} />);

    expect(screen.getByText('Weekly Congestion Heatmap')).toBeTruthy();
    expect(screen.getByText('Mon')).toBeTruthy();
    expect(screen.getByText('6a')).toBeTruthy();
    expect(screen.getByText('Quiet')).toBeTruthy();
    expect(screen.getByText('Busy')).toBeTruthy();
  });

  it('renders a safe fallback when data is too sparse', () => {
    render(<WeeklyCongestionHeatmap data={[...SPARSE_WEEKLY_CONGESTION]} />);

    expect(screen.getByText('Not enough weekly traffic data yet')).toBeTruthy();
    expect(screen.getByText('Sun')).toBeTruthy();
    expect(screen.getByText('9p')).toBeTruthy();
  });
});
