# Release Summary

**Product Name**: SlugGym  
**Team Name**: Strong Slugs  
**Date**: [Date Placeholder]  

---

## 1. Key User Stories & Acceptance Criteria

This section maps the overlying user stories completed in this release to their detailed acceptance criteria derived from the sprint issues:

### US-1.1: Equipment Catalog (SLU-41)
* **User Story**: As a gym-goer, I want to browse a documented list of all machines available in the gym so that I can plan my workout before arriving.
* **Acceptance Criteria**:
  * Users can browse a documented list of all machines available in the gym.
  * The equipment catalog, search, and map UI can display a representative asset or image for each equipment type.
  * Missing assets have a safe fallback icon, and the asset mapping is documented and easily extendable.

### US-1.2: Gym Headcount Display (SLU-39)
* **User Story**: As a gym-goer, I want to see the total number of people currently in the gym so that I can decide whether it is worth going.
* **Acceptance Criteria**:
  * Users can view the total number of people currently in the gym.

### US-1.3: Account Creation & Login/Logout (SLU-33)
* **User Story**: As a gym-goer, I want to create an account / log in and out so that I can keep track of my personal workout records.
* **Acceptance Criteria**:
  * Users can create an account and sign up.
  * Users can log in and out to access and protect their personal workout history.

### US-2.1: Equipment Availability List (SLU-68)
* **User Story**: As a gym-goer, I want to view which gym machines are currently occupied so that I can plan my session before arriving.
* **Acceptance Criteria**:
  * Users can view which gym machines are currently occupied.

### US-2.2: Workout Session Logging (SLU-82)
* **User Story**: As a gym-goer, I want to create a workout session and add exercises (equip., weight, sets, reps) so that I can track what I did at the gym.
* **Acceptance Criteria**:
  * Users can log a workout session and add exercises including equipment, weight, sets, and reps.
  * Client-side validation prevents submitting empty required fields or negative/zero weights.
  * Clear validation error messages show which field is invalid and why, with the submit button disabled until resolved.

### US-2.3: Real-Time Session Broadcast (SLU-70)
* **User Story**: As a gym-goer, I want my active workout session to be visible to the system in real time so that other users can see that an equipment is in use.
* **Acceptance Criteria**:
  * Starting a workout exercise reduces the matching equipment's available count by 1.
  * Real-time subscription reflects the count change immediately in the UI without a manual refresh.
  * Real-time updates update the UI, and subscription errors do not crash the UI (preserving stale data on connection error/timeout).

### US-2.4: Session End / Equipment Release (SLU-71)
* **User Story**: As a gym-goer, I want to mark my session as finished so that the equipment I was using is released for others.
* **Acceptance Criteria**:
  * Ending a workout exercise (setting it as ended) increases the matching equipment's available count by 1.
  * The availability count is bounded and never goes below 0 or above the physical total count.
  * Tapping "End Session" does not end it directly; it must open a confirmation modal.
  * Canceling the modal returns the user to the active session unchanged, while confirming ends the session and navigates to the summary.

### US-3.1: Equipment Availability Map (SLU-128)
* **User Story**: As a gym-goer, I want to see a visual map of equipment availability, color-coded by status, so that I can understand gym congestion at a glance.
* **Acceptance Criteria**:
  * Users can see separated tabs for "headcount" and "map" (tab named "map").
  * The equipment map shows in full-screen, visually grouping equipment by zone or layout with visible status colors and a legend.
  * Users can identify equipment availability (free, occupied, and unknown states represented consistently) at a glance.
  * Clicking a map zone opens a popup window showing the equipment assigned to that zone.
  * Displays a loading state while data is fetching, and an error state offering a retry/fallback path.

### US-3.2: Past Workout History (SLU-129)
* **User Story**: As a gym-goer, I want to view my past workout logs so that I can track my consistency over time.
* **Acceptance Criteria**:
  * A past workout can be opened from the session history list.
  * Exercises and completed sets (including exercise name, target muscles, and equipment name) are shown when available.
  * The view handles empty or missing detail data, with history list and detail rendering covering loading, empty, and error states.

### US-3.3: Weekly Congestion Heatmap (SLU-130)
* **User Story**: As a gym-goer, I want to see a weekly congestion heatmap for each equipment type so that I can identify historically quieter time slots.
* **Acceptance Criteria**:
  * Heatmap displays day/hour congestion intensity with a clear visual scale and legend, helping users identify quieter periods.
  * Sparse or missing data shows a helpful fallback display without presenting misleading recommendations.
  * Popular Times UI displays live aggregated history with loading, empty, and error states, keeping a safe fallback display when no historical samples exist.

### US-4.1: Routine Saving (SLU-157)
* **User Story**: As a gym-goer, I want to save my regular workout routine so that the app can use it to make personalized recommendations.
* **Acceptance Criteria**:
  * User can create, view, update, and delete saved routines tied to their account.
  * Routine can reference exercises/equipment needed for recommendation.
  * Empty/loading/error states are handled.
  * Tests cover the main routine saving flow.

