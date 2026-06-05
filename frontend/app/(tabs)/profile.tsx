import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ACCENTS, AccentKey, Radius, Size, Space, useTheme, useTweaks, withAlpha } from '../../src/constants/theme';
import { Card, SectionLabel, Button, StatTile, Divider } from '../../src/components/primitives';
import { useAuth } from '../../src/contexts/AuthContext';

type ProfilePanel = 'edit' | 'notifications' | 'units' | 'privacy' | 'help' | null;

export default function ProfileScreen() {
  const t = useTheme();
  const { signOut, updateProfile, user } = useAuth();
  const { tweaks, setTweaks } = useTweaks();
  const [activePanel, setActivePanel] = useState<ProfilePanel>(null);
  const [draftName, setDraftName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [panelError, setPanelError] = useState('');
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
  const rowSubtitle = useMemo(
    () => ({
      'Edit profile': displayName,
      Notifications: tweaks.equipmentNotifications ? 'Equipment alerts on' : 'Equipment alerts off',
      'Units (kg/lb)': tweaks.units.toUpperCase(),
      Privacy: tweaks.privateProfile ? 'Private profile' : 'Public profile',
      'Help & support': 'Contact and troubleshooting',
    }),
    [displayName, tweaks.equipmentNotifications, tweaks.privateProfile, tweaks.units],
  );

  useEffect(() => {
    if (activePanel === 'edit') {
      setDraftName(displayName);
    }
    setPanelError('');
  }, [activePanel, displayName]);

  const confirmSignOut = () => Alert.alert('Sign out?', 'You will return to the login screen.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Sign out',
      style: 'destructive',
      onPress: async () => {
        try {
          await signOut();
          router.replace('/(auth)/login');
        } catch (err: unknown) {
          Alert.alert('Sign out failed', err instanceof Error ? err.message : 'Please try again.');
        }
      },
    },
  ]);

  const openPanel = (row: string) => {
    const next: Record<string, ProfilePanel> = {
      'Edit profile': 'edit',
      Notifications: 'notifications',
      'Units (kg/lb)': 'units',
      Privacy: 'privacy',
      'Help & support': 'help',
    };
    setActivePanel(next[row] ?? null);
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setPanelError('');
    try {
      await updateProfile(draftName);
      setActivePanel(null);
    } catch (error: unknown) {
      setPanelError(error instanceof Error ? error.message : 'Profile update failed.');
    } finally {
      setSavingProfile(false);
    }
  };

  const openSupportEmail = () => {
    void Linking.openURL('mailto:support@sluggym.app?subject=SlugGym%20support');
  };

  const panelTitle =
    activePanel === 'edit'
      ? 'Edit profile'
      : activePanel === 'notifications'
        ? 'Notifications'
        : activePanel === 'units'
          ? 'Units'
          : activePanel === 'privacy'
            ? 'Privacy'
            : activePanel === 'help'
              ? 'Help & support'
              : '';

  return (
    <>
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
            <Pressable
              onPress={() => openPanel(row)}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.md, padding: Space.lg }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '700' }}>{row}</Text>
                <Text style={{ color: t.textSecondary, fontSize: Size.xs, marginTop: 3 }}>{rowSubtitle[row as keyof typeof rowSubtitle]}</Text>
              </View>
              <Text style={{ color: t.textMuted, fontSize: Size.md }}>›</Text>
            </Pressable>
            {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: t.border, marginHorizontal: Space.lg }} />}
          </View>
        ))}
      </Card>

      <View style={{ marginTop: Space.xl, gap: Space.sm }}>
        <Button title="Sign out" variant="danger" size="lg" onPress={confirmSignOut} />
      </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={activePanel !== null}
        onRequestClose={() => setActivePanel(null)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.54)',
          }}
        >
          <View
            style={{
              backgroundColor: t.surface,
              borderTopLeftRadius: Radius['2xl'],
              borderTopRightRadius: Radius['2xl'],
              padding: Space.lg,
              paddingBottom: Space['3xl'],
              borderWidth: 1,
              borderColor: t.borderStrong,
              gap: Space.md,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.md }}>
              <Text style={{ color: t.text, fontSize: Size.xl, fontWeight: '900' }}>{panelTitle}</Text>
              <Pressable
                onPress={() => setActivePanel(null)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: t.surface2,
                }}
              >
                <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '900' }}>X</Text>
              </Pressable>
            </View>

            {activePanel === 'edit' ? (
              <View style={{ gap: Space.md }}>
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="Display name"
                  placeholderTextColor={t.textMuted}
                  autoCapitalize="words"
                  style={{
                    color: t.text,
                    fontSize: Size.md,
                    backgroundColor: t.surface2,
                    borderWidth: 1,
                    borderColor: t.borderStrong,
                    borderRadius: Radius.md,
                    paddingHorizontal: Space.lg,
                    paddingVertical: Space.md,
                  }}
                />
                {panelError ? <Text style={{ color: t.error, fontSize: Size.sm }}>{panelError}</Text> : null}
                <Button title={savingProfile ? 'Saving...' : 'Save profile'} size="lg" onPress={saveProfile} disabled={savingProfile} />
              </View>
            ) : null}

            {activePanel === 'notifications' ? (
              <View style={{ gap: Space.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.lg }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>Equipment availability alerts</Text>
                    <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4 }}>
                      Show in-app alerts when watched equipment becomes available.
                    </Text>
                  </View>
                  <Switch
                    value={tweaks.equipmentNotifications}
                    onValueChange={(equipmentNotifications) => setTweaks({ equipmentNotifications })}
                    trackColor={{ false: t.surface3, true: withAlpha(t.primary, 0.45) }}
                    thumbColor={tweaks.equipmentNotifications ? t.primary : t.textMuted}
                  />
                </View>
              </View>
            ) : null}

            {activePanel === 'units' ? (
              <View style={{ gap: Space.sm }}>
                {(['kg', 'lb'] as const).map((unit) => {
                  const active = tweaks.units === unit;
                  return (
                    <Pressable
                      key={unit}
                      onPress={() => setTweaks({ units: unit })}
                      style={{
                        padding: Space.lg,
                        borderRadius: Radius.lg,
                        borderWidth: 1,
                        borderColor: active ? t.primary : t.border,
                        backgroundColor: active ? withAlpha(t.primary, 0.12) : t.surface2,
                      }}
                    >
                      <Text style={{ color: active ? t.primary : t.text, fontSize: Size.md, fontWeight: '900' }}>
                        {unit.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {activePanel === 'privacy' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.lg }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>Private profile</Text>
                  <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4 }}>
                    Hide profile stats from other members.
                  </Text>
                </View>
                <Switch
                  value={tweaks.privateProfile}
                  onValueChange={(privateProfile) => setTweaks({ privateProfile })}
                  trackColor={{ false: t.surface3, true: withAlpha(t.primary, 0.45) }}
                  thumbColor={tweaks.privateProfile ? t.primary : t.textMuted}
                />
              </View>
            ) : null}

            {activePanel === 'help' ? (
              <View style={{ gap: Space.md }}>
                <View style={{ gap: Space.xs }}>
                  <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>Need help?</Text>
                  <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                    Send a support email with your account address and a short description of the issue.
                  </Text>
                </View>
                <Button title="Email support" size="lg" onPress={openSupportEmail} />
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}
