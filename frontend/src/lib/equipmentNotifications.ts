// src/lib/equipmentNotifications.ts
// Pure detection logic for the equipment-free notification feature.
// No React, no Supabase — just decide which equipment items have just
// transitioned from busy (available=0) to free (available>0) for items
// the user is watching.

export interface EquipmentSnapshot {
  id: string;
  name: string;
  available: number;
}

export interface FreeTransition {
  equipmentId: string;
  equipmentName: string;
}

/**
 * Detect equipment items that just became available for users who are
 * watching them, while respecting a per-equipment debounce window.
 *
 * @param previous - snapshot of equipment availability from the previous render
 * @param current - latest snapshot of equipment availability
 * @param watchlist - set of equipment ids the user is watching
 * @param lastNotifiedAt - map of equipmentId -> timestamp (ms) of last notification
 * @param now - current timestamp (ms), passed in for deterministic tests
 * @param debounceMs - minimum time between notifications for the same equipment
 */
export function detectFreeTransitions(
  previous: EquipmentSnapshot[],
  current: EquipmentSnapshot[],
  watchlist: Set<string>,
  lastNotifiedAt: Map<string, number>,
  now: number,
  debounceMs: number,
): FreeTransition[] {
  const transitions: FreeTransition[] = [];
  const prevById = new Map(previous.map((eq) => [eq.id, eq]));

  for (const eq of current) {
    if (!watchlist.has(eq.id)) continue;

    const prev = prevById.get(eq.id);
    // First time we see this equipment — there is no transition to detect.
    // This avoids spurious notifications on app startup.
    if (!prev) continue;

    const wasOccupied = prev.available === 0;
    const isNowFree = eq.available > 0;
    if (!wasOccupied || !isNowFree) continue;

    // Debounce: skip if we recently notified for this same equipment.
    const last = lastNotifiedAt.get(eq.id);
    if (last !== undefined && now - last < debounceMs) continue;

    transitions.push({
      equipmentId: eq.id,
      equipmentName: eq.name,
    });
  }

  return transitions;
}
