-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cleanup function
CREATE OR REPLACE FUNCTION timeout_abandoned_sessions(timeout_hours int)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  -- Find workouts that have been open longer than timeout_hours
  WITH abandoned AS (
    SELECT id 
    FROM workouts 
    WHERE ended_at IS NULL 
    AND started_at < NOW() - (timeout_hours || ' hours')::interval
  ),
  -- Find all active workout_exercises tied to those workouts that hold equipment
  released_exercises AS (
    UPDATE workout_exercises we
    SET ended_at = NOW()
    FROM abandoned a
    WHERE we.workout_id = a.id 
      AND we.ended_at IS NULL 
      AND we.equipment_id IS NOT NULL
    RETURNING we.equipment_id
  ),
  -- Restore the gym_equipment available counts securely
  restore_counts AS (
    UPDATE gym_equipment ge
    SET available_count = LEAST(ge.total_count, ge.available_count + counts.c)
    FROM (
      SELECT equipment_id, count(*) as c 
      FROM released_exercises 
      GROUP BY equipment_id
    ) counts
    WHERE ge.id = counts.equipment_id
    RETURNING ge.id
  )
  -- end the abandoned workouts themselves
  UPDATE workouts w
  SET 
    ended_at = NOW(),
    -- Calculate duration so the stats page doesn't crash on abandoned workouts
    duration_min = (EXTRACT(EPOCH FROM (NOW() - w.started_at)) / 60)::int
  FROM abandoned a
  WHERE w.id = a.id;
END;
$$ LANGUAGE plpgsql;

-- Schedule the cron job to run every 5 minutes and timeout sessions older than 3 hours (changeable)
SELECT cron.schedule(
  'timeout-abandoned-sessions', 
  '*/5 * * * *', 
  'SELECT timeout_abandoned_sessions(3);'
);
