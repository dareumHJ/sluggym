# Test Plan and Report

**Product Name**: SlugGym  
**Team Name**: Strong Slugs  
**Date**: [Date Placeholder]  

---

## 1. User Story Mapping Table

| User Story ID | Title | User Story | Covered in Scenario |
| :--- | :--- | :--- | :--- |
| **US-1.1** (SLU-41) | Equipment Catalog | As a gym-goer, I want to browse a documented list of all machines available in the gym so that I can plan my workout before arriving. | Scenario 2 |
| **US-1.2** (SLU-39) | Gym Headcount Display | As a gym-goer, I want to see the total number of people currently in the gym so that I can decide whether it is worth going. | Scenario 2 |
| **US-1.3** (SLU-33) | Account Creation & Login/Logout | As a gym-goer, I want to create an account / log in and out so that I can keep track of my personal workout records. | Scenario 1 |
| **US-2.1** (SLU-68) | Equipment Availability List | As a gym-goer, I want to view which gym machines are currently occupied so that I can plan my session before arriving. | Scenario 2, Scenario 4 |
| **US-2.2** (SLU-82) | Workout Session Logging | As a gym-goer, I want to create a workout session and add exercises (equip., weight, sets, reps) so that I can track what I did at the gym. | Scenario 4, Scenario 7 |
| **US-2.3** (SLU-70) | Real-Time Session Broadcast | As a gym-goer, I want my active workout session to be visible to the system in real time so that other users can see that an equipment is in use. | Scenario 4 |
| **US-2.4** (SLU-71) | Session End / Equipment Release | As a gym-goer, I want to mark my session as finished so that the equipment I was using is released for others. | Scenario 4 |
| **US-3.1** (SLU-128) | Equipment Availability Map | As a gym-goer, I want to see a visual map of equipment availability, color-coded by status, so that I can understand gym congestion at a glance. | Scenario 2 |
| **US-3.2** (SLU-129) | Past Workout History | As a gym-goer, I want to view my past workout logs so that I can track my consistency over time. | Scenario 5 |
| **US-3.3** (SLU-130) | Weekly Congestion Heatmap | As a gym-goer, I want to see a weekly congestion heatmap for each equipment type so that I can identify historically quieter time slots. | Scenario 2 |
| **US-4.1** (SLU-157) | Routine Saving | As a gym-goer, I want to save my regular workout routine so that the app can use it to make personalized recommendations. | Scenario 3, Scenario 4 |
| **US-4.2** (SLU-158) | Optimal Time Recommendation | As a gym-goer, I want to receive a suggested time to visit the gym based on my routine and historical data so that I can avoid waiting for equipment. | Scenario 3, Scenario 6, Scenario 7 |
| **US-4.3** (SLU-159) | Equipment Availability Alerts | As a gym-goer, I want to receive a push notification when a busy equipment type becomes free so that I can act on it in real time. | Scenario 5 |
| **US-4.4** (SLU-160) | Bug Fixes & Polish | As a user, I want the app to be stable and easy to navigate so that I can focus on my workout. | Section 3 (Verification) |

---

## 2. System Test Scenarios

### Scenario 1: Authentication & Account Lifecycle (Pass/Fail)
* **Goal**: Validate that users can register, log out, and log back in, ensuring data is isolated and persistent.
* **Target User Stories**: **US-1.3** (SLU-33)
* **Pre-conditions**: App is launched; user is not logged in.

#### Steps & Verification:
1. **Action**: Tap **Sign Up** on the welcome screen. Enter `email = testuser@example.com`, `password = SlugGymPass123`, and `name = Alex Test`. Tap **Register**.
   * **Expected Output**: Account is successfully created. The app redirects to the **Home** tab, showing "Good morning, Alex".
2. **Action**: Navigate to the **Profile** tab, scroll to the bottom, and tap **Log Out**.
   * **Expected Output**: The session terminates. The app returns to the welcome login/signup screen.
3. **Action**: Tap **Log In**, enter `email = testuser@example.com` and `password = SlugGymPass123`. Tap **Sign In**.
   * **Expected Output**: The app authenticates successfully and loads the **Home** tab, restoring the logged-in state.

---

### Scenario 2: Gym Dashboard & Map Exploration (Pass/Fail)
* **Goal**: Verify that users can browse current headcount, search standard equipment, view the interactive visual map, and inspect the weekly congestion heatmap.
* **Target User Stories**: **US-1.1** (SLU-41), **US-1.2** (SLU-39), **US-2.1** (SLU-68), **US-3.1** (SLU-128), **US-3.3** (SLU-130)
* **Pre-conditions**: User is logged in and viewing the Home screen.

