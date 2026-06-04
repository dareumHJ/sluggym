import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  aggregateHourlyHeadcount,
  getGymLocalWeekdayIndex,
  getGymLocalWeekdayName,
  getRecentSameWeekdayWindows,
  hasHeadcountSamples,
  hourlyBucketsToPopularTimes,
  type HeadcountHistoryRow,
  type HourlyHeadcountBucket,
} from '../lib/headcountHistory';

type UseHeadcountHistoryState = {
  buckets: HourlyHeadcountBucket[];
  popularTimes: number[];
  loading: boolean;
  error: string | null;
  empty: boolean;
  weekdayName: string;
};

const LOOKBACK_DAYS = 28;
const HISTORY_WINDOW_PAGE_SIZE = 2000;
const DEFAULT_GYM_LOCATION = '405 E Field Service Rd, Santa Cruz, CA 95064 미국';

async function resolveGymId(locationName: string) {
  let { data, error } = await supabase
    .from('gyms')
    .select('id')
    .eq('location', locationName);

  if (error) throw error;

  if (!data || data.length === 0) {
    const fallback = await supabase
      .from('gyms')
      .select('id')
      .eq('name', locationName);

    if (fallback.error) throw fallback.error;
    data = fallback.data;
  }

  if (!data || data.length === 0) {
    throw new Error(`Gym location "${locationName}" not found.`);
  }

  return data[0].id as string;
}

export function useHeadcountHistory(days = LOOKBACK_DAYS, targetDate?: Date, locationName = DEFAULT_GYM_LOCATION) {
  const [defaultTargetDate] = useState(() => new Date());
  const effectiveTargetDate = targetDate ?? defaultTargetDate;
  const targetTime = effectiveTargetDate.getTime();
  const currentWeekdayIndex = getGymLocalWeekdayIndex(effectiveTargetDate);
  const weekdayName = getGymLocalWeekdayName(effectiveTargetDate);
  const initialBuckets = aggregateHourlyHeadcount([], currentWeekdayIndex);
  const [state, setState] = useState<UseHeadcountHistoryState>({
    buckets: initialBuckets,
    popularTimes: hourlyBucketsToPopularTimes(initialBuckets),
    loading: true,
    error: null,
    empty: true,
    weekdayName,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const gymId = await resolveGymId(locationName);
      const weekCount = Math.max(1, Math.ceil(days / 7));
      const windows = getRecentSameWeekdayWindows(new Date(targetTime), weekCount);
      const windowResults = await Promise.all(
        windows.map(async (window) => {
          const { data, error } = await supabase
            .from('gym_headcount_history')
            .select('count, sampled_at')
            .eq('gym_id', gymId)
            .gte('sampled_at', window.startIso)
            .lt('sampled_at', window.endIso)
            .order('sampled_at', { ascending: true })
            .range(0, HISTORY_WINDOW_PAGE_SIZE - 1);

          if (error) throw error;

          return (data ?? []) as HeadcountHistoryRow[];
        }),
      );

      const buckets = aggregateHourlyHeadcount(windowResults.flat(), currentWeekdayIndex);
      const empty = !hasHeadcountSamples(buckets);

      setState({
        buckets,
        popularTimes: hourlyBucketsToPopularTimes(buckets),
        loading: false,
        error: null,
        empty,
        weekdayName,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Headcount history unavailable',
        empty: true,
      }));
    }
  }, [currentWeekdayIndex, days, locationName, targetTime, weekdayName]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    ...state,
    reload,
  };
}
