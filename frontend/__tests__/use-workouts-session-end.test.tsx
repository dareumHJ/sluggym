import { act, renderHook, waitFor } from '@testing-library/react-native';
import { supabase } from '../src/lib/supabase';
import { useWorkouts } from '../src/hooks/useWorkouts';

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  },
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
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('cascade-ends active workout exercises before ending the workout', async () => {
    queueInitialWorkoutRefresh();
    const activeFetch = queueActiveExerciseFetch([
      { id: 'workout-exercise-1', equipment_id: 'equipment-1' },
      { id: 'workout-exercise-2', equipment_id: 'equipment-2' },
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

    // Equipment count release is handled by the database trigger on workout_exercises.ended_at.
    // The client should not double-increment counts through the old RPC path.
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('does not end the workout when releasing an active exercise fails', async () => {
    queueInitialWorkoutRefresh();
    queueActiveExerciseFetch([{ id: 'workout-exercise-1', equipment_id: 'equipment-1' }]);
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
