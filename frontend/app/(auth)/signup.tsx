import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { useTheme, Space, Size, Colors } from '../../src/constants/theme';
import { Button } from '../../src/components/primitives';
import { useAuth } from '../../src/contexts/AuthContext';

export default function SignupScreen() {
  const t = useTheme();
  const { signInWithGoogle, signUpWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onEmailSubmit = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Enter an email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name.trim() || undefined);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign up failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSubmit = async () => {
    setErrorMessage('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Google sign up failed. Try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const anyLoading = loading || googleLoading;

  const inputStyle = {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 16,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
    fontSize: Size.md,
    color: t.text,
    marginBottom: Space.md,
  } as const;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: t.bg }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: Space['2xl'], paddingTop: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ color: t.text, fontSize: Size['3xl'], fontWeight: '800', letterSpacing: -0.5 }}>
          Create account
        </Text>
        <Text style={{ color: t.textSecondary, fontSize: Size.md, marginTop: 6, marginBottom: Space['2xl'] }}>
          Sign up with email, or use your UCSC Google account.
        </Text>

        {errorMessage ? (
          <View
            style={{
              backgroundColor: Colors.errorOverlayBg,
              borderWidth: 1,
              borderColor: Colors.errorOverlayBorder,
              borderRadius: 16,
              paddingHorizontal: Space.lg,
              paddingVertical: Space.md,
              marginBottom: Space.lg,
            }}
          >
            <Text style={{ color: t.error, fontSize: Size.sm, textAlign: 'center' }}>{errorMessage}</Text>
          </View>
        ) : null}

        <TextInput
          style={inputStyle}
          placeholder="Name (optional)"
          placeholderTextColor={t.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!anyLoading}
        />
        <TextInput
          style={inputStyle}
          placeholder="Email"
          placeholderTextColor={t.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          editable={!anyLoading}
        />
        <TextInput
          style={inputStyle}
          placeholder="Password (min 6 characters)"
          placeholderTextColor={t.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          editable={!anyLoading}
        />

        <Button
          title={loading ? 'Creating account…' : 'Sign up'}
          onPress={onEmailSubmit}
          size="lg"
          disabled={anyLoading}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: Space.lg, gap: Space.md }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.inputBorder }} />
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.inputBorder }} />
        </View>

        <Button
          title={googleLoading ? 'Opening Google…' : 'Continue with Google'}
          onPress={onGoogleSubmit}
          size="lg"
          disabled={anyLoading}
        />

        <Text style={{ color: t.textMuted, fontSize: Size.xs, textAlign: 'center', marginTop: Space.lg, lineHeight: 18 }}>
          By continuing you agree to SlugGym’s terms.
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: Space['3xl'] }}>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Already have access? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={{ color: t.primary, fontSize: Size.sm, fontWeight: '700' }}>Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
