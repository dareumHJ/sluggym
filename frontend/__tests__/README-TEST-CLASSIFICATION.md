# SlugGym Frontend — Test Classification Report

> **Framework:** UCSC CSE115a "Quality Assurance Concepts"
> **Scope:** `frontend/__tests__/` — 29 files, 230 tests
> **Last updated:** 2026-06-05

---

## 1. Executive Summary

| Phase | Files |
|---|---|
| Unit Test | 14 |
| Integration Test | 15 |
| System Test | 0 — not present |
| Acceptance Test | 0 — not present |

| QA Approach | Files |
|---|---|
| Black-Box | 25 |
| White-Box | 5 |

---

## 2. Classification Table

### Unit Tests — Pure Functions

| File | Target | Approach | Description |
|---|---|---|---|
| `aggregation.test.ts` | `lib/aggregation.ts` | Black-Box | Tests `aggregateWeeklyCongestion()`. Covers empty input, bin-averaging, after-hours filtering, and intensity clamping at 100%. |
| `equipment-notifications.test.ts` | `lib/equipmentNotifications.ts` | Black-Box | Tests `detectFreeTransitions()`. Covers 0→1 transitions, watchlist membership, debounce window (inside and elapsed), and multi-item updates. |
| `exercise-images.test.ts` | `lib/exerciseImages.ts` | White-Box | Tests slug generation, single-frame URL, and multi-frame URL builders. Input variants exercise each regex branch (apostrophe, slash, space). |
| `headcount-history.test.ts` | `lib/headcountHistory.ts` | Black-Box | Tests seven helpers: hourly aggregation, UTC-to-Pacific conversion, weekday filtering, null-field handling, and empty-input edge cases. |
| `validation.test.ts` | `lib/validation.ts` (workout) | Black-Box | Tests `validateWorkoutWeight`, `validateWorkoutReps`, and `validateWorkoutSetCount`. Covers valid classes, invalid classes, and exact max boundary values (1000, 500). |
| `validation-auth.test.ts` | `lib/validation.ts` (auth) | Black-Box | Tests `validateEmail`, `validatePassword`, `validateName`, and `isFormValid`. Covers format equivalence classes, UCSC-domain check, password rule order, and name length boundaries (2, 50, 51 chars). |
| `routine-recommendations.test.ts` | `lib/routineRecommendations.ts` | White-Box | Tests the full recommendation algorithm: bucket construction, timestamp-to-bucket mapping, three-tier availability fallback (equipment → headcount → IHRSA baseline), bottleneck scoring formula, top-N sorting, and tie-breaking by `last_used_at`. |

### Unit Tests — Pure UI Components

| File | Target | Approach | Description |
|---|---|---|---|
| `exercise-filter-panel.test.tsx` | `ExerciseFilterPanel` | Black-Box | Tests view mode, add mode, and non-data states (loading, error, empty). Verifies filter callbacks, auto-select when one equipment option exists, and Clear-filters visibility. |
| `optimal-time-recommendation.test.tsx` | `OptimalTimeRecommendation` | Black-Box | Tests all prop-driven states: data, loading, error, empty, custom `emptyHint`, and refresh callback. Includes a regression guard against previously hard-coded mock data. |
| `weekly-congestion-heatmap.test.tsx` | `WeeklyCongestionHeatmap` | Black-Box | Tests full-data rendering (quiet-hour recommendations visible) and sparse-data fallback state. |
| `workout-summary.test.tsx` | `app/workout-summary` | Black-Box | Tests that duration, sets, exercises, and volume are correctly formatted and displayed from route params. |

### Unit Tests — Pure Hooks (no external I/O)

| File | Target | Approach | Description |
|---|---|---|---|
| `use-form-field.test.ts` | `hooks/useFormField.ts` | Black-Box | Tests the full field lifecycle: initial state, `setValue` before/after touch, `onBlur` touch-and-validate, `validate()` return value and forced touch, error clearance on valid input, and `reset()`. |

### Integration Tests — Screen + Hook(s)

