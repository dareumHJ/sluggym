import { test } from 'node:test';
import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';

/**
 * STEPS TO RUN THIS TEST:
 * 1. Open your terminal and ensure you are in the `backend` folder:
 *    cd backend
 * 2. Run the test executing the native Node.js test runner with env vars:
 *    SUPABASE_URL=your_url SUPABASE_ANON_KEY=your_key node --test occupancy-integration.test.js
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('RPC decrement_equipment_count lowers available_count', async (t) => {
    // 1. Fetch a valid equipment piece to test on
    const { data: equipmentList } = await supabase.from('gym_equipment').select('id, available_count').limit(1);
    if (!equipmentList || equipmentList.length === 0) {
        t.skip('No equipment found in the database');
        return;
    }
    const equip = equipmentList[0];
    const initialCount = equip.available_count;

    if (initialCount === 0) {
        t.skip('Equipment is fully occupied');
        return;
    }

    // 2. Execute the RPC decrement function
    const { error: decError } = await supabase.rpc('decrement_equipment_count', { equipment_id_input: equip.id });
    assert.strictEqual(decError, null, `RPC decrement failed: ${decError?.message}`);

    // 3. Verify the count actually went down by 1 in the database
    const { data: updatedEquip } = await supabase.from('gym_equipment').select('available_count').eq('id', equip.id).single();
    assert.strictEqual(updatedEquip.available_count, initialCount - 1);

    // 4. Cleanup / Restore the count 
    const { error: incError } = await supabase.rpc('increment_equipment_count', { equipment_id_input: equip.id });
    assert.strictEqual(incError, null, `RPC increment (cleanup) failed: ${incError?.message}`);
});

test('RPC increment_equipment_count raises available_count', async (t) => {
    // 1. Fetch a valid equipment piece to test on
    const { data: equipmentList } = await supabase.from('gym_equipment').select('id, available_count, total_count').limit(1);
    if (!equipmentList || equipmentList.length === 0) {
        t.skip('No equipment found in the database');
        return;
    }
    const equip = equipmentList[0];

    // Force a decrement first so we have room to increment
    if (equip.available_count === equip.total_count) {
        await supabase.rpc('decrement_equipment_count', { equipment_id_input: equip.id });
    }

    // 2. Get the new baseline count
    const { data: baseline } = await supabase.from('gym_equipment').select('available_count').eq('id', equip.id).single();

    // 3. Execute the RPC increment function
    const { error: incError } = await supabase.rpc('increment_equipment_count', { equipment_id_input: equip.id });
    assert.strictEqual(incError, null, `RPC increment failed: ${incError?.message}`);

    // 4. Verify the count went up by 1
    const { data: finalEquip } = await supabase.from('gym_equipment').select('available_count').eq('id', equip.id).single();
    assert.strictEqual(finalEquip.available_count, baseline.available_count + 1);
});

test('Row Level Security prevents anonymous users from inserting workout exercises', async () => {
    // Attempting to forge a workout exercise entry without being logged in
    const { data, error } = await supabase
        .from('workout_exercises')
        .insert([{ workout_id: '11111111-1111-1111-1111-111111111111', order_index: 1 }]);

    // RLS insertion policy states 'workout_id IN (...)'. Since anonymous requests have no uid, it must fail.
    assert.notStrictEqual(error, null, 'Expected RLS to block insertion');
    assert.strictEqual(error.code, '42501'); // 42501 is Postgres code for "new row violates row level security policy"
});

test('Row Level Security prevents anonymous users from inserting exercise sets', async () => {
    // Attempting to forge a set for an exercise without being logged in
    const { data, error } = await supabase
        .from('exercise_sets')
        .insert([{ workout_exercise_id: 999999, weight: 100, reps: 10, is_completed: true }]);

    assert.notStrictEqual(error, null, 'Expected RLS to block insertion');
    assert.strictEqual(error.code, '42501'); // RLS violation
});
