import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';

type User = { id: string; email: string; name: string } | null;
type Ctx = {
  user: User;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);
const redirectTo = makeRedirectUri({
  scheme: 'sluggym',
  path: 'auth/callback',
});

if (__DEV__) {
  console.log('[Auth] redirectTo', redirectTo);
}

WebBrowser.maybeCompleteAuthSession();

function mapSession(session: Session | null): User {
  const user = session?.user;
  if (!user?.email) return null;
  const fallbackName = user.email.split('@')[0];
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email,
    name: meta.name ?? meta.full_name ?? fallbackName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const createSessionFromUrl = useCallback(async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);

    const accessToken = params.access_token;
    const refreshToken = params.refresh_token;

    if (!accessToken || !refreshToken) return null;

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) throw error;
    return data.session;
  }, []);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await createSessionFromUrl(initialUrl);
        }
      } catch {
        // Ignore callback parsing errors during boot and fall through to session check.
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session ?? null);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };

    void boot();

    const authSubscription = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoading(false);
    });

    const linkSubscription = Linking.addEventListener('url', ({ url }) => {
      void createSessionFromUrl(url)
        .catch(() => {
          // OAuth callback errors surface during user-initiated sign in.
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    });

    return () => {
      mounted = false;
      authSubscription.data.subscription.unsubscribe();
      linkSubscription.remove();
    };
  }, [createSessionFromUrl]);

  const signInWithGoogle = useCallback(async () => {
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
      return;
    }

    if (__DEV__) {
      console.log('[Auth] signInWithGoogle using redirect', redirectTo);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Missing Google authorization URL.');

    if (__DEV__) {
      console.log('[Auth] provider URL', data.url);
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (__DEV__) {
      console.log('[Auth] auth result', result);
    }

    if (result.type === 'success' && result.url) {
      await createSessionFromUrl(result.url);
      return;
    }

    if (result.type === 'cancel') {
      throw new Error('Google sign-in was cancelled.');
    }

    throw new Error('Google sign-in did not complete.');
  }, [createSessionFromUrl]);

  const value = useMemo<Ctx>(
    () => ({
      user: mapSession(session),
      loading,
      signInWithGoogle,
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [loading, session, signInWithGoogle],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
