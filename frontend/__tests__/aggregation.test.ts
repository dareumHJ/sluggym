import { aggregateWeeklyCongestion } from '../src/lib/aggregation';

describe('aggregateWeeklyCongestion (SLU-143 / SLU-144)', () => {
  const capacity = 100; // 100 capacity makes the intensity % equal the raw count

  it('generates a full 7x6 matrix filled with nulls when given empty data', () => {
    const result = aggregateWeeklyCongestion([], capacity);

    // 7 days * 6 hour buckets = 42 cells
    expect(result.length).toBe(42);

    // Since there's no data, every intensity should be null
    expect(result.every(cell => cell.intensity === null)).toBe(true);

    // Order should strictly follow Mon -> Sun
    expect(result[0].day).toBe('Mon');
    expect(result[0].hourLabel).toBe('6a');
  });

  it('correctly bins data by day and time, and averages the counts', () => {
    const localData = [
      { timestamp: '2023-10-16T06:00:00', count: 50 }, // 50% intensity
      { timestamp: '2023-10-16T07:30:00', count: 70 }, // 70% intensity -> Average = 60%

      { timestamp: '2023-10-16T10:00:00', count: 85 }  // 85% intensity
    ];

    const result = aggregateWeeklyCongestion(localData, capacity);

    const mon6a = result.find(c => c.day === 'Mon' && c.hourLabel === '6a');
    expect(mon6a?.intensity).toBe(60);

    const mon9a = result.find(c => c.day === 'Mon' && c.hourLabel === '9a');
    expect(mon9a?.intensity).toBe(85);

    // Unpopulated cell should safely return null
    const mon12p = result.find(c => c.day === 'Mon' && c.hourLabel === '12p');
    expect(mon12p?.intensity).toBe(null);
  });

  it('safely ignores after-hours data (midnight to 5am)', () => {
    const localData = [
      { timestamp: '2023-10-16T03:00:00', count: 50 },
      { timestamp: '2023-10-16T05:59:59', count: 50 }
    ];

    const result = aggregateWeeklyCongestion(localData, capacity);

    // Everything should remain null because the gym is closed
    expect(result.every(cell => cell.intensity === null)).toBe(true);
  });

  it('clamps intensities over 100% back to 100%', () => {
    const localData = [
      { timestamp: '2023-10-16T12:00:00', count: 150 } // 150 / 100 capacity = 150%
    ];

    const result = aggregateWeeklyCongestion(localData, capacity);
    const mon12p = result.find(c => c.day === 'Mon' && c.hourLabel === '12p');

    expect(mon12p?.intensity).toBe(100);
  });
});
