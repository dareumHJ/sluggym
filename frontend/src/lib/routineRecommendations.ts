// src/lib/routineRecommendations.ts
// Pure scoring logic for the routine time recommendation feature.
// Implements RECOMMENDATION-LOGIC.md:
//   - 42 weekly buckets (7 days x 6 three-hour blocks)
//   - Bottleneck-penalised score: MeanAvail * (0.5 + 0.5 * MinAvail)
//   - 3-tier sparse-data fallback: equipment -> headcount -> IHRSA baseline
//
// All inputs are plain data so this module is straightforward to unit-test
// without Supabase or React.

export type DayLabel = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type HourLabel = '6a' | '9a' | '12p' | '3p' | '6p' | '9p';

export interface TimeBucket {
  /** ISO day of week, where Mon = 0 ... Sun = 6 */
  dayIndex: number;
  /** ISO hour label (matches RECOMMENDATION-LOGIC.md) */
  hourLabel: HourLabel;
  /** Start hour (local time, 24h) of this 3-hour block */
  startHour: number;
  /** End hour (exclusive) */
  endHour: number;
  /** Human readable day name */
  dayLabel: DayLabel;
}

export interface EquipmentAvailabilitySample {
  equipment_name: string;
  available_count: number;
  total_count: number;
  sampled_at: string; // ISO timestamp
}

export interface HeadcountSample {
  count: number;
  sampled_at: string; // ISO timestamp
}

export interface RoutineInput {
  routineId: string;
  routineName: string;
  targetMuscles: string[];
  /**
   * Distinct equipment names required by this routine, derived from the
   * routine's most recent completed workout. Empty means the algorithm
   * cannot recommend a time for this routine.
   */
  equipmentNames: string[];
  /** When the routine was last used; used as a tiebreaker. */
  lastUsedAt: string | null;
}

export interface RoutineTimeRecommendation {
  routineId: string;
  routineName: string;
  targetMuscles: string[];
  optimalDay: DayLabel;
  optimalHourLabel: HourLabel;
  startHour: number;
  endHour: number;
  /** 0 - 100 (score * 100, rounded) */
  score: number;
  /** The equipment with the lowest availability in the chosen bucket. */
  bottleneckEquipment: string;
  /** Highest fallback tier the score depended on (lower = more confident). */
  fallbackTier: 'equipment' | 'headcount' | 'baseline';
}

export const DAY_LABELS: DayLabel[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const HOUR_BLOCKS: { hourLabel: HourLabel; startHour: number; endHour: number }[] = [
  { hourLabel: '6a', startHour: 6, endHour: 9 },
  { hourLabel: '9a', startHour: 9, endHour: 12 },
  { hourLabel: '12p', startHour: 12, endHour: 15 },
  { hourLabel: '3p', startHour: 15, endHour: 18 },
  { hourLabel: '6p', startHour: 18, endHour: 21 },
  { hourLabel: '9p', startHour: 21, endHour: 24 },
];

/**
 * IHRSA-style commercial gym traffic baseline for each hour block.
 * Values are availability (1 - busy_percentage), so higher = more open.
 * See RECOMMENDATION-LOGIC.md Section 4.2 for rationale.
 */
export const IHRSA_BASELINE_AVAILABILITY: Record<HourLabel, number> = {
  '6a': 0.80,
  '9a': 0.65,
  '12p': 0.50,
  '3p': 0.35,
  '6p': 0.15,
  '9p': 0.60,
};

/** Build the canonical list of 42 buckets. */
export function buildBuckets(): TimeBucket[] {
  const buckets: TimeBucket[] = [];
  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    for (const block of HOUR_BLOCKS) {
      buckets.push({
        dayIndex,
        hourLabel: block.hourLabel,
        startHour: block.startHour,
        endHour: block.endHour,
        dayLabel: DAY_LABELS[dayIndex],
      });
    }
  }
  return buckets;
}

