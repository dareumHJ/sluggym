import { renderHook, waitFor } from '@testing-library/react-native';
import { useExerciseCatalog, type ExerciseFilters } from '../src/hooks/useExerciseCatalog';
import { supabase } from '../src/lib/supabase';
import { UNASSIGNED_EQUIPMENT_FILTER } from '../src/lib/exerciseFilters';

jest.mock('../src/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}));

const fromMock = (supabase as jest.Mocked<typeof supabase>).from as jest.Mock;

// ─── Fixture data ─────────────────────────────────────────────────────────────

const benchPressRow = {
  id: 1,
  name: 'Barbell Bench Press',
  category: 'strength',
  level: 'beginner',
  exercise_type: 'Barbell',
  target_muscle: 'chest',
  primary_muscles: ['chest'],
  secondary_muscles: ['triceps'],
};

const squatRow = {
  id: 2,
  name: 'Barbell Squat',
  category: 'strength',
  level: 'intermediate',
  exercise_type: 'Barbell',
  target_muscle: 'quadriceps',
  primary_muscles: ['quadriceps'],
  secondary_muscles: ['glutes', 'hamstrings'],
};

const pushUpRow = {
  id: 3,
  name: 'Push Up',
  category: 'strength',
  level: 'beginner',
  exercise_type: 'Body only',
  target_muscle: 'chest',
  primary_muscles: ['chest'],
  secondary_muscles: ['triceps'],
};

const flatBench = {
  id: 10,
  name: 'Flat Bench',
  category: 'Free Weights',
  location: '2nd floor',
  available_count: 2,
  description: 'Flat bench station',
};

const squatRack = {
  id: 11,
  name: 'Squat Rack',
  category: 'Free Weights',
  location: '1st floor',
  available_count: 1,
  description: 'Power rack',
};

const defaultExercises = [benchPressRow, squatRow, pushUpRow];
const defaultMappings = [
  { exercise_id: 1, equipment_id: 10, gym_equipment: flatBench },
  { exercise_id: 2, equipment_id: 11, gym_equipment: squatRack },
  // Push Up (id=3) intentionally has no mapping entry → bodyweight
];

// ─── Mock helpers ─────────────────────────────────────────────────────────────

function setupMocks({
  exercises = defaultExercises,
  mappings = defaultMappings,
  exerciseError = null as { message: string } | null,
  mappingError = null as { message: string } | null,
} = {}) {
  fromMock.mockImplementation((table: string) => {
    if (table === 'exercises') {
      const limit = jest.fn().mockResolvedValue({ data: exerciseError ? null : exercises, error: exerciseError });
      const order2 = jest.fn(() => ({ limit }));
      const order1 = jest.fn(() => ({ order: order2 }));
      const select = jest.fn(() => ({ order: order1 }));
      return { select };
    }
    if (table === 'exercise_equipment') {
      const select = jest.fn().mockResolvedValue({ data: mappingError ? null : mappings, error: mappingError });
      return { select };
    }
    return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
  });
}

// ─── Data loading & normalisation ────────────────────────────────────────────

describe('useExerciseCatalog — initial load', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('fetches exercises and equipment mappings in parallel on mount', async () => {
    const { result } = renderHook(() => useExerciseCatalog());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fromMock).toHaveBeenCalledWith('exercises');
    expect(fromMock).toHaveBeenCalledWith('exercise_equipment');
    expect(result.current.error).toBeNull();
  });

  it('normalises exercise ids to strings even when the DB returns numbers', async () => {
    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(typeof result.current.exercises[0].id).toBe('string');
    expect(result.current.exercises[0].id).toBe('1');
  });

  it('maps available_count → quantity on each equipment option', async () => {
    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const bench = result.current.exercises.find((e) => e.name === 'Barbell Bench Press');
    expect(bench?.equipmentOptions[0].quantity).toBe(2);  // flatBench.available_count = 2
  });

  it('groups multiple equipment options under the correct exercise', async () => {
    const extraMapping = { exercise_id: 1, equipment_id: 11, gym_equipment: squatRack };
    setupMocks({ mappings: [...defaultMappings, extraMapping] });

    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const bench = result.current.exercises.find((e) => e.name === 'Barbell Bench Press');
    expect(bench?.equipmentOptions).toHaveLength(2);
    expect(bench?.equipmentOptions.map((o) => o.name)).toContain('Flat Bench');
    expect(bench?.equipmentOptions.map((o) => o.name)).toContain('Squat Rack');
  });

  it('returns empty equipmentOptions for exercises with no mapping rows', async () => {
    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const pushUp = result.current.exercises.find((e) => e.name === 'Push Up');
    expect(pushUp?.equipmentOptions).toEqual([]);
  });

  it('handles gym_equipment returned as a single-element array (Supabase cardinality quirk)', async () => {
    setupMocks({
      mappings: [{ exercise_id: 1, equipment_id: 10, gym_equipment: [flatBench] as any }],
    });

    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const bench = result.current.exercises.find((e) => e.name === 'Barbell Bench Press');
    expect(bench?.equipmentOptions[0].name).toBe('Flat Bench');
  });

  it('treats null primary_muscles and secondary_muscles as empty arrays', async () => {
    setupMocks({
      exercises: [{ ...benchPressRow, primary_muscles: null, secondary_muscles: null } as any],
      mappings: [],
    });

    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.exercises[0].primaryMuscles).toEqual([]);
    expect(result.current.exercises[0].secondaryMuscles).toEqual([]);
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────

describe('useExerciseCatalog — error states', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('surfaces an error when the exercises query fails', async () => {
    setupMocks({ exerciseError: { message: 'exercises: permission denied' } });

    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('exercises: permission denied');
    expect(result.current.exercises).toHaveLength(0);
  });

  it('surfaces an error when the exercise_equipment query fails', async () => {
    setupMocks({ mappingError: { message: 'mapping: permission denied' } });

    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('mapping: permission denied');
    expect(result.current.exercises).toHaveLength(0);
  });
});

// ─── Computed filter options ──────────────────────────────────────────────────

describe('useExerciseCatalog — derived filter chip options', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('derives equipmentOptions from equipment categories (deduped, lowercased, sorted)', async () => {
    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Flat Bench + Squat Rack both have category 'Free Weights' → one 'free weights' entry
    expect(result.current.equipmentOptions).toEqual(['All', UNASSIGNED_EQUIPMENT_FILTER, 'free weights']);
  });

  it('derives muscleOptions from all muscle fields (deduped, lowercased, sorted)', async () => {
    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.muscleOptions).toEqual([
      'All', 'chest', 'glutes', 'hamstrings', 'quadriceps', 'triceps',
    ]);
  });

  it('derives levelOptions from exercise level fields (deduped, lowercased, sorted)', async () => {
    const { result } = renderHook(() => useExerciseCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.levelOptions).toEqual(['All', 'beginner', 'intermediate']);
  });
});

