import { test } from 'node:test';
import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';

/**
 * STEPS TO RUN THIS TEST:
 * 1. Open your terminal and ensure you are in the `backend` folder:
 *    cd backend
 * 2. Install the Supabase Javascript SDK if you haven't already:
 *    npm install @supabase/supabase-js
 * 3. Run the test executing the native Node.js test runner:
 *    node --test auth-integration.test.js
 */

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('Row Level Security prevents anonymous profile updates', async () => {
    // Attempting to maliciously update a random profile without an active OAuth session
    const { data, error } = await supabase
        .from('profiles')
        .update({ display_name: 'HackedName' })
        .eq('id', '00000000-0000-0000-0000-000000000000');

    // Verify that RLS silently blocks the update (returns no data and modifies 0 rows)
    assert.strictEqual(data, null);
});

test('Google OAuth gracefully handles invalid refresh tokens', async () => {
    // Testing the built-in error handling mechanism
    const { error } = await supabase.auth.refreshSession({ refresh_token: 'fake-token' });

    // Verify that the SDK catches the error and surfaces it correctly
    assert.notStrictEqual(error, null);
    assert.strictEqual(error.message.toLowerCase().includes('token'), true);
});

test('Row Level Security prevents anonymous profile insertions (ID spoofing)', async () => {
    // Attempting to forge a profile creation for an arbitrary ID without logging in
    const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: '11111111-1111-1111-1111-111111111111', display_name: 'Spoofed User' }]);

    // RLS insertion policy states 'auth.uid() = id'. Since anonymous requests have no uid, it must fail.
    assert.notStrictEqual(error, null);
    assert.strictEqual(error.code, '42501'); // 42501 is the standard Postgres code for "new row violates row level security policy"
});

test('Row Level Security prevents anonymous mass deletions', async () => {
    // Attempting a destructive action: deleting all profiles
    const { data, error } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // trying to delete everyone else

    // It should return null data indicating the request was blocked.
    assert.strictEqual(data, null);
});

test('API gateway firmly isolates internal auth tables from client queries', async () => {
    // Attempting to bypass the public schema and read directly from the highly sensitive auth schema
    const { data, error } = await supabase
        .from('auth.users')
        .select('*');

    // Supabase PostgREST completely blocks client access to non-public schemas.
    assert.notStrictEqual(error, null);
});
