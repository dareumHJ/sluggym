import type { WeeklyCongestionCell } from '../components/WeeklyCongestionHeatmap';

export type RawOccupancyRow = {
  timestamp: string; // ISO 8601 string
  count: number;
};

const HOUR_LABELS = ['6a', '9a', '12p', '3p', '6p', '9p'];
const DAYS_JS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Aggregates raw occupancy rows into a 7x6 matrix of WeeklyCongestionCells.
 * Rows are binned by day of the week and hour bucket.
 * 
 * @param data Array of raw timestamps and headcounts
 * @param capacity The maximum capacity of the gym to calculate intensity %
 */
export function aggregateWeeklyCongestion(
  data: RawOccupancyRow[],
  capacity: number
): WeeklyCongestionCell[] {
  const buckets: Record<string, { sum: number; count: number }> = {};

  for (const row of data) {
    const date = new Date(row.timestamp);
    if (Number.isNaN(date.getTime())) continue;

    const dayStr = DAYS_JS[date.getDay()];
    const hour = date.getHours();

    // Map hour to 3-hour buckets
    let bucketIdx = -1;
    if (hour >= 6 && hour < 9) bucketIdx = 0;
    else if (hour >= 9 && hour < 12) bucketIdx = 1;
    else if (hour >= 12 && hour < 15) bucketIdx = 2;
    else if (hour >= 15 && hour < 18) bucketIdx = 3;
    else if (hour >= 18 && hour < 21) bucketIdx = 4;
    else if (hour >= 21 && hour <= 23) bucketIdx = 5; // 9pm-midnight goes to '9p'
    // 0am to 5am are ignored since the gym is closed

    if (bucketIdx === -1) continue;

    const label = HOUR_LABELS[bucketIdx];
    const key = `${dayStr}-${label}`;

    if (!buckets[key]) {
      buckets[key] = { sum: 0, count: 0 };
    }
    buckets[key].sum += row.count;
    buckets[key].count += 1;
  }

  const result: WeeklyCongestionCell[] = [];

  for (const day of DEFAULT_DAY_ORDER) {
    for (const label of HOUR_LABELS) {
      const key = `${day}-${label}`;
      const stats = buckets[key];

      let intensity: number | null = null;
      if (stats && stats.count > 0) {
        const avg = stats.sum / stats.count;
        intensity = Math.round((avg / capacity) * 100);
        // Clamp to 0-100 just in case there was an anomaly
        intensity = Math.max(0, Math.min(100, intensity));
      }

      result.push({
        day,
        hourLabel: label,
        intensity
      });
    }
  }

  return result;
}
