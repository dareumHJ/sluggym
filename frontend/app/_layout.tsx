import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { TweaksProvider } from '../src/contexts/TweaksContext';
import { useTheme, useTweaks } from '../src/constants/theme';

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const t = useTheme();
  const inAuth = segments[0] === '(auth)';

  useEffect(() => {
    if (loading) return;
    if (!user && !inAuth) router.replace('/(auth)/login');
    else if (user && inAuth) router.replace('/(tabs)');
  }, [inAuth, loading, user]);

  if (loading || (!user && !inAuth) || (user && inAuth)) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.bg,
        }}
      >
        <ActivityIndicator color={t.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

function RootStack() {
  const t = useTheme();
  const { tweaks } = useTweaks();

  return (
    <>
      <StatusBar style={tweaks.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.bg },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="equipment/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <TweaksProvider>
      <AuthProvider>
        <Gate>
          <RootStack />
        </Gate>
      </AuthProvider>
    </TweaksProvider>
  );
}
