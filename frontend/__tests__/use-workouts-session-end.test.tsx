import { act, renderHook, waitFor } from '@testing-library/react-native';
import { supabase } from '../src/lib/supabase';
import { useWorkouts } from '../src/hooks/useWorkouts';
import { useExercises } from '../src/hooks/useExercises';

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

// useExercises imports AuthContext, which uses expo-linking's makeRedirectUri
// at module load time. expo-linking requires an expo-constants manifest that
// isn't available in the jest environment. Mocking AuthContext sidesteps the
// whole chain — the tests don't exercise auth behaviour, only the hook's
// supabase interactions.
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const getUserMock = mockSupabase.auth.getUser as jest.Mock;
const fromMock = mockSupabase.from as jest.Mock;
const rpcMock = mockSupabase.rpc as jest.Mock;
const NOW = '2026-05-09T00:00:00.000Z';

const activeWorkout = {
  id: 'workout-1',
  user_id: 'user-1',
  name: 'Push day',
  target_muscle: ['chest'],
  started_at: '2026-05-08T23:30:00.000Z',
  ended_at: null,
  created_at: '2026-05-08T23:30:00.000Z',
};

function queueInitialWorkoutRefresh(workouts = [activeWorkout]) {
  const order = jest.fn(async () => ({ data: workouts, error: null }));
  const eq = jest.fn(() => ({ order }));
  const select = jest.fn(() => ({ eq }));

  fromMock.mockReturnValueOnce({ select });
  return { select, eq, order };
}

function queueActiveExerciseFetch(activeExercises: { id: string; equipment_id: string }[]) {
  const is = jest.fn(async () => ({ data: activeExercises, error: null }));
  const eq = jest.fn(() => ({ is }));
  const select = jest.fn(() => ({ eq }));

  fromMock.mockReturnValueOnce({ select });
  return { select, eq, is };
}

function queueActiveExerciseEnd(error: { message: string } | null = null) {
  const eq = jest.fn(async () => ({ error }));
  const update: jest.Mock = jest.fn(() => ({ eq }));

  fromMock.mockReturnValueOnce({ update });
  return { update, eq };
}

function queueWorkoutEnd() {
  let endedAt = NOW;
  const single = jest.fn(async () => ({ data: { ...activeWorkout, ended_at: endedAt }, error: null }));
  const select = jest.fn(() => ({ single }));
  const eq = jest.fn(() => ({ select }));
  const update: jest.Mock = jest.fn((patch: { ended_at: string }) => {
    endedAt = patch.ended_at;
    return { eq };
  });

  fromMock.mockReturnValueOnce({ update });
  return { update, eq, select, single };
}

