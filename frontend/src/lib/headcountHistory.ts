import { GYM_CAPACITY } from './gymCapacity';

export type HeadcountHistoryRow = {
  count: number | null;
  capacity?: number | null;
  sampled_at: string | null;
};

export type HourlyHeadcountBucket = {
  hour: number;
  averageCount: number | null;
  sampleCount: number;
  capacity: number | null;
};

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
export const GYM_TIME_ZONE = 'America/Los_Angeles';
const GYM_WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const GYM_WEEKDAY_SHORT_TO_INDEX = new Map([
  ['Sun', 0],
  ['Mon', 1],
  ['Tue', 2],
  ['Wed', 3],
  ['Thu', 4],
  ['Fri', 5],
  ['Sat', 6],
]);
type GymLocalDateParts = {
  year: number;
  month: number;
  day: number;
};

export type GymLocalDayWindow = {
  startIso: string;
  endIso: string;
};

function getGymDateTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: GYM_TIME_ZONE,
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function shiftCivilDate(parts: GymLocalDateParts, dayOffset: number): GymLocalDateParts {
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + dayOffset, 12));

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function gymLocalDateTimeToUtc(parts: GymLocalDateParts, hour = 0) {
  const utcGuessMs = Date.UTC(parts.year, parts.month - 1, parts.day, hour, 0, 0);
  const gymPartsAtGuess = getGymDateTimeParts(new Date(utcGuessMs));
  const gymAsUtcMs = Date.UTC(
    gymPartsAtGuess.year,
    gymPartsAtGuess.month - 1,
    gymPartsAtGuess.day,
    gymPartsAtGuess.hour,
    gymPartsAtGuess.minute,
    gymPartsAtGuess.second,
  );

  return new Date(utcGuessMs - (gymAsUtcMs - utcGuessMs));
}

export function getGymLocalDateParts(date: Date): GymLocalDateParts {
  const parts = getGymDateTimeParts(date);
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
  };
}

export function getRecentSameWeekdayWindows(targetDate: Date, weeks: number): GymLocalDayWindow[] {
  const targetLocalDate = getGymLocalDateParts(targetDate);
  const windowCount = Math.max(1, Math.floor(weeks));

  return Array.from({ length: windowCount }, (_, index) => {
    const startLocalDate = shiftCivilDate(targetLocalDate, -(index + 1) * 7);
    const endLocalDate = shiftCivilDate(startLocalDate, 1);

    return {
      startIso: gymLocalDateTimeToUtc(startLocalDate).toISOString(),
      endIso: gymLocalDateTimeToUtc(endLocalDate).toISOString(),
    };
  });
}

export function getGymLocalHour(sampledAt: Date) {
  try {
    const hour = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: GYM_TIME_ZONE,
    }).format(sampledAt);
    return Number.parseInt(hour, 10);
  } catch {
    return sampledAt.getUTCHours();
  }
}

export function getGymLocalWeekdayIndex(sampledAt: Date) {
  try {
    const weekday = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: GYM_TIME_ZONE,
    }).format(sampledAt);
    return GYM_WEEKDAY_SHORT_TO_INDEX.get(weekday) ?? sampledAt.getUTCDay();
  } catch {
    return sampledAt.getUTCDay();
  }
}

export function getGymLocalWeekdayName(sampledAt: Date) {
  return GYM_WEEKDAY_NAMES[getGymLocalWeekdayIndex(sampledAt)] ?? 'Today';
}

export function aggregateHourlyHeadcount(rows: HeadcountHistoryRow[], weekdayIndex?: number): HourlyHeadcountBucket[] {
  const buckets = HOURS.map((hour) => ({
    hour,
    totalCount: 0,
    sampleCount: 0,
  }));

  for (const row of rows) {
    if (typeof row.count !== 'number' || !row.sampled_at) continue;

    const sampledAt = new Date(row.sampled_at);
    if (Number.isNaN(sampledAt.getTime())) continue;
    if (weekdayIndex !== undefined && getGymLocalWeekdayIndex(sampledAt) !== weekdayIndex) continue;

    const bucket = buckets[getGymLocalHour(sampledAt)];
    bucket.totalCount += row.count;
    bucket.sampleCount += 1;
  }

  return buckets.map((bucket) => ({
    hour: bucket.hour,
    averageCount: bucket.sampleCount > 0 ? Math.round(bucket.totalCount / bucket.sampleCount) : null,
    sampleCount: bucket.sampleCount,
    capacity: GYM_CAPACITY,
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
