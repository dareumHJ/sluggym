import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { TweaksProvider } from '../src/contexts/TweaksContext';
import { NotificationProvider } from '../src/contexts/NotificationContext';
import { NotificationToastHost } from '../src/components/NotificationToastHost';
import { useTheme, useTweaks } from '../src/constants/theme';

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const t = useTheme();
  const inAuth = segments[0] === '(auth)';

  useEffect(() => {
    if (loading) return;
    if (!user && !inAuth) router.replace('/(auth)/login');
    else if (user && inAuth) router.replace('/');
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
      <StatusBar hidden style={tweaks.mode === 'dark' ? 'light' : 'dark'} />
      <NotificationProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: t.bg },
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="equipment/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="routines" options={{ presentation: 'card' }} />
          <Stack.Screen name="workout-summary" options={{ presentation: 'card' }} />
        </Stack>
        {/* Toast host renders above all screens. Mounted inside Gate so the
            user is authenticated before any toasts can fire (useEquipment
            requires auth). */}
        <NotificationToastHost />
      </NotificationProvider>
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
