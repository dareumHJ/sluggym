import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';

export interface EquipmentListItem {
  id: string;
  name: string;
  category: string;
  location: string | null;
  quantity: number;
  description?: string | null;
}

interface UseEquipmentReturn {
  equipment: EquipmentListItem[];
  filteredEquipment: EquipmentListItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface EquipmentRow {
  id: number | string;
  name: string;
  category: string;
  location: string | null;
  quantity?: number | null;
  total_count?: number | null;
  available_count?: number | null;
  description?: string | null;
}

function normalizeEquipmentRow(row: EquipmentRow): EquipmentListItem {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    location: row.location,
    quantity: row.available_count ?? row.quantity ?? row.total_count ?? 0,
    description: row.description ?? null,
  };
}

export function useEquipment(query = '', category = 'All'): UseEquipmentReturn {
  const [equipment, setEquipment] = useState<EquipmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    const { data, error: fetchError } = await supabase
      .from('gym_equipment')
      .select('id, name, category, location, total_count, available_count, description')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (!isMountedRef.current) return;

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setEquipment((data ?? []).map(normalizeEquipmentRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refresh();

    const channel = supabase
      .channel('gym-equipment-ui-refresh')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gym_equipment' },
        () => {
          void refresh();
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError('Realtime connection interrupted. Pulling latest equipment data…');
          void refresh();
        }
      });

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void refresh();
      }
    });

    return () => {
      isMountedRef.current = false;
      appStateSubscription.remove();
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(equipment.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b))],
    [equipment],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  const filteredEquipment = useMemo(
    () =>
      equipment.filter((item) => {
        const matchesCategory =
          normalizedCategory === '' ||
          normalizedCategory === 'all' ||
          item.category.toLowerCase() === normalizedCategory;
        const matchesQuery =
          normalizedQuery === '' ||
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery) ||
          item.location?.toLowerCase().includes(normalizedQuery) ||
          item.description?.toLowerCase().includes(normalizedQuery);

        return matchesCategory && Boolean(matchesQuery);
      }),
    [equipment, normalizedCategory, normalizedQuery],
  );

  return {
    equipment,
    filteredEquipment,
    categories,
    loading,
    error,
    refresh,
  };
}
