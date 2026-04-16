import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useEquipment() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('category');

      if (!error) setEquipment(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { equipment, loading };
}