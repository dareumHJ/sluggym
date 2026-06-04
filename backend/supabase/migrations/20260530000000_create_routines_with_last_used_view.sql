-- =============================================================
-- View: routines_with_last_used
-- =============================================================
-- For each routine, adds `last_used_at` = MAX(ended_at) of
-- completed workouts that reference this routine. Used to
-- sort the routine list by most-recently-used.
--
-- security_invoker = true ensures the view runs with the
-- querying user's permissions, so the existing routines RLS
-- policy (`auth.uid() = user_id`) is applied automatically.
-- =============================================================

create or replace view public.routines_with_last_used as
select
  r.id,
  r.user_id,
  r.name,
  r.goal,
  r.target_muscles,
  r.created_at,
  max(w.ended_at) as last_used_at
from public.routines r
left join public.workouts w
  on w.routine_id = r.id
  and w.ended_at is not null
group by r.id, r.user_id, r.name, r.goal, r.target_muscles, r.created_at;

alter view public.routines_with_last_used set (security_invoker = true);

comment on view public.routines_with_last_used is
  'Routines joined with last completed workout timestamp for sort order.';
