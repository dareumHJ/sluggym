CREATE TABLE workout_exercises (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id bigint NOT NULL REFERENCES exercises(id),
  equipment_id bigint REFERENCES "gym_equipment"(id),
  order_index int NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_active ON workout_exercises(equipment_id) WHERE ended_at IS NULL;