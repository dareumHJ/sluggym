CREATE TABLE exercise_sets (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  workout_exercise_id bigint NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number int NOT NULL,
  weight numeric(6,2),
  reps int,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (workout_exercise_id, set_number)
);

CREATE INDEX idx_exercise_sets_workout_exercise_id ON exercise_sets(workout_exercise_id);