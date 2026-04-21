-- =============================================================
-- SlugGym exercise_equipment mapping — name-based JOIN inserts
-- =============================================================
-- This script uses exercise.name and equipment.name for lookups,
-- so it works regardless of auto-generated IDs.
-- Safe to re-run: uses ON CONFLICT DO NOTHING.
--
-- Total mappings: 958
-- Total exercises: 809
-- =============================================================

-- Optional: clear existing mappings first
-- DELETE FROM exercise_equipment;

-- 3/4 Sit-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = '3/4 Sit-Up' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = '3/4 Sit-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- 90/90 Hamstring
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = '90/90 Hamstring' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Ab Crunch Machine
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Ab Crunch Machine' AND eq.name = 'Abdominal crunch machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Ab Roller
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Ab Roller' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Adaptive Motion Training
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Adaptive Motion Training' AND eq.name = 'Adaptive motion trainer'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Adductor
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Adductor' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Adductor/Groin
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Adductor/Groin' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Advanced Kettlebell Windmill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Advanced Kettlebell Windmill' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Air Bike
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Air Bike' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- All Fours Quad Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'All Fours Quad Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternate Hammer Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternate Hammer Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternate Heel Touchers
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternate Heel Touchers' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternate Incline Dumbbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternate Incline Dumbbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternate Leg Diagonal Bound
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternate Leg Diagonal Bound' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternating Cable Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternating Cable Shoulder Press' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternating Deltoid Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternating Deltoid Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternating Floor Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternating Floor Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternating Hang Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternating Hang Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternating Kettlebell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternating Kettlebell Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternating Kettlebell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternating Kettlebell Row' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Alternating Renegade Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Alternating Renegade Row' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Ankle Circles
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Ankle Circles' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Ankle On The Knee
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Ankle On The Knee' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Anterior Tibialis-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Anterior Tibialis-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Anti-Gravity Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Anti-Gravity Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Arm Circles
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Arm Circles' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Arnold Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Arnold Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Around The Worlds
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Around The Worlds' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Back Flyes - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Back Flyes - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Backward Medicine Ball Throw
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Backward Medicine Ball Throw' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Balance Board
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Balance Board' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Ball Leg Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Ball Leg Curl' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Band Assisted Pull-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Band Assisted Pull-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Band Assisted Pull-Up' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Band Good Morning
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Band Good Morning' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Band Good Morning (Pull Through)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Band Good Morning (Pull Through)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Band Hip Adductions
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Band Hip Adductions' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Band Pull Apart
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Band Pull Apart' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Band Skull Crusher
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Band Skull Crusher' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Ab Rollout
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Ab Rollout' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Ab Rollout - On Knees
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Ab Rollout - On Knees' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Bench Press - Medium Grip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Bench Press - Medium Grip' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Bench Press - Medium Grip' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Bench Press - Medium Grip' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Curls Lying Against An Incline
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Curls Lying Against An Incline' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Full Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Full Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Full Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Glute Bridge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Glute Bridge' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Guillotine Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Guillotine Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Guillotine Bench Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Guillotine Bench Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Hack Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Hack Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Hack Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Hip Thrust
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Hip Thrust' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Incline Bench Press - Medium Grip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Incline Bench Press - Medium Grip' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Incline Bench Press - Medium Grip' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Incline Shoulder Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Incline Shoulder Raise' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Lunge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Lunge' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Rear Delt Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Rear Delt Row' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Rollout from Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Rollout from Bench' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Seated Calf Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Seated Calf Raise' AND eq.name = 'Standing calf raise'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Shoulder Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Shrug
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Shrug' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Shrug Behind The Back
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Shrug Behind The Back' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Side Bend
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Side Bend' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Side Split Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Side Split Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Side Split Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Squat To A Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Squat To A Bench' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Squat To A Bench' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Step Ups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Step Ups' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Barbell Walking Lunge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Barbell Walking Lunge' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Battling Ropes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Battling Ropes' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Behind Head Chest Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Behind Head Chest Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bench Dips
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Dips' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Dips' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bench Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bench Press - Powerlifting
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Press - Powerlifting' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Press - Powerlifting' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Press - Powerlifting' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bench Press - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Press - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bench Press with Chains
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Press with Chains' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Press with Chains' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Press with Chains' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bench Sprint
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bench Sprint' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Over Barbell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Over Barbell Row' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Over Dumbbell Rear Delt Raise With Head On Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Over Dumbbell Rear Delt Raise With Head On Bench' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Over Low-Pulley Side Lateral
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Over Low-Pulley Side Lateral' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Over One-Arm Long Bar Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Over One-Arm Long Bar Row' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Over Two-Arm Long Bar Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Over Two-Arm Long Bar Row' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Over Two-Dumbbell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Over Two-Dumbbell Row' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Over Two-Dumbbell Row With Palms In
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Over Two-Dumbbell Row With Palms In' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent-Arm Barbell Pullover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent-Arm Barbell Pullover' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent-Arm Barbell Pullover' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent-Arm Dumbbell Pullover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent-Arm Dumbbell Pullover' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent-Arm Dumbbell Pullover' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bent-Knee Hip Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bent-Knee Hip Raise' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bicycling, Stationary
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bicycling, Stationary' AND eq.name = 'Upright bike'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Board Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Board Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Body Tricep Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Body Tricep Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Body-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Body-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bodyweight Flyes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bodyweight Flyes' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bodyweight Mid Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bodyweight Mid Row' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bodyweight Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bodyweight Squat' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bodyweight Walking Lunge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bodyweight Walking Lunge' AND eq.name = 'Running machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bosu Ball Cable Crunch With Side Bends
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bosu Ball Cable Crunch With Side Bends' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bottoms Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bottoms Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bottoms-Up Clean From The Hang Position
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bottoms-Up Clean From The Hang Position' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Box Jump (Multiple Response)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Jump (Multiple Response)' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Box Skip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Skip' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Box Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Box Squat with Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Squat with Bands' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Squat with Bands' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Box Squat with Chains
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Squat with Chains' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Box Squat with Chains' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Brachialis-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Brachialis-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Bradford/Rocky Presses
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Bradford/Rocky Presses' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Butt Lift (Bridge)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Butt Lift (Bridge)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Butt-Ups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Butt-Ups' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Butterfly
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Butterfly' AND eq.name = 'Pectoral fly machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Chest Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Chest Press' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Crossover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Crossover' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Crunch' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Deadlifts
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Deadlifts' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Hammer Curls - Rope Attachment
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Hammer Curls - Rope Attachment' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Hip Adduction
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Hip Adduction' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Incline Pushdown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Incline Pushdown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Incline Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Incline Triceps Extension' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Internal Rotation
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Internal Rotation' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Iron Cross
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Iron Cross' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Judo Flip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Judo Flip' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Lying Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Lying Triceps Extension' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable One Arm Tricep Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable One Arm Tricep Extension' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Preacher Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Preacher Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Rear Delt Fly
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Rear Delt Fly' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Reverse Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Reverse Crunch' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Rope Overhead Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Rope Overhead Triceps Extension' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Rope Rear-Delt Rows
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Rope Rear-Delt Rows' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Russian Twists
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Russian Twists' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Seated Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Seated Crunch' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Seated Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Seated Lateral Raise' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Shoulder Press' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Shrugs
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Shrugs' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cable Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cable Wrist Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calf Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calf Press' AND eq.name = 'Standing calf raise'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calf Press On The Leg Press Machine
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calf Press On The Leg Press Machine' AND eq.name = 'Seated leg press'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calf Raise On A Dumbbell
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calf Raise On A Dumbbell' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calf Raises - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calf Raises - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calf Stretch Elbows Against Wall
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calf Stretch Elbows Against Wall' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calf Stretch Hands Against Wall
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calf Stretch Hands Against Wall' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calf-Machine Shoulder Shrug
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calf-Machine Shoulder Shrug' AND eq.name = 'Shoulder press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Calves-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Calves-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Car Drivers
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Car Drivers' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Carioca Quick Step
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Carioca Quick Step' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cat Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cat Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Catch and Overhead Throw
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Catch and Overhead Throw' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chair Leg Extended Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chair Leg Extended Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chair Lower Back Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chair Lower Back Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chair Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chair Squat' AND eq.name = 'Seated leg press'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chair Upper Body Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chair Upper Body Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chest And Front Of Shoulder Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chest And Front Of Shoulder Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chest Push (multiple response)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chest Push (multiple response)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chest Push (single response)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chest Push (single response)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chest Push from 3 point stance
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chest Push from 3 point stance' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chest Push with Run Release
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chest Push with Run Release' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chest Stretch on Stability Ball
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chest Stretch on Stability Ball' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Child's Pose
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Child''s Pose' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chin To Chest Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chin To Chest Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Chin-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chin-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Chin-Up' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Clean and Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Clean and Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Clock Push-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Clock Push-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Clock Push-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip Barbell Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Barbell Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Barbell Bench Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Barbell Bench Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip EZ Bar Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip EZ Bar Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip EZ-Bar Curl with Band
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip EZ-Bar Curl with Band' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip EZ-Bar Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip EZ-Bar Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip Front Lat Pulldown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Front Lat Pulldown' AND eq.name = 'Lat pulldown machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Front Lat Pulldown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip Push-Up off of a Dumbbell
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Push-Up off of a Dumbbell' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Push-Up off of a Dumbbell' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Close-Grip Standing Barbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Close-Grip Standing Barbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cocoons
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cocoons' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Concentration Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Concentration Curls' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cross Body Hammer Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cross Body Hammer Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cross Over - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cross Over - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cross-Body Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cross-Body Crunch' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cross-Body Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Crossover Reverse Lunge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Crossover Reverse Lunge' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Crunch - Hands Overhead
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Crunch - Hands Overhead' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Crunch - Hands Overhead' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Crunch - Legs On Exercise Ball
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Crunch - Legs On Exercise Ball' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Crunch - Legs On Exercise Ball' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Crunches
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Crunches' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Crunches' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Cuban Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Cuban Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dancer's Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dancer''s Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dead Bug
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dead Bug' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Deadlift with Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Deadlift with Bands' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Deadlift with Chains
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Deadlift with Chains' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Barbell Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Barbell Bench Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Barbell Bench Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Close-Grip Bench To Skull Crusher
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Close-Grip Bench To Skull Crusher' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Close-Grip Bench To Skull Crusher' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Crunch' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Dumbbell Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Dumbbell Bench Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Dumbbell Flyes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Dumbbell Flyes' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline EZ Bar Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline EZ Bar Triceps Extension' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Oblique Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Oblique Crunch' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Oblique Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Push-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Push-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Reverse Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Reverse Crunch' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Reverse Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Decline Smith Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Decline Smith Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Deficit Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Deficit Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Depth Jump Leap
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Depth Jump Leap' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dip Machine
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dip Machine' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dips - Chest Version
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dips - Chest Version' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dips - Chest Version' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dips - Triceps Version
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dips - Triceps Version' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dips - Triceps Version' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Donkey Calf Raises
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Donkey Calf Raises' AND eq.name = 'Standing calf raise'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Double Kettlebell Alternating Hang Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Double Kettlebell Alternating Hang Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Double Kettlebell Jerk
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Double Kettlebell Jerk' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Double Kettlebell Push Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Double Kettlebell Push Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Double Kettlebell Snatch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Double Kettlebell Snatch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Double Kettlebell Windmill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Double Kettlebell Windmill' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Double Leg Butt Kick
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Double Leg Butt Kick' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Downward Facing Balance
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Downward Facing Balance' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Drag Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Drag Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Drop Push
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Drop Push' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Alternate Bicep Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Alternate Bicep Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Bench Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Bench Press with Neutral Grip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Bench Press with Neutral Grip' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Bench Press with Neutral Grip' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Bicep Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Bicep Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Clean' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Floor Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Floor Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Flyes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Flyes' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Flyes' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Incline Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Incline Row' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Incline Shoulder Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Incline Shoulder Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Lunges
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lunges' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Lying One-Arm Rear Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying One-Arm Rear Lateral Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying One-Arm Rear Lateral Raise' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Lying Pronation
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying Pronation' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying Pronation' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Lying Rear Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying Rear Lateral Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying Rear Lateral Raise' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Lying Supination
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying Supination' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Lying Supination' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell One-Arm Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell One-Arm Shoulder Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell One-Arm Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell One-Arm Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell One-Arm Upright Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell One-Arm Upright Row' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Prone Incline Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Prone Incline Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Rear Lunge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Rear Lunge' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Scaption
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Scaption' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Seated Box Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Seated Box Jump' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Seated One-Leg Calf Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Seated One-Leg Calf Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Shoulder Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Shrug
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Shrug' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Side Bend
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Side Bend' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Squat' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Squat To A Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Squat To A Bench' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Step Ups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Step Ups' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dumbbell Tricep Extension -Pronated Grip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dumbbell Tricep Extension -Pronated Grip' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dynamic Back Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dynamic Back Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Dynamic Chest Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Dynamic Chest Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- EZ-Bar Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'EZ-Bar Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- EZ-Bar Skullcrusher
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'EZ-Bar Skullcrusher' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'EZ-Bar Skullcrusher' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Elbow Circles
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Elbow Circles' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Elbow to Knee
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Elbow to Knee' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Elbows Back
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Elbows Back' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Elevated Back Lunge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Elevated Back Lunge' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Elevated Cable Rows
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Elevated Cable Rows' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Elliptical Trainer
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Elliptical Trainer' AND eq.name = 'Elliptical trainer'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Exercise Ball Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Exercise Ball Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Exercise Ball Pull-In
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Exercise Ball Pull-In' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Extended Range One-Arm Kettlebell Floor Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Extended Range One-Arm Kettlebell Floor Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- External Rotation
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'External Rotation' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- External Rotation with Band
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'External Rotation with Band' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- External Rotation with Cable
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'External Rotation with Cable' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Face Pull
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Face Pull' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Fast Skipping
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Fast Skipping' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Finger Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Finger Curls' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Flat Bench Cable Flyes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Flat Bench Cable Flyes' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Flat Bench Leg Pull-In
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Flat Bench Leg Pull-In' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Flat Bench Lying Leg Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Flat Bench Lying Leg Raise' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Flexor Incline Dumbbell Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Flexor Incline Dumbbell Curls' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Floor Glute-Ham Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Floor Glute-Ham Raise' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Floor Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Floor Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Floor Press with Chains
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Floor Press with Chains' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Flutter Kicks
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Flutter Kicks' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Foot-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Foot-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Freehand Jump Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Freehand Jump Squat' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Frog Hops
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Frog Hops' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Frog Sit-Ups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Frog Sit-Ups' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Frog Sit-Ups' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Barbell Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Barbell Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Barbell Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Barbell Squat To A Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Barbell Squat To A Bench' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Barbell Squat To A Bench' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Box Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Box Jump' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Cable Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Cable Raise' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Cone Hops (or hurdle hops)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Cone Hops (or hurdle hops)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Dumbbell Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Dumbbell Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Incline Dumbbell Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Incline Dumbbell Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Leg Raises
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Leg Raises' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Plate Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Plate Raise' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Raise And Pullover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Raise And Pullover' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Raise And Pullover' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Squat (Clean Grip)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Squat (Clean Grip)' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Squat (Clean Grip)' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Squats With Two Kettlebells
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Squats With Two Kettlebells' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Front Two-Dumbbell Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Front Two-Dumbbell Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Full Range-Of-Motion Lat Pulldown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Full Range-Of-Motion Lat Pulldown' AND eq.name = 'Lat pulldown machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Full Range-Of-Motion Lat Pulldown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Gironda Sternum Chins
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Gironda Sternum Chins' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Gironda Sternum Chins' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Glute Ham Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Glute Ham Raise' AND eq.name = 'Glute ham / reverse hyper combo'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Glute Kickback
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Glute Kickback' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Goblet Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Goblet Squat' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Good Morning
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Good Morning' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Good Morning off Pins
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Good Morning off Pins' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Gorilla Chin/Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Gorilla Chin/Crunch' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Gorilla Chin/Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Groin and Back Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Groin and Back Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Groiners
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Groiners' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hack Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hack Squat' AND eq.name = 'Hack squat machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hammer Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hammer Curls' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hammer Grip Incline DB Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hammer Grip Incline DB Bench Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hamstring Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hamstring Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hamstring-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hamstring-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Handstand Push-Ups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Handstand Push-Ups' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Handstand Push-Ups' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hanging Bar Good Morning
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hanging Bar Good Morning' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hanging Leg Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hanging Leg Raise' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hanging Pike
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hanging Pike' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Heavy Bag Thrust
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Heavy Bag Thrust' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- High Cable Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'High Cable Curls' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hip Circles (prone)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hip Circles (prone)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hip Extension with Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hip Extension with Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hip Flexion with Band
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hip Flexion with Band' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hip Lift with Band
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hip Lift with Band' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hug A Ball
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hug A Ball' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hug Knees To Chest
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hug Knees To Chest' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hurdle Hops
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hurdle Hops' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hyperextensions (Back Extensions)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hyperextensions (Back Extensions)' AND eq.name = 'Back extension bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hyperextensions (Back Extensions)' AND eq.name = 'Back extension machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Hyperextensions With No Hyperextension Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hyperextensions With No Hyperextension Bench' AND eq.name = 'Back extension bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Hyperextensions With No Hyperextension Bench' AND eq.name = 'Back extension machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- IT Band and Glute Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'IT Band and Glute Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Iliotibial Tract-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Iliotibial Tract-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Inchworm
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Inchworm' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Barbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Barbell Triceps Extension' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Bench Pull
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Bench Pull' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Cable Chest Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Cable Chest Press' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Cable Flye
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Cable Flye' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Dumbbell Bench With Palms Facing In
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Dumbbell Bench With Palms Facing In' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Dumbbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Dumbbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Dumbbell Flyes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Dumbbell Flyes' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Dumbbell Flyes - With A Twist
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Dumbbell Flyes - With A Twist' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Hammer Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Hammer Curls' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Inner Biceps Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Inner Biceps Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Push-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Push-Up Close-Grip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Close-Grip' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Close-Grip' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Push-Up Depth Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Depth Jump' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Push-Up Medium
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Medium' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Medium' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Push-Up Reverse Grip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Reverse Grip' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Reverse Grip' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Incline Push-Up Wide
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Wide' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Incline Push-Up Wide' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Intermediate Groin Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Intermediate Groin Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Intermediate Hip Flexor and Quad Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Intermediate Hip Flexor and Quad Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Internal Rotation with Band
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Internal Rotation with Band' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Inverted Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Inverted Row' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Inverted Row with Straps
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Inverted Row with Straps' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Iron Cross
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Iron Cross' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Iron Crosses (stretch)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Iron Crosses (stretch)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Isometric Chest Squeezes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Isometric Chest Squeezes' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Isometric Neck Exercise - Front And Back
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Isometric Neck Exercise - Front And Back' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Isometric Neck Exercise - Sides
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Isometric Neck Exercise - Sides' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Isometric Wipers
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Isometric Wipers' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- JM Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'JM Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Jackknife Sit-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Jackknife Sit-Up' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Jackknife Sit-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Janda Sit-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Janda Sit-Up' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Janda Sit-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Jefferson Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Jefferson Squats' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Jefferson Squats' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Jogging, Treadmill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Jogging, Treadmill' AND eq.name = 'Running machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Arnold Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Arnold Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Dead Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Dead Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Figure 8
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Figure 8' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Hang Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Hang Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell One-Legged Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell One-Legged Deadlift' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Pass Between The Legs
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Pass Between The Legs' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Pirate Ships
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Pirate Ships' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Pistol Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Pistol Squat' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Seated Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Seated Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Seesaw Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Seesaw Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Sumo High Pull
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Sumo High Pull' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Thruster
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Thruster' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Turkish Get-Up (Lunge style)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Turkish Get-Up (Lunge style)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Turkish Get-Up (Squat style)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Turkish Get-Up (Squat style)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kettlebell Windmill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kettlebell Windmill' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kipping Muscle Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kipping Muscle Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kipping Muscle Up' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Knee Across The Body
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Knee Across The Body' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Knee Circles
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Knee Circles' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Knee Tuck Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Knee Tuck Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Knee/Hip Raise On Parallel Bars
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Knee/Hip Raise On Parallel Bars' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling Arm Drill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Arm Drill' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling Cable Crunch With Alternating Oblique Twists
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Cable Crunch With Alternating Oblique Twists' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling Cable Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Cable Triceps Extension' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling Forearm Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Forearm Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling High Pulley Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling High Pulley Row' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling Hip Flexor
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Hip Flexor' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling Single-Arm High Pulley Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Single-Arm High Pulley Row' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Kneeling Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Kneeling Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Landmine 180's
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Landmine 180''s' AND eq.name = 'Landmine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Landmine Linear Jammer
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Landmine Linear Jammer' AND eq.name = 'Landmine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lateral Bound
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lateral Bound' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lateral Box Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lateral Box Jump' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lateral Cone Hops
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lateral Cone Hops' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lateral Raise - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lateral Raise - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Latissimus Dorsi-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Latissimus Dorsi-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leg Extensions
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leg Extensions' AND eq.name = 'Leg extension machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leg Lift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leg Lift' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leg Pull-In
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leg Pull-In' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leg-Over Floor Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leg-Over Floor Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leg-Up Hamstring Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leg-Up Hamstring Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage Chest Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage Chest Press' AND eq.name = 'Chest press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage Decline Chest Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage Decline Chest Press' AND eq.name = 'Chest press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage High Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage High Row' AND eq.name = 'Row machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage Incline Chest Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage Incline Chest Press' AND eq.name = 'Chest press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage Iso Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage Iso Row' AND eq.name = 'Row machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage Shoulder Press' AND eq.name = 'Shoulder press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Leverage Shrug
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Leverage Shrug' AND eq.name = 'Shoulder press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Linear 3-Part Start Technique
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Linear 3-Part Start Technique' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Linear Acceleration Wall Drill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Linear Acceleration Wall Drill' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Linear Depth Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Linear Depth Jump' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Linear Leg Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Linear Leg Press' AND eq.name = 'Linear leg press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- London Bridges
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'London Bridges' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Looking At Ceiling
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Looking At Ceiling' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Low Cable Crossover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Low Cable Crossover' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Low Cable Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Low Cable Triceps Extension' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Low Pulley Row To Neck
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Low Pulley Row To Neck' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lower Back Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lower Back Curl' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lower Back-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lower Back-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lunge Pass Through
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lunge Pass Through' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lunge Sprint
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lunge Sprint' AND eq.name = 'Seated leg press'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Bent Leg Groin
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Bent Leg Groin' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Cable Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Cable Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Cambered Barbell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Cambered Barbell Row' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Close-Grip Bar Curl On High Pulley
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Close-Grip Bar Curl On High Pulley' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Close-Grip Barbell Triceps Extension Behind The Head
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Close-Grip Barbell Triceps Extension Behind The Head' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Close-Grip Barbell Triceps Extension Behind The Head' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Close-Grip Barbell Triceps Press To Chin
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Close-Grip Barbell Triceps Press To Chin' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Close-Grip Barbell Triceps Press To Chin' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Crossover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Crossover' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Dumbbell Tricep Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Dumbbell Tricep Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Dumbbell Tricep Extension' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Face Down Plate Neck Resistance
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Face Down Plate Neck Resistance' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Face Up Plate Neck Resistance
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Face Up Plate Neck Resistance' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Glute
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Glute' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Hamstring
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Hamstring' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying High Bench Barbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying High Bench Barbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Leg Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Leg Curls' AND eq.name = 'Leg curl machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Machine Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Machine Squat' AND eq.name = 'Seated leg press'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying One-Arm Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying One-Arm Lateral Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying One-Arm Lateral Raise' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Prone Quadriceps
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Prone Quadriceps' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Rear Delt Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Rear Delt Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Rear Delt Raise' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Supine Dumbbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Supine Dumbbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Supine Dumbbell Curl' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying T-Bar Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying T-Bar Row' AND eq.name = 'Row machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Lying Triceps Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Triceps Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Lying Triceps Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Bench Press' AND eq.name = 'Chest press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Bicep Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Bicep Curl' AND eq.name = 'Biceps curl machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Hip Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Hip Extension' AND eq.name = 'Hip & glute machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Hip Thrust
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Hip Thrust' AND eq.name = 'Glute drive machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Lateral Raise' AND eq.name = 'Lateral raise machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Preacher Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Preacher Curls' AND eq.name = 'Biceps curl machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Shoulder (Military) Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Shoulder (Military) Press' AND eq.name = 'Shoulder press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Machine Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Machine Triceps Extension' AND eq.name = 'Triceps extension machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Medicine Ball Chest Pass
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Medicine Ball Chest Pass' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Medicine Ball Full Twist
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Medicine Ball Full Twist' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Medicine Ball Scoop Throw
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Medicine Ball Scoop Throw' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Middle Back Shrug
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Middle Back Shrug' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Middle Back Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Middle Back Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Mixed Grip Chin
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Mixed Grip Chin' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Mixed Grip Chin' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Monster Walk
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Monster Walk' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Mountain Climbers
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Mountain Climbers' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Moving Claw Series
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Moving Claw Series' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Muscle Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Muscle Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Muscle Up' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Narrow Stance Hack Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Narrow Stance Hack Squats' AND eq.name = 'Hack squat machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Narrow Stance Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Narrow Stance Squats' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Narrow Stance Squats' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Natural Glute Ham Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Natural Glute Ham Raise' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Neck Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Neck Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Neck-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Neck-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Oblique Crunches
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Oblique Crunches' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Oblique Crunches' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Oblique Crunches - On The Floor
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Oblique Crunches - On The Floor' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Oblique Crunches - On The Floor' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- On Your Side Quad Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'On Your Side Quad Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- On-Your-Back Quad Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'On-Your-Back Quad Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Against Wall
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Against Wall' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Chin-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Chin-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Chin-Up' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Dumbbell Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Dumbbell Bench Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Dumbbell Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Dumbbell Preacher Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Dumbbell Preacher Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Floor Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Floor Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Lat Pulldown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Lat Pulldown' AND eq.name = 'Lat pulldown machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Lat Pulldown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Pronated Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Pronated Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Arm Supinated Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Arm Supinated Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Half Locust
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Half Locust' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Handed Hang
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Handed Hang' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Knee To Chest
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Knee To Chest' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One Leg Barbell Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Leg Barbell Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One Leg Barbell Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Dumbbell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Dumbbell Row' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Flat Bench Dumbbell Flye
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Flat Bench Dumbbell Flye' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Flat Bench Dumbbell Flye' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm High-Pulley Cable Side Bends
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm High-Pulley Cable Side Bends' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Incline Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Incline Lateral Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Clean and Jerk
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Clean and Jerk' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Floor Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Floor Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Jerk
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Jerk' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Military Press To The Side
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Military Press To The Side' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Para Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Para Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Push Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Push Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Row' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Snatch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Snatch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Split Jerk
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Split Jerk' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Split Snatch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Split Snatch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Kettlebell Swings
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Kettlebell Swings' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Long Bar Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Long Bar Row' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Medicine Ball Slam
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Medicine Ball Slam' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Open Palm Kettlebell Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Open Palm Kettlebell Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Overhead Kettlebell Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Overhead Kettlebell Squats' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Side Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Side Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Arm Side Laterals
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Arm Side Laterals' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- One-Legged Cable Kickback
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'One-Legged Cable Kickback' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Open Palm Kettlebell Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Open Palm Kettlebell Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Otis-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Otis-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Overhead Cable Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Overhead Cable Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Overhead Lat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Overhead Lat' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Overhead Slam
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Overhead Slam' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Overhead Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Overhead Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Overhead Triceps
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Overhead Triceps' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pallof Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pallof Press' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pallof Press With Rotation
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pallof Press With Rotation' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Palms-Down Dumbbell Wrist Curl Over A Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Palms-Down Dumbbell Wrist Curl Over A Bench' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Palms-Down Wrist Curl Over A Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Palms-Down Wrist Curl Over A Bench' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Palms-Up Barbell Wrist Curl Over A Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Palms-Up Barbell Wrist Curl Over A Bench' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Palms-Up Dumbbell Wrist Curl Over A Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Palms-Up Dumbbell Wrist Curl Over A Bench' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Parallel Bar Dip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Parallel Bar Dip' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Parallel Bar Dip' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pelvic Tilt Into Bridge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pelvic Tilt Into Bridge' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Peroneals Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Peroneals Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Peroneals-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Peroneals-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Physioball Hip Bridge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Physioball Hip Bridge' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pin Presses
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pin Presses' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Piriformis-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Piriformis-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Plank
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Plank' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Plate Pinch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Plate Pinch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Plate Twist
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Plate Twist' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Platform Hamstring Slides
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Platform Hamstring Slides' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Plie Dumbbell Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Plie Dumbbell Squat' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Plyo Kettlebell Pushups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Plyo Kettlebell Pushups' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Plyo Push-up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Plyo Push-up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Plyo Push-up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Posterior Tibialis Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Posterior Tibialis Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Power Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Power Clean' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Power Partials
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Power Partials' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Preacher Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Preacher Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Preacher Hammer Dumbbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Preacher Hammer Dumbbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Press Sit-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Press Sit-Up' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Prone Manual Hamstring
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Prone Manual Hamstring' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Prowler Sprint
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Prowler Sprint' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pull Through
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pull Through' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pullups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pullups' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pullups' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Push Up to Side Plank
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push Up to Side Plank' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push Up to Side Plank' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Push-Up Wide
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push-Up Wide' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push-Up Wide' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Push-Ups - Close Triceps Position
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push-Ups - Close Triceps Position' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push-Ups - Close Triceps Position' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Push-Ups With Feet Elevated
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push-Ups With Feet Elevated' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push-Ups With Feet Elevated' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Push-Ups With Feet On An Exercise Ball
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Push-Ups With Feet On An Exercise Ball' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pushups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pushups' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pushups' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pushups (Close and Wide Hand Positions)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pushups (Close and Wide Hand Positions)' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pushups (Close and Wide Hand Positions)' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Pyramid
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Pyramid' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Quad Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Quad Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Quadriceps-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Quadriceps-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Quick Leap
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Quick Leap' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rack Pull with Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rack Pull with Bands' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rack Pulls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rack Pulls' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rear Leg Raises
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rear Leg Raises' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Recumbent Bike
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Recumbent Bike' AND eq.name = 'Recumbent cycle'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Return Push from Stance
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Return Push from Stance' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Band Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Bench Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Bench Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Band Box Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Box Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Box Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Band Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Band Power Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Power Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Power Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Band Sumo Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Band Sumo Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Barbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Barbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Barbell Preacher Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Barbell Preacher Curls' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Cable Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Cable Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Crunch' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Flyes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Flyes' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Flyes' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Flyes With External Rotation
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Flyes With External Rotation' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Flyes With External Rotation' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Grip Bent-Over Rows
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Grip Bent-Over Rows' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Grip Triceps Pushdown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Grip Triceps Pushdown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Hyperextension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Hyperextension' AND eq.name = 'Glute ham / reverse hyper combo'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Machine Flyes
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Machine Flyes' AND eq.name = 'Pectoral fly machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Plate Curls
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Plate Curls' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Reverse Triceps Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Triceps Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Triceps Bench Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Reverse Triceps Bench Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rhomboids-SMR
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rhomboids-SMR' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Ring Dips
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Ring Dips' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Ring Dips' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rocket Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rocket Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rocking Standing Calf Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rocking Standing Calf Raise' AND eq.name = 'Standing calf raise'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rocky Pull-Ups/Pulldowns
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rocky Pull-Ups/Pulldowns' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rocky Pull-Ups/Pulldowns' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Romanian Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Romanian Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rope Climb
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rope Climb' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rope Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rope Crunch' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rope Jumping
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rope Jumping' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rope Straight-Arm Pulldown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rope Straight-Arm Pulldown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Round The World Shoulder Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Round The World Shoulder Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Rowing, Stationary
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Rowing, Stationary' AND eq.name = 'Rowing machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Runner's Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Runner''s Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Running, Treadmill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Running, Treadmill' AND eq.name = 'Running machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Russian Twist
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Russian Twist' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Scapular Pull-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Scapular Pull-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Scissor Kick
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Scissor Kick' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Scissors Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Scissors Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Band Hamstring Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Band Hamstring Curl' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Barbell Military Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Barbell Military Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Barbell Military Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Barbell Twist
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Barbell Twist' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Bent-Over One-Arm Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Bent-Over One-Arm Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Bent-Over Rear Delt Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Bent-Over Rear Delt Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Bent-Over Two-Arm Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Bent-Over Two-Arm Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Biceps
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Biceps' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Cable Rows
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Cable Rows' AND eq.name = 'Seated cable row machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Cable Rows' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Cable Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Cable Shoulder Press' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Calf Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Calf Raise' AND eq.name = 'Seated calf raise machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Calf Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Calf Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Close-Grip Concentration Barbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Close-Grip Concentration Barbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Dumbbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Dumbbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Dumbbell Inner Biceps Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Dumbbell Inner Biceps Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Dumbbell Palms-Down Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Dumbbell Palms-Down Wrist Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Dumbbell Palms-Up Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Dumbbell Palms-Up Wrist Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Flat Bench Leg Pull-In
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Flat Bench Leg Pull-In' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Floor Hamstring Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Floor Hamstring Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Front Deltoid
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Front Deltoid' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Glute
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Glute' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Good Mornings
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Good Mornings' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Hamstring
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Hamstring' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Hamstring and Calf Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Hamstring and Calf Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Head Harness Neck Resistance
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Head Harness Neck Resistance' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Leg Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Leg Curl' AND eq.name = 'Leg curl machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Leg Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Leg Press' AND eq.name = 'Seated leg press'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Leg Tucks
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Leg Tucks' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated One-Arm Dumbbell Palms-Down Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated One-Arm Dumbbell Palms-Down Wrist Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated One-Arm Dumbbell Palms-Up Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated One-Arm Dumbbell Palms-Up Wrist Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated One-arm Cable Pulley Rows
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated One-arm Cable Pulley Rows' AND eq.name = 'Seated cable row machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated One-arm Cable Pulley Rows' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Overhead Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Overhead Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Palm-Up Barbell Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Palm-Up Barbell Wrist Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Palms-Down Barbell Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Palms-Down Barbell Wrist Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Side Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Side Lateral Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Triceps Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Triceps Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Seated Two-Arm Palms-Up Low-Pulley Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Seated Two-Arm Palms-Up Low-Pulley Wrist Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- See-Saw Press (Alternating Side Press)
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'See-Saw Press (Alternating Side Press)' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Shotgun Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Shotgun Row' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Shoulder Circles
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Shoulder Circles' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Shoulder Press - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Shoulder Press - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Shoulder Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Shoulder Raise' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Shoulder Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Shoulder Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Bridge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Bridge' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Hop-Sprint
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Hop-Sprint' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Jackknife
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Jackknife' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Lateral Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Lateral Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Laterals to Front Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Laterals to Front Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Leg Raises
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Leg Raises' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Lying Groin Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Lying Groin Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Neck Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Neck Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Standing Long Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Standing Long Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side To Side Chins
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side To Side Chins' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side To Side Chins' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side Wrist Pull
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side Wrist Pull' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side to Side Box Shuffle
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side to Side Box Shuffle' AND eq.name = 'Plyometric box'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Side-Lying Floor Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Side-Lying Floor Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single Dumbbell Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single Dumbbell Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single Leg Butt Kick
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single Leg Butt Kick' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single Leg Glute Bridge
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single Leg Glute Bridge' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single Leg Push-off
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single Leg Push-off' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Arm Cable Crossover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Arm Cable Crossover' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Arm Linear Jammer
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Arm Linear Jammer' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Arm Push-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Arm Push-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Arm Push-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Cone Sprint Drill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Cone Sprint Drill' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Leg High Box Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Leg High Box Squat' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Leg Hop Progression
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Leg Hop Progression' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Leg Lateral Hop
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Leg Lateral Hop' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Leg Leg Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Leg Leg Extension' AND eq.name = 'Leg extension machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Single-Leg Stride Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Single-Leg Stride Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Sit Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Sit Squats' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Sit-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Sit-Up' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Sit-Up' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Incline Shoulder Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Incline Shoulder Raise' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Behind the Back Shrug
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Behind the Back Shrug' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Bench Press' AND eq.name = 'Chest press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Bent Over Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Bent Over Row' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Calf Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Calf Raise' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Close-Grip Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Close-Grip Bench Press' AND eq.name = 'Chest press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Close-Grip Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Decline Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Decline Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Decline Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Hang Power Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Hang Power Clean' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Hang Power Clean' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Hip Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Hip Raise' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Incline Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Incline Bench Press' AND eq.name = 'Chest press machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Incline Bench Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Leg Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Leg Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine One-Arm Upright Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine One-Arm Upright Row' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Overhead Shoulder Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Overhead Shoulder Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Pistol Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Pistol Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Pistol Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Reverse Calf Raises
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Reverse Calf Raises' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Stiff-Legged Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Stiff-Legged Deadlift' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Stiff-Legged Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Machine Upright Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Machine Upright Row' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Smith Single-Leg Split Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Single-Leg Split Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Smith Single-Leg Split Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Snatch Pull
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Snatch Pull' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Speed Band Overhead Triceps
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Speed Band Overhead Triceps' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Speed Box Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Speed Box Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Speed Box Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Speed Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Speed Squats' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Speed Squats' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Spell Caster
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Spell Caster' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Spider Crawl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Spider Crawl' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Spider Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Spider Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Spin Cycling
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Spin Cycling' AND eq.name = 'Spin bike'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Spinal Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Spinal Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Split Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Split Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Split Squat with Dumbbells
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Split Squat with Dumbbells' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Split Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Split Squats' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Squat Jerk
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat Jerk' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat Jerk' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Squat with Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat with Bands' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat with Bands' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Squat with Chains
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat with Chains' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat with Chains' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Squat with Plate Movers
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat with Plate Movers' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squat with Plate Movers' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Squats - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Squats - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Stairmaster
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Stairmaster' AND eq.name = 'Stair climber'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Alternating Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Alternating Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Barbell Calf Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Barbell Calf Raise' AND eq.name = 'Standing calf raise'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Barbell Press Behind Neck
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Barbell Press Behind Neck' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Bent-Over One-Arm Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Bent-Over One-Arm Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Bent-Over Two-Arm Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Bent-Over Two-Arm Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Biceps Cable Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Biceps Cable Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Biceps Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Biceps Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Bradford Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Bradford Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Cable Chest Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Cable Chest Press' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Cable Lift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Cable Lift' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Cable Wood Chop
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Cable Wood Chop' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Calf Raises
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Calf Raises' AND eq.name = 'Standing calf raise'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Concentration Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Concentration Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Dumbbell Calf Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Dumbbell Calf Raise' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Dumbbell Reverse Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Dumbbell Reverse Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Dumbbell Straight-Arm Front Delt Raise Above Head
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Dumbbell Straight-Arm Front Delt Raise Above Head' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Dumbbell Upright Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Dumbbell Upright Row' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Elevated Quad Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Elevated Quad Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Front Barbell Raise Over Head
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Front Barbell Raise Over Head' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Gastrocnemius Calf Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Gastrocnemius Calf Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Hamstring and Calf Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Hamstring and Calf Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Hip Circles
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Hip Circles' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Hip Flexors
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Hip Flexors' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Inner-Biceps Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Inner-Biceps Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Lateral Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Lateral Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Leg Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Leg Curl' AND eq.name = 'Leg curl machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Long Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Long Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Low-Pulley Deltoid Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Low-Pulley Deltoid Raise' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Low-Pulley One-Arm Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Low-Pulley One-Arm Triceps Extension' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Military Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Military Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Military Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Olympic Plate Hand Squeeze
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Olympic Plate Hand Squeeze' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing One-Arm Cable Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing One-Arm Cable Curl' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing One-Arm Dumbbell Curl Over Incline Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing One-Arm Dumbbell Curl Over Incline Bench' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing One-Arm Dumbbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing One-Arm Dumbbell Triceps Extension' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Overhead Barbell Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Overhead Barbell Triceps Extension' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Palm-In One-Arm Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Palm-In One-Arm Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Palms-In Dumbbell Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Palms-In Dumbbell Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Palms-Up Barbell Behind The Back Wrist Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Palms-Up Barbell Behind The Back Wrist Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Pelvic Tilt
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Pelvic Tilt' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Rope Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Rope Crunch' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Soleus And Achilles Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Soleus And Achilles Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Toe Touches
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Toe Touches' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Towel Triceps Extension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Towel Triceps Extension' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Standing Two-Arm Overhead Throw
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Standing Two-Arm Overhead Throw' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Star Jump
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Star Jump' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Step Mill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Step Mill' AND eq.name = 'Stair climber'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Step-up with Knee Raise
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Step-up with Knee Raise' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Stiff Leg Barbell Good Morning
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Stiff Leg Barbell Good Morning' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Stiff-Legged Barbell Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Stiff-Legged Barbell Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Stiff-Legged Dumbbell Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Stiff-Legged Dumbbell Deadlift' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Stomach Vacuum
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Stomach Vacuum' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Straight Bar Bench Mid Rows
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Straight Bar Bench Mid Rows' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Straight Raises on Incline Bench
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Straight Raises on Incline Bench' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Straight-Arm Dumbbell Pullover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Straight-Arm Dumbbell Pullover' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Straight-Arm Dumbbell Pullover' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Straight-Arm Pulldown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Straight-Arm Pulldown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Stride Jump Crossover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Stride Jump Crossover' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Sumo Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Sumo Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Sumo Deadlift with Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Sumo Deadlift with Bands' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Sumo Deadlift with Chains
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Sumo Deadlift with Chains' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Superman
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Superman' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Supine Chest Throw
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Supine Chest Throw' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Supine One-Arm Overhead Throw
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Supine One-Arm Overhead Throw' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Supine Two-Arm Overhead Throw
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Supine Two-Arm Overhead Throw' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Svend Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Svend Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- T-Bar Row with Handle
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'T-Bar Row with Handle' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Tate Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Tate Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- The Straddle
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'The Straddle' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Thigh Abductor
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Thigh Abductor' AND eq.name = 'Hip abduction machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Thigh Adductor
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Thigh Adductor' AND eq.name = 'Hip adduction machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Toe Touchers
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Toe Touchers' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Torso Rotation
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Torso Rotation' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Trail Running/Walking
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Trail Running/Walking' AND eq.name = 'Running machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Trap Bar Deadlift
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Trap Bar Deadlift' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Tricep Dumbbell Kickback
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Tricep Dumbbell Kickback' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Tricep Side Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Tricep Side Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Triceps Overhead Extension with Rope
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Triceps Overhead Extension with Rope' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Triceps Pushdown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Triceps Pushdown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Triceps Pushdown - Rope Attachment
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Triceps Pushdown - Rope Attachment' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Triceps Pushdown - V-Bar Attachment
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Triceps Pushdown - V-Bar Attachment' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Triceps Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Triceps Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Tuck Crunch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Tuck Crunch' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Tuck Crunch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Two-Arm Dumbbell Preacher Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Two-Arm Dumbbell Preacher Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Two-Arm Kettlebell Clean
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Two-Arm Kettlebell Clean' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Two-Arm Kettlebell Jerk
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Two-Arm Kettlebell Jerk' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Two-Arm Kettlebell Military Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Two-Arm Kettlebell Military Press' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Two-Arm Kettlebell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Two-Arm Kettlebell Row' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Underhand Cable Pulldowns
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Underhand Cable Pulldowns' AND eq.name = 'Fixed pulldown'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Underhand Cable Pulldowns' AND eq.name = 'Fixed pulldown machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Underhand Cable Pulldowns' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Upper Back Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Upper Back Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Upper Back-Leg Grab
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Upper Back-Leg Grab' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Upper Body Ergometer
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Upper Body Ergometer' AND eq.name = 'Krank cycle'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Upright Barbell Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Upright Barbell Row' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Upright Cable Row
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Upright Cable Row' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Upright Row - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Upright Row - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Upward Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Upward Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- V-Bar Pulldown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'V-Bar Pulldown' AND eq.name = 'Fixed pulldown'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'V-Bar Pulldown' AND eq.name = 'Fixed pulldown machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'V-Bar Pulldown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- V-Bar Pullup
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'V-Bar Pullup' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'V-Bar Pullup' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Vertical Swing
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Vertical Swing' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Walking, Treadmill
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Walking, Treadmill' AND eq.name = 'Running machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Ball Hyperextension
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Ball Hyperextension' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Ball Side Bend
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Ball Side Bend' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Bench Dip
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Bench Dip' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Bench Dip' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Crunches
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Crunches' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Jump Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Jump Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Jump Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Pull Ups
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Pull Ups' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Pull Ups' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Sissy Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Sissy Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Sissy Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Sit-Ups - With Bands
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Sit-Ups - With Bands' AND eq.name = 'Decline situp board'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Sit-Ups - With Bands' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Weighted Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Weighted Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide Stance Barbell Squat
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide Stance Barbell Squat' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide Stance Barbell Squat' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide-Grip Barbell Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Barbell Bench Press' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Barbell Bench Press' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Barbell Bench Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide-Grip Decline Barbell Bench Press
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Decline Barbell Bench Press' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Decline Barbell Bench Press' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide-Grip Decline Barbell Pullover
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Decline Barbell Pullover' AND eq.name = 'Flat bench rack'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Decline Barbell Pullover' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide-Grip Lat Pulldown
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Lat Pulldown' AND eq.name = 'Lat pulldown machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Lat Pulldown' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide-Grip Pulldown Behind The Neck
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Pulldown Behind The Neck' AND eq.name = 'Fixed pulldown'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Pulldown Behind The Neck' AND eq.name = 'Fixed pulldown machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Pulldown Behind The Neck' AND eq.name = 'Cable'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide-Grip Rear Pull-Up
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Rear Pull-Up' AND eq.name = 'Power tower'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Rear Pull-Up' AND eq.name = 'Assisted pull-up machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wide-Grip Standing Barbell Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wide-Grip Standing Barbell Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wind Sprints
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wind Sprints' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Windmills
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Windmills' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- World's Greatest Stretch
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'World''s Greatest Stretch' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wrist Circles
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wrist Circles' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wrist Roller
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wrist Roller' AND eq.name = 'Yoga Mat Space'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Wrist Rotations with Straight Bar
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Wrist Rotations with Straight Bar' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Zercher Squats
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Zercher Squats' AND eq.name = 'Power rack (squat rack)'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 2, false
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Zercher Squats' AND eq.name = 'Smith machine'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Zottman Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Zottman Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

-- Zottman Preacher Curl
INSERT INTO exercise_equipment (exercise_id, equipment_id, priority, is_optional)
SELECT e.id, eq.id, 1, true
FROM exercises e, "gym-equipment" eq
WHERE e.name = 'Zottman Preacher Curl' AND eq.name = 'Incline bench'
ON CONFLICT (exercise_id, equipment_id) DO NOTHING;

