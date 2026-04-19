import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { LiveEquipment } from '../types';

type UseEquipmentState = {
  equipment: LiveEquipment[];
  error: string | null;
  loading: boolean;
};

export interface EquipmentListItem {
  id: string;
  name: string;
  type: string;
  location: string | null;
  quantity: number;
}

interface UseEquipmentOptions {
  query?: string;
  type?: string;
}

interface UseEquipmentReturn {
  equipment: EquipmentListItem[];
  filteredEquipment: EquipmentListItem[];
  types: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface EquipmentRow {
  id: number | string;
  name: string;
  type: string;
  location: string | null;
  quantity: number | null;
}

function normalizeEquipmentRow(row: EquipmentRow): EquipmentListItem {
  return {
    id: String(row.id),
    name: row.name,
    type: row.type,
    location: row.location,
    quantity: row.quantity ?? 0,
  };
}

export function useEquipment(options: UseEquipmentOptions = {}): UseEquipmentReturn {
  const { query = '', type = 'All' } = options;
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
      .from('equipment')
      .select('id, name, type, location, quantity')
      .order('name', { ascending: true });

    if (!isMountedRef.current) {
      return;
    }

    if (fetchError) {
      setEquipment([]);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setEquipment((data ?? []).map(normalizeEquipmentRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  const types = useMemo(
    () => ['All', ...Array.from(new Set(equipment.map((item) => item.type))).sort((a, b) => a.localeCompare(b))],
    [equipment],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedType = type.trim().toLowerCase();

  const filteredEquipment = useMemo(
    () =>
      equipment.filter((item) => {
        const matchesType =
          normalizedType === '' || normalizedType === 'all' || item.type.toLowerCase() === normalizedType;
        const matchesQuery =
          normalizedQuery === '' ||
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.type.toLowerCase().includes(normalizedQuery) ||
          item.location?.toLowerCase().includes(normalizedQuery);

        return matchesType && Boolean(matchesQuery);
      }),
    [equipment, normalizedQuery, normalizedType],
  );

  return {
    equipment,
    filteredEquipment,
    types,
    loading,
    error,
    refresh,
  };
}