/**
 * Convert an ISO timestamp to a bucket key based on the user's local time.
 * Returns null if the timestamp falls outside any 3-hour block (e.g. midnight-6am).
 */
export function bucketKeyForTimestamp(isoTimestamp: string): string | null {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return null;

  const localHour = date.getHours();
  const block = HOUR_BLOCKS.find((b) => localHour >= b.startHour && localHour < b.endHour);
  if (!block) return null;

  // Convert JS day (Sun=0..Sat=6) to ISO day (Mon=0..Sun=6)
  const jsDay = date.getDay();
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
  return `${dayIndex}:${block.hourLabel}`;
}

export function bucketKey(bucket: TimeBucket): string {
  return `${bucket.dayIndex}:${bucket.hourLabel}`;
}

/**
 * Group equipment samples by (equipment_name -> bucket_key -> samples).
 */
export function groupEquipmentSamples(
  samples: EquipmentAvailabilitySample[],
): Map<string, Map<string, EquipmentAvailabilitySample[]>> {
  const byEquipment = new Map<string, Map<string, EquipmentAvailabilitySample[]>>();

  for (const sample of samples) {
    const key = bucketKeyForTimestamp(sample.sampled_at);
    if (!key) continue;

    let perEquipment = byEquipment.get(sample.equipment_name);
    if (!perEquipment) {
      perEquipment = new Map();
      byEquipment.set(sample.equipment_name, perEquipment);
    }

    const bucketSamples = perEquipment.get(key);
    if (bucketSamples) {
      bucketSamples.push(sample);
    } else {
      perEquipment.set(key, [sample]);
    }
  }

  return byEquipment;
}

/**
 * Group headcount samples by bucket_key.
 * Stores normalised "occupancy ratio" via the supplied capacity proxy
 * (the largest observed count across the window).
 */
export function groupHeadcountSamples(
  samples: HeadcountSample[],
): { byBucket: Map<string, HeadcountSample[]>; maxObservedCount: number } {
  const byBucket = new Map<string, HeadcountSample[]>();
  let maxObservedCount = 0;

  for (const sample of samples) {
    const key = bucketKeyForTimestamp(sample.sampled_at);
    if (!key) continue;

    if (sample.count > maxObservedCount) maxObservedCount = sample.count;

    const bucketSamples = byBucket.get(key);
    if (bucketSamples) {
      bucketSamples.push(sample);
    } else {
      byBucket.set(key, [sample]);
    }
  }

  return { byBucket, maxObservedCount };
}

/**
 * Tier 1 — equipment-specific historical availability.
 * Returns null if no samples exist for this equipment in this bucket.
 */
export function tier1EquipmentAvailability(
  equipmentName: string,
  bucket: TimeBucket,
  grouped: Map<string, Map<string, EquipmentAvailabilitySample[]>>,
): number | null {
  const samples = grouped.get(equipmentName)?.get(bucketKey(bucket));
  if (!samples || samples.length === 0) return null;

  let sum = 0;
  let valid = 0;
  for (const sample of samples) {
    if (sample.total_count > 0) {
      sum += sample.available_count / sample.total_count;
      valid += 1;
    }
  }
  return valid > 0 ? sum / valid : null;
}

/**
 * Tier 2 — gym-wide headcount used as a proxy.
 * Availability = 1 - (mean_count / max_observed_count) for the bucket.
 * Returns null if no samples exist for this bucket.
 */
export function tier2HeadcountAvailability(
  bucket: TimeBucket,
  byBucket: Map<string, HeadcountSample[]>,
  maxObservedCount: number,
): number | null {
  const samples = byBucket.get(bucketKey(bucket));
  if (!samples || samples.length === 0 || maxObservedCount === 0) return null;

  const meanCount = samples.reduce((acc, s) => acc + s.count, 0) / samples.length;
  return Math.max(0, Math.min(1, 1 - meanCount / maxObservedCount));
}

