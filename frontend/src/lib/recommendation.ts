export type RoutineEquipmentNeed = {
  routineId: string;
  routineName: string;
  targetMuscles: string[];
  equipmentNames: string[]; // unique list of equipment names used in the last session
  lastUsedAt: string | null;
};

export type EquipmentHistorySample = {
  equipment_name: string;
  available_count: number;
  total_count: number;
  sampled_at: string;
};

export type GymHeadcountSample = {
  count: number;
  capacity: number | null;
  sampled_at: string;
};

export interface RankedTimeWindow {
  day: string;
  hourLabel: string;
  score: number; // 0 to 100
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  bottleneckEquipment: string;
}

export interface RoutineTimeRecommendation {
  routineId: string;
  routineName: string;
  targetMuscles: string[];
  optimalDay: string;          // e.g., "Wed"
  optimalHourLabel: string;   // e.g., "9a"
  score: number;                // Score percentage (0 - 100)
  bottleneckEquipment: string; // The equipment name that limited the score
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

const DEFAULT_DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_HOUR_ORDER = ['6a', '9a', '12p', '3p', '6p', '9p'];
const DAYS_JS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Standard capacity fallback value
const DEFAULT_CAPACITY = 150;

// IHRSA (International Health, Racquet & Sportsclub Association) peak and off-peak hour patterns
// representing the baseline commercial fitness center occupancy profile.
const IHRSA_OCCUPANCY_BASELINE: Record<string, number> = {
  '6a': 0.20, // 20% busy (early morning peak starts)
  '9a': 0.35, // 35% busy (mid-morning taper)
  '12p': 0.50, // 50% busy (lunch hour peak)
  '3p': 0.65, // 65% busy (early afternoon build)
  '6p': 0.85, // 85% busy (post-work rush hour peak)
  '9p': 0.40, // 40% busy (late night cool down)
};

/**
 * Parses UTC timestamps into PDT/PST hours and day names.
 */
export function getPacificDayAndHour(timestamp: string): { day: string; hour: number } | null {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  try {
    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: 'America/Los_Angeles',
    });
    const hourFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'America/Los_Angeles',
    });

    const dayStr = dayFormatter.format(date);
    const hourStr = hourFormatter.format(date);
    const hour = parseInt(hourStr, 10);
    return { day: dayStr.substring(0, 3), hour };
  } catch {
    // Fallback if Intl is unsupported or fails in the runtime env
    const dayStr = DAYS_JS[date.getUTCDay()];
    const hour = date.getUTCHours();
    return { day: dayStr, hour };
  }
}

/**
 * Maps hour (0-23) to corresponding time bucket string.
 */
export function getHourLabel(hour: number): string | null {
  if (hour >= 6 && hour < 9) return '6a';
  if (hour >= 9 && hour < 12) return '9a';
  if (hour >= 12 && hour < 15) return '12p';
  if (hour >= 15 && hour < 18) return '3p';
  if (hour >= 18 && hour < 21) return '6p';
  if (hour >= 21 && hour <= 23) return '9p';
  return null;
}

/**
 * Computes ranked visit time recommendations for a single routine template.
 */
