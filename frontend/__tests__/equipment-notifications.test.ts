// __tests__/equipment-notifications.test.ts
// Unit tests for the pure equipment-free notification detection logic.

import {
  detectFreeTransitions,
  type EquipmentSnapshot,
} from '../src/lib/equipmentNotifications';

const NOW = 1_717_200_000_000; // arbitrary fixed timestamp
const DEBOUNCE_MS = 2 * 60 * 1000;

function snapshot(id: string, name: string, available: number): EquipmentSnapshot {
  return { id, name, available };
}

describe('detectFreeTransitions', () => {
  it('returns an empty list when nothing changed', () => {
    const prev = [snapshot('1', 'Bench Press', 0)];
    const curr = [snapshot('1', 'Bench Press', 0)];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([]);
  });

  it('detects a 0 -> 1 transition for watched equipment', () => {
    const prev = [snapshot('1', 'Bench Press', 0)];
    const curr = [snapshot('1', 'Bench Press', 1)];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([{ equipmentId: '1', equipmentName: 'Bench Press' }]);
  });

  it('detects a 0 -> 2 transition (any positive count is "free")', () => {
    const prev = [snapshot('1', 'Bench Press', 0)];
    const curr = [snapshot('1', 'Bench Press', 2)];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toHaveLength(1);
  });

  it('does not fire when the user is not watching that equipment', () => {
    const prev = [snapshot('1', 'Bench Press', 0)];
    const curr = [snapshot('1', 'Bench Press', 1)];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['2']), // watching a different item
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([]);
  });

  it('does not fire on transitions from free -> still free', () => {
    const prev = [snapshot('1', 'Bench Press', 2)];
    const curr = [snapshot('1', 'Bench Press', 1)];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([]);
  });

  it('does not fire on transitions from free -> busy', () => {
    const prev = [snapshot('1', 'Bench Press', 1)];
    const curr = [snapshot('1', 'Bench Press', 0)];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([]);
  });

  it('does not fire when equipment is seen for the first time (no previous snapshot)', () => {
    // First mount: prev is empty. Even if the equipment is currently available,
    // we should not notify since we have no transition to point at.
    const prev: EquipmentSnapshot[] = [];
    const curr = [snapshot('1', 'Bench Press', 1)];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([]);
  });

  it('respects the debounce window', () => {
    const prev = [snapshot('1', 'Bench Press', 0)];
    const curr = [snapshot('1', 'Bench Press', 1)];

    // Already notified one minute ago, debounce is two minutes — should skip.
    const lastNotified = new Map<string, number>([['1', NOW - 60_000]]);

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      lastNotified,
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([]);
  });

  it('fires again once the debounce window has elapsed', () => {
    const prev = [snapshot('1', 'Bench Press', 0)];
    const curr = [snapshot('1', 'Bench Press', 1)];

    // Notified three minutes ago — debounce of two minutes is past.
    const lastNotified = new Map<string, number>([['1', NOW - 3 * 60_000]]);

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1']),
      lastNotified,
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toHaveLength(1);
  });

  it('handles multiple equipment items in a single update', () => {
    const prev = [
      snapshot('1', 'Bench Press', 0),
      snapshot('2', 'Squat Rack', 0),
      snapshot('3', 'Treadmill', 1),
    ];
    const curr = [
      snapshot('1', 'Bench Press', 1), // 0 -> 1, watching
      snapshot('2', 'Squat Rack', 1), // 0 -> 1, NOT watching
      snapshot('3', 'Treadmill', 2), // 1 -> 2, not a "free" transition
    ];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1', '3']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([{ equipmentId: '1', equipmentName: 'Bench Press' }]);
  });

  it('handles new equipment appearing in the current list (no previous entry)', () => {
    // Equipment '2' did not exist in prev — treat as first-time seen.
    const prev = [snapshot('1', 'Bench Press', 0)];
    const curr = [
      snapshot('1', 'Bench Press', 1),
      snapshot('2', 'New Machine', 1),
    ];

    const transitions = detectFreeTransitions(
      prev,
      curr,
      new Set(['1', '2']),
      new Map(),
      NOW,
      DEBOUNCE_MS,
    );

    expect(transitions).toEqual([{ equipmentId: '1', equipmentName: 'Bench Press' }]);
  });
});
