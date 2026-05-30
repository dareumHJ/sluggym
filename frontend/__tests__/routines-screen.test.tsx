import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import RoutineEditorScreen from '../app/routines';
import { useRoutines } from '../src/hooks/useRoutines';

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock('expo-router', () => ({
  router: { back: () => mockBack(), push: (...args: unknown[]) => mockPush(...args) },
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('../src/hooks/useRoutines', () => ({
  useRoutines: jest.fn(),
}));

const mockUseRoutines = useRoutines as jest.MockedFunction<typeof useRoutines>;
type UseRoutinesReturn = ReturnType<typeof useRoutines>;

const sampleRoutine = {
  id: 'routine-1',
  name: 'Push day',
  goal: 'Strength',
  targetMuscles: ['chest', 'triceps'],
  createdAt: '2026-05-01T00:00:00Z',
  lastUsedAt: '2026-05-25T00:00:00Z',
};

function setupHook(overrides: Partial<UseRoutinesReturn> = {}) {
  const defaults: UseRoutinesReturn = {
    routines: [],
    loading: false,
    error: null,
    refresh: jest.fn(async () => undefined),
    createRoutine: jest.fn(async ({ name, goal }) => ({
      id: 'new-id',
      name,
      goal: goal ?? null,
      targetMuscles: [],
      createdAt: '2026-05-30T00:00:00Z',
      lastUsedAt: null,
    })),
    updateRoutine: jest.fn(async (id, patch) => ({
      ...sampleRoutine,
      id,
      name: patch.name ?? sampleRoutine.name,
      goal: patch.goal ?? sampleRoutine.goal,
    })),
    deleteRoutine: jest.fn(async () => true),
  };

  mockUseRoutines.mockReturnValue({ ...defaults, ...overrides });
}

describe('RoutineEditorScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBack.mockClear();
    mockPush.mockClear();
    mockUseLocalSearchParams.mockReturnValue({});
    setupHook();
  });

  it('renders the new-routine form when no id param is provided', () => {
    render(<RoutineEditorScreen />);

    expect(screen.getByText('New routine')).toBeTruthy();
    expect(screen.getByText('Name your new routine')).toBeTruthy();
    expect(screen.getByPlaceholderText(/Routine name/i)).toBeTruthy();
    expect(screen.getByText('Save routine')).toBeTruthy();
    expect(screen.queryByText('Delete')).toBeNull();
  });

  it('creates a routine and navigates back', async () => {
    const createRoutine = jest.fn(async ({ name, goal }) => ({
      id: 'new-id',
      name,
      goal: goal ?? null,
      targetMuscles: [],
      createdAt: '2026-05-30T00:00:00Z',
      lastUsedAt: null,
    }));
    setupHook({ createRoutine });

    render(<RoutineEditorScreen />);

    fireEvent.changeText(screen.getByPlaceholderText(/Routine name/i), 'Push day');
    fireEvent.changeText(screen.getByPlaceholderText(/Goal/i), 'Strength');
    fireEvent.press(screen.getByText('Save routine'));

    await waitFor(() => expect(createRoutine).toHaveBeenCalledTimes(1));
    expect(createRoutine).toHaveBeenCalledWith({ name: 'Push day', goal: 'Strength' });
    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));
  });

  it('requires a non-empty routine name before saving', async () => {
    const createRoutine = jest.fn();
    setupHook({ createRoutine });

    render(<RoutineEditorScreen />);

    fireEvent.changeText(screen.getByPlaceholderText(/Routine name/i), '   ');
    fireEvent.press(screen.getByText('Save routine'));

    expect(await screen.findByText('Add a routine name before saving.')).toBeTruthy();
    expect(createRoutine).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('hydrates the form with existing routine values when editing', () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 'routine-1' });
    setupHook({ routines: [sampleRoutine] });

    render(<RoutineEditorScreen />);

    expect(screen.getByText('Edit routine')).toBeTruthy();
    expect(screen.getByText('Update routine details')).toBeTruthy();
    expect(screen.getByDisplayValue('Push day')).toBeTruthy();
    expect(screen.getByDisplayValue('Strength')).toBeTruthy();
    expect(screen.getByText('Update routine')).toBeTruthy();
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('updates the routine and navigates back', async () => {
    const updateRoutine = jest.fn(async (id, patch) => ({
      ...sampleRoutine,
      id,
      name: patch.name ?? sampleRoutine.name,
      goal: patch.goal ?? sampleRoutine.goal,
    }));
    mockUseLocalSearchParams.mockReturnValue({ id: 'routine-1' });
    setupHook({ routines: [sampleRoutine], updateRoutine });

    render(<RoutineEditorScreen />);

    fireEvent.changeText(screen.getByDisplayValue('Push day'), 'Push day v2');
    fireEvent.press(screen.getByText('Update routine'));

    await waitFor(() => expect(updateRoutine).toHaveBeenCalledTimes(1));
    expect(updateRoutine).toHaveBeenCalledWith('routine-1', { name: 'Push day v2', goal: 'Strength' });
    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));
  });

  it('deletes the routine and navigates back', async () => {
    const deleteRoutine = jest.fn(async () => true);
    mockUseLocalSearchParams.mockReturnValue({ id: 'routine-1' });
    setupHook({ routines: [sampleRoutine], deleteRoutine });

    render(<RoutineEditorScreen />);

    fireEvent.press(screen.getByText('Delete'));

    await waitFor(() => expect(deleteRoutine).toHaveBeenCalledWith('routine-1'));
    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));
  });

  it('shows a loading indicator while fetching a routine for editing', () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 'routine-1' });
    setupHook({ routines: [], loading: true });

    render(<RoutineEditorScreen />);

    expect(screen.getByText('Loading routine…')).toBeTruthy();
  });

  it('preserves user input when saving fails', async () => {
    const createRoutine = jest.fn(async () => null);
    setupHook({ createRoutine, error: 'Insert failed' });

    render(<RoutineEditorScreen />);

    fireEvent.changeText(screen.getByPlaceholderText(/Routine name/i), 'Leg day');
    fireEvent.press(screen.getByText('Save routine'));

    await waitFor(() => expect(createRoutine).toHaveBeenCalled());
    // Form value still present (user input preserved on failure)
    expect(screen.getByDisplayValue('Leg day')).toBeTruthy();
    // Error surfaced inline
    expect(await screen.findByText('Insert failed')).toBeTruthy();
    // Did not navigate back
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('surfaces a fetch error with no destructive navigation', () => {
    setupHook({ error: 'Network unavailable' });

    render(<RoutineEditorScreen />);

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Network unavailable')).toBeTruthy();
  });
});
