// src/contexts/TweaksContext.tsx — theme + accent + occupancy style, persisted
import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeCtx, makeTheme, Tweaks } from '../constants/theme';

const KEY = 'sluggym.tweaks';
const DEFAULT: Tweaks = { mode: 'dark', accent: 'lime', occupancyStyle: 'ring', currentOccupancy: 62 };

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaksState] = useState<Tweaks>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => { if (v) try { setTweaksState({ ...DEFAULT, ...JSON.parse(v) }); } catch {} });
  }, []);

  const setTweaks = (patch: Partial<Tweaks>) => {
    setTweaksState(prev => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const theme = useMemo(() => makeTheme(tweaks.mode, tweaks.accent), [tweaks.mode, tweaks.accent]);

  return <ThemeCtx.Provider value={{ theme, tweaks, setTweaks }}>{children}</ThemeCtx.Provider>;
}
