-- =============================================================
-- Gym Headcount History
-- =============================================================
-- Persisted time-series of total gym occupancy.
-- Populated by a backend polling job that samples an external
-- occupancy source on a fixed interval. Consumed by the
-- Popular Times / WeeklyCongestionHeatmap UI to show historical
-- trends.
--
-- Design notes:
--   - `gym_id` is a foreign key into `public.gyms` (consistent with
--     gym_equipment, zones). The gym's display name is dereferenced
--     via JOIN — no redundant copy is stored here.
--   - `capacity` is kept on this table (rather than on `gyms`)
--     until we verify whether the external API treats it as a
--     constant per gym or as a value that can vary per sample.
--     If it turns out to be constant, this column can be migrated
--     to `gyms.capacity` later.
--   - `sampled_at` is the timestamp reported by the source; it
--     may differ from `created_at` (when the row was inserted)
--     because the source can return cached values.
-- =============================================================

create table public.gym_headcount_history (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  count integer not null check (count >= 0),
  capacity integer check (capacity is null or capacity > 0),
  source text not null,
  sampled_at timestamptz not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- =============================================================
-- Indexes
-- =============================================================

-- Time-range queries across all gyms (e.g. "last 24 hours")
create index idx_gym_headcount_history_sampled_at
  on public.gym_headcount_history(sampled_at desc);

-- Per-gym time-range queries (e.g. "main gym, last week")
create index idx_gym_headcount_history_gym_sampled
  on public.gym_headcount_history(gym_id, sampled_at desc);

-- =============================================================
-- Row Level Security
-- =============================================================
-- All authenticated users can read headcount history.
-- Writes are restricted to the backend service role (which
-- bypasses RLS automatically). No INSERT/UPDATE/DELETE policy is
-- created for regular users.
-- =============================================================

alter table public.gym_headcount_history enable row level security;

create policy "Authenticated users can read headcount history"
  on public.gym_headcount_history for select
  to authenticated
  using ( true );