/** Tier 3 — IHRSA baseline. Always defined. */
export function tier3BaselineAvailability(bucket: TimeBucket): number {
  return IHRSA_BASELINE_AVAILABILITY[bucket.hourLabel];
}

interface ResolvedAvailability {
  availability: number;
  tier: 'equipment' | 'headcount' | 'baseline';
}

/**
 * Resolve availability for one equipment item in one bucket, walking the
 * 3-tier fallback chain.
 */
export function resolveAvailability(
  equipmentName: string,
  bucket: TimeBucket,
  equipmentGrouped: Map<string, Map<string, EquipmentAvailabilitySample[]>>,
  headcountByBucket: Map<string, HeadcountSample[]>,
  maxObservedCount: number,
): ResolvedAvailability {
  const t1 = tier1EquipmentAvailability(equipmentName, bucket, equipmentGrouped);
  if (t1 !== null) return { availability: t1, tier: 'equipment' };

  const t2 = tier2HeadcountAvailability(bucket, headcountByBucket, maxObservedCount);
  if (t2 !== null) return { availability: t2, tier: 'headcount' };

  return { availability: tier3BaselineAvailability(bucket), tier: 'baseline' };
}

/**
 * Bottleneck-penalised score for a single routine in a single bucket.
 * Score = MeanAvail * (0.5 + 0.5 * MinAvail), per RECOMMENDATION-LOGIC.md.
 */
export function scoreRoutineBucket(
  routine: RoutineInput,
  bucket: TimeBucket,
  equipmentGrouped: Map<string, Map<string, EquipmentAvailabilitySample[]>>,
  headcountByBucket: Map<string, HeadcountSample[]>,
  maxObservedCount: number,
): { score: number; bottleneckEquipment: string; fallbackTier: ResolvedAvailability['tier'] } {
  if (routine.equipmentNames.length === 0) {
    return { score: 0, bottleneckEquipment: '', fallbackTier: 'baseline' };
  }

  let sum = 0;
  let minAvail = 1;
  let minEquipment = routine.equipmentNames[0];
  // Worst tier the score depended on (equipment < headcount < baseline)
  let worstTier: ResolvedAvailability['tier'] = 'equipment';
  const tierOrder = { equipment: 0, headcount: 1, baseline: 2 } as const;

  for (const equipmentName of routine.equipmentNames) {
    const resolved = resolveAvailability(
      equipmentName,
      bucket,
      equipmentGrouped,
      headcountByBucket,
      maxObservedCount,
    );
    sum += resolved.availability;
    if (resolved.availability < minAvail) {
      minAvail = resolved.availability;
      minEquipment = equipmentName;
    }
    if (tierOrder[resolved.tier] > tierOrder[worstTier]) {
      worstTier = resolved.tier;
    }
  }

  const meanAvail = sum / routine.equipmentNames.length;
  const score = meanAvail * (0.5 + 0.5 * minAvail);

  return { score, bottleneckEquipment: minEquipment, fallbackTier: worstTier };
}

/**
 * Find the best bucket for a single routine.
 * Tie-break by hour-label position (earlier in day wins) for determinism.
 */
export function pickBestBucketForRoutine(
  routine: RoutineInput,
  equipmentGrouped: Map<string, Map<string, EquipmentAvailabilitySample[]>>,
  headcountByBucket: Map<string, HeadcountSample[]>,
  maxObservedCount: number,
): RoutineTimeRecommendation | null {
  if (routine.equipmentNames.length === 0) return null;

  const buckets = buildBuckets();
  let best: {
    bucket: TimeBucket;
    score: number;
    bottleneckEquipment: string;
    fallbackTier: ResolvedAvailability['tier'];
  } | null = null;

  for (const bucket of buckets) {
    const { score, bottleneckEquipment, fallbackTier } = scoreRoutineBucket(
      routine,
      bucket,
      equipmentGrouped,
      headcountByBucket,
      maxObservedCount,
    );
    if (!best || score > best.score) {
      best = { bucket, score, bottleneckEquipment, fallbackTier };
    }
  }

  if (!best) return null;

  return {
    routineId: routine.routineId,
    routineName: routine.routineName,
    targetMuscles: routine.targetMuscles,
    optimalDay: best.bucket.dayLabel,
    optimalHourLabel: best.bucket.hourLabel,
    startHour: best.bucket.startHour,
    endHour: best.bucket.endHour,
    score: Math.round(best.score * 100),
    bottleneckEquipment: best.bottleneckEquipment,
    fallbackTier: best.fallbackTier,
  };
}

