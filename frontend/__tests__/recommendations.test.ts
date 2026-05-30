import { buildWorkoutRecommendation } from '../src/lib/recommendations';
import type { EquipmentListItem } from '../src/hooks/useEquipment';
import type { WorkoutExerciseWithSets } from '../src/hooks/useExercises';
import type { Workout } from '../src/hooks/useWorkouts';

const bench: EquipmentListItem = {
  id: 'eq-1',
  name: 'Bench Press',
  category: 'Free Weights',
  location: '2nd floor',
  quantity: 2,
};

const cable: EquipmentListItem = {
  id: 'eq-2',
  name: 'Cable Crossover',
  category: 'Cables',
  location: '1st floor',
  quantity: 4,
};

const workout: Workout = {
  id: 'w-1',
  user_id: 'u-1',
  name: 'Push Day',
  target_muscle: ['Chest'],
  started_at: '2026-05-10T01:00:00.000Z',
  ended_at: '2026-05-10T02:00:00.000Z',
  duration_min: 60,
  created_at: '2026-05-10T01:00:00.000Z',
};

function historyExercise(equipmentId: string): WorkoutExerciseWithSets {
  return {
    id: `we-${equipmentId}`,
    workout_id: 'w-1',
    exercise_id: 'ex-1',
    equipment_id: equipmentId,
    order_index: 1,
    started_at: '2026-05-10T01:05:00.000Z',
    ended_at: '2026-05-10T01:30:00.000Z',
    created_at: '2026-05-10T01:05:00.000Z',
    exercise: { id: 'ex-1', name: 'Bench Press', target_muscle: 'Chest', exercise_type: 'Strength' },
    equipment: { id: equipmentId, name: equipmentId === 'eq-1' ? 'Bench Press' : 'Cable Crossover', category: 'Strength' },
    sets: [],
  };
}

describe('buildWorkoutRecommendation', () => {
  it('prefers available equipment from saved session history', () => {
    const recommendation = buildWorkoutRecommendation({
      activeWorkout: null,
      workouts: [workout],
      equipment: [cable, bench],
      historyExercises: [historyExercise('eq-1')],
      occupancyCount: 42,
      occupancyCapacity: 150,
    });

    expect(recommendation.title).toBe('Best fit for Chest');
    expect(recommendation.equipment?.name).toBe('Bench Press');
    expect(recommendation.sourceLabel).toBe('History + live equipment');
  });

  it('updates when history points to a different available equipment row', () => {
    const recommendation = buildWorkoutRecommendation({
      activeWorkout: null,
      workouts: [workout],
      equipment: [cable, bench],
      historyExercises: [historyExercise('eq-2'), historyExercise('eq-2')],
      occupancyCount: 42,
      occupancyCapacity: 150,
    });

    expect(recommendation.equipment?.name).toBe('Cable Crossover');
  });

  it('surfaces fallback and warning details when persisted inputs are missing or degraded', () => {
    const recommendation = buildWorkoutRecommendation({
      activeWorkout: null,
      workouts: [],
      equipment: [],
      historyExercises: [],
      occupancyCount: 0,
      occupancyCapacity: 150,
      errors: ['Failed to load equipment'],
    });

    expect(recommendation.fallbackLabel).toBe('No persisted inputs yet');
    expect(recommendation.warnings).toEqual(['Failed to load equipment']);
  });
});