export function getOptimalTimesForRoutine(
  routine: RoutineEquipmentNeed,
  equipmentSamples: EquipmentHistorySample[],
  headcountSamples: GymHeadcountSample[]
): RankedTimeWindow[] {
  // If the routine has no logged equipment history, return low confidence informational slots
  if (routine.equipmentNames.length === 0) {
    return DEFAULT_DAY_ORDER.flatMap((day) =>
      DEFAULT_HOUR_ORDER.map((hourLabel) => ({
        day,
        hourLabel,
        score: Math.round((1.0 - IHRSA_OCCUPANCY_BASELINE[hourLabel]) * 100),
        confidence: 'low' as const,
        reason: 'No workout history logged yet; start a workout to get recommendations.',
        bottleneckEquipment: 'None',
      }))
    ).sort((a, b) => b.score - a.score);
  }

  // 1. Group equipment availability samples: Key = `equipment_name|day|hourLabel`
  const equipBuckets: Record<string, number[]> = {};
  for (const s of equipmentSamples) {
    const parsed = getPacificDayAndHour(s.sampled_at);
    if (!parsed) continue;

    const hourLabel = getHourLabel(parsed.hour);
    if (!hourLabel) continue;

    if (s.total_count <= 0) continue;

    const key = `${s.equipment_name}|${parsed.day}|${hourLabel}`;
    if (!equipBuckets[key]) {
      equipBuckets[key] = [];
    }
    equipBuckets[key].push(s.available_count / s.total_count);
  }

  // 2. Group overall gym headcount samples: Key = `day|hourLabel`
  const headcountBuckets: Record<string, number[]> = {};
  for (const s of headcountSamples) {
    const parsed = getPacificDayAndHour(s.sampled_at);
    if (!parsed) continue;

    const hourLabel = getHourLabel(parsed.hour);
    if (!hourLabel) continue;

    const capacity = s.capacity ?? DEFAULT_CAPACITY;
    if (capacity <= 0) continue;

    const key = `${parsed.day}|${hourLabel}`;
    if (!headcountBuckets[key]) {
      headcountBuckets[key] = [];
    }
    headcountBuckets[key].push(s.count / capacity);
  }

  // 3. Compute score for all 42 buckets
  const timeWindows: RankedTimeWindow[] = [];

  for (const day of DEFAULT_DAY_ORDER) {
    for (const hourLabel of DEFAULT_HOUR_ORDER) {
      const availabilities: number[] = [];
      let highConfidenceCount = 0;
      let mediumConfidenceCount = 0;

      let minAvailVal = 1.0;
      let bottleneckName = 'None';

      for (const equipName of routine.equipmentNames) {
        const key = `${equipName}|${day}|${hourLabel}`;
        const samples = equipBuckets[key];

        if (samples && samples.length > 0) {
          // Rule 1: We have equipment-specific samples
          const avg = samples.reduce((sum, val) => sum + val, 0) / samples.length;
          availabilities.push(avg);
          highConfidenceCount++;

          if (avg < minAvailVal) {
            minAvailVal = avg;
            bottleneckName = equipName;
          }
        } else {
          // Rule 2: Fall back to gym headcount history
          const hcKey = `${day}|${hourLabel}`;
          const hcSamples = headcountBuckets[hcKey];

          if (hcSamples && hcSamples.length > 0) {
            const avgOccupancy = hcSamples.reduce((sum, val) => sum + val, 0) / hcSamples.length;
            const estimatedAvail = Math.max(0.0, 1.0 - avgOccupancy);
            availabilities.push(estimatedAvail);
            mediumConfidenceCount++;

            if (estimatedAvail < minAvailVal) {
              minAvailVal = estimatedAvail;
              bottleneckName = `${equipName} (Estimated)`;
            }
          } else {
            // Rule 3: Fall back to IHRSA occupancy baseline
            const baselineBusy = IHRSA_OCCUPANCY_BASELINE[hourLabel] ?? 0.50;
            const estimatedAvail = 1.0 - baselineBusy;
            availabilities.push(estimatedAvail);

            if (estimatedAvail < minAvailVal) {
              minAvailVal = estimatedAvail;
              bottleneckName = `${equipName} (Standard Profile)`;
            }
          }
        }
      }

      // Calculate score metrics
      const meanAvail = availabilities.reduce((sum, val) => sum + val, 0) / availabilities.length;
      // Adjusted score applies the bottleneck penalty: scales down score if any item is scarce
      const adjustedAvail = meanAvail * (0.5 + 0.5 * minAvailVal);
      const score = Math.round(adjustedAvail * 100);

      // Determine confidence level
      let confidence: 'high' | 'medium' | 'low' = 'low';
      if (highConfidenceCount === routine.equipmentNames.length) {
        confidence = 'high';
      } else if (highConfidenceCount > 0 || mediumConfidenceCount > 0) {
        confidence = 'medium';
      }

      // Determine reasoning string
      let reason = '';
      if (confidence === 'high') {
        reason = `Based on historical availability of ${routine.equipmentNames.join(', ')}.`;
      } else if (confidence === 'medium') {
        reason = 'Estimated based on general gym congestion levels due to sparse equipment data.';
      } else {
        reason = 'Estimated using typical commercial gym traffic patterns (no historical logs available).';
      }

      timeWindows.push({
        day,
        hourLabel,
        score,
        confidence,
        reason,
        bottleneckEquipment: bottleneckName,
      });
    }
  }

  // Sort time windows by score descending
  return timeWindows.sort((a, b) => b.score - a.score);
}

/**
 * Compares and ranks all user routines to recommend the single overall best routine & time combination.
 */
export function getTopRoutineRecommendation(
  routines: RoutineEquipmentNeed[],
  equipmentSamples: EquipmentHistorySample[],
  headcountSamples: GymHeadcountSample[]
): RoutineTimeRecommendation | null {
  if (routines.length === 0) return null;

  const routineBestRecommendations: RoutineTimeRecommendation[] = [];

  for (const r of routines) {
    const ranked = getOptimalTimesForRoutine(r, equipmentSamples, headcountSamples);
    if (ranked.length > 0) {
      const topWindow = ranked[0];
      routineBestRecommendations.push({
        routineId: r.routineId,
        routineName: r.routineName,
        targetMuscles: r.targetMuscles,
        optimalDay: topWindow.day,
        optimalHourLabel: topWindow.hourLabel,
        score: topWindow.score,
        bottleneckEquipment: topWindow.bottleneckEquipment,
        confidence: topWindow.confidence,
        reason: topWindow.reason,
      });
    }
  }

  if (routineBestRecommendations.length === 0) return null;

  // Sort optimal recommendations: score descending, then break ties by last used timestamp
  return routineBestRecommendations.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const rA = routines.find((r) => r.routineId === a.routineId);
    const rB = routines.find((r) => r.routineId === b.routineId);
    const timeA = rA?.lastUsedAt ? new Date(rA.lastUsedAt).getTime() : 0;
    const timeB = rB?.lastUsedAt ? new Date(rB.lastUsedAt).getTime() : 0;
    return timeB - timeA;
  })[0];
}
