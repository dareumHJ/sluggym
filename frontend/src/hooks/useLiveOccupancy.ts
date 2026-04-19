import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { LiveOccupancy } from '../types';

const POLL_INTERVAL_MS = 60_000;
const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

type UseLiveOccupancyState = {
  data: LiveOccupancy | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
};

export function useLiveOccupancy() {
  const [state, setState] = useState<UseLiveOccupancyState>({
    data: null,
    error: apiBaseUrl ? null : 'Set EXPO_PUBLIC_API_BASE_URL to load live headcount.',
    loading: true,
    refreshing: false,
  });
  const inFlightRef = useRef(false);

  const reload = useCallback(async () => {
    if (!apiBaseUrl) {
      setState({
        data: null,
        error: 'Set EXPO_PUBLIC_API_BASE_URL to load live headcount.',
        loading: false,
        refreshing: false,
      });
      return;
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setState((prev) => ({
      data: prev.data,
      error: null,
      loading: prev.data === null,
      refreshing: prev.data !== null,
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/occupancy`);
      if (!response.ok) {
        throw new Error(`Live headcount request failed (${response.status}).`);
      }

      const payload = (await response.json()) as LiveOccupancy;
      if (payload.source !== 'api' || typeof payload.count !== 'number') {
        throw new Error(payload.message ?? 'Live headcount is currently unavailable.');
      }

      setState({ data: payload, error: null, loading: false, refreshing: false });
    } catch (error) {
      setState((prev) => ({
        data: prev.data,
        error: error instanceof Error ? error.message : 'Unable to load live headcount.',
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
