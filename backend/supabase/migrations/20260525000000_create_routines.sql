-- =============================================================
-- Routines (Sprint 4 — Saved Routines)
-- =============================================================
-- Slim "label" table for grouping workouts into reusable routines.
-- Design follows the "Single Source of Truth" pattern: routine
-- content (exercises, sets, weights, reps) is NOT duplicated here.
-- Instead, the most recent completed workout linked via
-- `workouts.routine_id` IS the current definition of the routine.
--
-- Design notes:
--   - No `routine_exercises` or `routine_exercise_sets` tables.
--     All workout content lives in workouts/workout_exercises/exercise_sets.
--   - "Latest weights/reps" come for free: querying the most recent
--     completed workout for a given routine_id gives the up-to-date
--     template values automatically.
--   - `routine_id` is nullable on workouts so that deleting a routine
--     preserves historical workout data. UX-level convention is that
--     all new workouts start from a routine (routine-first flow),
--     but the DB tolerates NULLs for safety.
--   - Recommendation system filters to `routine_id IS NOT NULL` rows.
--   - First-time use: a fresh routine has no completed workout yet,
--     so its "content" is empty until the first session is logged.
-- =============================================================

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_muscles text[] not null default '{}',
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, name)
);

-- =============================================================
-- Link workouts to routines
-- =============================================================
-- Nullable so that deleting a routine doesn't cascade-delete
-- the user's workout history. Recommendation queries filter
-- WHERE routine_id IS NOT NULL.
-- =============================================================

alter table public.workouts
  add column routine_id uuid references public.routines(id) on delete set null;

-- =============================================================
-- Indexes
-- =============================================================

create index idx_routines_user_id on public.routines(user_id);

-- Partial index — only non-null routine_id matters for joins
create index idx_workouts_routine_id
  on public.workouts(routine_id)
  where routine_id is not null;

-- =============================================================
-- Row Level Security
-- =============================================================
-- Users can only access their own routines. The check is on user_id;
-- routine-linked workouts inherit access control via the existing
-- workouts RLS policies (user_id check there).
-- =============================================================

alter table public.routines enable row level security;

create policy "Users access own routines"
  on public.routines for all
  to authenticated
  using ( auth.uid() = user_id );
