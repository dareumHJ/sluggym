import {
  getOptimalTimesForRoutine,
  getTopRoutineRecommendation,
  type RoutineEquipmentNeed,
  type EquipmentHistorySample,
  type GymHeadcountSample,
} from '../src/lib/recommendation';

describe('Recommendation scoring logic', () => {
  const routine: RoutineEquipmentNeed = {
    routineId: 'r-chest',
    routineName: 'Chest Day',
    targetMuscles: ['Chest'],
    equipmentNames: ['Bench Press', 'Incline Bench'],
    lastUsedAt: '2026-05-25T18:00:00Z',
  };

  it('calculates deterministic scores and ranks them descending', () => {
    // Mock samples for Mon 9a (9:00 - 11:59 AM Pacific)
    // Mon May 25 2026 16:30 UTC = Mon 9:30 AM PDT -> Mon 9a bucket
    const equipmentSamples: EquipmentHistorySample[] = [
      { equipment_name: 'Bench Press', available_count: 3, total_count: 3, sampled_at: '2026-05-25T16:30:00Z' }, // 100% free
      { equipment_name: 'Incline Bench', available_count: 2, total_count: 2, sampled_at: '2026-05-25T16:30:00Z' }, // 100% free
    ];

    const results = getOptimalTimesForRoutine(routine, equipmentSamples, []);

    // The top ranked result should be Mon 9a
    expect(results).toHaveLength(42);
    expect(results[0].day).toBe('Mon');
    expect(results[0].hourLabel).toBe('9a');
    expect(results[0].score).toBe(100);
    expect(results[0].confidence).toBe('high');
    expect(results[0].reason).toContain('Bench Press, Incline Bench');
    expect(results[0].bottleneckEquipment).toBe('None');

    // Ensure they are sorted descending by score
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });

  it('applies the bottleneck penalty when one machine is congested', () => {
    // Mock samples for Mon 9a
    const equipmentSamples: EquipmentHistorySample[] = [
      { equipment_name: 'Bench Press', available_count: 3, total_count: 3, sampled_at: '2026-05-25T16:30:00Z' }, // 1.0 (100% free)
      { equipment_name: 'Incline Bench', available_count: 0, total_count: 2, sampled_at: '2026-05-25T16:30:00Z' }, // 0.0 (0% free)
    ];

    const results = getOptimalTimesForRoutine(routine, equipmentSamples, []);
    const mon9a = results.find((r) => r.day === 'Mon' && r.hourLabel === '9a');

    // Mean availability = (1.0 + 0.0) / 2 = 0.5 (50%)
    // Bottleneck (Min) = 0.0
    // Adjusted score = 0.5 * (0.5 + 0.5 * 0.0) = 0.25 (25% score)
    expect(mon9a).toBeDefined();
    expect(mon9a?.score).toBe(25);
    expect(mon9a?.bottleneckEquipment).toBe('Incline Bench');
  });

  it('falls back to gym headcount history when specific equipment samples are missing', () => {
    // No specific equipment availability history exists, but overall headcount does
    // Mon May 25 2026 16:30 UTC = Mon 9:30 AM PDT -> Mon 9a bucket
    const headcountSamples: GymHeadcountSample[] = [
      { count: 30, capacity: 150, sampled_at: '2026-05-25T16:30:00Z' }, // 30/150 = 20% occupancy -> 80% free
    ];

    const results = getOptimalTimesForRoutine(routine, [], headcountSamples);
    const mon9a = results.find((r) => r.day === 'Mon' && r.hourLabel === '9a');

    expect(mon9a).toBeDefined();
    expect(mon9a?.score).toBe(72);
    // Mean = 0.8. Min = 0.8.
    // Score = 0.8 * (0.5 + 0.5 * 0.8) = 0.8 * 0.9 = 0.72 -> 72%
    expect(mon9a?.confidence).toBe('medium');
    expect(mon9a?.reason).toContain('congestion');
    expect(mon9a?.bottleneckEquipment).toBe('Bench Press (Estimated)'); // maps first item
  });

  it('falls back to IHRSA baseline profile when no historical logs are available', () => {
    const results = getOptimalTimesForRoutine(routine, [], []);
    
    // Low confidence baseline fallback should apply to all 42 buckets
    expect(results).toHaveLength(42);
    expect(results.every((r) => r.confidence === 'low')).toBe(true);
    expect(results.every((r) => r.reason.includes('commercial gym traffic'))).toBe(true);

    // Best standard profile time is 6a (20% busy -> 80% free -> 0.8 * (0.5 + 0.5 * 0.8) = 72% score)
    const topResult = results[0];
    expect(topResult.hourLabel).toBe('6a');
    expect(topResult.score).toBe(72);

    // Worst standard profile time is 6p (85% busy -> 15% free -> 0.15 * (0.5 + 0.5 * 0.15) = 0.15 * 0.575 = 0.086 -> 9% score)
    const worstResult = results[results.length - 1];
    expect(worstResult.hourLabel).toBe('6p');
    expect(worstResult.score).toBe(9);
  });

  it('returns a low-confidence state with descriptive reason if routine has no logged exercises', () => {
    const emptyRoutine: RoutineEquipmentNeed = {
      routineId: 'r-empty',
      routineName: 'New Workout',
      targetMuscles: [],
      equipmentNames: [], // empty list (no history)
      lastUsedAt: null,
    };

    const results = getOptimalTimesForRoutine(emptyRoutine, [], []);
    expect(results).toHaveLength(42);
    expect(results[0].confidence).toBe('low');
    expect(results[0].reason).toContain('No workout history logged yet');
  });

  it('selects the top routine and breaks score ties using the last used timestamp', () => {
    const r1: RoutineEquipmentNeed = {
      routineId: 'r1',
      routineName: 'R1',
      targetMuscles: [],
      equipmentNames: ['Bench Press'],
      lastUsedAt: '2026-05-24T10:00:00Z', // older
    };

    const r2: RoutineEquipmentNeed = {
      routineId: 'r2',
      routineName: 'R2',
      targetMuscles: [],
      equipmentNames: ['Bench Press'],
      lastUsedAt: '2026-05-25T10:00:00Z', // newer
    };

    // Both routines have identical availability data (so their optimal scores will tie)
    const equipmentSamples: EquipmentHistorySample[] = [
      { equipment_name: 'Bench Press', available_count: 3, total_count: 3, sampled_at: '2026-05-25T16:30:00Z' }, // Mon 9a
    ];

    const recommendation = getTopRoutineRecommendation([r1, r2], equipmentSamples, []);
    
    // Should tie-break to r2 because it was used more recently
    expect(recommendation).not.toBeNull();
    expect(recommendation?.routineId).toBe('r2');
  });
});
