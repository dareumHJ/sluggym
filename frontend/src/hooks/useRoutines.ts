import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Routine {
  id: string;
  name: string;
  goal: string | null;
  targetMuscles: string[];
  createdAt: string;
  lastUsedAt: string | null;
}

interface UseRoutinesReturn {
  routines: Routine[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createRoutine: (input: { name: string; goal?: string | null }) => Promise<Routine | null>;
  updateRoutine: (id: string, patch: { name?: string; goal?: string | null }) => Promise<Routine | null>;
  deleteRoutine: (id: string) => Promise<boolean>;
}

interface RoutineRow {
  id: string;
  name: string;
  goal: string | null;
  target_muscles: string[] | null;
  created_at: string;
  last_used_at: string | null;
}

function normalizeRoutineRow(row: RoutineRow): Routine {
  return {
    id: row.id,
    name: row.name,
    goal: row.goal,
    targetMuscles: row.target_muscles ?? [],
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
  };
}

function compareByLastUsed(a: Routine, b: Routine): number {
  // Most recent last_used_at first, nulls last (never-used routines at bottom)
  if (a.lastUsedAt === null && b.lastUsedAt === null) {
    return b.createdAt.localeCompare(a.createdAt);
  }
  if (a.lastUsedAt === null) return 1;
  if (b.lastUsedAt === null) return -1;
  return b.lastUsedAt.localeCompare(a.lastUsedAt);
}

export function useRoutines(): UseRoutinesReturn {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setRoutines([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('routines_with_last_used')
      .select('id, name, goal, target_muscles, created_at, last_used_at');

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const normalized = (data ?? []).map(normalizeRoutineRow);
    normalized.sort(compareByLastUsed);
    setRoutines(normalized);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createRoutine = useCallback(
    async ({ name, goal }: { name: string; goal?: string | null }): Promise<Routine | null> => {
      if (!user) {
        setError('You must be signed in to save a routine.');
        return null;
      }

      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        setError('Routine name cannot be empty.');
        return null;
      }

      const { data, error: insertError } = await supabase
        .from('routines')
        .insert({
          user_id: user.id,
          name: trimmedName,
          goal: goal?.trim() || null,
          target_muscles: [],
        })
        .select('id, name, goal, target_muscles, created_at')
        .single();

      if (insertError || !data) {
        setError(insertError?.message ?? 'Failed to create routine.');
        return null;
      }

      const created = normalizeRoutineRow({ ...data, last_used_at: null });
      setRoutines((prev) => {
        const next = [created, ...prev];
        next.sort(compareByLastUsed);
        return next;
      });
      setError(null);
      return created;
    },
    [user],
  );

  const updateRoutine = useCallback(
    async (
      id: string,
      patch: { name?: string; goal?: string | null },
    ): Promise<Routine | null> => {
      if (!user) {
        setError('You must be signed in to update a routine.');
        return null;
      }

      const updates: Record<string, string | null> = {};
      if (patch.name !== undefined) {
        const trimmed = patch.name.trim();
        if (trimmed.length === 0) {
          setError('Routine name cannot be empty.');
          return null;
        }
        updates.name = trimmed;
      }
      if (patch.goal !== undefined) {
        updates.goal = patch.goal?.trim() || null;
      }

      if (Object.keys(updates).length === 0) {
        return routines.find((routine) => routine.id === id) ?? null;
      }

      const { data, error: updateError } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', id)
        .select('id, name, goal, target_muscles, created_at')
        .single();

      if (updateError || !data) {
        setError(updateError?.message ?? 'Failed to update routine.');
        return null;
      }

      const previous = routines.find((routine) => routine.id === id);
      const updated = normalizeRoutineRow({
        ...data,
        last_used_at: previous?.lastUsedAt ?? null,
      });
      setRoutines((prev) => prev.map((routine) => (routine.id === id ? updated : routine)));
      setError(null);
      return updated;
    },
    [user, routines],
  );

  const deleteRoutine = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        setError('You must be signed in to delete a routine.');
        return false;
      }

      const { error: deleteError } = await supabase
        .from('routines')
        .delete()
        .eq('id', id);

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      setRoutines((prev) => prev.filter((routine) => routine.id !== id));
      setError(null);
      return true;
    },
    [user],
  );

  return {
    routines,
    loading,
    error,
    refresh,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
}
