// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme, useTweaks, Space, Radius, Size, ACCENTS, AccentKey } from '../../src/constants/theme';
import { Card, SectionLabel, Button, StatTile, Divider } from '../../src/components/primitives';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ProfileScreen() {
  const t = useTheme();
  const { signOut, user } = useAuth();
  const { tweaks, setTweaks } = useTweaks();
  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Athlete';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const secondaryLine = user?.email ?? 'Signed in member';
  const stats = { workouts: 0, streak: 0, followers: 0 };

  const confirmSignOut = () => Alert.alert('Sign out?', 'You will return to the login screen.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/(auth)/login'); } },
  ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: Space.lg, paddingBottom: 120 }}>
      {/* Identity */}
      <View style={{ alignItems: 'center', marginVertical: Space.lg }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Space.md }}>
          <Text style={{ color: t.onPrimary, fontSize: Size['3xl'], fontWeight: '800' }}>{initials}</Text>
        </View>
        <Text style={{ color: t.text, fontSize: Size.xl, fontWeight: '800' }}>{displayName}</Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 2 }}>{secondaryLine}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg }}>
        <StatTile value={stats.workouts} label="Workouts" accent />
        <StatTile value={stats.streak} label="Streak" />
        <StatTile value={stats.followers} label="Followers" />
      </View>

      <SectionLabel>Appearance</SectionLabel>
      <Card style={{ marginBottom: Space.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space.md }}>
          <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '600' }}>Theme</Text>
          <View style={{ flexDirection: 'row', backgroundColor: t.surface2, borderRadius: Radius.full, padding: 3 }}>
            {(['light','dark'] as const).map(m => (
              <Pressable key={m} onPress={() => setTweaks({ mode: m })}
                style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: Radius.full, backgroundColor: tweaks.mode === m ? t.primary : 'transparent' }}>
                <Text style={{ color: tweaks.mode === m ? t.onPrimary : t.text, fontSize: Size.xs, fontWeight: '700', textTransform: 'capitalize' }}>{m}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Divider />
        <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '600', marginBottom: Space.sm }}>Accent color</Text>
        <View style={{ flexDirection: 'row', gap: Space.sm }}>
          {(Object.keys(ACCENTS) as AccentKey[]).map(k => (
            <Pressable key={k} onPress={() => setTweaks({ accent: k })}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: ACCENTS[k].primary, borderWidth: 3, borderColor: tweaks.accent === k ? t.text : 'transparent' }} />
          ))}
        </View>
      </Card>

      <SectionLabel>Account</SectionLabel>
      <Card style={{ padding: 0 }}>
        {['Edit profile','Notifications','Units (kg/lb)','Privacy','Help & support'].map((row, i, arr) => (
          <View key={row}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Space.lg }}>
              <Text style={{ color: t.text, fontSize: Size.md }}>{row}</Text>
              <Text style={{ color: t.textMuted, fontSize: Size.md }}>›</Text>
            </Pressable>
            {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: t.border, marginHorizontal: Space.lg }} />}
          </View>
        ))}
      </Card>

      <View style={{ marginTop: Space.xl }}>
        <Button title="Sign out" variant="danger" size="lg" onPress={confirmSignOut} />
      </View>
    </ScrollView>
  );
}
