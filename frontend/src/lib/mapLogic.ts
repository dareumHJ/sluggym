export type MapStatus = 'free' | 'occupied' | 'unknown';

type EquipmentStatusInput = {
  id: string | number;
  quantity?: number | null;
};

export interface MapState {
  statuses: Record<string, MapStatus>;
  globalState: 'loading' | 'error' | 'ready' | 'empty';
}

/**
 * Transforms the live equipment list from Supabase into a status model 
 * that the Gym Map UI can easily consume for color-coding.
 */
export function getEquipmentMapStatus(
  equipmentList: EquipmentStatusInput[] | null,
  loading: boolean,
  error: Error | string | null
): MapState {
  const hasEquipment = Boolean(equipmentList && equipmentList.length > 0);

  if (error && !hasEquipment) {
    return { statuses: {}, globalState: 'error' };
  }

  if (loading && !hasEquipment) {
    return { statuses: {}, globalState: 'loading' };
  }

  if (!equipmentList || equipmentList.length === 0) {
    return { statuses: {}, globalState: 'empty' };
  }

  const statuses: Record<string, MapStatus> = {};

  for (const equipment of equipmentList) {
    // If we have an ID but quantity is undefined or null, it's unknown
    if (equipment.quantity === undefined || equipment.quantity === null) {
      statuses[String(equipment.id)] = 'unknown';
    } else if (equipment.quantity > 0) {
      statuses[String(equipment.id)] = 'free';
    } else {
      statuses[String(equipment.id)] = 'occupied';
    }
  }

  return { statuses, globalState: 'ready' };
}