// ─── Text-query filtering ─────────────────────────────────────────────────────

describe('useExerciseCatalog — text query filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('returns all exercises when the query is empty', async () => {
    const { result } = renderHook(() => useExerciseCatalog(''));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(3);
  });

  it('matches by exercise name (case insensitive)', async () => {
    const { result } = renderHook(() => useExerciseCatalog('BENCH'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Barbell Bench Press');
  });

  it('matches by target muscle name', async () => {
    const { result } = renderHook(() => useExerciseCatalog('quadriceps'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Barbell Squat');
  });

  it('matches by equipment name (so searching "flat bench" finds the mapped exercise)', async () => {
    const { result } = renderHook(() => useExerciseCatalog('flat bench'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Barbell Bench Press');
  });

  it('matches by equipment category (so "free weights" finds all exercises using that category)', async () => {
    const { result } = renderHook(() => useExerciseCatalog('free weights'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Bench Press and Squat both have Free Weights equipment
    expect(result.current.filteredExercises).toHaveLength(2);
  });

  it('returns an empty list when the query matches no exercise', async () => {
    const { result } = renderHook(() => useExerciseCatalog('doesnotexist'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(0);
  });
});

// ─── Filter chip filtering ────────────────────────────────────────────────────

describe('useExerciseCatalog — filter chip filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('equipment filter "All" returns all exercises', async () => {
    const { result } = renderHook(() =>
      useExerciseCatalog('', { equipment: 'All' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.filteredExercises).toHaveLength(3);
  });

  it('equipment filter by category uses OR semantics — any mapped equipment category matches', async () => {
    const { result } = renderHook(() =>
      useExerciseCatalog('', { equipment: 'free weights' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Bench Press and Squat — both have equipment in 'Free Weights' category
    expect(result.current.filteredExercises).toHaveLength(2);
    const names = result.current.filteredExercises.map((e) => e.name);
    expect(names).toContain('Barbell Bench Press');
    expect(names).toContain('Barbell Squat');
  });

  it(`UNASSIGNED_EQUIPMENT_FILTER returns only exercises with no equipment mapping`, async () => {
    const { result } = renderHook(() =>
      useExerciseCatalog('', { equipment: UNASSIGNED_EQUIPMENT_FILTER }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Push Up');
  });

  it('muscle filter matches targetMuscle, primaryMuscles, and secondaryMuscles (OR)', async () => {
    // 'triceps' appears in secondary muscles of both Bench Press and Push Up
    const { result } = renderHook(() =>
      useExerciseCatalog('', { muscle: 'triceps' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(2);
    const names = result.current.filteredExercises.map((e) => e.name);
    expect(names).toContain('Barbell Bench Press');
    expect(names).toContain('Push Up');
  });

  it('muscle filter matches only exercises with that muscle', async () => {
    const { result } = renderHook(() =>
      useExerciseCatalog('', { muscle: 'glutes' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Barbell Squat');
  });

  it('level filter returns only exercises at the specified level', async () => {
    const { result } = renderHook(() =>
      useExerciseCatalog('', { level: 'intermediate' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Barbell Squat');
  });

  it('level filter is case-insensitive', async () => {
    const { result } = renderHook(() =>
      useExerciseCatalog('', { level: 'BEGINNER' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(2);
  });
});

// ─── Combined query + filter ──────────────────────────────────────────────────

describe('useExerciseCatalog — combined query and filters (AND semantics)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('applies query AND level filter together, narrowing results further', async () => {
    // query='bench' matches Bench Press only; level='beginner' also matches Bench Press
    const { result } = renderHook(() =>
      useExerciseCatalog('bench', { level: 'beginner' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Barbell Bench Press');
  });

  it('returns empty when query matches an exercise that fails the level filter', async () => {
    // query='bench' matches Bench Press (beginner); level='intermediate' does not match
    const { result } = renderHook(() =>
      useExerciseCatalog('bench', { level: 'intermediate' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(0);
  });

  it('applies equipment + muscle filters simultaneously', async () => {
    // equipment='free weights' matches Bench Press and Squat
    // muscle='quadriceps' matches only Squat
    const { result } = renderHook(() =>
      useExerciseCatalog('', { equipment: 'free weights', muscle: 'quadriceps' }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Barbell Squat');
  });
});
