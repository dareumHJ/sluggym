# Frontend Auth Integration Guide (Google OAuth)

This guide explains how the React Native frontend should implement user authentication for SlugGym using Supabase's Google Auth provider.

## Initialization

First, make sure to install the Supabase JS client and Google Sign-In libraries in your React Native project. 
*(Note: React Native often requires using expo-auth-session or @react-native-google-signin/google-signin depending on if you are using Expo or bare React Native).*

Initialize the client: 

```javascript
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 1. Sign In With Google (Handles both Signup and Login)

Google OAuth simplifies the registration process because Supabase treats a Google Sign-In as both a "Sign Up" (first time) and a "Log In" (returning user). 

```javascript
// Native OAuth flow varies heavily based on Expo vs Bare native apps.
// The raw Supabase method for the web looks like this:

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  // To properly implement this in React Native with Expo, you'll likely use 
  // expo-auth-session to get an id_token, and then pass it to supabase:
  //
  // const { data, error } = await supabase.auth.signInWithIdToken({
  //   provider: 'google',
  //   token: googleIdToken,
  // })

  if (error) {
    console.error("Sign In failed:", error.message)
  } else {
    console.log("Sign In successful!", data)
  }
}
```

## 2. Log Out

To log a user out securely and clear their local session token:

```javascript
const { error } = await supabase.auth.signOut()
if (error) console.error("Logout error:", error.message)
```

## 3. Reading the User's Profile

When the user signs in with Google for the first time, our backend database (`public.profiles`) automatically grabs their Google Display Name and creates a row for them in our system using a database trigger!

You can fetch their SlugGym profile info like this:

```javascript
const getProfile = async () => {
  // Get the currently logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .single()

    if (error) console.error(error)
    else console.log("User Profile:", profile)
  }
}
```