### US-4.2: Optimal Time Recommendation (SLU-158)
* **User Story**: As a gym-goer, I want to receive a suggested time to visit the gym based on my routine and historical data so that I can avoid waiting for equipment.
* **Acceptance Criteria**:
  * Recommendation uses saved routine inputs and historical congestion/equipment data when available.
  * Sparse or missing data shows clear fallback copy.
  * Recommendation logic is documented and testable.

### US-4.3: Equipment-Free Push Notification (SLU-159)
* **User Story**: As a gym-goer, I want to receive a push notification when a busy equipment type becomes free so that I can act on it in real time.
* **Acceptance Criteria**:
  * Feasibility is confirmed for current Expo/Supabase setup.
  * If full push is too risky, implement/document an in-app fallback.
  * Trigger logic is deterministic and testable without live external services.

### US-4.4: Bug Fixes & Polish (SLU-160)
* **User Story**: As a user, I want the app to be stable and easy to navigate so that I can focus on my workout.
* **Acceptance Criteria**:
  * Final polish issues are tracked and resolved or explicitly deferred.
  * Tests, lint, typecheck, and smoke test are documented before release.
  * Demo path is stable end to end.

---

## 2. Known Problems & Design Shortcuts

Below is a summary of major omissions, design shortcuts, and fallback behaviors currently residing in the codebase:

### Design Shortcuts & Hardcoded Fallbacks
1. **Catalog Row Limits**:
   * The catalog list query in `useExerciseCatalog.ts` is capped at a hard limit of `500` rows, meaning very large catalogs could truncate exercises.
2. **Gym Occupancy Capacity**:
   * The maximum gym capacity is hardcoded as `150` centrally inside `gymCapacity.ts` (with a local default in `useWeeklyCongestion.ts`), as the backend database tables lack a dynamic capacity column.
3. **Weekly Heatmap & Popular Times Fallback**:
   * If there is no historical occupancy data recorded in the database, the Popular Times graph falls back to the static `HOURLY` mock array from `mock.ts`. The Weekly Congestion Heatmap does not use a mock fallback; instead, it renders empty cells and displays a warning banner indicating that not enough weekly traffic data has accumulated yet.
4. **Scoring Fallback (IHRSA Baseline)**:
   * The third tier of the routine recommendation scoring engine relies on a hardcoded list of typical commercial gym traffic coefficients (`IHRSA_BASELINE_AVAILABILITY` inside `routineRecommendations.ts`), which may not accurately reflect the actual patterns of specific local facilities.
5. **Timezone Normalization**:
   * The hourly headcount history aggregator, the weekly congestion heatmap, and the routine recommendation scoring engine (`routineRecommendations.ts`) all normalize date-parsing using the `America/Los_Angeles` timezone (the local time of UC Santa Cruz gyms) to ensure consistent binned results regardless of the user's local device/emulator timezone settings.


### Known Issues
1. **Gym Headcount API Availability**
   * The gym headcount API sometimes returns invalid reponses to requests, rendering a 0 in the gym headcount in the home tab of the application.
---

## 3. Product Backlog for Follow-On Project

The following high-priority user stories represent deferred features and enhancements intended to guide the next phase of development:

1. **US-B.1: Strength Progress Graph**
   * *User Story*: As a gym-goer, I want to visualize my strength gains over time so that I can track long-term progress.
   * *Description*: Add dynamic chart visualizations (e.g. 1-Rep Max estimation trends and volume progression graphs) on the Stats tab based on logged set weight and reps.

2. **US-B.2: Workout Sharing**
   * *User Story*: As a gym-goer, I want to share my workout summary with friends so that I can stay motivated.
   * *Description*: Expose social sharing mechanisms (e.g. copying a formatted summary block or generating a link/image) from the Workout Summary screen.

3. **US-B.3: Class Schedule Timetable Integration**
   * *User Story*: As a student, I want to sync my class timetable with SlugGym so that recommendations avoid my class hours.
   * *Description*: Allow users to import academic schedules (e.g. iCal formats). Penalize routine recommendation scores to zero during class hours.

4. **US-B.4: Admin Dashboard for Staff**
   * *User Story*: As a gym staff member, I want to manage the equipment list so that the digital inventory matches the physical gym.
   * *Description*: Build a dashboard for administrators/staff to add, remove, disable, or adjust total counts of physical equipment.

5. **US-B.5: Equipment Condition Rating**
   * *User Story*: As a gym-goer, I want to rate the condition of equipment so that others know if a machine is broken or worn.
   * *Description*: Allow rating (e.g. clean/worn/out-of-order) when viewing equipment on the Map or Search tabs, reporting aggregates to staff.
