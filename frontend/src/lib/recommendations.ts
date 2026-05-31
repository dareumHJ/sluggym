import type { EquipmentListItem } from '../hooks/useEquipment';
import type { WorkoutExerciseWithSets } from '../hooks/useExercises';
import type { Workout } from '../hooks/useWorkouts';

export interface RecommendationInput {
  activeWorkout: Workout | null;
  workouts: Workout[];
  equipment: EquipmentListItem[];
  historyExercises: WorkoutExerciseWithSets[];
  occupancyCount: number;
  occupancyCapacity: number;
  errors?: (string | null | undefined)[];
}

export interface WorkoutRecommendation {
  title: string;
  detail: string;
  equipment: EquipmentListItem | null;
  crowdLabel: string;
  sourceLabel: string;
  fallbackLabel: string | null;
  warnings: string[];
}

function formatList(values: string[]) {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

function mostAvailable(equipment: EquipmentListItem[]) {
  return [...equipment].sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name))[0] ?? null;
}

function mostUsedAvailableEquipment(historyExercises: WorkoutExerciseWithSets[], equipment: EquipmentListItem[]) {
  const equipmentById = new Map(equipment.map((item) => [item.id, item]));
  const usage = new Map<string, number>();

  for (const exercise of historyExercises) {
    usage.set(exercise.equipment_id, (usage.get(exercise.equipment_id) ?? 0) + 1);
  }

  return [...usage.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([equipmentId]) => equipmentById.get(equipmentId) ?? null)
    .find((item): item is EquipmentListItem => Boolean(item && item.quantity > 0)) ?? null;
}

function crowdLabel(count: number, capacity: number) {
  const pct = capacity > 0 ? count / capacity : 0;
  if (pct >= 0.85) return 'Peak crowd';
  if (pct >= 0.6) return 'Moderate crowd';
  return 'Open floor';
}

export function buildWorkoutRecommendation(input: RecommendationInput): WorkoutRecommendation {
  const warnings = (input.errors ?? []).filter((value): value is string => Boolean(value));
  const completedWorkouts = input.workouts.filter((workout) => workout.ended_at !== null);
  const routineMuscles =
    input.activeWorkout?.target_muscle.length
      ? input.activeWorkout.target_muscle
      : completedWorkouts.find((workout) => workout.target_muscle.length > 0)?.target_muscle ?? [];

  const historicalPick = mostUsedAvailableEquipment(input.historyExercises, input.equipment);
  const availablePick = mostAvailable(input.equipment.filter((item) => item.quantity > 0));
  const pick = historicalPick ?? availablePick;
  const hasPersistedInputs = input.equipment.length > 0 || input.workouts.length > 0 || input.historyExercises.length > 0;
  const label = crowdLabel(input.occupancyCount, input.occupancyCapacity);

  if (!pick) {
    return {
      title: routineMuscles.length ? `Plan around ${formatList(routineMuscles)}` : 'No live station recommendation yet',
      detail: hasPersistedInputs
        ? 'Saved history is loaded, but no currently available equipment matched it.'
        : 'Live equipment and saved workout history are still empty, so the app is waiting for persisted data.',
      equipment: null,
      crowdLabel: label,
      sourceLabel: hasPersistedInputs ? 'Saved data' : 'Waiting for data',
      fallbackLabel: hasPersistedInputs ? 'No available match' : 'No persisted inputs yet',
      warnings,
    };
  }

  const crowdNote =
    label === 'Peak crowd'
      ? ' Headcount is high, so favor lower-wait stations.'
      : label === 'Moderate crowd'
        ? ' Headcount is moderate; this is a workable option.'
        : ' Headcount is light right now.';

  if (historicalPick) {
    return {
      title: routineMuscles.length ? `Best fit for ${formatList(routineMuscles)}` : 'Repeat a proven station',
      detail: `${historicalPick.name} is available and appears in your saved session history.${crowdNote}`,
      equipment: historicalPick,
      crowdLabel: label,
      sourceLabel: 'History + live equipment',
      fallbackLabel: null,
      warnings,
    };
  }

  return {
    title: routineMuscles.length ? `Open option for ${formatList(routineMuscles)}` : 'Best open station now',
    detail: `${pick.name} has ${pick.quantity} available now.${crowdNote}`,
    equipment: pick,
    crowdLabel: label,
    sourceLabel: 'Live equipment',
    fallbackLabel: input.historyExercises.length === 0 ? 'No saved exercise history yet' : null,
    warnings,
  };
}
