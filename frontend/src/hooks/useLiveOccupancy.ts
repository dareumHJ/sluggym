import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { LiveOccupancy } from '../types';

const POLL_INTERVAL_MS = 60_000;
const DEFAULT_API_BASE_URL = 'https://sluggym-backend.onrender.com';
const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');

function normalizeTimestamp(timestamp?: string | null) {
  if (!timestamp) return null;
  return timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T');
}

type UseLiveOccupancyState = {
  data: LiveOccupancy;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
};

const fallbackData: LiveOccupancy = {
  count: 0,
  location: 'East Gym',
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
      const normalizedPayload: LiveOccupancy = {
        ...payload,
        timestamp: normalizeTimestamp(payload.timestamp),
      };

      if (normalizedPayload.source !== 'api' || typeof normalizedPayload.count !== 'number') {
        setState({
          data: {
            ...fallbackData,
            location: normalizedPayload.location ?? fallbackData.location,
            timestamp: normalizedPayload.timestamp ?? null,
            message: normalizedPayload.message ?? fallbackData.message,
          },
          error: 'API connection failed',
          loading: false,
          refreshing: false,
        });
        return;
      }

      setState({ data: normalizedPayload, error: null, loading: false, refreshing: false });
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
