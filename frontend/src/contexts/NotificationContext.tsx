// src/contexts/NotificationContext.tsx
// In-memory watchlist + toast queue for the equipment-free notification feature.
// Hooks into useEquipment to detect 0 -> >0 availability transitions for any
// equipment the user has opted into, and renders upper toasts.
//
// State is intentionally NOT persisted to Supabase — the feature is designed
// for in-session use ("Notify me while I'm at the gym"). When the app closes,
// the watchlist is cleared.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useEquipment } from '../hooks/useEquipment';
import { detectFreeTransitions, type EquipmentSnapshot } from '../lib/equipmentNotifications';
import { useTweaks } from '../constants/theme';

const DEBOUNCE_MS = 2 * 60 * 1000; // 2 minutes per equipment (decision 4)
const MAX_TOASTS = 3; // simultaneous toasts (decision 3)

export interface ToastItem {
  /** Unique id per toast occurrence; used as React key + for dismiss. */
  id: string;
  equipmentId: string;
  equipmentName: string;
  /** Wall-clock timestamp when the toast was created. */
  createdAt: number;
}

interface NotificationContextValue {
  // Watchlist API
  isInWatchlist: (equipmentId: string) => boolean;
  addToWatchlist: (equipmentId: string) => void;
  removeFromWatchlist: (equipmentId: string) => void;
  /** Snapshot of the watchlist; mainly useful for tests/debugging. */
  watchlist: ReadonlySet<string>;

  // Toast API
  toasts: ToastItem[];
  dismissToast: (toastId: string) => void;
  /** Tapping a toast: dismiss + remove from watchlist (decision D). */
  onToastTap: (toast: ToastItem) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Set<string>>(() => new Set());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { tweaks } = useTweaks();

  // Hook into the existing realtime-equipment hook.
  // Note: this is a separate subscription from screens that also call
  // useEquipment(). The extra subscription is intentional — keeping the
  // provider self-contained makes the dependency graph simpler.
  const { equipment } = useEquipment();

  const prevSnapshotsRef = useRef<EquipmentSnapshot[]>([]);
  const lastNotifiedRef = useRef<Map<string, number>>(new Map());

  const currentSnapshots = useMemo<EquipmentSnapshot[]>(
    () =>
      equipment.map((item) => ({
        id: item.id,
        name: item.name,
        // The frontend EquipmentListItem exposes `quantity` which is the live
        // available_count value from gym_equipment.
        available: item.quantity ?? 0,
      })),
    [equipment],
  );

  // Detect transitions whenever equipment data updates.
  useEffect(() => {
    if (!tweaks.equipmentNotifications) {
      prevSnapshotsRef.current = currentSnapshots;
      setToasts([]);
      return;
    }

    const now = Date.now();
    const transitions = detectFreeTransitions(
      prevSnapshotsRef.current,
      currentSnapshots,
      watchlist,
      lastNotifiedRef.current,
      now,
      DEBOUNCE_MS,
    );

    if (transitions.length > 0) {
      // Record debounce timestamps immediately so concurrent renders don't
      // re-fire for the same equipment.
      for (const t of transitions) {
        lastNotifiedRef.current.set(t.equipmentId, now);
      }

      setToasts((prev) => {
        const newToasts: ToastItem[] = transitions.map((t, index) => ({
          id: `${t.equipmentId}:${now}:${index}`,
          equipmentId: t.equipmentId,
          equipmentName: t.equipmentName,
          createdAt: now,
        }));
        // Cap at MAX_TOASTS; if queue overflows, oldest items roll off.
        return [...prev, ...newToasts].slice(-MAX_TOASTS);
      });
    }

    prevSnapshotsRef.current = currentSnapshots;
  }, [currentSnapshots, tweaks.equipmentNotifications, watchlist]);

  // Note: toasts no longer auto-dismiss. They persist until the user taps
  // them (which also removes the equipment from the watchlist) or until they
  // get pushed out by queue overflow (MAX_TOASTS = 3).

  const isInWatchlist = useCallback((equipmentId: string) => watchlist.has(equipmentId), [watchlist]);

  const addToWatchlist = useCallback((equipmentId: string) => {
    setWatchlist((prev) => {
      if (prev.has(equipmentId)) return prev;
      const next = new Set(prev);
      next.add(equipmentId);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((equipmentId: string) => {
    setWatchlist((prev) => {
      if (!prev.has(equipmentId)) return prev;
      const next = new Set(prev);
      next.delete(equipmentId);
      return next;
    });
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const onToastTap = useCallback(
    (toast: ToastItem) => {
      // Decision D: dismiss the toast AND remove the equipment from watchlist
      // (the user is presumably going to use the equipment now).
      setWatchlist((prev) => {
        if (!prev.has(toast.equipmentId)) return prev;
        const next = new Set(prev);
        next.delete(toast.equipmentId);
        return next;
      });
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    },
    [],
  );

  const value: NotificationContextValue = {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    watchlist,
    toasts,
    dismissToast,
    onToastTap,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a <NotificationProvider>');
  }
  return ctx;
}
