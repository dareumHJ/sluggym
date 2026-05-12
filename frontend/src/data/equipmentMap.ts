import type { EquipmentListItem } from '../hooks/useEquipment';
import type { MapStatus } from '../lib/mapLogic';

export type FloorName = '1st floor' | '2nd floor';

export type ZoneArea = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type EquipmentMapZoneDefinition = {
  id: string;
  name: string;
  floor: FloorName;
  color: string;
  areas: ZoneArea[];
  matchers: {
    names?: string[];
    categories?: string[];
  };
};

export type EquipmentMapZoneSummary = EquipmentMapZoneDefinition & {
  equipment: EquipmentListItem[];
  totalCount: number;
  availableCount: number;
  status: MapStatus;
};

export const EQUIPMENT_MAP_ZONES: EquipmentMapZoneDefinition[] = [
  {
    id: 'power-rack-zone',
    name: 'Power Rack Zone',
    floor: '1st floor',
    color: '#4F8CFF',
    areas: [
      { left: 6, top: 16, width: 30, height: 50 },
      { left: 8, top: 70, width: 24, height: 10 },
    ],
    matchers: { names: ['power rack', 'smith machine', 'squat rack'] },
  },
  {
    id: 'bench-zone',
    name: 'Bench Zone',
    floor: '1st floor',
    color: '#4BC08A',
    areas: [{ left: 40, top: 14, width: 24, height: 66 }],
    matchers: { names: ['bench', 'back extension', 'situp', 'landmine', 'glute ham', 'power tower'] },
  },
  {
    id: 'plate-loaded-zone',
    name: 'Plate-loaded Zone',
    floor: '1st floor',
    color: '#E4B84A',
    areas: [{ left: 68, top: 18, width: 24, height: 62 }],
    matchers: { names: ['leg press', 'hack squat', 'calf raise', 'glute drive'] },
  },
  {
    id: 'cable-zone',
    name: 'Cable Zone',
    floor: '2nd floor',
    color: '#4F8CFF',
    areas: [{ left: 8, top: 18, width: 24, height: 58 }],
    matchers: { names: ['cable', 'pulldown', 'row'], categories: ['cables'] },
  },
  {
    id: 'cardio-zone',
    name: 'Cardio Zone',
    floor: '2nd floor',
    color: '#E4B84A',
    areas: [{ left: 36, top: 18, width: 24, height: 58 }],
    matchers: { names: ['elliptical', 'motion trainer', 'rowing', 'stair', 'treadmill', 'bike', 'cycle'], categories: ['cardio'] },
  },
  {
    id: 'machine-zone',
    name: 'Machine Zone',
    floor: '2nd floor',
    color: '#4BC08A',
    areas: [{ left: 64, top: 18, width: 26, height: 58 }],
    matchers: { categories: ['machines'] },
  },
  {
    id: 'functional-area',
    name: 'Functional Area',
    floor: '2nd floor',
    color: '#A277FF',
    areas: [{ left: 24, top: 80, width: 52, height: 10 }],
    matchers: { names: ['yoga', 'plyometric', 'box'] },
  },
];

function normalize(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase();
}

function matchesZone(definition: EquipmentMapZoneDefinition, equipment: EquipmentListItem) {
  const normalizedName = normalize(equipment.name);
  const normalizedCategory = normalize(equipment.category);
  const names = definition.matchers.names ?? [];
  const categories = definition.matchers.categories ?? [];

  return names.some((name) => normalizedName.includes(normalize(name))) || categories.some((category) => normalizedCategory.includes(normalize(category)));
}

function zoneStatus(equipment: EquipmentListItem[], statuses: Record<string, MapStatus>): MapStatus {
  if (equipment.length === 0) return 'unknown';

  let hasFree = false;
  let hasOccupied = false;
  let hasUnknown = false;

  for (const item of equipment) {
    const status = statuses[item.id] ?? 'unknown';
    if (status === 'free') hasFree = true;
    if (status === 'occupied') hasOccupied = true;
    if (status === 'unknown') hasUnknown = true;
  }

  if (hasFree) return 'free';
  if (hasOccupied && !hasUnknown) return 'occupied';
  return 'unknown';
}

export function buildEquipmentMapZones(equipment: EquipmentListItem[], statuses: Record<string, MapStatus>) {
  const assigned = new Set<string>();

  return EQUIPMENT_MAP_ZONES.map((definition) => {
    const zoneEquipment = equipment.filter((item) => {
      const matched = matchesZone(definition, item);
      if (matched) assigned.add(item.id);
      return matched;
    });

    const totalCount = zoneEquipment.length;
    const availableCount = zoneEquipment.filter((item) => (statuses[item.id] ?? 'unknown') === 'free').length;

    return {
      ...definition,
      equipment: zoneEquipment,
      totalCount,
      availableCount,
      status: zoneStatus(zoneEquipment, statuses),
    } satisfies EquipmentMapZoneSummary;
  });
}
