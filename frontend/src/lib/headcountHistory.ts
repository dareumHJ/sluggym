export type HeadcountHistoryRow = {
  count: number | null;
  capacity: number | null;
  sampled_at: string | null;
};

export type HourlyHeadcountBucket = {
  hour: number;
  averageCount: number | null;
  sampleCount: number;
  capacity: number | null;
};

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

export function aggregateHourlyHeadcount(rows: HeadcountHistoryRow[]): HourlyHeadcountBucket[] {
  const buckets = HOURS.map((hour) => ({
    hour,
    totalCount: 0,
    sampleCount: 0,
    capacityTotal: 0,
    capacityCount: 0,
  }));

  for (const row of rows) {
    if (typeof row.count !== 'number' || !row.sampled_at) continue;

    const sampledAt = new Date(row.sampled_at);
    if (Number.isNaN(sampledAt.getTime())) continue;

    const bucket = buckets[sampledAt.getHours()];
    bucket.totalCount += row.count;
    bucket.sampleCount += 1;

    if (typeof row.capacity === 'number' && row.capacity > 0) {
      bucket.capacityTotal += row.capacity;
      bucket.capacityCount += 1;
    }
  }

  return buckets.map((bucket) => ({
    hour: bucket.hour,
    averageCount: bucket.sampleCount > 0 ? Math.round(bucket.totalCount / bucket.sampleCount) : null,
    sampleCount: bucket.sampleCount,
    capacity: bucket.capacityCount > 0 ? Math.round(bucket.capacityTotal / bucket.capacityCount) : null,
  }));
}

export function hourlyBucketsToPopularTimes(buckets: HourlyHeadcountBucket[]) {
  return buckets.map((bucket) => bucket.averageCount ?? 0);
}

export function hasHeadcountSamples(buckets: HourlyHeadcountBucket[]) {
  return buckets.some((bucket) => bucket.sampleCount > 0);
}

export function busiestHourlyWindow(buckets: HourlyHeadcountBucket[]) {
  const sampled = buckets.filter((bucket) => bucket.averageCount !== null);
  if (sampled.length === 0) return null;

  const busiest = sampled.reduce((best, bucket) => {
    if ((bucket.averageCount ?? 0) > (best.averageCount ?? 0)) return bucket;
    return best;
  }, sampled[0]);

  return busiest.hour;
}
