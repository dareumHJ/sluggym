// src/types/index.ts
export interface User { id: string; email: string; name: string; handle: string; memberSince: string; stats: { workouts: number; streak: number; followers: number; following: number }; }
export interface Equipment { id: string; name: string; category: string; muscles: string[]; available: boolean; waitMin?: number; difficulty: string; rating: number; zone: string; }
export interface ExerciseSet { previous: string; kg: number | null; reps: number | null; completed: boolean; }
export interface Exercise { id: string; equipmentId: string; name: string; notes?: string; sets: ExerciseSet[]; }
export interface Manual { name: string; difficulty: string; rating: number; ratingCount: number; duration: string; primary: string[]; secondary: string[]; steps: string[]; tips: string[]; }
export interface GymOccupancy { current: number; capacity: number; updatedAt: string; }
export interface Zone { id: string; name: string; count: number; capacity: number; }
