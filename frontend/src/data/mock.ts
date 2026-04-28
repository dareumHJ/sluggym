// src/data/mock.ts — mock data
import type { Equipment, Exercise, Manual, User, Zone } from '../types';

export const EQUIPMENT: Equipment[] = [
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

export const HOURLY = [4, 3, 2, 2, 4, 12, 28, 48, 62, 55, 42, 38, 44, 52, 48, 55, 72, 95, 108, 88, 62, 40, 22, 10];

export const ZONES: Zone[] = [
  { id: 'A', name: 'Free Weights', count: 24, capacity: 40 },
  { id: 'B', name: 'Cables',       count: 12, capacity: 24 },
  { id: 'C', name: 'Machines',     count: 18, capacity: 30 },
  { id: 'D', name: 'Cardio',       count: 8,  capacity: 26 },
];

export const EXERCISES: Record<string, Manual> = {
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

export const CURRENT_USER: User = {
  id: 'u1', email: 'arivera@ucsc.edu', name: 'Alex Rivera', handle: '@alex.lifts',
  memberSince: 'Sep 2024', stats: { workouts: 47, streak: 5, followers: 128, following: 96 },
};

export const ACTIVE_WORKOUT: { name: string; startedAt: number; exercises: Exercise[] } = {
  name: 'Push Day', startedAt: Date.now() - 28 * 60 * 1000,
  exercises: [
    { id: 'ex1', equipmentId: 'bench-1', name: 'Barbell Bench Press', sets: [
      { previous: '60 kg × 8', kg: 60, reps: 8, completed: true },
      { previous: '65 kg × 6', kg: 65, reps: 6, completed: true },
      { previous: '70 kg × 5', kg: 70, reps: 5, completed: false },
    ]},
    { id: 'ex2', equipmentId: 'bench-2', name: 'Incline DB Press', sets: [
      { previous: '22 kg × 10', kg: 22, reps: 10, completed: false },
      { previous: '22 kg × 10', kg: 22, reps: null, completed: false },
      { previous: '22 kg × 8', kg: 22, reps: null, completed: false },
    ]},
    { id: 'ex3', equipmentId: 'cable-1', name: 'Cable Crossover', sets: [
      { previous: '18 kg × 12', kg: null, reps: null, completed: false },
      { previous: '18 kg × 12', kg: null, reps: null, completed: false },
    ]},
  ],
};

export const RECENT_WORKOUTS = [
  { id: 'w1', name: 'Pull Day', date: 'Yesterday', durationMin: 62, volumeKg: 4820, prs: 1 },
  { id: 'w2', name: 'Leg Day',  date: '3 days ago', durationMin: 71, volumeKg: 6210, prs: 2 },
  { id: 'w3', name: 'Push Day', date: '5 days ago', durationMin: 58, volumeKg: 3940, prs: 0 },
  { id: 'w4', name: 'Pull Day', date: 'Last week',  durationMin: 66, volumeKg: 4720, prs: 0 },
];

export const PR_HISTORY = [
  { exercise: 'Bench Press', pr: '82.5 kg', date: 'Yesterday', delta: '+2.5' },
  { exercise: 'Deadlift',    pr: '160 kg',  date: 'Last week',  delta: '+5' },
  { exercise: 'Back Squat',  pr: '120 kg',  date: '2 wks ago',  delta: '+2.5' },
];
