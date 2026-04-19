// app/(auth)/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useTheme, Space, Radius, Size } from '../../src/constants/theme';
import { Button } from '../../src/components/primitives';
import { useAuth } from '../../src/contexts/AuthContext';

export default function SignupScreen() {
  const t = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) { Alert.alert('Missing fields', 'All fields are required.'); return; }
    if (password.length < 6) { Alert.alert('Weak password', 'At least 6 characters.'); return; }
    setLoading(true);
    try {
      const result = await signUp(email, password, name);
      if (result.hasSession) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Check your email',
          'Your account was created. Please verify your email, then sign in.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
        );
      }
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    backgroundColor: t.surface2, color: t.text, borderRadius: Radius.lg, borderWidth: 1, borderColor: t.borderLight,
    paddingHorizontal: Space.lg, paddingVertical: 14, fontSize: Size.md,
  };
  const label = { color: t.textSecondary, fontSize: Size.xs, fontWeight: '700' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 6 };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: Space['2xl'], paddingTop: 80 }} keyboardShouldPersistTaps="handled">
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>Create account</Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.md, marginTop: 6, marginBottom: Space['2xl'] }}>Start tracking your lifts today.</Text>

        <View style={{ gap: Space.md }}>
          <View>
            <Text style={label}>Full name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Alex Rivera" placeholderTextColor={t.textMuted} style={inputStyle} />
          </View>
          <View>
            <Text style={label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="you@ucsc.edu" placeholderTextColor={t.textMuted}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={inputStyle} />
          </View>
          <View>
            <Text style={label}>Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="At least 6 characters" placeholderTextColor={t.textMuted}
              secureTextEntry autoCapitalize="none" style={inputStyle} />
          </View>
        </View>

        <View style={{ marginTop: Space['2xl'] }}>
          <Button title={loading ? 'Creating…' : 'Create account'} onPress={onSubmit} size="lg" disabled={loading} />
        </View>

        <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center', marginTop: Space.lg, lineHeight: 18 }}>
          By continuing you agree to SlugGym&apos;s Terms of Service and Privacy Policy.
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: Space['3xl'] }}>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable><Text style={{ color: t.primary, fontSize: Size.sm, fontWeight: '700' }}>Sign in</Text></Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
