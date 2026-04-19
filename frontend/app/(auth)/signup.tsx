import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useTheme, Space, Size } from '../../src/constants/theme';
import { Button } from '../../src/components/primitives';
import { useAuth } from '../../src/contexts/AuthContext';

export default function SignupScreen() {
  const t = useTheme();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Google sign up failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: Space['2xl'], paddingTop: 80 }} keyboardShouldPersistTaps="handled">
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>Create account</Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.md, marginTop: 6, marginBottom: Space['2xl'] }}>
          SlugGym uses Google sign-in. Continue with your UCSC Google account to create a profile.
        </Text>

        {errorMessage ? (
          <View
            style={{
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255, 82, 82, 0.3)',
              borderRadius: 16,
              paddingHorizontal: Space.lg,
              paddingVertical: Space.md,
              marginBottom: Space.lg,
            }}
          >
            <Text style={{ color: t.error, fontSize: Size.sm, textAlign: 'center' }}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={{ marginTop: Space.lg }}>
          <Button title={loading ? 'Opening Google…' : 'Continue with Google'} onPress={onSubmit} size="lg" disabled={loading} />
        </View>

        <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center', marginTop: Space.lg, lineHeight: 18 }}>
          We’ll use your Google identity to sign you in and create your SlugGym profile.
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: Space['3xl'] }}>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Already have access? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable><Text style={{ color: t.primary, fontSize: Size.sm, fontWeight: '700' }}>Sign in</Text></Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
