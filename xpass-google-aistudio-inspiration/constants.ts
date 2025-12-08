import { Dumbbell, Activity, Waves, Move, Bike, Crown, Sparkles, Scissors } from 'lucide-react';
import { Studio, ClassSession, User, Category, Product, DailyMacros, Exercise, MealLog } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Jonathan',
  credits: 120,
  avatarUrl: 'https://picsum.photos/id/64/100/100',
  referralCode: 'JONATHAN-X92'
};

export const UPCOMING_CLASSES: ClassSession[] = [
  {
    id: 'c1',
    title: 'Power Yoga Flow',
    studioName: 'Zenith Space',
    time: '18:00',
    date: 'Hoje',
    status: 'upcoming'
  }
];

export const STUDIOS: Studio[] = [
  {
    id: 's1',
    name: 'Iron Forge Gym',
    category: 'Musculação',
    rating: 4.8,
    distance: '0.8 km',
    imageUrl: 'https://picsum.photos/id/200/400/400',
    creditCost: 15,
    isOpen: true
  },
  {
    id: 's2',
    name: 'Quantum Pilates',
    category: 'Pilates',
    rating: 4.9,
    distance: '1.2 km',
    imageUrl: 'https://picsum.photos/id/201/400/400',
    creditCost: 25,
    isOpen: true
  },
  {
    id: 's3',
    name: 'Velocity Crossfit',
    category: 'CrossFit',
    rating: 4.7,
    distance: '2.5 km',
    imageUrl: 'https://picsum.photos/id/202/400/400',
    creditCost: 30,
    isOpen: false
  },
  {
    id: 's4',
    name: 'Aqua Blue Center',
    category: 'Natação',
    rating: 4.6,
    distance: '3.0 km',
    imageUrl: 'https://picsum.photos/id/203/400/400',
    creditCost: 20,
    isOpen: true
  },
   {
    id: 's5',
    name: 'Fight Club MMA',
    category: 'Artes Marciais',
    rating: 5.0,
    distance: '4.2 km',
    imageUrl: 'https://picsum.photos/id/204/400/400',
    creditCost: 22,
    isOpen: true
  }
];

export const ACTIVITY_CATEGORIES: Category[] = [
  { id: '1', name: 'Fitness', icon: Dumbbell, imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60' },
  { id: '2', name: 'Wellness', icon: Sparkles, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&auto=format&fit=crop&q=60' },
  { id: '3', name: 'Beauty', icon: Scissors, imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&auto=format&fit=crop&q=60' },
  { id: '4', name: 'Yoga', icon: Activity, imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&auto=format&fit=crop&q=60' },
  { id: '5', name: 'Cardio', icon: Bike, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60' },
  { id: '6', name: 'Swimming', icon: Waves, imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&auto=format&fit=crop&q=60' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Whey Protein Isolate',
    brand: 'Optimum Tech',
    price: 45,
    currency: 'credits',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&auto=format&fit=crop&q=60',
    tags: ['Best Seller']
  },
  {
    id: 'p2',
    name: 'Smart Shaker V2',
    brand: 'NeonLife',
    price: 89.90,
    currency: 'BRL',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=60',
    tags: ['New']
  },
  {
    id: 'p3',
    name: 'Resistance Bands Set',
    brand: 'FitGear',
    price: 20,
    currency: 'credits',
    originalPrice: 35,
    imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&auto=format&fit=crop&q=60',
    tags: ['Sale']
  },
  {
    id: 'p4',
    name: 'Pre-Workout Energy',
    brand: 'C4 Explosive',
    price: 129.00,
    currency: 'BRL',
    imageUrl: 'https://images.unsplash.com/photo-1622484214029-035367584552?w=500&auto=format&fit=crop&q=60'
  }
];

// Wellness Data
export const INITIAL_MACROS: DailyMacros = {
  calories: { current: 1250, target: 2400, unit: 'kcal' },
  protein: { current: 90, target: 180, unit: 'g' },
  carbs: { current: 140, target: 250, unit: 'g' },
  fats: { current: 45, target: 80, unit: 'g' },
};

export const INITIAL_WORKOUT: Exercise[] = [
  { id: 'w1', name: 'Barbell Squat', sets: 4, reps: '8-10', completed: true },
  { id: 'w2', name: 'Leg Press', sets: 3, reps: '12', completed: true },
  { id: 'w3', name: 'Walking Lunges', sets: 3, reps: '20 steps', completed: false },
  { id: 'w4', name: 'Calf Raises', sets: 4, reps: '15', completed: false },
  { id: 'w5', name: 'Plank', sets: 3, reps: '60s', completed: false },
];

export const INITIAL_MEALS: MealLog[] = [
  { id: 'm1', name: 'Breakfast', foodItems: ['Oatmeal', 'Whey Protein', 'Banana'], calories: 450, timestamp: '08:00' },
  { id: 'm2', name: 'Lunch', foodItems: ['Grilled Chicken', 'Rice', 'Broccoli'], calories: 600, timestamp: '12:30' },
  { id: 'm3', name: 'Snack', foodItems: ['Greek Yogurt', 'Honey'], calories: 200, timestamp: '16:00' },
];