#### Steps & Verification:
1. **Action**: View the **Live Headcount** card on the **Home** screen.
   * **Expected Output**: Displays the location name (e.g. "East Gym"), a progress bar, a timestamp of the last update, and the exact count (e.g., `24/150 people here now`).
2. **Action**: Scroll to the bottom of the **Home** screen and inspect the **Weekly Congestion Heatmap**.
   * **Expected Output**: Renders a grid showing relative busy indicators per hour block across all days. If the database has no historical data, it renders a clean, user-friendly fallback pattern.
3. **Action**: Navigate to the **Search** tab. Select **Equipment** mode and search for `Bench`.
   * **Expected Output**: A list of matched equipment appears (e.g., "Bench Press", "Incline Bench") showing their categories (e.g., "Free Weights") and live availability status (e.g., `2 available`).
4. **Action**: Navigate to the **Map** tab.
   * **Expected Output**: A full-screen visual map layout loads. Zones are colored by zone identifier, with a list legend at the bottom displaying live availability status and occupancy levels for each zone (e.g., 'Open' or 'Busy').
5. **Action**: Tap the **Bench Zone** (Zone 2) on the map.
   * **Expected Output**: A popup/bottom sheet sweeps up, displaying the list of all physical equipment assigned to that zone (e.g., showing 'Bench Press' or other machines as available/occupied).

---

### Scenario 3: Routine Creation & Management (Pass/Fail)
* **Goal**: Validate that users can create and manage routines, and that the optimal time recommendations handle routines without workout history.
* **Target User Stories**: **US-4.1** (SLU-157), **US-4.2** (SLU-158)
* **Pre-conditions**: User is on the **Workout** tab.

#### Steps & Verification:
1. **Action**: Under the **Pick a routine** header, tap **New Routine** (or **Create your first routine**).
   * **Expected Output**: Opens the **New routine** editor screen.
2. **Action**: Enter `name = Chest Day` and `goal = Strength`. Tap **Save routine**.
   * **Expected Output**: Routine is created and persisted. The screen returns to the **Workout** tab, and `Chest Day` is now visible under the routines list.
3. **Action**: Navigate to the **Home** tab and view the **Optimal Time Recommendation** card.
   * **Expected Output**: The card indicates that no recommendation is available yet because the routine has no logged history. It displays the empty hint fallback text: *"Create a routine and log at least one workout to unlock smart time recommendations."*

---

### Scenario 4: Workout Logging & Real-Time Occupancy Broadcast (Pass/Fail)
* **Goal**: Start a session from a saved routine, add exercises, sets, reps, and verify that claiming/releasing equipment decrements and increments live availability counters in real time.
* **Target User Stories**: **US-2.1** (SLU-68), **US-2.2** (SLU-82), **US-2.3** (SLU-70), **US-2.4** (SLU-71), **US-4.1** (SLU-157)
* **Pre-conditions**: User is on the **Workout** tab with `Chest Day` routine created.

#### Steps & Verification:
1. **Action**: Tap on the `Chest Day` routine, review the blank details, and tap **Start workout with this routine**.
   * **Expected Output**: The active workout logger screen opens, displaying the workout name "Chest Day" and starting the session timer.
2. **Action**: Tap **Add Exercise**. In the search bar, type `Bench Press`. Under the `Barbell Bench Press` exercise row, select the equipment option `Bench Press` and tap **Add**.
   * **Expected Output**: `Barbell Bench Press` is added to the active workout list.
3. **Action**: Verify real-time broadcast: Check the **Search** tab or the **Map** tab (either in parallel client or by database snapshot).
   * **Expected Output**: The live `available_count` for `Bench Press` has decremented by 1 (e.g., from `2` available to `1` available) because the active workout is claiming it.
4. **Action**: In the active workout screen, tap **Add Set**. Enter `weight = 80 kg`, `reps = 8`. Tap the completion checkbox. Tap **Add Set** again, enter `weight = 80 kg`, `reps = 6`, and tap the completion checkbox.
   * **Expected Output**: Two completed sets are logged under the exercise.
5. **Action**: Tap **End Exercise** (completing the exercise block).
   * **Expected Output**: The exercise is marked as finished. The live `available_count` for `Bench Press` increments back by 1 (e.g. from `1` to `2` available), releasing the equipment.
6. **Action**: Tap **End Workout** at the top right of the screen.
   * **Expected Output**: The workout session completes. The app redirects to the **Workout Summary** screen showing total duration, sets logged, and exercises completed.

---

### Scenario 5: History Review & In-App Alerts (Pass/Fail)
* **Goal**: Verify completed workouts appear in history and that in-app occupancy alerts function correctly.
* **Target User Stories**: **US-3.2** (SLU-129), **US-4.3** (SLU-159)
* **Pre-conditions**: 
  1. Two users participate in the test: **User A** and **User B**, logged into the app on separate devices (or client sessions).
  2. The gym database includes an equipment type with a total count of 1 (e.g. `Assisted Pull-up Machine`).
  3. **User B** has logged at least one workout under the `Chest Day` routine to enable history verification.

