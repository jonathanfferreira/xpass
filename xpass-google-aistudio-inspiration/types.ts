export interface Studio {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string; // e.g., "1.2 km"
  imageUrl: string;
  creditCost: number;
  isOpen: boolean;
}

export interface User {
  id: string;
  name: string;
  credits: number;
  avatarUrl: string;
  referralCode: string;
}

export interface ClassSession {
  id: string;
  title: string;
  studioName: string;
  time: string;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: 'credits' | 'BRL';
  imageUrl: string;
  tags?: string[];
}

export type Tab = 'home' | 'credits' | 'explore' | 'wellness' | 'shop' | 'profile';

export interface Category {
  id: string;
  name: string;
  icon: any; // Lucide icon component
  imageUrl?: string; // Optional image for "Browse All" cards
}

// Wellness Types
export interface MacroTarget {
  current: number;
  target: number;
  unit: string;
}

export interface DailyMacros {
  calories: MacroTarget;
  protein: MacroTarget;
  carbs: MacroTarget;
  fats: MacroTarget;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
}

export interface MealLog {
  id: string;
  name: string; // e.g., "Breakfast"
  foodItems: string[]; // e.g., ["Oats", "Banana"]
  calories: number;
  timestamp: string;
  imageUrl?: string;
}