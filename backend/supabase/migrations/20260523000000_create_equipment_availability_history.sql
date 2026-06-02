-- =============================================================
-- Equipment Availability History
-- =============================================================
-- Time-series snapshot of per-equipment-type availability.
-- Used by routine recommendation features to identify the
-- optimal time to use specific equipment.
--
-- Design notes:
--   - Granularity is per equipment *type* (not per individual unit).
--     The Power rack with quantity=9 is one row per snapshot, holding
--     the aggregate available_count / total_count for that type.
--     This matches the existing `gym_equipment` table structure where
--     each row represents an equipment type with a `quantity` field.
--   - `available_count` reflects usage by SlugGym app users only,
--     not gym-wide occupancy. For total headcount see `gym_headcount_history`.
--   - Snapshot is taken every 30 minutes by pg_cron (no external
--     dependency, runs entirely inside Supabase).
--   - Retention is currently unlimited. Revisit if disk usage
--     becomes a concern.
-- =============================================================

create table public.equipment_availability_history (
  id bigint generated always as identity primary key,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  equipment_name text not null,
  category text not null,
  available_count integer not null check (available_count >= 0),
  total_count integer not null check (total_count > 0),
  sampled_at timestamptz not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- =============================================================
-- Indexes
-- =============================================================

-- Time-range queries across all equipment (e.g. "last 24 hours")
create index idx_equipment_availability_sampled_at
  on public.equipment_availability_history(sampled_at desc);

-- Per-equipment-type time-range queries (most common query pattern
-- for recommendation: "show me Power rack usage over the last 4 weeks")
create index idx_equipment_availability_name_sampled
  on public.equipment_availability_history(equipment_name, sampled_at desc);

-- =============================================================
-- Row Level Security
-- =============================================================
-- All authenticated users can read history (needed for recommendation
-- features that run client-side). Writes happen via the snapshot
-- function (SECURITY DEFINER), so no INSERT policy is needed for users.
-- =============================================================

alter table public.equipment_availability_history enable row level security;

create policy "Authenticated users can read equipment history"
  on public.equipment_availability_history for select
  to authenticated
  using ( true );

-- =============================================================
-- Snapshot function
-- =============================================================
-- Captures a snapshot of the current gym_equipment state into the
-- history table. Runs with SECURITY DEFINER so it can insert
-- regardless of RLS policies.
-- =============================================================

create or replace function public.snapshot_equipment_availability()
returns void
language plpgsql
security definer
as $$
begin
  insert into public.equipment_availability_history
    (gym_id, equipment_name, category, available_count, total_count, sampled_at)
  select
    gym_id,
    name,
    category,
    available_count,
    total_count,
    now()
  from public.gym_equipment;
end;
$$;

-- =============================================================
-- Scheduled execution via pg_cron
-- =============================================================
-- Runs every 30 minutes at 11 and 41 past the hour (offset from
-- top-of-hour to avoid contention with other cron jobs).
-- =============================================================

create extension if not exists pg_cron;

select cron.schedule(
  'snapshot-equipment-availability',
  '11,41 * * * *',
  'select public.snapshot_equipment_availability();'
);
