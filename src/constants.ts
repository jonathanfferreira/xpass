import { Dumbbell, Activity, Waves, Bike, Sparkles, Scissors } from 'lucide-react';
import { Studio, ClassSession, User, Category, Product, DailyMacros, Exercise, MealLog } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Jonathan',
  credits: 120,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  referralCode: 'JONATHAN-X92',
  plan: 'Black Diamond'
};

export const UPCOMING_CLASSES: ClassSession[] = [
  {
    id: 'c1',
    title: 'Power Yoga Flow',
    studioName: 'Zenith Space',
    time: '18:00',
    date: 'Hoje',
    status: 'upcoming',
    creditCost: 15
  },
  {
    id: 'c2',
    title: 'CrossFit WOD',
    studioName: 'Velocity Crossfit',
    time: '07:00',
    date: 'Amanhã',
    status: 'upcoming',
    creditCost: 20
  }
];

export const STUDIOS: Studio[] = [
  {
    id: 's1',
    name: 'Iron Forge Gym',
    category: 'Musculação',
    rating: 4.8,
    distance: '0.8 km',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    creditCost: 15,
    isOpen: true,
    address: 'Av. Paulista, 1000 - Bela Vista',
    description: 'Equipamentos biomecânicos de ponta, pesos livres e vestiários premium com sauna.',
    amenities: ['Estacionamento', 'Chuveiro', 'Wi-Fi', 'Armários']
  },
  {
    id: 's2',
    name: 'Quantum Pilates',
    category: 'Pilates',
    rating: 4.9,
    distance: '1.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    creditCost: 25,
    isOpen: true,
    address: 'Rua Oscar Freire, 850 - Jardins',
    description: 'Estúdio boutique com aparelhos Cadillac e Reformer para postura e fortalecimento profundo.',
    amenities: ['Turmas Reduzidas', 'Toalhas Cortesia', 'Água Alcalina']
  },
  {
    id: 's3',
    name: 'Velocity Crossfit',
    category: 'CrossFit',
    rating: 4.7,
    distance: '2.5 km',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    creditCost: 30,
    isOpen: false,
    address: 'Rua Funchal, 418 - Vila Olímpia',
    description: 'Box oficial com piso de absorção de impacto, barras olímpicas e coaches certificados.',
    amenities: ['Vestiário Completo', 'Recovery Zone', 'Estacionamento']
  },
  {
    id: 's4',
    name: 'Aqua Blue Center',
    category: 'Natação',
    rating: 4.6,
    distance: '3.0 km',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=600&auto=format&fit=crop',
    creditCost: 20,
    isOpen: true,
    address: 'Rua Pamplona, 1400 - Jardim Paulista',
    description: 'Piscina semi-olímpica aquecida tratada com ozônio para treinos de natação e hidroginástica.',
    amenities: ['Piscina Aquecida', 'Ozônio', 'Vestiários Térmicos']
  },
  {
    id: 's5',
    name: 'Fight Club MMA',
    category: 'Artes Marciais',
    rating: 5.0,
    distance: '4.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop',
    creditCost: 22,
    isOpen: true,
    address: 'Rua Augusta, 2200 - Consolação',
    description: 'Tatames profissionais, octógono oficial e aulas de Muay Thai, Boxe e Jiu-Jitsu.',
    amenities: ['Octógono', 'Sacos de Pancada', 'Chuveiros']
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
    name: 'Whey Protein Isolate 900g',
    brand: 'Optimum Tech',
    price: 45,
    currency: 'credits',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&auto=format&fit=crop&q=60',
    tags: ['Mais Vendido']
  },
  {
    id: 'p2',
    name: 'Smart Shaker V2 Térmico',
    brand: 'NeonLife',
    price: 89.90,
    currency: 'BRL',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=60',
    tags: ['Lançamento']
  },
  {
    id: 'p3',
    name: 'Kit Super Bands (3 níveis)',
    brand: 'FitGear Pro',
    price: 20,
    currency: 'credits',
    originalPrice: 35,
    imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&auto=format&fit=crop&q=60',
    tags: ['Promoção']
  },
  {
    id: 'p4',
    name: 'Pré-Treino Igniter 300g',
    brand: 'Apex Nutrition',
    price: 129.00,
    currency: 'BRL',
    imageUrl: 'https://images.unsplash.com/photo-1622484214029-035367584552?w=500&auto=format&fit=crop&q=60'
  }
];

export const INITIAL_MACROS: DailyMacros = {
  calories: { current: 1450, target: 2400, unit: 'kcal' },
  protein: { current: 110, target: 180, unit: 'g' },
  carbs: { current: 160, target: 250, unit: 'g' },
  fats: { current: 52, target: 80, unit: 'g' },
};

export const INITIAL_WORKOUT: Exercise[] = [
  { id: 'w1', name: 'Agachamento Livre', sets: 4, reps: '8-10', completed: true },
  { id: 'w2', name: 'Leg Press 45º', sets: 3, reps: '12', completed: true },
  { id: 'w3', name: 'Passada com Halteres', sets: 3, reps: '20 passos', completed: false },
  { id: 'w4', name: 'Elevação Pélvica', sets: 4, reps: '12', completed: false },
  { id: 'w5', name: 'Prancha Abdominal', sets: 3, reps: '60s', completed: false },
];

export const INITIAL_MEALS: MealLog[] = [
  { id: 'm1', name: 'Café da Manhã', foodItems: ['Aveia', 'Whey Protein', 'Banana'], calories: 450, timestamp: '08:00' },
  { id: 'm2', name: 'Almoço', foodItems: ['Filé de Frango', 'Arroz Integral', 'Brócolis'], calories: 650, timestamp: '12:30' },
  { id: 'm3', name: 'Lanche da Tarde', foodItems: ['Iogurte Grego', 'Frutas Vermelhas'], calories: 350, timestamp: '16:00' },
];
