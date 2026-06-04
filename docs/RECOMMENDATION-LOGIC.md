# Optimal Visit-Time Recommendation Scoring Logic

This document defines the deterministic scoring algorithm to recommend the optimal visit times for a user's gym routines. To align with the project's frontend-driven architecture, this logic is designed to execute entirely in a client-side React hook using direct Supabase queries.

---

## 1. Core Objectives

1. **Find the best time for each routine**: For every routine, determine the day of the week and 3-hour time slot (e.g., `Mon-6p`) when the routine's required equipment has the highest historical availability.
2. **Recommend the single best routine & time**: Compare the optimal times across all user routines and select the single combination with the highest overall availability score to display as the top recommendation (e.g., "The best time for your Back Day routine is Wed at 9am, when 90% of equipment is typically free").

---

## 2. Inputs & Data Mapping (Direct Supabase Queries)

Rather than calling a backend server, the frontend React hook queries Supabase directly to pull inputs:

1. **Fetch User Routines**:
   Queries `public.routines` for all templates matching `user_id = auth.uid()`.
2. **Determine Required Equipment names ($E_R$)**:
   For each routine $R$, finds the most recent completed workout matching `routine_id = R.id`. It retrieves the `equipment_id`s from `public.workout_exercises` and dereferences them against the `public.gym_equipment` table to get the unique list of `equipment_name` values (e.g., `["Squat Rack", "Leg Press"]`).
3. **Fetch Availability History**:
   Queries `public.equipment_availability_history` for records matching the target `equipment_name`s within a 30-day window.

---

## 3. The Scoring Algorithm

For each routine $R$ and each of the **42 weekly time buckets** (7 days × 6 hour blocks: `6a`, `9a`, `12p`, `3p`, `6p`, `9p`):

### Step 1: Calculate Individual Equipment Availability
For each required equipment name $e \in E_R$, calculate its historical average availability proportion $A(e, B)$ in bucket $B$:
$$A(e, B) = \frac{1}{|S(e, B)|} \sum_{s \in S(e, B)} \frac{\text{available\_count}_s}{\text{total\_count}_s}$$
where $S(e, B)$ is the set of history samples for equipment $e$ during bucket $B$. $A(e, B)$ yields a value between `0.0` (fully occupied) and `1.0` (completely free).

### Step 2: Apply the Bottleneck Penalty
To prevent a workout from being scheduled during a time when even a single crucial piece of equipment is fully occupied, we apply a **bottleneck penalty**:

* **Mean Availability**: 
  $$\text{MeanAvail}(R, B) = \frac{1}{|E_R|} \sum_{e \in E_R} A(e, B)$$
* **Minimum (Bottleneck) Availability**:
  $$\text{MinAvail}(R, B) = \min_{e \in E_R} A(e, B)$$
* **Adjusted Score**:
  $$\text{Score}(R, B) = \text{MeanAvail}(R, B) \times \left(0.5 + 0.5 \times \text{MinAvail}(R, B)\right)$$

*Example*: If a routine needs a Bench Press (100% free) and a Cable Cross (0% free), the mean availability is 50%, but the bottleneck is 0%. The adjusted score is $0.5 \times (0.5 + 0) = 25\%$.

### Step 3: Select the Best Time for the Routine
Identify the bucket $B_R^*$ that maximizes the score:
$$B_R^* = \arg\max_{B} \text{Score}(R, B)$$

### Step 4: Rank Routines for the Top Recommendation
Sort routines by their maximum score in descending order. Recommend the top routine $R_{\text{best}}$ and its optimal time $B_{R_{\text{best}}}^*$, breaking ties with the most recent `last_used_at` timestamp.

---

## 4. Sparse-Data Fallback Behavior

If the historical tables have missing data or very few samples, we apply the following fallback rules in order of priority:

1. **Missing Equipment-Specific Samples**: 
   If there are no samples for an equipment name $e$ in bucket $B$, query the overall gym headcount occupancy percentage $O(B)$ for that bucket (calculated from `public.gym_headcount_history`) and approximate the availability as:
   $$A(e, B) = 1.0 - O(B)$$
2. **Missing Gym Headcount Samples (Commercial Gym Traffic Baseline)**:
   If overall gym headcount logs are also missing for bucket $B$, fall back to a hardcoded **industry-standard commercial gym traffic profile** $P(B)$. 
   
   *Basis for the profile:* This profile is derived from reports by the **IHRSA (International Health, Racquet & Sportsclub Association)** regarding peak and off-peak hour patterns in commercial fitness centers, reflecting a typical double-peak curve:
   * **`6a`** (6:00 – 08:59) $\rightarrow$ *Early Morning Wake-up Peak*: 20% busy ($\text{Availability } A = 0.80$)
   * **`9a`** (09:00 – 11:59) $\rightarrow$ *Mid-Morning Taper*: 35% busy ($\text{Availability } A = 0.65$)
   * **`12p`** (12:00 – 14:59) $\rightarrow$ *Lunch Hour Mini-Peak*: 50% busy ($\text{Availability } A = 0.50$)
   * **`3p`** (15:00 – 17:59) $\rightarrow$ *Early Afternoon Taper*: 65% busy ($\text{Availability } A = 0.35$)
   * **`6p`** (18:00 – 20:59) $\rightarrow$ *Post-Work Rush Hour Peak*: 85% busy ($\text{Availability } A = 0.15$)
   * **`9p`** (21:00 – 23:59) $\rightarrow$ *Late Night Cool Down*: 40% busy ($\text{Availability } A = 0.60$)
3. **No Workout History**:
   If a routine is newly created and has no workout history, it cannot receive recommendations. The UI will prompt: *"Log your first session to receive smart time recommendations."*

---

## 5. Client-Side Hook Interface

The scoring algorithm runs in a custom hook `useRoutineRecommendations` that interacts directly with Supabase:

```typescript
export interface RoutineTimeRecommendation {
  routineId: string;
  routineName: string;
  targetMuscles: string[];
  optimalDay: string;          // e.g., "Wed"
  optimalHourLabel: string;   // e.g., "9a"
  score: number;                // Score percentage (0 - 100)
  bottleneckEquipment: string; // The equipment name that limited the score
}

export interface UseRoutineRecommendationsReturn {
  // The single best recommendation to display at the top
  topRecommendation: RoutineTimeRecommendation | null;
  
  // All other routines and their optimal times for secondary display
  allRecommendations: RoutineTimeRecommendation[];
  
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
```
