# Sprint 3 Audit — US-3.2 Past Workout History

Related Linear issues:
- `SLU-129` — US-3.2: Past workout history
- `SLU-134` — Audit existing session history against US-3.2
- `SLU-135` — Add workout history detail view
- `SLU-136` — Verify history detail data contract
- `SLU-137` — Add tests for history and detail states

Audit target: current `origin/dev` behavior, with notes on already-open follow-up work.

## Existing covered behavior

### 1. Workout sessions are persisted and can be listed
- `useWorkouts.refresh()` fetches workouts for the signed-in user from Supabase, ordered by `started_at desc`.
- `useWorkouts.endWorkout()` marks a workout as ended and updates local state with computed `duration_min`.
- The Stats screen renders a `Session History` section from `useWorkouts()`.

Evidence:
- `frontend/src/hooks/useWorkouts.ts`
- `frontend/app/(tabs)/stats.tsx`

### 2. History already includes basic session summary metadata
Each saved row in the current Stats history list shows:
- workout name
- relative date
- duration (when ended)
- target muscles (when present)
- active badge for in-progress workouts

Evidence:
- `workoutMeta()` in `frontend/app/(tabs)/stats.tsx`

### 3. Empty / loading / error states already exist for the history list
Current Session History behavior already handles:
- loading state
- error state with retry
- empty state with guidance text

Evidence:
- conditional cards in `frontend/app/(tabs)/stats.tsx`

### 4. Workout end flow already persists the data needed for history
The workout flow already:
- creates a workout row
- creates `workout_exercises`
- creates nested `exercise_sets`
- ends active exercises before ending the workout

This means the backend persistence path needed for past history is already in place.

Evidence:
- `frontend/app/(tabs)/workout.tsx`
- `frontend/src/hooks/useExercises.ts`
- `frontend/src/hooks/useWorkouts.ts`
- `frontend/__tests__/use-workouts-session-end.test.tsx`

### 5. Post-session summary UI already exists
There is already a `workout-summary` screen that shows:
- duration
- set count
- exercise count
- total volume

So part of the “past session review” UX is already present, even though it is not yet the long-term history detail screen.

Evidence:
- `frontend/app/workout-summary.tsx`

## Remaining gaps vs US-3.2

### Gap A. No detailed drill-down from history on current `dev`
Current `origin/dev` shows a history list, but users cannot open a completed workout to inspect its exercises and sets.

Impact:
- This is the main missing user-facing behavior for US-3.2.

Follow-up:
- `SLU-135` is still required.

### Gap B. Detail data shape is incomplete for human-readable names
`useExercises.getExercisesForWorkout()` currently returns:
- `exercise_id`
- `equipment_id`
- nested sets

But it does **not** join:
- `exercise.name`
- `exercise.target_muscle`
- `equipment.name`

Impact:
- A detail screen can render fallback IDs, but not polished user-friendly labels without extra joins.

Follow-up:
- `SLU-136` correctly identified this.
- A dedicated follow-up ticket for the joins should be created or linked before calling the detail experience complete.

### Gap C. History/detail tests are only partially covered on current `dev`
Current tests cover the workout end persistence path, but not the full history/detail rendering contract.

Still needed:
- explicit tests for history list states on the current history surface
- explicit tests for detail rendering once `SLU-135` lands
- explicit tests for missing-detail fallback

Follow-up:
- `SLU-137` is still required unless its coverage lands together with `SLU-135`.

### Gap D. Some copy is stale
`workout-summary.tsx` still says:
> "this summary is ready to appear in session history once the Workouts hook is wired"

That statement is now outdated because session history list rendering already exists.

Impact:
- Low product risk, but confusing for implementation status.

Suggested fix:
- Update the copy when the next history PR touches this screen.

## Scope conclusion

US-3.2 is **partially complete already** on current `dev`.

What is already done:
- persistence
- list fetching
- basic summary rows
- loading/error/empty states
- post-session summary screen

What is still missing for the story to feel complete:
- completed-workout detail drill-down
- joined human-readable exercise/equipment labels
- dedicated history/detail state coverage

## Recommended issue adjustment

### Keep
- `SLU-135` — still needed
- `SLU-136` — still needed
- `SLU-137` — still needed, unless bundled into `SLU-135`

### Reframe
- `SLU-129` should be treated as **history list + detail completion**, not as a net-new history feature from scratch.

### Optional cleanup
- Update stale summary copy in `workout-summary.tsx` during the next history PR.
