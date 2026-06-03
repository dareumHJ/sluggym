import {
  aggregateHourlyHeadcount,
  busiestHourlyWindow,
  getGymLocalHour,
  getGymLocalWeekdayIndex,
  getGymLocalWeekdayName,
  getRecentSameWeekdayWindows,
  hasHeadcountSamples,
  hourlyBucketsToPopularTimes,
} from '../src/lib/headcountHistory';

describe('headcount history aggregation', () => {
  it('aggregates normal hourly samples with fixed gym capacity', () => {
    const buckets = aggregateHourlyHeadcount([
      { count: 40, capacity: 150, sampled_at: '2026-05-20T09:10:00-07:00' },
      { count: 60, capacity: 150, sampled_at: '2026-05-20T09:40:00-07:00' },
      { count: 90, capacity: 180, sampled_at: '2026-05-20T18:00:00-07:00' },
    ]);

    expect(buckets[9]).toEqual({ hour: 9, averageCount: 50, sampleCount: 2, capacity: 150 });
    expect(buckets[18]).toEqual({ hour: 18, averageCount: 90, sampleCount: 1, capacity: 150 });
    expect(hourlyBucketsToPopularTimes(buckets)[9]).toBe(50);
    expect(busiestHourlyWindow(buckets)).toBe(18);
  });

  it('keeps sparse missing hours explicit as empty buckets', () => {
    const buckets = aggregateHourlyHeadcount([
      { count: 24, capacity: null, sampled_at: '2026-05-20T06:00:00-07:00' },
      { count: null, capacity: 150, sampled_at: '2026-05-20T07:00:00-07:00' },
      { count: 70, capacity: 150, sampled_at: null },
    ]);

    expect(buckets).toHaveLength(24);
    expect(buckets[6]).toEqual({ hour: 6, averageCount: 24, sampleCount: 1, capacity: 150 });
    expect(buckets[7]).toEqual({ hour: 7, averageCount: null, sampleCount: 0, capacity: 150 });
    expect(hasHeadcountSamples(buckets)).toBe(true);
  });

  it('buckets UTC timestamptz samples by gym local Pacific hour', () => {
    const buckets = aggregateHourlyHeadcount([
      { count: 42, capacity: null, sampled_at: '2026-05-20T16:15:00Z' },
    ]);

    expect(buckets[9]).toEqual({ hour: 9, averageCount: 42, sampleCount: 1, capacity: 150 });
    expect(buckets[16]).toEqual({ hour: 16, averageCount: null, sampleCount: 0, capacity: 150 });
  });

  it('filters hourly samples to the requested gym local weekday', () => {
    const wednesday = getGymLocalWeekdayIndex(new Date('2026-05-20T16:00:00Z'));
    const buckets = aggregateHourlyHeadcount([
      { count: 40, capacity: null, sampled_at: '2026-05-20T16:00:00Z' },
      { count: 80, capacity: null, sampled_at: '2026-05-27T16:00:00Z' },
      { count: 100, capacity: null, sampled_at: '2026-05-21T16:00:00Z' },
    ], wednesday);

    expect(buckets[9]).toEqual({ hour: 9, averageCount: 60, sampleCount: 2, capacity: 150 });
  });

  it('returns the current gym local hour from a timestamp', () => {
    expect(getGymLocalHour(new Date('2026-05-20T16:15:00Z'))).toBe(9);
  });

  it('returns the gym local weekday name from a timestamp', () => {
    expect(getGymLocalWeekdayName(new Date('2026-05-20T16:15:00Z'))).toBe('Wednesday');
  });

  it('builds previous same-weekday Pacific day windows', () => {
    const windows = getRecentSameWeekdayWindows(new Date('2026-05-20T17:00:00Z'), 2);

    expect(windows).toEqual([
      { startIso: '2026-05-13T07:00:00.000Z', endIso: '2026-05-14T07:00:00.000Z' },
      { startIso: '2026-05-06T07:00:00.000Z', endIso: '2026-05-07T07:00:00.000Z' },
    ]);
  });

  it('returns deterministic empty buckets when there are no samples', () => {
    const buckets = aggregateHourlyHeadcount([]);

    expect(buckets).toHaveLength(24);
    expect(hasHeadcountSamples(buckets)).toBe(false);
    expect(hourlyBucketsToPopularTimes(buckets)).toEqual(Array(24).fill(0));
    expect(busiestHourlyWindow(buckets)).toBeNull();
  });
});
