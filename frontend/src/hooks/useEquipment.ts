import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { LiveEquipment } from '../types';

type UseEquipmentState = {
  equipment: LiveEquipment[];
  error: string | null;
  loading: boolean;
};

export function useEquipment() {
  const [state, setState] = useState<UseEquipmentState>({
    equipment: [],
    error: null,
    loading: true,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, error: null, loading: true }));

    const { data, error } = await supabase
      .from('gym-equipment')
      .select('id,name,category,location,quantity,description')
      .order('name');

    if (error) {
      setState({ equipment: [], error: error.message, loading: false });
      return;
    }

    setState({
      equipment: (data ?? []) as LiveEquipment[],
      error: null,
      loading: false,
    });
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    equipment: state.equipment,
    error: state.error,
    loading: state.loading,
    reload,
  };
}
