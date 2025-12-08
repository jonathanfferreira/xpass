import React, { useState, useEffect } from 'react';
import { Bell, Search, SlidersHorizontal, ShoppingBag, Zap, ChevronLeft, Settings, Clock, Heart, Users, Award, LogOut, ChevronRight, X, Calendar, MapPin, Check, Plus, Flame, Utensils, Scan } from 'lucide-react';
import BottomNav from './components/BottomNav';
import CreditCard from './components/CreditCard';
import StudioCard from './components/StudioCard';
import CategoryGrid from './components/CategoryGrid';
import FeatureCard from './components/FeatureCard';
import ProductCard from './components/ProductCard';
import LoadingState from './components/LoadingState';
import AICoach from './components/AICoach';
import FoodScanner from './components/FoodScanner';
import ToastContainer, { ToastMessage } from './components/Toast';
import { Tab, Studio } from './types';
import { MOCK_USER, STUDIOS, UPCOMING_CLASSES, ACTIVITY_CATEGORIES, MOCK_PRODUCTS, INITIAL_MACROS, INITIAL_WORKOUT, INITIAL_MEALS } from './constants';

interface StudentAppProps {
  onReturnToPortal: () => void;
}

const StudentApp: React.FC<StudentAppProps> = ({ onReturnToPortal }) => {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interactive States
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [userCredits, setUserCredits] = useState(MOCK_USER.credits);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Wellness States
  const [macros, setMacros] = useState(INITIAL_MACROS);
  const [workout, setWorkout] = useState(INITIAL_WORKOUT);
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [isFoodScannerOpen, setIsFoodScannerOpen] = useState(false);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Derived State for Search/Filter
  const filteredStudios = STUDIOS.filter(studio => {
    const matchesCategory = selectedCategory === 'Todos' || studio.category === selectedCategory;
    const matchesSearch = studio.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          studio.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Simulate System Boot / Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  // Function to handle tab switching (if not Profile)
  const handleTabChange = (tab: Tab) => {
    setIsProfileOpen(false);
    setCurrentTab(tab);
    // Reset filters when leaving explore
    if (currentTab === 'explore' && tab !== 'explore') {
       setSearchQuery('');
       setSelectedCategory('Todos');
    }
  };

  const handleCategorySelect = (categoryName: string) => {
     if (selectedCategory === categoryName) {
        setSelectedCategory('Todos');
     } else {
        setSelectedCategory(categoryName);
     }
     if (currentTab === 'home') {
        setCurrentTab('explore');
     }
  };

  const handleStudioClick = (studio: Studio) => {
    setSelectedStudio(studio);
    setIsBookingSuccess(false);
  };

  const confirmBooking = () => {
    if (selectedStudio && userCredits >= selectedStudio.creditCost) {
       setUserCredits(prev => prev - selectedStudio.creditCost);
       setIsBookingSuccess(true);
       
       // Visual Feedback
       addToast('success', 'Reserva Confirmada!', `Você reservou um horário em ${selectedStudio.name}`);

       setTimeout(() => {
          setSelectedStudio(null);
          setIsBookingSuccess(false);
       }, 2000);
    } else {
       addToast('error', 'Saldo Insuficiente', 'Recarregue seus créditos para continuar.');
    }
  };

  // Wellness Actions
  const toggleExercise = (id: string) => {
    setWorkout(workout.map(ex => {
       if (ex.id === id && !ex.completed) {
          // Add small toast on completion
          addToast('success', 'Exercício Concluído', `${ex.name} finalizado.`);
          return { ...ex, completed: true };
       } else if (ex.id === id) {
          return { ...ex, completed: false };
       }
       return ex;
    }));
  };

  const addMeal = (calories: number, name: string) => {
    const newMeal = {
      id: Date.now().toString(),
      name: name,
      foodItems: ['Scanned Meal'],
      calories: calories,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMeals([...meals, newMeal]);
    setMacros(prev => ({
      ...prev,
      calories: { ...prev.calories, current: prev.calories.current + calories }
    }));
    setIsFoodScannerOpen(false);
    addToast('success', 'Refeição Registrada', `${calories}kcal adicionadas ao diário.`);
  };

  const renderHome = () => (
    <div className="flex flex-col space-y-8 pb-36 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-8">
        <div 
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsProfileOpen(true)}
        >
          <div className="relative">
            <img 
              src={MOCK_USER.avatarUrl} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border border-white/10 object-cover grayscale"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-black"></div>
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase mb-0.5">Welcome back</p>
            <h1 className="text-white font-heading font-bold text-2xl uppercase tracking-wide">{MOCK_USER.name}</h1>
          </div>
        </div>
        <button className="relative p-3 rounded-full bg-onyx-900 hover:bg-onyx-800 transition-colors border border-white/5 group">
          <Bell size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
          <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
        </button>
      </header>

      {/* Hero Section - Energy Core */}
      <section className="px-6">
        <CreditCard credits={userCredits} />
      </section>

      {/* Quick Search */}
      <section className="px-6">
        <div className="flex justify-between items-end mb-3">
          <h2 className="font-heading font-semibold text-lg text-white uppercase tracking-wide">Quick Access</h2>
          <span 
             onClick={() => setCurrentTab('explore')}
             className="text-xs text-brand-500 font-mono cursor-pointer hover:underline"
          >
            VIEW_ALL
          </span>
        </div>
        <CategoryGrid 
          categories={ACTIVITY_CATEGORIES.slice(0, 6)} // Show icons
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </section>

      {/* Featured Studios */}
      <section className="flex flex-col space-y-4">
        <div className="px-6 flex justify-between items-center">
          <h2 className="font-heading font-semibold text-lg text-white uppercase tracking-wide">Nearby Units</h2>
        </div>
        <div className="px-6 flex flex-col gap-4">
          {STUDIOS.slice(0, 3).map((studio) => (
            <div key={studio.id} onClick={() => handleStudioClick(studio)}>
               <StudioCard studio={studio} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // ... (Other render functions kept same as previous step, just ensure they are included in the full file return)
  // To save space in this response, I am assuming the logic for renderExplore, renderWellness, renderCredits, renderShop, renderProfile
  // remains identical to the previous step unless I explicitly need to inject the Toast there. 
  // Note: I injected addToast into toggleExercise (Wellness) already.

  const renderExplore = () => (
     <div className="flex flex-col min-h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300">
        <h2 className="font-heading font-bold text-3xl text-white uppercase mb-6">Explore</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
           <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search studios, classes..." 
              className="w-full bg-onyx-900 border border-white/5 rounded-xl py-4 pl-12 pr-12 text-white font-mono text-sm placeholder:text-zinc-700 focus:outline-none focus:border-brand-500/50 transition-colors"
           />
           {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
              >
                 <X size={16} />
              </button>
           )}
           <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-onyx-800 rounded text-zinc-400 hover:text-white transition-colors">
              <SlidersHorizontal size={16} />
           </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
           <button 
              onClick={() => setSelectedCategory('Todos')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-mono uppercase border transition-all ${selectedCategory === 'Todos' ? 'bg-brand-500 text-black border-brand-500' : 'bg-onyx-900 text-zinc-400 border-white/10'}`}
           >
              Todos
           </button>
           {ACTIVITY_CATEGORIES.map(cat => (
              <button 
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat.name)}
                 className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-mono uppercase border transition-all ${selectedCategory === cat.name ? 'bg-brand-500 text-black border-brand-500' : 'bg-onyx-900 text-zinc-400 border-white/10'}`}
              >
                 {cat.name}
              </button>
           ))}
        </div>

        {/* Search Results */}
        <section className="mb-8">
           <h3 className="font-heading font-semibold text-white uppercase tracking-wide mb-4">
              {filteredStudios.length} Result(s)
           </h3>
           
           <div className="flex flex-col gap-4">
              {filteredStudios.length > 0 ? (
                 filteredStudios.map(studio => (
                    <div key={studio.id} onClick={() => handleStudioClick(studio)}>
                       <StudioCard studio={studio} />
                    </div>
                 ))
              ) : (
                 <div className="text-center py-10 text-zinc-500">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-mono text-xs uppercase">No studios found.</p>
                 </div>
              )}
           </div>
        </section>

        {!searchQuery && selectedCategory === 'Todos' && (
          <section>
             <h3 className="font-heading font-semibold text-white uppercase tracking-wide mb-4">Categories</h3>
             <div className="grid grid-cols-2 gap-4">
                {ACTIVITY_CATEGORIES.map((cat) => (
                   <FeatureCard 
                      key={cat.id} 
                      category={cat} 
                      onClick={() => handleCategorySelect(cat.name)}
                   />
                ))}
             </div>
          </section>
        )}
     </div>
  );

  const renderWellness = () => (
    <div className="flex flex-col min-h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="font-heading font-bold text-3xl text-white uppercase leading-none">My Plan</h2>
           <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">AI-Optimized Protocol</p>
        </div>
        <div className="flex items-center gap-2 bg-onyx-900 border border-white/10 rounded-full px-3 py-1">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] text-white font-mono">On Track</span>
        </div>
      </div>

      {/* Daily Snapshot (Ring Charts) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="col-span-1 p-4 bg-onyx-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#1f1f1f" strokeWidth="8" fill="transparent" />
                  <circle 
                     cx="56" cy="56" r="48" stroke="#FF5200" strokeWidth="8" fill="transparent" 
                     strokeDasharray={2 * Math.PI * 48} 
                     strokeDashoffset={(2 * Math.PI * 48) * (1 - macros.calories.current / macros.calories.target)}
                     className="transition-all duration-1000 ease-out"
                  />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-heading font-bold text-white">{macros.calories.current}</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">of {macros.calories.target}</span>
               </div>
            </div>
            <div className="flex items-center gap-1">
               <Flame size={12} className="text-brand-500" />
               <span className="text-xs font-heading uppercase text-white tracking-wide">Calories</span>
            </div>
         </div>

         <div className="col-span-1 space-y-3">
             {[
               { label: 'Protein', val: macros.protein, color: 'bg-blue-500' },
               { label: 'Carbs', val: macros.carbs, color: 'bg-green-500' },
               { label: 'Fats', val: macros.fats, color: 'bg-yellow-500' }
             ].map((m) => (
                <div key={m.label} className="p-3 bg-onyx-900 border border-white/5 rounded-xl">
                   <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-400 mb-1">
                      <span>{m.label}</span>
                      <span className="text-white">{m.val.current} / {m.val.target}g</span>
                   </div>
                   <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full`} style={{ width: `${(m.val.current / m.val.target) * 100}%` }} />
                   </div>
                </div>
             ))}
         </div>
      </div>

      {/* Meal Tracker */}
      <section className="mb-8">
         <div className="flex justify-between items-end mb-4">
            <h3 className="font-heading font-semibold text-white uppercase tracking-wide">Nutrition Log</h3>
            <button 
               onClick={() => setIsFoodScannerOpen(true)}
               className="text-[10px] font-mono bg-brand-500 text-black px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white transition-colors"
            >
               <Scan size={12} /> Scan Meal
            </button>
         </div>
         <div className="space-y-3">
            {meals.map(meal => (
               <div key={meal.id} className="flex justify-between items-center p-4 bg-onyx-900 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-onyx-800 flex items-center justify-center border border-white/5 text-zinc-500">
                        <Utensils size={18} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-white">{meal.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{meal.foodItems.join(', ')}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="block text-sm font-mono text-brand-500">{meal.calories} kcal</span>
                     <span className="text-[9px] text-zinc-600 font-mono">{meal.timestamp}</span>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Workout of the Day */}
      <section className="mb-8">
         <div className="flex justify-between items-end mb-4">
            <h3 className="font-heading font-semibold text-white uppercase tracking-wide">Daily Protocol</h3>
            <span className="text-[10px] font-mono text-zinc-500">Upper Body Power</span>
         </div>
         <div className="space-y-2">
            {workout.map(ex => (
               <div 
                  key={ex.id} 
                  onClick={() => toggleExercise(ex.id)}
                  className={`flex justify-between items-center p-4 rounded-xl border transition-all cursor-pointer ${ex.completed ? 'bg-brand-900/10 border-brand-500/30' : 'bg-onyx-900 border-white/5 hover:border-white/20'}`}
               >
                  <div className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${ex.completed ? 'bg-brand-500 border-brand-500 text-black' : 'border-zinc-600'}`}>
                        {ex.completed && <Check size={14} strokeWidth={3} />}
                     </div>
                     <div>
                        <h4 className={`text-sm font-bold transition-colors ${ex.completed ? 'text-brand-500 line-through' : 'text-white'}`}>{ex.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{ex.sets} sets x {ex.reps}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );

  const renderCredits = () => (
    <div className="flex flex-col h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300">
      <h2 className="font-heading font-bold text-3xl text-white uppercase mb-8">My Credits</h2>
      
      {/* Big Ring Display */}
      <div className="flex items-center justify-center mb-10">
        <div className="relative w-64 h-64 flex items-center justify-center">
           <div className="absolute inset-0 rounded-full border-[6px] border-onyx-800" />
           <div className="absolute inset-0 rounded-full border-[6px] border-brand-500 border-t-transparent border-l-transparent -rotate-45" />
           <div className="flex flex-col items-center">
              <span className="font-mono text-7xl font-bold text-white tracking-tighter">{userCredits}</span>
              <span className="text-zinc-500 font-mono text-xs uppercase mt-2">Available</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="p-4 rounded-xl bg-onyx-900 border border-white/5 flex flex-col items-center">
            <span className="font-mono text-2xl font-bold text-white">0</span>
            <span className="text-[10px] text-zinc-500 uppercase text-center mt-1">Purchased Today</span>
         </div>
         <div className="p-4 rounded-xl bg-onyx-900 border border-white/5 flex flex-col items-center">
            <span className="font-mono text-2xl font-bold text-white">0</span>
            <span className="text-[10px] text-zinc-500 uppercase text-center mt-1">Expiring Soon</span>
         </div>
      </div>

      <button className="w-full bg-brand-500 text-white font-heading font-bold text-lg uppercase py-4 rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(255,82,0,0.3)]">
         Buy Individual Credits
      </button>
    </div>
  );

  const renderShop = () => (
    <div className="flex flex-col min-h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300">
      
      <div className="flex justify-between items-center mb-6">
         <h2 className="font-heading font-bold text-3xl text-white uppercase">Supply Drop</h2>
         {/* Mini Credit Balance in Shop */}
         <div className="flex items-center gap-2 bg-onyx-800 border border-brand-500/30 px-3 py-1.5 rounded-full">
            <Zap size={14} className="text-brand-500 fill-brand-500" />
            <span className="font-mono font-bold text-white text-sm">{userCredits}</span>
         </div>
      </div>

      {/* Flash Deal Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-red-600 p-5 mb-8 shadow-[0_0_20px_rgba(255,82,0,0.3)]">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white text-brand-600 text-[9px] font-bold px-1.5 rounded uppercase">Limited Time</span>
                  <span className="text-white font-mono text-xs animate-pulse">02:14:55</span>
               </div>
               <h3 className="font-heading text-xl font-bold text-white uppercase italic">Flash Drop</h3>
               <p className="text-white/80 text-xs">Supplements & Gear up to 40% OFF</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
               <ShoppingBag className="text-white" size={20} />
            </div>
         </div>
      </div>

      {/* Categories / Brands (Horizontal Scroll) */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 pb-2">
         {['All', 'Supplements', 'Apparel', 'Equipment', 'Tech'].map((tag, i) => (
            <button 
               key={tag} 
               className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-heading uppercase tracking-wide border transition-all ${i === 0 ? 'bg-white text-black border-white' : 'bg-onyx-900 text-zinc-400 border-white/10 hover:border-white/30'}`}
            >
               {tag}
            </button>
         ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
         {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
         ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="fixed inset-0 z-[60] bg-onyx-950 animate-in slide-in-from-bottom duration-300">
       <div className="flex items-center p-6 border-b border-white/5">
          <button 
             onClick={() => setIsProfileOpen(false)}
             className="mr-4 p-2 bg-onyx-900 rounded-full border border-white/5 text-white hover:bg-brand-500 hover:border-brand-500 transition-all"
          >
             <ChevronLeft size={20} />
          </button>
          <h2 className="font-heading text-xl text-white uppercase">Control Center</h2>
       </div>

       <div className="flex flex-col items-center py-8 border-b border-white/5 bg-onyx-900/50">
          <div className="relative mb-4">
            <img src={MOCK_USER.avatarUrl} alt="User" className="w-24 h-24 rounded-full border-4 border-onyx-800 grayscale" />
            <button className="absolute bottom-0 right-0 p-2 bg-brand-500 rounded-full text-white border-4 border-onyx-950">
               <Settings size={14} />
            </button>
          </div>
          <h3 className="font-heading text-2xl text-white uppercase tracking-wide">{MOCK_USER.name}</h3>
          <button className="mt-4 px-6 py-2 bg-brand-500 text-white font-heading uppercase text-xs rounded-full shadow-[0_0_15px_rgba(255,82,0,0.3)]">
             Get Started / Upgrade
          </button>
       </div>

       <div className="p-6 space-y-2">
          {[
             { label: 'Reservations', icon: Clock, count: UPCOMING_CLASSES.length },
             { label: 'Saved Places', icon: Heart, count: 0 },
             { label: 'Friends', icon: Users, count: 0 },
             { label: 'Achievements', icon: Award, count: 5 },
          ].map((item) => (
             <button key={item.label} className="w-full flex items-center justify-between p-4 bg-onyx-900 border border-white/5 rounded-xl hover:border-brand-500/50 hover:bg-onyx-800 transition-all group">
                <div className="flex items-center gap-4">
                   <item.icon size={20} className="text-zinc-500 group-hover:text-brand-500 transition-colors" />
                   <span className="font-heading text-white uppercase tracking-wider">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                   {item.count > 0 && <span className="text-xs font-mono text-brand-500">{item.count}</span>}
                   <ChevronRight size={16} className="text-zinc-600" />
                </div>
             </button>
          ))}
          
          <button 
            onClick={onReturnToPortal}
            className="w-full flex items-center justify-between p-4 mt-8 bg-brand-900/10 border border-brand-500/20 rounded-xl text-brand-500 hover:bg-brand-500 hover:text-white transition-all group"
          >
             <div className="flex items-center gap-4">
                <LogOut size={20} />
                <span className="font-heading uppercase tracking-wider">Exit System</span>
             </div>
             <span className="text-[10px] font-mono opacity-60">RETURN TO PORTAL</span>
          </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-onyx-950 text-white font-sans relative overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Floating AI Coach (Always visible unless Profile is open) */}
      {!isProfileOpen && !isLoading && !selectedStudio && !isFoodScannerOpen && <AICoach />}

      {/* Full Screen Food Scanner */}
      {isFoodScannerOpen && <FoodScanner onClose={() => setIsFoodScannerOpen(false)} onScanComplete={addMeal} />}

      {isProfileOpen && renderProfile()}
      
      {!isProfileOpen && (
        <>
          {/* Boot Sequence / Loading State */}
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {currentTab === 'home' && renderHome()}
              {currentTab === 'credits' && renderCredits()}
              {currentTab === 'explore' && renderExplore()}
              {currentTab === 'wellness' && renderWellness()}
              {currentTab === 'shop' && renderShop()}
            </>
          )}
          
          <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </>
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* STUDIO DETAIL / BOOKING MODAL */}
      {selectedStudio && (
        <div className="fixed inset-0 z-[60] bg-onyx-950 animate-in slide-in-from-bottom duration-300 overflow-y-auto">
           {/* Modal Header */}
           <div className="relative h-64">
              <img src={selectedStudio.imageUrl} className="w-full h-full object-cover opacity-80" alt={selectedStudio.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 to-transparent" />
              <button 
                onClick={() => setSelectedStudio(null)}
                className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur rounded-full text-white border border-white/10"
              >
                 <ChevronLeft size={24} />
              </button>
           </div>

           <div className="px-6 -mt-12 relative z-10 pb-24">
              <div className="flex justify-between items-start mb-4">
                 <h2 className="font-heading font-bold text-3xl uppercase leading-none">{selectedStudio.name}</h2>
                 <div className="bg-brand-500 text-black px-3 py-1 rounded text-xs font-bold font-mono">
                    {selectedStudio.creditCost} CR
                 </div>
              </div>

              <div className="flex gap-4 mb-6 text-xs font-mono text-zinc-400">
                 <div className="flex items-center gap-1"><MapPin size={14} className="text-brand-500" /> {selectedStudio.distance}</div>
                 <div className="flex items-center gap-1"><Heart size={14} className="text-brand-500" /> 4.9 Rating</div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h3 className="font-heading text-sm uppercase text-white mb-2">Sobre</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                       Experience high-intensity training in a state-of-the-art facility. Equipped with premium gear and expert coaches to push your limits.
                    </p>
                 </div>

                 <div>
                    <h3 className="font-heading text-sm uppercase text-white mb-3">Próximos Horários</h3>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                       {['07:00', '09:30', '14:00', '18:30', '20:00'].map(time => (
                          <button key={time} className="flex-shrink-0 px-4 py-2 rounded-lg bg-onyx-900 border border-white/10 hover:border-brand-500 hover:text-brand-500 transition-colors">
                             <span className="font-mono text-xs">{time}</span>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-onyx-950 via-onyx-950 to-transparent">
                 {isBookingSuccess ? (
                    <button className="w-full bg-green-500 text-black font-heading font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2">
                       <Check size={20} /> Reserva Confirmada
                    </button>
                 ) : (
                    <button 
                       onClick={confirmBooking}
                       className="w-full bg-brand-500 text-black font-heading font-bold uppercase py-4 rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(255,82,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                       disabled={userCredits < selectedStudio.creditCost}
                    >
                       {userCredits < selectedStudio.creditCost ? 'Saldo Insuficiente' : 'Confirmar Reserva'}
                    </button>
                 )}
                 <p className="text-center text-[10px] text-zinc-600 mt-2 font-mono uppercase">
                    Cancelamento grátis até 2h antes.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default StudentApp;