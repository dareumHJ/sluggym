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
    zoneNumber: 4,
    color: '#4778C7',
    areas: [
      { left: 5, top: 5, width: 56, height: 16 },
      { left: 76, top: 50, width: 22, height: 19 },
    ],
    matchers: { names: ['cable', 'pulldown', 'row'], categories: ['cables'] },
  },
  {
    id: 'cardio-zone',
    name: 'Cardio Zone',
    floor: '2nd floor',
    zoneNumber: 5,
    color: '#FFC20A',
    areas: [
      { left: 5, top: 31, width: 17, height: 35 },
      { left: 38, top: 50, width: 25, height: 19 },
    ],
    matchers: { names: ['elliptical', 'motion trainer', 'rowing', 'stair', 'treadmill', 'bike', 'cycle'], categories: ['cardio'] },
  },
  {
    id: 'machine-zone',
    name: 'Machine Zone',
    floor: '2nd floor',
    zoneNumber: 6,
    color: '#05B65A',
    areas: [
      { left: 38, top: 27, width: 25, height: 17 },
      { left: 5, top: 79, width: 40, height: 19 },
    ],
    matchers: { categories: ['selectorized machine', 'machine', 'machines'] },
  },
  {
    id: 'functional-area-zone',
    name: 'Functional Area',
    floor: '2nd floor',
    zoneNumber: 7,
    color: '#7C3AED',
    areas: [
      { left: 82, top: 5, width: 17, height: 23 },
      { left: 57, top: 79, width: 40, height: 19 },
    ],
    matchers: {
      names: ['plyometric', 'box', 'battle rope', 'medicine ball', 'mat', 'trx', 'functional'],
      categories: ['functional'],
    },
  },
];

function normalize(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase();
}

function matchesZone(definition: EquipmentMapZoneDefinition, equipment: EquipmentListItem) {
  const normalizedName = normalize(equipment.name);
  const normalizedCategory = normalize(equipment.category);
  const normalizedLocation = normalize(equipment.location);
  const names = definition.matchers.names ?? [];
  const categories = definition.matchers.categories ?? [];

  if (normalizedLocation && normalizedLocation !== normalize(definition.floor)) return false;

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