| File | Target | Approach | Description |
|---|---|---|---|
| `equipment-map-tab.test.tsx` | `TabsLayout` + `app/(tabs)/map` | Black-Box | Mocks `useEquipmentMap` and `useNotifications`. Verifies tab registration, 1st/2nd floor zone rendering, and loading/error/empty states. |
| `home-popular-times.test.tsx` | `app/(tabs)` (HomeScreen) | Black-Box | Mocks six hooks simultaneously. Tests five data-blending scenarios: live history present, backfill from weekly congestion, zero-count override, all-fallback, and empty history. |
| `routines-screen.test.tsx` | `app/routines` | Black-Box | Mocks `useRoutines` and `expo-router`. Tests create, edit, update, delete, loading state, save failure (form preserved), and fetch error. |
| `search-screen.test.tsx` | `app/(tabs)/search` | Black-Box | Mocks three hooks. Tests equipment tab default view, exercise tab switch, realtime quantity update via `rerender`, stale-data-plus-error display, and reconnecting status. |
| `stats-history.test.tsx` | `app/(tabs)/stats` | Black-Box | Mocks `useWorkouts` and `useExercises`. Tests workout summary rendering, detail navigation, and loading/error/empty list states. |
| `workout-history-detail.test.tsx` | `app/workout-history/[id]` | Black-Box | Mocks two hooks. Tests fallback ID labels when join data is absent, full names when join data is present, and empty-exercise placeholder. |
| `workout-routine.test.tsx` | `app/(tabs)/workout` | Black-Box | Mocks five hooks. Tests routine list (empty, refresh, navigate-to-editor, render, select, edit, error) and routine preview (no history, exercise load, workout start, not-found, deselect). |

### Integration Tests — UI Component + Hook(s)

| File | Target | Approach | Description |
|---|---|---|---|
| `equipment-map-ui.test.tsx` | `EquipmentAvailabilityMap` | Black-Box | Mocks `useEquipmentMap` and `useNotifications`. Tests loading/error states, zone popup open/close, equipment status display, watchlist bell, and floor switch. |
| `notification-context.test.tsx` | `NotificationContext` | Black-Box | Mocks `useEquipment` and Supabase. Tests six notification state-machine paths: not-watching, watching+transition, toast persistence, tap-to-dismiss, debounce suppression, first-mount guard. |

### Integration Tests — Hook + Supabase / External API

| File | Target | Approach | Description |
|---|---|---|---|
| `use-equipment-realtime.test.tsx` | `hooks/useEquipment` (realtime) | White-Box | Exposes Supabase channel callbacks directly. Covers all `connectionState` branches: `SUBSCRIBED`, `CHANNEL_ERROR`, `TIMED_OUT`, `CLOSED`, app-foreground refresh, and unmount cleanup. |
| `use-headcount-history.test.tsx` | `hooks/useHeadcountHistory` | Black-Box | Mocks five-level Supabase query chain. Verifies table name, column selection, date filters, row limit, and aggregation output for success, empty, and error responses. |
| `use-live-occupancy.test.tsx` | `hooks/useLiveOccupancy` | Black-Box | Mocks `global.fetch`. Covers six paths: fallback response, live success, HTTP non-2xx, network exception, space-delimited timestamp normalization, and null timestamp. |
| `use-routines.test.ts` | `hooks/useRoutines` | White-Box | Mocks Supabase and `AuthContext`. Verifies the `max(last_used_at, created_at)` sort comparator and cross-instance state sync via the internal event bus. |
| `use-workouts-session-end.test.tsx` | `hooks/useWorkouts` + `hooks/useExercises` | White-Box | Queues Supabase calls with `mockReturnValueOnce`. Verifies cascade-end DB call sequence, error propagation halts the workout update, and set/exercise CRUD operations. |
| `useWeeklyCongestion.test.ts` | `hooks/useWeeklyCongestion` | Black-Box | Mocks `gyms` and `gym_headcount_history` tables. Tests intensity calculation with Pacific Time offset, empty-data all-null output, and database error propagation. |
| `use-exercise-catalog.test.ts` | `hooks/useExerciseCatalog` | Black-Box | Mocks parallel Supabase queries (`exercises` + `exercise_equipment`). Tests data normalization (id→string, available_count→quantity, null arrays), equipment option grouping, computed filter chip options, text query filtering, equipment/muscle/level filter chips, UNASSIGNED filter, and combined AND filters. |

### Integration Tests — Mixed (Unit + Integration in same file)

| File | Target | Approach | Description |
|---|---|---|---|
| `map-status.test.ts` | `lib/mapLogic.ts` (unit) + `hooks/useEquipmentMap` (integration) | Black-Box | First `describe`: pure function tests for loading/error/empty/ready states and free/occupied/unknown status mapping. Second `describe`: hook integration test verifying `useEquipmentMap` composes `useEquipment` and applies `getEquipmentMapStatus`. |

---

## 3. Coverage Gaps

| Gap | Severity | Notes |
|---|---|---|
| No System Tests | High | No E2E tests covering full user flows (occupancy → search → workout session). |
| No Acceptance Tests | High | No user-story-based scenarios from a PO or end-user perspective. |
| `useExercises` set-level operations untested | Medium | `addSet`, `updateSet`, `deleteSet`, and set renumbering after delete have no dedicated tests. |
| No DST boundary tests | Medium | Pacific Time spring-forward/fall-back edge cases are untested in all timezone-sensitive helpers. |
| `AuthContext` untested | Low | Session hydration, sign-out cleanup, and OAuth flow have no direct tests. |
| No Load / Stress / Random tests | Low | No performance or fuzz testing of any kind. |
