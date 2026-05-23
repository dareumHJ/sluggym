import {
  aggregateHourlyHeadcount,
  busiestHourlyWindow,
  hasHeadcountSamples,
  hourlyBucketsToPopularTimes,
} from '../src/lib/headcountHistory';

describe('headcount history aggregation', () => {
  it('aggregates normal hourly samples with average count and capacity', () => {
    const buckets = aggregateHourlyHeadcount([
      { count: 40, capacity: 150, sampled_at: '2026-05-20T09:10:00' },
      { count: 60, capacity: 150, sampled_at: '2026-05-20T09:40:00' },
      { count: 90, capacity: 180, sampled_at: '2026-05-20T18:00:00' },
    ]);

    expect(buckets[9]).toEqual({ hour: 9, averageCount: 50, sampleCount: 2, capacity: 150 });
    expect(buckets[18]).toEqual({ hour: 18, averageCount: 90, sampleCount: 1, capacity: 180 });
    expect(hourlyBucketsToPopularTimes(buckets)[9]).toBe(50);
    expect(busiestHourlyWindow(buckets)).toBe(18);
  });

  it('keeps sparse missing hours explicit as empty buckets', () => {
    const buckets = aggregateHourlyHeadcount([
      { count: 24, capacity: null, sampled_at: '2026-05-20T06:00:00' },
      { count: null, capacity: 150, sampled_at: '2026-05-20T07:00:00' },
      { count: 70, capacity: 150, sampled_at: null },
    ]);

    expect(buckets).toHaveLength(24);
    expect(buckets[6]).toEqual({ hour: 6, averageCount: 24, sampleCount: 1, capacity: null });
    expect(buckets[7]).toEqual({ hour: 7, averageCount: null, sampleCount: 0, capacity: null });
    expect(hasHeadcountSamples(buckets)).toBe(true);
  });

  it('returns deterministic empty buckets when there are no samples', () => {
    const buckets = aggregateHourlyHeadcount([]);

    expect(buckets).toHaveLength(24);
    expect(hasHeadcountSamples(buckets)).toBe(false);
    expect(hourlyBucketsToPopularTimes(buckets)).toEqual(Array(24).fill(0));
    expect(busiestHourlyWindow(buckets)).toBeNull();
  });
});
