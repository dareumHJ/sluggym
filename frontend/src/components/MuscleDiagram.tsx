// src/components/MuscleDiagram.tsx — front-view muscle map
import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { View } from 'react-native';
import { useTheme, withAlpha } from '../constants/theme';

export function MuscleDiagram({ primary = [], secondary = [], size = 200 }: { primary?: string[]; secondary?: string[]; size?: number }) {
  const t = useTheme();
  const baseFill = withAlpha(t.text, 0.08);
  const strokeC = withAlpha(t.text, 0.22);

  const fillFor = (group: string) => {
    const g = group.toLowerCase();
    const inArr = (arr: string[]) => arr.some(m => m.toLowerCase().includes(g) || g.includes(m.toLowerCase()));
    if (inArr(primary)) return t.primary;
    if (inArr(secondary)) return withAlpha(t.primary, 0.45);
    return baseFill;
  };

  return (
    <View style={{ width: size, aspectRatio: 0.55, alignItems: 'center' }}>
      <Svg width="100%" height="100%" viewBox="0 0 110 200">
        {/* Head */}
        <Circle cx="55" cy="16" r="11" fill={baseFill} stroke={strokeC} strokeWidth="0.5" />
        {/* Neck */}
        <Path d="M49 26 L61 26 L60 32 L50 32 Z" fill={baseFill} stroke={strokeC} strokeWidth="0.5" />
        {/* Upper chest (split) */}
        <Path d="M32 34 Q40 34 52 36 L52 56 Q40 56 32 52 Q28 44 32 34 Z" fill={fillFor('chest')} stroke={strokeC} strokeWidth="0.5" />
        <Path d="M78 34 Q70 34 58 36 L58 56 Q70 56 78 52 Q82 44 78 34 Z" fill={fillFor('chest')} stroke={strokeC} strokeWidth="0.5" />
        {/* Shoulders (delts) */}
        <Ellipse cx="27" cy="40" rx="8" ry="10" fill={fillFor('shoulder')} stroke={strokeC} strokeWidth="0.5" />
        <Ellipse cx="83" cy="40" rx="8" ry="10" fill={fillFor('shoulder')} stroke={strokeC} strokeWidth="0.5" />
        {/* Biceps */}
        <Ellipse cx="22" cy="62" rx="7" ry="12" fill={fillFor('bicep')} stroke={strokeC} strokeWidth="0.5" />
        <Ellipse cx="88" cy="62" rx="7" ry="12" fill={fillFor('bicep')} stroke={strokeC} strokeWidth="0.5" />
        {/* Triceps (sides) */}
        <Path d="M15 54 Q13 68 16 80 L22 80 L22 58 Z" fill={fillFor('tricep')} stroke={strokeC} strokeWidth="0.5" />
        <Path d="M95 54 Q97 68 94 80 L88 80 L88 58 Z" fill={fillFor('tricep')} stroke={strokeC} strokeWidth="0.5" />
        {/* Forearms */}
        <Ellipse cx="20" cy="92" rx="6" ry="12" fill={baseFill} stroke={strokeC} strokeWidth="0.5" />
        <Ellipse cx="90" cy="92" rx="6" ry="12" fill={baseFill} stroke={strokeC} strokeWidth="0.5" />
        {/* Abs / Core */}
        <Path d="M42 58 L68 58 L66 100 L44 100 Z" fill={fillFor('core')} stroke={strokeC} strokeWidth="0.5" />
        <Path d="M55 58 L55 100" stroke={strokeC} strokeWidth="0.4" />
        <Path d="M42 70 L68 70 M43 82 L67 82 M44 94 L66 94" stroke={strokeC} strokeWidth="0.4" />
        {/* Obliques */}
        <Path d="M34 58 Q30 80 36 104 L44 104 L42 58 Z" fill={fillFor('core')} stroke={strokeC} strokeWidth="0.5" />
        <Path d="M76 58 Q80 80 74 104 L66 104 L68 58 Z" fill={fillFor('core')} stroke={strokeC} strokeWidth="0.5" />
        {/* Quads */}
        <Path d="M36 108 Q32 140 38 170 L52 170 L52 108 Z" fill={fillFor('quad')} stroke={strokeC} strokeWidth="0.5" />
        <Path d="M74 108 Q78 140 72 170 L58 170 L58 108 Z" fill={fillFor('quad')} stroke={strokeC} strokeWidth="0.5" />
        {/* Knees */}
        <Ellipse cx="45" cy="174" rx="6" ry="3" fill={baseFill} stroke={strokeC} strokeWidth="0.4" />
        <Ellipse cx="65" cy="174" rx="6" ry="3" fill={baseFill} stroke={strokeC} strokeWidth="0.4" />
        {/* Calves (partial front/shin) */}
        <Path d="M40 180 Q38 192 42 198 L50 198 L50 180 Z" fill={baseFill} stroke={strokeC} strokeWidth="0.5" />
        <Path d="M70 180 Q72 192 68 198 L60 198 L60 180 Z" fill={baseFill} stroke={strokeC} strokeWidth="0.5" />
      </Svg>
    </View>
  );
}
