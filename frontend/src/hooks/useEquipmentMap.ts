import { useEquipment, type EquipmentListItem } from './useEquipment';
import { getEquipmentMapStatus, type MapState } from '../lib/mapLogic';

/**
 * A wrapper hook that bridges the existing realtime equipment logic 
 * to the upcoming Gym Map UI.
 * 
 * Reuses the existing Supabase WebSocket subscription to avoid duplicate channels.
 */
export function useEquipmentMap(query = '', category = 'All'): MapState & { equipment: EquipmentListItem[]; refresh: () => Promise<void> } {
  const { equipment, loading, error, refresh } = useEquipment(query, category);

  // Translate the payload into the discrete statuses for the Map UI
  const mapState = getEquipmentMapStatus(equipment, loading, error);

  return { ...mapState, equipment, refresh };
}
