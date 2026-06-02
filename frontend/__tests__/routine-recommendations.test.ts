// __tests__/routine-recommendations.test.ts
// Unit tests for the pure scoring algorithm.

import {
  buildBuckets,
  bucketKeyForTimestamp,
  buildRoutineRecommendations,
  groupEquipmentSamples,
  groupHeadcountSamples,
  IHRSA_BASELINE_AVAILABILITY,
  pickBestBucketForRoutine,
  scoreRoutineBucket,
  tier1EquipmentAvailability,
  tier2HeadcountAvailability,
  tier3BaselineAvailability,
  toUITimeRecommendations,
  type EquipmentAvailabilitySample,
  type HeadcountSample,
  type RoutineInput,
} from '../src/lib/routineRecommendations';

// Note: bucketKeyForTimestamp uses local time (Date.getHours/getDay).
// Tests construct samples with Date objects so they're robust to the
// test runner's timezone.

function isoAt(year: number, month: number, day: number, hour: number): string {
  // Build a local-time date, then output ISO so the algorithm can read it back.
  return new Date(year, month - 1, day, hour, 0, 0).toISOString();
}

function dayOfWeek(year: number, month: number, day: number): number {
  const jsDay = new Date(year, month - 1, day).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

describe('buildBuckets', () => {
  it('produces 42 buckets (7 days × 6 hour blocks)', () => {
    const buckets = buildBuckets();
    expect(buckets).toHaveLength(42);
  });

  it('covers every hour block for every day', () => {
    const buckets = buildBuckets();
    const labels = new Set(buckets.map((b) => `${b.dayIndex}:${b.hourLabel}`));
    expect(labels.size).toBe(42);
  });
});

describe('bucketKeyForTimestamp', () => {
  it('maps timestamps in the 9-12 block to the 9a bucket', () => {
    // Wed 2026-05-13 10:30 → Wed (dayIndex=2), 9a
    const key = bucketKeyForTimestamp(isoAt(2026, 5, 13, 10));
    const expectedDay = dayOfWeek(2026, 5, 13);
    expect(key).toBe(`${expectedDay}:9a`);
  });

  it('maps timestamps in the 18-21 block to the 6p bucket', () => {
    const key = bucketKeyForTimestamp(isoAt(2026, 5, 13, 19));
    const expectedDay = dayOfWeek(2026, 5, 13);
    expect(key).toBe(`${expectedDay}:6p`);
  });

  it('returns null for timestamps outside any block (e.g. 3am)', () => {
    expect(bucketKeyForTimestamp(isoAt(2026, 5, 13, 3))).toBeNull();
  });
});

describe('tier1EquipmentAvailability', () => {
  it('averages available_count/total_count across samples in the bucket', () => {
    const samples: EquipmentAvailabilitySample[] = [
      { equipment_name: 'Bench Press', available_count: 2, total_count: 4, sampled_at: isoAt(2026, 5, 13, 10) },
      { equipment_name: 'Bench Press', available_count: 4, total_count: 4, sampled_at: isoAt(2026, 5, 13, 11) },
    ];
    const grouped = groupEquipmentSamples(samples);
    const buckets = buildBuckets();
    const wedNineAm = buckets.find((b) => b.dayIndex === dayOfWeek(2026, 5, 13) && b.hourLabel === '9a')!;

    const avail = tier1EquipmentAvailability('Bench Press', wedNineAm, grouped);
    expect(avail).toBeCloseTo(0.75); // (0.5 + 1.0) / 2
  });

  it('returns null when there are no samples for that bucket', () => {
    const grouped = groupEquipmentSamples([]);
    const buckets = buildBuckets();
    expect(tier1EquipmentAvailability('Bench Press', buckets[0], grouped)).toBeNull();
  });

  it('skips samples with total_count = 0', () => {
    const samples: EquipmentAvailabilitySample[] = [
      { equipment_name: 'Bench Press', available_count: 0, total_count: 0, sampled_at: isoAt(2026, 5, 13, 10) },
    ];
    const grouped = groupEquipmentSamples(samples);
    const buckets = buildBuckets();
    const wedNineAm = buckets.find((b) => b.dayIndex === dayOfWeek(2026, 5, 13) && b.hourLabel === '9a')!;
    expect(tier1EquipmentAvailability('Bench Press', wedNineAm, grouped)).toBeNull();
  });
});

describe('tier2HeadcountAvailability', () => {
  it('converts mean headcount to availability using max as capacity proxy', () => {
    const samples: HeadcountSample[] = [
      { count: 50, sampled_at: isoAt(2026, 5, 13, 10) },
      { count: 100, sampled_at: isoAt(2026, 5, 14, 19) }, // sets the max
    ];
    const { byBucket, maxObservedCount } = groupHeadcountSamples(samples);
    const buckets = buildBuckets();
    const wedNineAm = buckets.find((b) => b.dayIndex === dayOfWeek(2026, 5, 13) && b.hourLabel === '9a')!;

    const avail = tier2HeadcountAvailability(wedNineAm, byBucket, maxObservedCount);
    // 1 - 50/100 = 0.5
    expect(avail).toBeCloseTo(0.5);
  });

  it('returns null when there are no headcount samples for the bucket', () => {
    const { byBucket, maxObservedCount } = groupHeadcountSamples([]);
    const buckets = buildBuckets();
    expect(tier2HeadcountAvailability(buckets[0], byBucket, maxObservedCount)).toBeNull();
  });
});

describe('tier3BaselineAvailability', () => {
  it('returns the documented IHRSA baseline per hour block', () => {
    const buckets = buildBuckets();
    const sixPm = buckets.find((b) => b.hourLabel === '6p')!;
    expect(tier3BaselineAvailability(sixPm)).toBe(IHRSA_BASELINE_AVAILABILITY['6p']);

    const sixAm = buckets.find((b) => b.hourLabel === '6a')!;
    expect(tier3BaselineAvailability(sixAm)).toBe(IHRSA_BASELINE_AVAILABILITY['6a']);
  });
});

describe('scoreRoutineBucket', () => {
  it('applies the bottleneck penalty (Score = MeanAvail × (0.5 + 0.5 × MinAvail))', () => {
    // One equipment fully free (1.0), one fully occupied (0.0)
    const samples: EquipmentAvailabilitySample[] = [
      { equipment_name: 'Bench Press', available_count: 4, total_count: 4, sampled_at: isoAt(2026, 5, 13, 10) },
      { equipment_name: 'Cable Cross', available_count: 0, total_count: 4, sampled_at: isoAt(2026, 5, 13, 10) },
    ];
    const equipmentGrouped = groupEquipmentSamples(samples);
    const { byBucket: headcountByBucket, maxObservedCount } = groupHeadcountSamples([]);

    const buckets = buildBuckets();
    const wedNineAm = buckets.find((b) => b.dayIndex === dayOfWeek(2026, 5, 13) && b.hourLabel === '9a')!;

    const routine: RoutineInput = {
      routineId: 'r-1',
      routineName: 'Push day',
      targetMuscles: ['chest'],
      equipmentNames: ['Bench Press', 'Cable Cross'],
      lastUsedAt: null,
    };

    const result = scoreRoutineBucket(routine, wedNineAm, equipmentGrouped, headcountByBucket, maxObservedCount);

    // MeanAvail = (1.0 + 0.0) / 2 = 0.5
    // MinAvail  = 0.0
    // Score     = 0.5 * (0.5 + 0.5 * 0.0) = 0.25
    expect(result.score).toBeCloseTo(0.25);
    expect(result.bottleneckEquipment).toBe('Cable Cross');
  });

  it('returns score 0 when the routine has no equipment names', () => {
    const buckets = buildBuckets();
    const result = scoreRoutineBucket(
      { routineId: 'r-1', routineName: 'Empty', targetMuscles: [], equipmentNames: [], lastUsedAt: null },
      buckets[0],
      new Map(),
      new Map(),
      0,
    );
    expect(result.score).toBe(0);
  });

  it('falls through to headcount and reports the fallback tier', () => {
    // No equipment samples; use headcount tier
    const headcountSamples: HeadcountSample[] = [
      { count: 10, sampled_at: isoAt(2026, 5, 13, 10) },
      { count: 100, sampled_at: isoAt(2026, 5, 14, 19) },
    ];
    const { byBucket, maxObservedCount } = groupHeadcountSamples(headcountSamples);

    const buckets = buildBuckets();
    const wedNineAm = buckets.find((b) => b.dayIndex === dayOfWeek(2026, 5, 13) && b.hourLabel === '9a')!;

    const result = scoreRoutineBucket(
      {
        routineId: 'r-1',
        routineName: 'Push day',
        targetMuscles: [],
        equipmentNames: ['Bench Press'],
        lastUsedAt: null,
      },
      wedNineAm,
      new Map(),
      byBucket,
      maxObservedCount,
    );

    expect(result.fallbackTier).toBe('headcount');
    // 1 - 10/100 = 0.9 mean, min same since one equipment, score = 0.9 * (0.5 + 0.5*0.9) = 0.9*0.95 = 0.855
    expect(result.score).toBeCloseTo(0.855);
  });

  it('falls through to IHRSA baseline when there is no historical data at all', () => {
    const buckets = buildBuckets();
    const sixAm = buckets.find((b) => b.hourLabel === '6a')!;

    const result = scoreRoutineBucket(
      {
        routineId: 'r-1',
        routineName: 'Push day',
        targetMuscles: [],
        equipmentNames: ['Bench Press'],
        lastUsedAt: null,
      },
      sixAm,
      new Map(),
      new Map(),
      0,
    );

    expect(result.fallbackTier).toBe('baseline');
    // baseline = 0.8 mean=0.8 min=0.8 score = 0.8 * (0.5 + 0.5*0.8) = 0.72
    expect(result.score).toBeCloseTo(0.72);
  });
});

describe('buildRoutineRecommendations', () => {
  it('returns top-N routines sorted by score desc', () => {
    // routine-1: Push day, equipment fully available all the time
    // routine-2: Leg day, equipment heavily occupied
    const samples: EquipmentAvailabilitySample[] = [
      // 6a Wed is the best slot for everyone in this fixture
      { equipment_name: 'Bench Press', available_count: 4, total_count: 4, sampled_at: isoAt(2026, 5, 13, 7) },
      { equipment_name: 'Leg Press', available_count: 1, total_count: 4, sampled_at: isoAt(2026, 5, 13, 7) },
    ];

    const routines: RoutineInput[] = [
      {
        routineId: 'r-push',
        routineName: 'Push day',
        targetMuscles: ['chest'],
        equipmentNames: ['Bench Press'],
        lastUsedAt: null,
      },
      {
        routineId: 'r-leg',
        routineName: 'Leg day',
        targetMuscles: ['quads'],
        equipmentNames: ['Leg Press'],
        lastUsedAt: null,
      },
    ];

    const recs = buildRoutineRecommendations(routines, samples, [], 3);
    expect(recs).toHaveLength(2);
    expect(recs[0].routineName).toBe('Push day');
    expect(recs[0].score).toBeGreaterThan(recs[1].score);
  });

  it('filters out routines with no equipment names', () => {
    const routines: RoutineInput[] = [
      {
        routineId: 'r-empty',
        routineName: 'No history',
        targetMuscles: [],
        equipmentNames: [],
        lastUsedAt: null,
      },
    ];

    const recs = buildRoutineRecommendations(routines, [], [], 3);
    expect(recs).toHaveLength(0);
  });

  it('respects the topN parameter', () => {
    const routines: RoutineInput[] = ['a', 'b', 'c', 'd', 'e'].map((id) => ({
      routineId: id,
      routineName: `Routine ${id}`,
      targetMuscles: [],
      equipmentNames: ['Bench Press'],
      lastUsedAt: null,
    }));

    const recs = buildRoutineRecommendations(routines, [], [], 2);
    expect(recs).toHaveLength(2);
  });

  it('ties broken by most-recent last_used_at', () => {
    const routines: RoutineInput[] = [
      {
        routineId: 'older',
        routineName: 'Older',
        targetMuscles: [],
        equipmentNames: ['Bench Press'],
        lastUsedAt: '2026-05-01T00:00:00Z',
      },
      {
        routineId: 'newer',
        routineName: 'Newer',
        targetMuscles: [],
        equipmentNames: ['Bench Press'],
        lastUsedAt: '2026-05-20T00:00:00Z',
      },
    ];

    const recs = buildRoutineRecommendations(routines, [], [], 3);
    // Both should tie on baseline score, newer wins
    expect(recs[0].routineName).toBe('Newer');
  });
});

describe('toUITimeRecommendations', () => {
  it('maps congestion based on score thresholds', () => {
    const recs = toUITimeRecommendations([
      {
        routineId: 'r-1',
        routineName: 'Push day',
        targetMuscles: [],
        optimalDay: 'Wed',
        optimalHourLabel: '9a',
        startHour: 9,
        endHour: 12,
        score: 75,
        bottleneckEquipment: 'Bench Press',
        fallbackTier: 'equipment',
      },
      {
        routineId: 'r-2',
        routineName: 'Leg day',
        targetMuscles: [],
        optimalDay: 'Mon',
        optimalHourLabel: '6p',
        startHour: 18,
        endHour: 21,
        score: 30,
        bottleneckEquipment: 'Leg Press',
        fallbackTier: 'baseline',
      },
    ]);

    expect(recs[0].congestion).toBe('low');
    expect(recs[0].confidence).toBe(75);
    expect(recs[0].label).toMatch(/Best for/);

    expect(recs[1].congestion).toBe('high');
    expect(recs[1].label).toMatch(/Also good/);
  });

  it('formats time ranges in 12-hour clock', () => {
    const [rec] = toUITimeRecommendations([
      {
        routineId: 'r-1',
        routineName: 'Push day',
        targetMuscles: [],
        optimalDay: 'Wed',
        optimalHourLabel: '9a',
        startHour: 9,
        endHour: 12,
        score: 75,
        bottleneckEquipment: 'Bench Press',
        fallbackTier: 'equipment',
      },
    ]);

    expect(rec.timeRange).toBe('Wed 9:00 AM–12:00 PM');
  });

  it('mentions the fallback tier in the reason text', () => {
    const [rec] = toUITimeRecommendations([
      {
        routineId: 'r-1',
        routineName: 'Push day',
        targetMuscles: [],
        optimalDay: 'Wed',
        optimalHourLabel: '9a',
        startHour: 9,
        endHour: 12,
        score: 65,
        bottleneckEquipment: 'Bench Press',
        fallbackTier: 'baseline',
      },
    ]);

    expect(rec.reason).toMatch(/baseline/i);
    expect(rec.reason).toMatch(/Bench Press/);
  });
});