/**
 * Build top-N routine recommendations across all of the user's routines.
 * Routines with no equipment history are filtered out (per RECOMMENDATION-LOGIC.md
 * section 4.3 — "Log your first session to receive smart time recommendations").
 *
 * Tiebreaker: most recently used routine wins on equal score.
 */
export function buildRoutineRecommendations(
  routines: RoutineInput[],
  equipmentSamples: EquipmentAvailabilitySample[],
  headcountSamples: HeadcountSample[],
  topN = 3,
): RoutineTimeRecommendation[] {
  const equipmentGrouped = groupEquipmentSamples(equipmentSamples);
  const { byBucket: headcountByBucket, maxObservedCount } = groupHeadcountSamples(headcountSamples);

  const perRoutine = routines
    .filter((routine) => routine.equipmentNames.length > 0)
    .map((routine) => pickBestBucketForRoutine(routine, equipmentGrouped, headcountByBucket, maxObservedCount))
    .filter((rec): rec is RoutineTimeRecommendation => rec !== null);

  // Sort by score desc, then by last_used (more recent wins)
  perRoutine.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aRoutine = routines.find((r) => r.routineId === a.routineId);
    const bRoutine = routines.find((r) => r.routineId === b.routineId);
    const aLast = aRoutine?.lastUsedAt ?? '';
    const bLast = bRoutine?.lastUsedAt ?? '';
    return bLast.localeCompare(aLast);
  });

  return perRoutine.slice(0, topN);
}

// --- UI mapping helpers ----------------------------------------------------

function formatHourRange(startHour: number, endHour: number): string {
  const fmt = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };
  return `${fmt(startHour)}–${fmt(endHour === 24 ? 0 : endHour)}`;
}

export interface UITimeRecommendation {
  id: string;
  label: string;
  timeRange: string;
  congestion: 'low' | 'moderate' | 'high';
  confidence: number;
  reason: string;
}

/**
 * Convert algorithm output to the UI-friendly shape that the existing
 * `OptimalTimeRecommendation` component expects.
 */
export function toUITimeRecommendations(
  recommendations: RoutineTimeRecommendation[],
): UITimeRecommendation[] {
  return recommendations.map((rec, index) => {
    const ratio = rec.score / 100;
    const congestion: 'low' | 'moderate' | 'high' =
      ratio >= 0.6 ? 'low' : ratio >= 0.35 ? 'moderate' : 'high';

    const tierNote =
      rec.fallbackTier === 'equipment'
        ? 'Based on your equipment availability history.'
        : rec.fallbackTier === 'headcount'
          ? 'Equipment data limited — using gym headcount history.'
          : 'Using industry baseline while live data accumulates.';

    const bottleneckNote = rec.bottleneckEquipment
      ? ` Watch out for ${rec.bottleneckEquipment}.`
      : '';

    return {
      id: rec.routineId,
      label: index === 0 ? `Best for ${rec.routineName}` : `Also good: ${rec.routineName}`,
      timeRange: `${rec.optimalDay} ${formatHourRange(rec.startHour, rec.endHour)}`,
      congestion,
      confidence: rec.score,
      reason: `${tierNote}${bottleneckNote}`,
    };
  });
}
