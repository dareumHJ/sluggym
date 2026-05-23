import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  aggregateHourlyHeadcount,
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
};

const LOOKBACK_DAYS = 14;

function lookbackStart(days: number) {
  const start = new Date();
  start.setDate(start.getDate() - days);
  return start.toISOString();
}

export function useHeadcountHistory(days = LOOKBACK_DAYS) {
  const initialBuckets = aggregateHourlyHeadcount([]);
  const [state, setState] = useState<UseHeadcountHistoryState>({
    buckets: initialBuckets,
    popularTimes: hourlyBucketsToPopularTimes(initialBuckets),
    loading: true,
    error: null,
    empty: true,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('gym_headcount_history')
        .select('count, capacity, sampled_at')
        .gte('sampled_at', lookbackStart(days))
        .order('sampled_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const buckets = aggregateHourlyHeadcount((data ?? []) as HeadcountHistoryRow[]);
      const empty = !hasHeadcountSamples(buckets);

      setState({
        buckets,
        popularTimes: hourlyBucketsToPopularTimes(buckets),
        loading: false,
        error: null,
        empty,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Headcount history unavailable',
        empty: true,
      }));
    }
  }, [days]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    ...state,
    reload,
  };
}
