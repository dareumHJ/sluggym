-- Sprint 2: RPC functions and RLS policies for per-exercise tracking
-- Author: Heidi
-- Date: April 29 2026
--
-- This file documents all SQL changes made during Sprint 2 to support
-- per-exercise occupancy tracking. The changes were applied via Supabase
-- SQL Editor and are recorded here for reference / re-applicability.

-- ============================================================
-- RPC functions for atomic equipment count updates
-- ============================================================
-- These run with SECURITY DEFINER so they can update gym_equipment
-- regardless of the calling user's RLS permissions.

CREATE OR REPLACE FUNCTION decrement_equipment_count(equipment_id_input bigint)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  UPDATE gym_equipment
  SET available_count = available_count - 1
  WHERE id = equipment_id_input AND available_count > 0;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_equipment_count(equipment_id_input bigint)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  UPDATE gym_equipment
  SET available_count = available_count + 1
  WHERE id = equipment_id_input AND available_count < total_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RLS policies for workouts
-- ============================================================

CREATE POLICY "users see own workouts"
ON workouts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "users insert own workouts"
ON workouts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own workouts"
ON workouts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS policies for workout_exercises
-- (Note: an earlier "Users access own workout exercises" policy
--  with a null with_check was dropped because it blocked inserts.)
-- ============================================================

DROP POLICY IF EXISTS "Users access own workout exercises" ON workout_exercises;

CREATE POLICY "users insert own workout_exercises"
ON workout_exercises FOR INSERT
TO authenticated
WITH CHECK (
  workout_id IN (
    SELECT id FROM workouts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "users update own workout_exercises"
ON workout_exercises FOR UPDATE
TO authenticated
USING (
  workout_id IN (
    SELECT id FROM workouts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "users read own workout_exercises"
ON workout_exercises FOR SELECT
TO authenticated
USING (
  workout_id IN (
    SELECT id FROM workouts WHERE user_id = auth.uid()
  )
);

-- ============================================================
-- RLS policies for exercise_sets
-- ============================================================

CREATE POLICY "users see own exercise_sets"
ON exercise_sets FOR SELECT
TO authenticated
USING (
  workout_exercise_id IN (
    SELECT id FROM workout_exercises
    WHERE workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  )
);

CREATE POLICY "users insert own exercise_sets"
ON exercise_sets FOR INSERT
TO authenticated
WITH CHECK (
  workout_exercise_id IN (
    SELECT id FROM workout_exercises
    WHERE workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  )
);

CREATE POLICY "users update own exercise_sets"
ON exercise_sets FOR UPDATE
TO authenticated
USING (
  workout_exercise_id IN (
    SELECT id FROM workout_exercises
    WHERE workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  )
);

CREATE POLICY "users delete own exercise_sets"
ON exercise_sets FOR DELETE
TO authenticated
USING (
  workout_exercise_id IN (
    SELECT id FROM workout_exercises
    WHERE workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  )
);

-- ============================================================
-- RLS policies for gym_equipment
-- ============================================================
-- Equipment data is shared and readable by all authenticated users.
-- Writes go through the SECURITY DEFINER RPC functions above, so
-- no explicit insert/update policies are needed.

CREATE POLICY "authenticated users read equipment"
ON gym_equipment FOR SELECT
TO authenticated
USING (true);
