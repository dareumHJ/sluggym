import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { WeeklyCongestionCell } from '../components/WeeklyCongestionHeatmap';

interface UseWeeklyCongestionReturn {
  data: WeeklyCongestionCell[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const DEFAULT_DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_HOUR_ORDER = ['6a', '9a', '12p', '3p', '6p', '9p'];

// Capacity Warning: Neither gym_headcount_history nor gyms table has a capacity column.
// Defaulting capacity to 150 as defined in the frontend stats/home screens.
const DEFAULT_GYM_CAPACITY = 150;

function getHourLabel(hour: number): string | null {
  if (hour >= 6 && hour < 9) return '6a';
  if (hour >= 9 && hour < 12) return '9a';
  if (hour >= 12 && hour < 15) return '12p';
  if (hour >= 15 && hour < 18) return '3p';
  if (hour >= 18 && hour < 21) return '6p';
  if (hour >= 21 && hour < 24) return '9p';
  return null;
}

export function useWeeklyCongestion(locationName: string, dateRangeDays = 30): UseWeeklyCongestionReturn {
  const [data, setData] = useState<WeeklyCongestionCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    if (!locationName) return;

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      // 1. Look up the gym ID from the gyms table
      let { data: gymData, error: gymError } = await supabase
        .from('gyms')
        .select('id')
        .eq('name', locationName);

      if (gymError) throw gymError;

      // Fallback: If not found by name, search by location field
      if (!gymData || gymData.length === 0) {
        const fallbackRes = await supabase
          .from('gyms')
          .select('id')
          .eq('location', locationName);

        if (fallbackRes.error) throw fallbackRes.error;
        gymData = fallbackRes.data;
      }

      if (!gymData || gymData.length === 0) {
        throw new Error(`Gym location "${locationName}" not found.`);
      }

      const gymId = gymData[0].id;

      // 2. Fetch headcount history within the date range
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - dateRangeDays * 24 * 60 * 60 * 1000).toISOString();

      const { data: historyData, error: historyError } = await supabase
        .from('gym_headcount_history')
        .select('count, sampled_at')
        .eq('gym_id', gymId)
        .gte('sampled_at', startDate)
        .lte('sampled_at', endDate);

      if (historyError) throw historyError;

      // 3. Setup bucket groups
      const buckets: Record<string, number[]> = {};
      for (const d of DEFAULT_DAY_ORDER) {
        for (const h of DEFAULT_HOUR_ORDER) {
          buckets[`${d}-${h}`] = [];
        }
      }

      // Formatters for local time (Pacific Time / America/Los_Angeles for UCSC Slugs)
      const dayFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: 'America/Los_Angeles',
      });

      const hourFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'America/Los_Angeles',
      });

      // 4. Populate buckets with sample counts
      if (historyData) {
        for (const sample of historyData) {
          const date = new Date(sample.sampled_at);
          if (isNaN(date.getTime())) continue;

          const dayStr = dayFormatter.format(date);
          const day = dayStr.substring(0, 3); // "Mon", "Tue", etc.

          const hour = parseInt(hourFormatter.format(date), 10);
          const hourLabel = getHourLabel(hour);

          if (hourLabel && DEFAULT_DAY_ORDER.includes(day)) {
            buckets[`${day}-${hourLabel}`].push(sample.count);
          }
        }
      }

      // 5. Aggregate averages and intensities into the final structure
      const cells: WeeklyCongestionCell[] = [];
      for (const day of DEFAULT_DAY_ORDER) {
        for (const hourLabel of DEFAULT_HOUR_ORDER) {
          const counts = buckets[`${day}-${hourLabel}`];

          if (counts.length > 0) {
            const averageCount = counts.reduce((sum, val) => sum + val, 0) / counts.length;
            const intensity = Math.round((averageCount / DEFAULT_GYM_CAPACITY) * 100);

            cells.push({
              day,
              hourLabel,
              intensity: Math.max(0, Math.min(100, intensity)),
            });
          } else {
            // Missing data explicitly handled as null
            cells.push({
              day,
              hourLabel,
              intensity: null,
            });
          }
        }
      }

      if (isMountedRef.current) {
        setData(cells);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || 'Failed to fetch historical headcount data.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [locationName, dateRangeDays]);

  useEffect(() => {
    isMountedRef.current = true;
    void refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
