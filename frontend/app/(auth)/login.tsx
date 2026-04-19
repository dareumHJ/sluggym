import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';
import { validateEmail, validatePassword } from '../../src/lib/validation';
import { useFormField } from '../../src/hooks/useFormField';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LoginScreen() {
  const email = useFormField(validateEmail);
  const password = useFormField(validatePassword);
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleLogin = async () => {
    setFormError('');

    // Validate all fields
    const emailValid = email.validate();
    const passwordValid = password.validate();

    if (!emailValid || !passwordValid) {
      return;
    }

    setLoading(true);
    try {
      await signIn(email.value.trim(), password.value);
      router.replace('/(tabs)');
    } catch (error: any) {
      setFormError(error?.message ?? 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>SlugGym</Text>
        <Text style={styles.subtitle}>Your smart gym companion</Text>
      </View>

      <View style={styles.form}>
        {/* General form error */}
        {formError ? (
          <View style={styles.formErrorContainer}>
            <Text style={styles.formErrorText}>{formError}</Text>
          </View>
        ) : null}

        {/* Email field */}
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, email.error ? styles.inputError : null]}
            placeholder="your@ucsc.edu"
            placeholderTextColor={Colors.textMuted}
            value={email.value}
            onChangeText={email.setValue}
            onBlur={email.onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {email.error ? (
            <Text style={styles.errorText}>{email.error}</Text>
          ) : null}
        </View>

        {/* Password field */}
        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, password.error ? styles.inputError : null]}
            placeholder="Enter your password"
            placeholderTextColor={Colors.textMuted}
            value={password.value}
            onChangeText={password.setValue}
            onBlur={password.onBlur}
            secureTextEntry
            autoComplete="password"
          />
          {password.error ? (
            <Text style={styles.errorText}>{password.error}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>
              Don&apos;t have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  brand: {
    fontSize: FontSize['4xl'],
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  form: {
    gap: Spacing.md,
  },
  formErrorContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  formErrorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  linkText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  linkHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
