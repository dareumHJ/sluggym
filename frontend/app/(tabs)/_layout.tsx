// app/(tabs)/_layout.tsx — bottom tab navigation
import React from 'react';
import { Tabs } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../src/constants/theme';

const TabIcon = ({ name, color }: { name: string; color: string }) => {
  const s = 24;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {name === 'home' && <Path d="M3 11 L12 4 L21 11 V20 a1 1 0 0 1 -1 1 H15 V14 H9 V21 H4 a1 1 0 0 1 -1 -1 Z" />}
      {name === 'search' && (<><Circle cx="11" cy="11" r="7" /><Path d="M21 21 L16 16" /></>)}
      {name === 'workout' && (<><Rect x="2" y="9" width="3" height="6" rx="1" /><Rect x="19" y="9" width="3" height="6" rx="1" /><Rect x="6" y="6" width="3" height="12" rx="1" /><Rect x="15" y="6" width="3" height="12" rx="1" /><Path d="M9 12 H15" /></>)}
      {name === 'stats' && (<><Path d="M3 20 H21" /><Rect x="5" y="11" width="3" height="8" /><Rect x="10" y="6" width="3" height="13" /><Rect x="15" y="14" width="3" height="5" /></>)}
      {name === 'profile' && (<><Circle cx="12" cy="8" r="4" /><Path d="M4 21 c0 -4 4 -7 8 -7 s8 3 8 7" /></>)}
    </Svg>
  );
};

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.border, height: 84, paddingTop: 8, paddingBottom: 24 },
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
      }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Home',    tabBarIcon: ({ color }) => <TabIcon name="home"    color={color} /> }} />
      <Tabs.Screen name="search"  options={{ title: 'Search',  tabBarIcon: ({ color }) => <TabIcon name="search"  color={color} /> }} />
      <Tabs.Screen name="workout" options={{ title: 'Workout', tabBarIcon: ({ color }) => <TabIcon name="workout" color={color} /> }} />
      <Tabs.Screen name="stats"   options={{ title: 'Stats',   tabBarIcon: ({ color }) => <TabIcon name="stats"   color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon name="profile" color={color} /> }} />
    </Tabs>
  );
}
