import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Size, Space, useTheme } from '../../src/constants/theme';

export default function AuthCallbackScreen() {
  const { loading, user } = useAuth();
  const t = useTheme();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? '/' : '/(auth)/login');
  }, [loading, user]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Space.md,
        backgroundColor: t.bg,
        padding: Space.xl,
      }}
    >
      <ActivityIndicator color={t.primary} />
      <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>Completing sign in...</Text>
    </View>
  );
}
