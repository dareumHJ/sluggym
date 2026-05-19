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
  zoneNumber: number;
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
    zoneNumber: 1,
    color: '#4778C7',
    areas: [
      { left: 4, top: 26, width: 25, height: 58 },
      { left: 43, top: 86, width: 30, height: 6 },
    ],
    matchers: { names: ['power rack', 'smith machine', 'squat rack'] },
  },
  {
    id: 'bench-zone',
    name: 'Bench Zone',
    floor: '1st floor',
    zoneNumber: 2,
    color: '#4F8432',
    areas: [{ left: 43, top: 6, width: 51, height: 59 }],
    matchers: { names: ['bench', 'back extension', 'situp', 'landmine', 'glute ham', 'power tower'] },
  },
  {
    id: 'plate-loaded-zone',
    name: 'Plate-loaded Zone',
    floor: '1st floor',
    zoneNumber: 3,
    color: '#FFC20A',
    areas: [
      { left: 4, top: 6, width: 25, height: 14 },
      { left: 43, top: 68, width: 51, height: 14 },
    ],
    matchers: { names: ['leg press', 'hack squat', 'calf raise', 'glute drive'] },
  },
  {
    id: 'cable-zone',
    name: 'Cable Zone',
    floor: '2nd floor',
    zoneNumber: 1,
    color: '#4778C7',
    areas: [
      { left: 4, top: 4, width: 10, height: 19 },
      { left: 4, top: 4, width: 58, height: 6 },
      { left: 75, top: 49, width: 27, height: 21 },
    ],
    matchers: { names: ['cable', 'pulldown', 'row'], categories: ['cables'] },
  },
  {
    id: 'cardio-zone',
    name: 'Cardio Zone',
    floor: '2nd floor',
    zoneNumber: 2,
    color: '#FFC20A',
    areas: [
      { left: 4, top: 29, width: 18, height: 38 },
      { left: 37, top: 49, width: 27, height: 21 },
    ],
    matchers: { names: ['elliptical', 'motion trainer', 'rowing', 'stair', 'treadmill', 'bike', 'cycle'], categories: ['cardio'] },
  },
  {
    id: 'machine-zone',
    name: 'Machine Zone',
    floor: '2nd floor',
    zoneNumber: 3,
    color: '#05B65A',
    areas: [
      { left: 37, top: 23, width: 27, height: 19 },
      { left: 4, top: 78, width: 42, height: 21 },
    ],
    matchers: { categories: ['machines'] },
  },
  {
    id: 'functional-area',
    name: 'Functional Area',
    floor: '2nd floor',
    zoneNumber: 4,
    color: '#9E63D2',
    areas: [
      { left: 75, top: 15, width: 27, height: 27 },
      { left: 63, top: 78, width: 39, height: 21 },
    ],
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