#### Steps & Verification:
1. **Action**: **User B** navigates to the **Stats** (or History) tab and taps the most recent workout in the log.
   * **Expected Output**: The detail screen loads, displaying the date, duration, total exercises, total sets, and showing `Barbell Bench Press` with sets: `80 kg x 8 reps` and `80 kg x 6 reps` marked as completed.
2. **Action**: **User B** goes to the **Workout** tab, selects `Chest Day`, and reviews the routine preview screen.
   * **Expected Output**: Instead of the empty banner, the routine preview now displays the bootstrapped exercises and sets from the last completed session (`Barbell Bench Press - 2 sets`).
3. **Action**: **User A** starts a workout session, adds `Assisted Pull-up Machine` to their active workout, and claim-selects it.
   * **Expected Output**: **User A**'s active workout page shows the exercise. The live availability counter for `Assisted Pull-up Machine` in the database drops from `1` to `0` (occupied).
4. **Action**: **User B** navigates to the **Search** tab, selects **Equipment** mode, searches for `Assisted Pull-up Machine` (showing 0 available), and taps **Notify when free**.
   * **Expected Output**: The button text changes to `✓ Notifying when free` and **User B**'s in-memory watchlist registers the subscription.
5. **Action**: **User A** completes/ends the exercise (or ends the workout session) to release the machine.
   * **Expected Output**: The live availability counter for `Assisted Pull-up Machine` in the database increments from `0` to `1` (available).
6. **Action**: **User B** checks their screen.
   * **Expected Output**: An in-app toast notification is displayed immediately at the top of **User B**'s screen showing `NOW AVAILABLE` and the equipment name `Assisted Pull-up Machine`. Tapping the toast dismisses it and removes the machine from **User B**'s watchlist.

---

### Scenario 6: Dynamic Routine Recommendation & Bottleneck Penalty (Pass/Fail)
* **Goal**: Verify that adding an exercise with congested equipment to a routine dynamically recalculates the availability scores, triggering the bottleneck penalty and updating the highlighted recommendation on the Home tab.
* **Target User Stories**: **US-2.2** (SLU-82), **US-4.2** (SLU-158)
* **Pre-conditions**:
  1. A user is logged in.
  2. The user has two saved routines: `"Back day!"` (initially containing `"One-Arm Dumbell Row"`) and `"Chest day!"` (initially containing `"Cable Crossover"`).
  3. Historical equipment logs for the last 2 weeks show:
     - `"Incline bench"` (used in `"Back day!"`): `12/13` availability (92.3% free).
     - `"Cable"` (used in `"Chest day!"`): `9/11` availability (81.8% free).
     - `"Back extension bench"` (used in `"Hyperextensions"`): `0/1` availability (0% free).

#### Steps & Verification:
1. **Action**: View the **Home** tab.
   * **Expected Output**: The `"Back day!"` routine has a higher confidence score than `"Chest day!"` (since 92.3% > 81.8%) and is highlighted at the top of the **Best Time to Go** card as the best recommendation.
2. **Action**: Navigate to the **Workout** tab, select the `"Back day!"` routine, and tap **Start workout with this routine**.
   * **Expected Output**: The active workout logger screen opens.
3. **Action**: Tap **Add Exercise**. Search for `"Hyperextensions"`. Under the exercise row, select `"Back extension bench"` as the equipment option, and tap **Add**. Log a set and tap **End Workout**.
   * **Expected Output**: The workout completes. The latest session for the `"Back day!"` routine now registers as having used both `"Incline bench"` and `"Back extension bench"`.
4. **Action**: Navigate back to the **Home** tab and view the **Best Time to Go** card.
   * **Expected Output**:
     - The scoring engine recalculates the scores for `"Back day!"`. Because `"Back extension bench"` is heavily congested (0% availability), the bottleneck penalty is triggered, drastically reducing the score.
     - The `"Back day!"` routine's congestion level is marked as `"Busy"`.
     - The `"Chest day!"` routine now has a higher confidence score, becomes the top pick, and is highlighted as the new recommendation.

---

## 3. Validation Report

An automated test suite exists in `frontend/__tests__` and has been run successfully.

### Automated Test Execution
* **Command**: `cd frontend && npm test -- --testTimeout=15000`
* **Result**: **PASS** (100%)
* **Suites**: 27 passed, 27 total
* **Tests**: 159 passed, 159 total

### Typechecking & Linting
* **Typecheck Command**: `npx tsc --noEmit` (Successfully verified code types)
* **Linting Command**: `npm run lint` (Completed with zero warnings or errors)
