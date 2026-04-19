import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { LiveOccupancy } from '../types';

const POLL_INTERVAL_MS = 60_000;
const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

type UseLiveOccupancyState = {
  data: LiveOccupancy;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
};

const fallbackData: LiveOccupancy = {
  count: 0,
  location: 'East Field House',
  source: 'fallback',
  timestamp: null,
  message: 'API connection failed',
};

export function useLiveOccupancy() {
  const [state, setState] = useState<UseLiveOccupancyState>({
    data: fallbackData,
    error: apiBaseUrl ? null : 'API connection failed',
    loading: true,
    refreshing: false,
  });
  const inFlightRef = useRef(false);

  const reload = useCallback(async () => {
    if (!apiBaseUrl) {
      setState({
        data: fallbackData,
        error: 'API connection failed',
        loading: false,
        refreshing: false,
      });
      return;
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setState((prev) => {
      const hasLiveSnapshot = prev.data.source === 'api' && typeof prev.data.count === 'number';
      return {
        data: prev.data,
        error: null,
        loading: !hasLiveSnapshot,
        refreshing: hasLiveSnapshot,
      };
    });

    try {
      const response = await fetch(`${apiBaseUrl}/occupancy`);
      if (!response.ok) {
        throw new Error(`Live headcount request failed (${response.status}).`);
      }

      const payload = (await response.json()) as LiveOccupancy;
      if (payload.source !== 'api' || typeof payload.count !== 'number') {
        setState({
          data: {
            ...fallbackData,
            location: payload.location ?? fallbackData.location,
            timestamp: payload.timestamp ?? null,
            message: payload.message ?? fallbackData.message,
          },
          error: 'API connection failed',
          loading: false,
          refreshing: false,
        });
        return;
      }

      setState({ data: payload, error: null, loading: false, refreshing: false });
    } catch {
      setState((prev) => ({
        data: {
          ...fallbackData,
          location: prev.data.location ?? fallbackData.location,
          timestamp: prev.data.timestamp ?? null,
        },
        error: 'API connection failed',
        loading: false,
        refreshing: false,
      }));
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    void reload();

    const intervalId = setInterval(() => {
      void reload();
    }, POLL_INTERVAL_MS);

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void reload();
      }
    });

    return () => {
      clearInterval(intervalId);
      appStateSubscription.remove();
    };
  }, [reload]);

  return {
    ...state,
    reload,
  };
}
