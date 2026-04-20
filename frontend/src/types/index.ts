export interface User {
  id: string;
  email: string;
  name: string;
  handle: string;
  location: string;
  memberSince: string;
  avatarUrl?: string;
  stats: {
    workouts: number;
    followers: number;
    following: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  workout: string;
  time: string;
  stats: string;
  liked: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  tags: string[];
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  id: string;
  previous: string;
  kg: number | null;
  reps: number | null;
  completed: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  available: boolean;
}

export interface GymOccupancy {
  current: number;
  capacity: number;
  updatedAt: string;
}

export interface HourlyOccupancy {
  hour: number;
  count: number;
}
