import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsMounted } from './useIsMounted';
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
  connectionState: 'live' | 'reconnecting' | 'offline';
  refresh: () => Promise<void>;
  simulateRealtimeDisconnect: () => void;
}

const REALTIME_RECONNECT_BASE_MS = 1_000;
const REALTIME_RECONNECT_MAX_MS = 30_000;
let equipmentChannelCounter = 0;

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

function areEquipmentListsEqual(a: EquipmentListItem[], b: EquipmentListItem[]) {
  if (a.length !== b.length) return false;

  for (let index = 0; index < a.length; index += 1) {
    const left = a[index];
    const right = b[index];
    if (
      left.id !== right.id ||
      left.name !== right.name ||
      left.category !== right.category ||
      left.location !== right.location ||
      left.quantity !== right.quantity ||
      left.description !== right.description
    ) {
      return false;
    }
  }

  return true;
}

export function useEquipment(query = '', category = 'All'): UseEquipmentReturn {
  const [equipment, setEquipment] = useState<EquipmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<'live' | 'reconnecting' | 'offline'>('reconnecting');
  const isMountedRef = useIsMounted();
  const connectionStateRef = useRef<'live' | 'reconnecting' | 'offline'>('reconnecting');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const channelNameRef = useRef(`gym-equipment-ui-refresh-${++equipmentChannelCounter}`);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const equipmentRef = useRef<EquipmentListItem[]>([]);

  const refreshInternal = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (isMountedRef.current) {
      if (!silent && equipmentRef.current.length === 0) {
        setLoading(true);
      }
      if (!silent) {
        setError(null);
      }
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

    const nextEquipment = (data ?? []).map(normalizeEquipmentRow);
    equipmentRef.current = nextEquipment;
    setEquipment((current) => {
      if (areEquipmentListsEqual(current, nextEquipment)) return current;
      return nextEquipment;
    });
    setError(null);
    setLoading(false);
  }, []);

  const refresh = useCallback(() => refreshInternal({ silent: false }), [refreshInternal]);

  const updateConnectionState = useCallback((nextState: 'live' | 'reconnecting' | 'offline') => {
    connectionStateRef.current = nextState;
    setConnectionState(nextState);
  }, []);

  useEffect(() => {
    void refreshInternal({ silent: false });

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const removeCurrentChannel = () => {
      const channel = channelRef.current;
      channelRef.current = null;
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };

    const subscribeToEquipment = () => {
      if (!isMountedRef.current) return;

      removeCurrentChannel();

      const channel = supabase
        .channel(channelNameRef.current)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'gym_equipment' },
          () => {
            void refreshInternal({ silent: true });
          },
        )
        .subscribe((status) => {
          if (!isMountedRef.current) return;

          if (status === 'SUBSCRIBED') {
            reconnectAttemptRef.current = 0;
            updateConnectionState('live');
            return;
          }

          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            updateConnectionState(status === 'CLOSED' ? 'offline' : 'reconnecting');
            if (equipmentRef.current.length === 0) {
              setError('Realtime connection interrupted. Pulling latest equipment data…');
            }
            void refreshInternal({ silent: true });

            clearReconnectTimer();
            const delay = Math.min(
              REALTIME_RECONNECT_BASE_MS * 2 ** reconnectAttemptRef.current,
              REALTIME_RECONNECT_MAX_MS,
            );
            reconnectAttemptRef.current += 1;
            reconnectTimerRef.current = setTimeout(() => {
              updateConnectionState('reconnecting');
              subscribeToEquipment();
            }, delay);
          }
        });

      channelRef.current = channel;
    };

    subscribeToEquipment();

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        if (connectionStateRef.current !== 'live') {
          reconnectAttemptRef.current = 0;
          clearReconnectTimer();
          subscribeToEquipment();
        }
        void refreshInternal({ silent: equipmentRef.current.length > 0 });
      }
    });

    return () => {
      clearReconnectTimer();
      appStateSubscription.remove();
      removeCurrentChannel();
    };
  }, [refreshInternal, updateConnectionState]);

  const simulateRealtimeDisconnect = useCallback(() => {
    updateConnectionState('offline');
    setError('Realtime connection interrupted. Pulling latest equipment data…');
  }, [updateConnectionState]);

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
    connectionState,
    refresh,
    simulateRealtimeDisconnect,
  };
}