describe('useWorkouts session end flow', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date(NOW) });
    jest.clearAllMocks();
    getUserMock.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    rpcMock.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('cascade-ends active workout exercises before ending the workout', async () => {
    queueInitialWorkoutRefresh();
    const activeFetch = queueActiveExerciseFetch([
      { id: 'workout-exercise-1', equipment_id: '1' },
      { id: 'workout-exercise-2', equipment_id: '2' },
    ]);
    const firstExerciseEnd = queueActiveExerciseEnd();
    const secondExerciseEnd = queueActiveExerciseEnd();
    const workoutEnd = queueWorkoutEnd();

    const { result } = renderHook(() => useWorkouts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let updatedWorkout;
    await act(async () => {
      updatedWorkout = await result.current.endWorkout('workout-1');
    });

    expect(activeFetch.select).toHaveBeenCalledWith('id, equipment_id');
    expect(activeFetch.eq).toHaveBeenCalledWith('workout_id', 'workout-1');
    expect(activeFetch.is).toHaveBeenCalledWith('ended_at', null);

    const endedAt = (firstExerciseEnd.update.mock.calls[0][0] as { ended_at: string }).ended_at;

    expect(firstExerciseEnd.update).toHaveBeenCalledWith({ ended_at: endedAt });
    expect(firstExerciseEnd.eq).toHaveBeenCalledWith('id', 'workout-exercise-1');
    expect(secondExerciseEnd.update).toHaveBeenCalledWith({ ended_at: endedAt });
    expect(secondExerciseEnd.eq).toHaveBeenCalledWith('id', 'workout-exercise-2');

    expect(workoutEnd.update).toHaveBeenCalledWith({ ended_at: endedAt });
    expect(workoutEnd.eq).toHaveBeenCalledWith('id', 'workout-1');
    expect(workoutEnd.select).toHaveBeenCalledWith('id, user_id, name, target_muscle, routine_id, started_at, ended_at, created_at');
    expect(updatedWorkout).toMatchObject({ id: 'workout-1', ended_at: endedAt, duration_min: 30 });

    expect(rpcMock).toHaveBeenCalledWith('increment_equipment_count', { equipment_id_input: 1 });
    expect(rpcMock).toHaveBeenCalledWith('increment_equipment_count', { equipment_id_input: 2 });
  });

  it('does not end the workout when releasing an active exercise fails', async () => {
    queueInitialWorkoutRefresh();
    queueActiveExerciseFetch([{ id: 'workout-exercise-1', equipment_id: '1' }]);
    queueActiveExerciseEnd({ message: 'release failed' });

    const { result } = renderHook(() => useWorkouts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.endWorkout('workout-1')).rejects.toThrow(
      'Failed to end active exercise workout-exercise-1: release failed',
    );

    expect(fromMock).toHaveBeenCalledTimes(3);
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/* useExercises equipment reservation lifecycle                         */
/* ------------------------------------------------------------------ */

function queueExistingActiveExerciseCheck(activeExercises: { id: string }[] = []) {
  const is = jest.fn(async () => ({ data: activeExercises, error: null }));
  const eq = jest.fn(() => ({ is }));
  const select = jest.fn(() => ({ eq }));

  fromMock.mockReturnValueOnce({ select });
  return { select, eq, is };
}

function queueWorkoutExerciseInsert(row = {
  id: '42',
  workout_id: 'workout-1',
  exercise_id: '5',
  equipment_id: '7',
  order_index: 1,
  started_at: NOW,
  ended_at: null,
  created_at: NOW,
}) {
  const single = jest.fn(async () => ({ data: row, error: null }));
  const select = jest.fn(() => ({ single }));
  const insert = jest.fn(() => ({ select }));

  fromMock.mockReturnValueOnce({ insert });
  return { insert, select, single };
}

function queueWorkoutExerciseEnd(row = {
  id: '42',
  workout_id: 'workout-1',
  exercise_id: '5',
  equipment_id: '7',
  order_index: 1,
  started_at: NOW,
  ended_at: NOW,
  created_at: NOW,
}) {
  const single = jest.fn(async () => ({ data: row, error: null }));
  const select = jest.fn(() => ({ single }));
  const eq = jest.fn(() => ({ select }));
  const update = jest.fn(() => ({ eq }));

  fromMock.mockReturnValueOnce({ update });
  return { update, eq, select, single };
}

function queueExerciseRowFetch(row: { id: string; equipment_id: string | null; ended_at: string | null }) {
  const single = jest.fn(async () => ({ data: row, error: null }));
  const eq = jest.fn(() => ({ single }));
  const select = jest.fn(() => ({ eq }));

  fromMock.mockReturnValueOnce({ select });
  return { select, eq, single };
}

function queueExerciseDelete(error: { message: string } | null = null) {
  const eq = jest.fn(async () => ({ error }));
  const del: jest.Mock = jest.fn(() => ({ eq }));

  fromMock.mockReturnValueOnce({ delete: del });
  return { delete: del, eq };
}

describe('useExercises.deleteExercise', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUserMock.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    rpcMock.mockResolvedValue({ error: null });
  });

  it('reserves equipment when an exercise starts', async () => {
    queueExistingActiveExerciseCheck();
    const insert = queueWorkoutExerciseInsert();

    const { result } = renderHook(() => useExercises());

    await act(async () => {
      await result.current.addExercise({
        workoutId: 'workout-1',
        exerciseId: '5',
        equipmentId: '7',
        orderIndex: 1,
      });
    });

    expect(insert.insert).toHaveBeenCalledWith({
      workout_id: 'workout-1',
      exercise_id: 5,
      equipment_id: 7,
      order_index: 1,
      started_at: expect.any(String),
    });
    expect(rpcMock).toHaveBeenCalledWith('decrement_equipment_count', { equipment_id_input: 7 });
    expect(result.current.activeExercise).toMatchObject({ id: '42', equipment_id: '7' });
  });

  it('releases equipment when an exercise finishes', async () => {
    const update = queueWorkoutExerciseEnd();

    const { result } = renderHook(() => useExercises());

    await act(async () => {
      await result.current.endExercise('42', '7');
    });

    expect(update.update).toHaveBeenCalledWith({ ended_at: expect.any(String) });
    expect(update.eq).toHaveBeenCalledWith('id', 42);
    expect(rpcMock).toHaveBeenCalledWith('increment_equipment_count', { equipment_id_input: 7 });
  });

  it('deletes the workout_exercises row by id', async () => {
    queueExerciseRowFetch({ id: '42', equipment_id: '7', ended_at: null });
    const exerciseDelete = queueExerciseDelete();

    const { result } = renderHook(() => useExercises());

    await act(async () => {
      await result.current.deleteExercise('42');
    });

    expect(fromMock).toHaveBeenCalledWith('workout_exercises');
    expect(exerciseDelete.delete).toHaveBeenCalledTimes(1);
    expect(exerciseDelete.eq).toHaveBeenCalledWith('id', 42);
    expect(rpcMock).toHaveBeenCalledWith('increment_equipment_count', { equipment_id_input: 7 });
  });

  it('throws and exposes an error when the database delete fails', async () => {
    queueExerciseRowFetch({ id: '42', equipment_id: '7', ended_at: null });
    queueExerciseDelete({ message: 'delete blocked by policy' });

    const { result } = renderHook(() => useExercises());

    await act(async () => {
      await expect(result.current.deleteExercise('42')).rejects.toThrow(
        'delete blocked by policy',
      );
    });

    await waitFor(() => expect(result.current.error).toBe('delete blocked by policy'));
    expect(result.current.loading).toBe(false);
  });

  it('does not touch local state for non-active exercises', async () => {
    queueExerciseRowFetch({ id: '42', equipment_id: '7', ended_at: '2026-05-09T00:00:00.000Z' });
    queueExerciseDelete();

    const { result } = renderHook(() => useExercises());

    expect(result.current.activeExercise).toBeNull();
    expect(result.current.setsForActiveExercise).toEqual([]);

    await act(async () => {
      await result.current.deleteExercise('42');
    });

    // No active exercise was hydrated, so deletion leaves local state alone.
    expect(result.current.activeExercise).toBeNull();
    expect(result.current.setsForActiveExercise).toEqual([]);
    expect(rpcMock).not.toHaveBeenCalledWith('increment_equipment_count', { equipment_id_input: 7 });
  });
});
