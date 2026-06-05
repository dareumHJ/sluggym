import type { Equipment, Exercise, Manual } from '../types';

export const EQUIPMENT_GUIDE: Equipment[] = [
  { id: 'sq-rack-1', name: 'Squat Rack 1', category: 'Free Weights', muscles: ['Quads','Glutes','Core'], available: false, waitMin: 8, difficulty: 'Intermediate', rating: 4.7, zone: 'A' },
  { id: 'sq-rack-2', name: 'Squat Rack 2', category: 'Free Weights', muscles: ['Quads','Glutes'], available: true, difficulty: 'Intermediate', rating: 4.7, zone: 'A' },
  { id: 'bench-1', name: 'Bench Press', category: 'Free Weights', muscles: ['Chest','Triceps','Shoulders'], available: true, difficulty: 'Intermediate', rating: 4.8, zone: 'A' },
  { id: 'bench-2', name: 'Incline Bench', category: 'Free Weights', muscles: ['Upper Chest','Shoulders'], available: false, waitMin: 4, difficulty: 'Intermediate', rating: 4.6, zone: 'A' },
  { id: 'cable-1', name: 'Cable Crossover', category: 'Cables', muscles: ['Chest','Shoulders'], available: true, difficulty: 'Beginner', rating: 4.5, zone: 'B' },
  { id: 'lat-1', name: 'Lat Pulldown', category: 'Cables', muscles: ['Back','Biceps'], available: true, difficulty: 'Beginner', rating: 4.8, zone: 'B' },
  { id: 'row-1', name: 'Seated Row', category: 'Cables', muscles: ['Back','Biceps'], available: false, waitMin: 2, difficulty: 'Beginner', rating: 4.7, zone: 'B' },
  { id: 'leg-press', name: 'Leg Press', category: 'Machines', muscles: ['Quads','Glutes','Hamstrings'], available: true, difficulty: 'Beginner', rating: 4.6, zone: 'C' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'Machines', muscles: ['Hamstrings'], available: true, difficulty: 'Beginner', rating: 4.3, zone: 'C' },
  { id: 'leg-ext', name: 'Leg Extension', category: 'Machines', muscles: ['Quads'], available: false, waitMin: 6, difficulty: 'Beginner', rating: 4.2, zone: 'C' },
  { id: 'tm-1', name: 'Treadmill 1', category: 'Cardio', muscles: ['Full Body'], available: true, difficulty: 'Beginner', rating: 4.4, zone: 'D' },
  { id: 'tm-2', name: 'Treadmill 2', category: 'Cardio', muscles: ['Full Body'], available: true, difficulty: 'Beginner', rating: 4.4, zone: 'D' },
  { id: 'bike-1', name: 'Assault Bike', category: 'Cardio', muscles: ['Full Body'], available: false, waitMin: 3, difficulty: 'Advanced', rating: 4.6, zone: 'D' },
  { id: 'row-erg', name: 'Rowing Erg', category: 'Cardio', muscles: ['Back','Legs','Core'], available: true, difficulty: 'Intermediate', rating: 4.7, zone: 'D' },
];

export const EXERCISE_GUIDES: Record<string, Manual> = {
  'bench-1': {
    name: 'Barbell Bench Press', difficulty: 'Intermediate', rating: 4.8, ratingCount: 1284,
    duration: '3–5 sets · 6–12 reps',
    primary: ['Chest'], secondary: ['Triceps','Front Delts'],
    steps: [
      'Lie flat on the bench with eyes directly below the bar. Plant feet, arch slightly, retract shoulder blades.',
      'Grip bar slightly wider than shoulder-width. Unrack with straight arms, bring bar over lower chest.',
      'Lower the bar under control to mid-chest, elbows at roughly 45° from the torso.',
      'Press back up explosively, driving through your feet. Lock out over the shoulder line.',
    ],
    tips: ['Keep wrists stacked over elbows.','Never bounce the bar off your chest.','Use a spotter on working sets.'],
  },
  'sq-rack-1': {
    name: 'Back Squat', difficulty: 'Intermediate', rating: 4.9, ratingCount: 2103,
    duration: '3–5 sets · 5–8 reps',
    primary: ['Quads','Glutes'], secondary: ['Core','Hamstrings','Lower Back'],
    steps: [
      'Set bar on upper traps, grip just outside shoulders. Unrack and step back in two steps.',
      'Feet shoulder-width, toes slightly out. Brace core, take a big breath.',
      'Push hips back and bend knees together. Descend until hip crease is below knee.',
      'Drive through whole foot to stand. Re-brace at the top before the next rep.',
    ],
    tips: ['Knees track over toes.','Chest up, neutral spine.','Depth before weight.'],
  },
  'lat-1': {
    name: 'Lat Pulldown', difficulty: 'Beginner', rating: 4.8, ratingCount: 942,
    duration: '3 sets · 10–15 reps',
    primary: ['Lats'], secondary: ['Biceps','Rear Delts'],
    steps: [
      'Set thigh pad snug. Grip bar slightly wider than shoulders, palms forward.',
      'Lean back ~15°. Pull shoulder blades down and back before you pull the bar.',
      'Pull bar to upper chest. Squeeze lats at the bottom for one count.',
      "Control the bar back to a full stretch — don't let the stack crash.",
    ],
    tips: ['Lead with elbows, not hands.',"Don't yank with momentum.",'Full overhead stretch between reps.'],
  },
};
