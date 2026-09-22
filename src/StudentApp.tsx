import React, { useState, useEffect } from 'react';
import { Bell, Search, SlidersHorizontal, ShoppingBag, Zap, ChevronLeft, Settings, Clock, Heart, Users, Award, LogOut, ChevronRight, X, Calendar, MapPin, Check, Plus, Flame, Utensils, Scan, CreditCard as CardIcon, QrCode, ShieldCheck } from 'lucide-react';
import BottomNav from './components/BottomNav';
import CreditCard from './components/CreditCard';
import QuickActions from './components/QuickActions';
import StudioCard from './components/StudioCard';
import CategoryGrid from './components/CategoryGrid';
import FeatureCard from './components/FeatureCard';
import ProductCard from './components/ProductCard';
import LoadingState from './components/LoadingState';
import AICoach from './components/AICoach';
import FoodScanner from './components/FoodScanner';
import ToastContainer, { ToastMessage } from './components/Toast';
import { Tab, Studio, Product } from './types';
import { MOCK_USER, STUDIOS, UPCOMING_CLASSES, ACTIVITY_CATEGORIES, MOCK_PRODUCTS, INITIAL_MACROS, INITIAL_WORKOUT, INITIAL_MEALS } from './constants';
import { getStoredUser, saveStoredUser, getStoredBookings, saveBooking } from './services/storage';
import { supabase } from './lib/supabase';

interface StudentAppProps {
  onReturnToPortal: () => void;
}

const StudentApp: React.FC<StudentAppProps> = ({ onReturnToPortal }) => {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // User & Bookings State (loaded from storage)
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [userCredits, setUserCredits] = useState(currentUser.credits);
  const [bookings, setBookings] = useState(getStoredBookings());
  const [studios, setStudios] = useState<Studio[]>(STUDIOS);
  
  // Modals
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Wellness States
  const [macros, setMacros] = useState(INITIAL_MACROS);
  const [workout, setWorkout] = useState(INITIAL_WORKOUT);
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [isFoodScannerOpen, setIsFoodScannerOpen] = useState(false);

  // Sync credits with storage
  useEffect(() => {
    const updated = { ...currentUser, credits: userCredits };
    setCurrentUser(updated);
    saveStoredUser(updated);
  }, [userCredits]);

  // Load studios from Supabase with fallback to constants
  useEffect(() => {
    async function loadStudios() {
      try {
        const { data, error } = await supabase.from('studios').select('*');
        if (!error && data && data.length > 0) {
          const mapped: Studio[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            rating: Number(item.rating) || 4.8,
            distance: item.distance || '1.0 km',
            imageUrl: item.image_url,
            creditCost: item.credit_cost,
            isOpen: item.is_open,
            address: item.address,
            description: item.description,
            amenities: item.amenities || []
          }));
          setStudios(mapped);
        }
      } catch (err) {
        console.warn('Usando catálogo local de estúdios:', err);
      }
    }
    loadStudios();
  }, []);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Filter Studios
  const filteredStudios = studios.filter(studio => {
    const matchesCategory = selectedCategory === 'Todos' || studio.category === selectedCategory;
    const matchesSearch = studio.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          studio.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Simulated Boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); 
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: Tab) => {
    setIsProfileOpen(false);
    setCurrentTab(tab);
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

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'checkin' || actionId === 'pass') {
      setIsPassModalOpen(true);
    } else if (actionId === 'map') {
      setCurrentTab('explore');
    } else if (actionId === 'coach') {
      addToast('info', 'AI Coach Ativo', 'Toque no ícone do robô no canto inferior direito para conversar com o Coach.');
    }
  };

  const handleStudioClick = (studio: Studio) => {
    setSelectedStudio(studio);
    setIsBookingSuccess(false);
  };

  const confirmBooking = async () => {
    if (selectedStudio && userCredits >= selectedStudio.creditCost) {
       const newBalance = userCredits - selectedStudio.creditCost;
       setUserCredits(newBalance);
       setIsBookingSuccess(true);
       
       const newBooking = {
         id: 'b-' + Date.now(),
         title: `Treino em ${selectedStudio.name}`,
         studioName: selectedStudio.name,
         time: '18:30',
         date: 'Hoje',
         status: 'upcoming' as const,
         creditCost: selectedStudio.creditCost
       };
       const updatedList = saveBooking(newBooking);
       setBookings(updatedList);

       // Save to Supabase if UUID
       try {
         if (selectedStudio.id.includes('-')) {
           await supabase.from('bookings').insert({
             studio_id: selectedStudio.id,
             studio_name: selectedStudio.name,
             credit_cost: selectedStudio.creditCost,
             status: 'confirmed'
           });
         }
       } catch (err) {
         console.debug('Reserva sincronizada localmente');
       }

       addToast('success', 'Reserva Confirmada!', `Você agendou em ${selectedStudio.name}. Saldo: ${newBalance} CR`);

       setTimeout(() => {
          setSelectedStudio(null);
          setIsBookingSuccess(false);
       }, 1800);
    } else {
       addToast('error', 'Saldo Insuficiente', 'Recarregue seus créditos para agendar esta aula.');
    }
  };

  const handleRecharge = (amount: number, bonus: number = 0) => {
    const total = amount + bonus;
    setUserCredits(prev => prev + total);
    setIsRechargeModalOpen(false);
    addToast('success', 'Créditos Recarregados!', `+${total} CR adicionados à sua carteira.`);
  };

  const handleBuyProduct = (product: Product) => {
    if (product.currency === 'credits') {
      if (userCredits >= product.price) {
        setUserCredits(prev => prev - product.price);
        addToast('success', 'Produto Resgatado!', `${product.name} adquirido por ${product.price} CR.`);
      } else {
        addToast('error', 'Saldo Insuficiente', 'Recarregue seus créditos para comprar este item.');
      }
    } else {
      addToast('success', 'Pedido Realizado!', `${product.name} faturado com sucesso via cartão.`);
    }
  };

  const toggleExercise = (id: string) => {
    setWorkout(workout.map(ex => {
       if (ex.id === id && !ex.completed) {
          addToast('success', 'Exercício Concluído', `${ex.name} finalizado! +15 XP`);
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
      foodItems: ['Item Escaneado'],
      calories: calories,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMeals([...meals, newMeal]);
    setMacros(prev => ({
      ...prev,
      calories: { ...prev.calories, current: prev.calories.current + calories }
    }));
    setIsFoodScannerOpen(false);
    addToast('success', 'Refeição Registrada', `${calories} kcal adicionadas ao seu diário de hoje.`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // --- TAB: HOME ---
  const renderHome = () => (
    <div className="flex flex-col space-y-8 pb-36 animate-in fade-in duration-500 max-w-lg mx-auto">
      
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-8">
        <div 
          className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsProfileOpen(true)}
        >
          <div className="relative">
            <img 
              src={currentUser.avatarUrl} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-brand-500/40 object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand-500 rounded-full border-2 border-black"></div>
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">Olá de volta,</p>
            <h1 className="text-white font-heading font-bold text-2xl uppercase tracking-wide">{currentUser.name}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onReturnToPortal}
            className="text-[10px] font-mono border border-white/10 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:border-brand-500/50 transition-colors"
            title="Voltar ao seletor de interfaces"
          >
            PORTAL
          </button>
          <button 
            onClick={() => addToast('info', 'Notificações', 'Você tem 1 check-in agendado para hoje.')}
            className="relative p-2.5 rounded-full bg-onyx-900 hover:bg-onyx-800 transition-colors border border-white/10 group cursor-pointer"
          >
            <Bell size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full animate-ping"></span>
          </button>
        </div>
      </header>

      {/* Energy Core Card */}
      <section className="px-6">
        <CreditCard 
          credits={userCredits} 
          onRecharge={() => setIsRechargeModalOpen(true)} 
          onViewHistory={() => setIsHistoryModalOpen(true)}
        />
      </section>

      {/* Quick Actions Bar */}
      <section className="px-6">
        <QuickActions onAction={handleQuickAction} />
      </section>

      {/* Upcoming Bookings */}
      {bookings.length > 0 && (
        <section className="px-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-heading font-semibold text-lg text-white uppercase tracking-wide">Próximos Treinos</h2>
            <span className="text-xs text-brand-500 font-mono">{bookings.length} ATIVOS</span>
          </div>
          <div className="space-y-2">
            {bookings.slice(0, 2).map((b) => (
              <div key={b.id} className="p-3.5 rounded-xl bg-onyx-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm uppercase">{b.title}</h4>
                    <p className="text-zinc-400 text-xs font-mono">{b.studioName} • {b.date} às {b.time}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">CONFIRMADO</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Category Access */}
      <section className="px-6">
        <div className="flex justify-between items-end mb-3">
          <h2 className="font-heading font-semibold text-lg text-white uppercase tracking-wide">Modalidades</h2>
          <span 
             onClick={() => setCurrentTab('explore')}
             className="text-xs text-brand-500 font-mono cursor-pointer hover:underline"
          >
            VER_TODAS
          </span>
        </div>
        <CategoryGrid 
          categories={ACTIVITY_CATEGORIES.slice(0, 6)} 
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </section>

      {/* Featured Studios */}
      <section className="flex flex-col space-y-4">
        <div className="px-6 flex justify-between items-center">
          <h2 className="font-heading font-semibold text-lg text-white uppercase tracking-wide">Estúdios Próximos</h2>
          <span className="text-xs font-mono text-zinc-500">São Paulo, SP</span>
        </div>
        <div className="px-6 flex flex-col gap-4">
          {studios.slice(0, 4).map((studio) => (
            <StudioCard key={studio.id} studio={studio} onClick={() => handleStudioClick(studio)} />
          ))}
        </div>
      </section>
    </div>
  );

  // --- TAB: EXPLORE ---
  const renderExplore = () => (
     <div className="flex flex-col min-h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300 max-w-lg mx-auto">
        <h2 className="font-heading font-bold text-3xl text-white uppercase mb-6">Explorar Estúdios</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
           <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estúdio, modalidade, bairro..." 
              className="w-full bg-onyx-900 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
           />
           {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                 <X size={16} />
              </button>
           )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
           <button 
              onClick={() => setSelectedCategory('Todos')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-mono uppercase border transition-all cursor-pointer ${selectedCategory === 'Todos' ? 'bg-brand-500 text-black font-bold border-brand-500 shadow-md shadow-brand-500/20' : 'bg-onyx-900 text-zinc-400 border-white/10'}`}
           >
              Todos
           </button>
           {ACTIVITY_CATEGORIES.map(cat => (
              <button 
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat.name)}
                 className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-mono uppercase border transition-all cursor-pointer ${selectedCategory === cat.name ? 'bg-brand-500 text-black font-bold border-brand-500 shadow-md shadow-brand-500/20' : 'bg-onyx-900 text-zinc-400 border-white/10'}`}
              >
                 {cat.name}
              </button>
           ))}
        </div>

        {/* Results */}
        <div className="space-y-4">
           {filteredStudios.length === 0 ? (
             <div className="text-center py-16 text-zinc-500 font-mono text-sm">
                Nenhum estúdio encontrado para este filtro.
             </div>
           ) : (
             filteredStudios.map(studio => (
                <StudioCard key={studio.id} studio={studio} onClick={() => handleStudioClick(studio)} />
             ))
           )}
        </div>
     </div>
  );

  // --- TAB: WELLNESS & MEU PLANO ---
  const renderWellness = () => (
    <div className="flex flex-col min-h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300 max-w-lg mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Rotina & Desempenho</span>
           <h2 className="font-heading font-bold text-3xl text-white uppercase">Meu Plano</h2>
        </div>
        <button 
           onClick={() => setIsFoodScannerOpen(true)}
           className="flex items-center gap-1.5 bg-brand-500 text-black font-heading font-bold px-3 py-2 rounded-xl text-xs uppercase tracking-wide shadow-[0_0_15px_rgba(255,82,0,0.3)] hover:bg-brand-400 transition-all cursor-pointer"
        >
           <Scan size={14} /> Scan Alimento
        </button>
      </div>

      {/* Macros Section */}
      <div className="p-5 rounded-2xl bg-onyx-900 border border-white/10">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-heading font-bold uppercase text-white tracking-wide">Macronutrientes Diários</h3>
           <span className="text-xs font-mono text-brand-500">{macros.calories.current} / {macros.calories.target} kcal</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-onyx-950 rounded-full overflow-hidden mb-5">
           <div 
             className="h-full bg-gradient-to-r from-brand-500 to-orange-400 rounded-full transition-all duration-500"
             style={{ width: `${Math.min(100, (macros.calories.current / macros.calories.target) * 100)}%` }}
           />
        </div>

        <div className="grid grid-cols-3 gap-3">
           <div className="p-3 bg-onyx-950 rounded-xl border border-white/5 text-center">
              <span className="text-lg font-mono font-bold text-white">{macros.protein.current}g</span>
              <span className="block text-[9px] font-mono text-zinc-500 uppercase mt-0.5">Proteína ({macros.protein.target}g)</span>
           </div>
           <div className="p-3 bg-onyx-950 rounded-xl border border-white/5 text-center">
              <span className="text-lg font-mono font-bold text-white">{macros.carbs.current}g</span>
              <span className="block text-[9px] font-mono text-zinc-500 uppercase mt-0.5">Carbos ({macros.carbs.target}g)</span>
           </div>
           <div className="p-3 bg-onyx-950 rounded-xl border border-white/5 text-center">
              <span className="text-lg font-mono font-bold text-white">{macros.fats.current}g</span>
              <span className="block text-[9px] font-mono text-zinc-500 uppercase mt-0.5">Gorduras ({macros.fats.target}g)</span>
           </div>
        </div>
      </div>

      {/* Workout Routine */}
      <div className="space-y-3">
         <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold uppercase text-white tracking-wide">Treino de Hoje (Inferiores & Core)</h3>
            <span className="text-xs font-mono text-zinc-500">{workout.filter(w => w.completed).length}/{workout.length} FEITOS</span>
         </div>
         
         <div className="space-y-2">
            {workout.map(exercise => (
              <div 
                key={exercise.id}
                onClick={() => toggleExercise(exercise.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                   exercise.completed 
                     ? 'bg-onyx-900/50 border-green-500/30 opacity-70' 
                     : 'bg-onyx-900 border-white/10 hover:border-brand-500/40'
                }`}
              >
                 <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${exercise.completed ? 'bg-green-500 border-green-500 text-black' : 'border-zinc-700'}`}>
                       {exercise.completed && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div>
                       <h4 className={`font-heading font-bold text-sm uppercase ${exercise.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                          {exercise.name}
                       </h4>
                       <p className="text-xs font-mono text-zinc-500">{exercise.sets} séries × {exercise.reps}</p>
                    </div>
                 </div>
                 <span className="text-[10px] font-mono text-brand-500">+15 XP</span>
              </div>
            ))}
         </div>
      </div>

      {/* Meals Logged */}
      <div className="space-y-3">
         <h3 className="font-heading font-bold uppercase text-white tracking-wide">Refeições de Hoje</h3>
         <div className="space-y-2">
            {meals.map(meal => (
               <div key={meal.id} className="p-3 bg-onyx-900 border border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                     <h5 className="font-heading font-bold text-white text-sm uppercase">{meal.name}</h5>
                     <p className="text-[11px] font-mono text-zinc-500">{meal.foodItems.join(', ')}</p>
                  </div>
                  <div className="text-right">
                     <span className="font-mono text-sm font-bold text-brand-500">{meal.calories} kcal</span>
                     <span className="block text-[10px] font-mono text-zinc-600">{meal.timestamp}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  // --- TAB: CREDITS ---
  const renderCredits = () => (
    <div className="flex flex-col min-h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300 max-w-lg mx-auto space-y-8">
      <div>
         <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Carteira XPASS</span>
         <h2 className="font-heading font-bold text-3xl text-white uppercase">Meus Créditos</h2>
      </div>

      <CreditCard 
        credits={userCredits} 
        onRecharge={() => setIsRechargeModalOpen(true)} 
        onViewHistory={() => setIsHistoryModalOpen(true)}
      />

      <div className="p-5 bg-onyx-900 border border-white/10 rounded-2xl space-y-4">
         <h3 className="font-heading font-bold uppercase text-white text-lg">Planos de Assinatura</h3>
         <div className="p-4 rounded-xl border border-brand-500/50 bg-brand-500/5 flex justify-between items-center">
            <div>
               <span className="px-2 py-0.5 rounded bg-brand-500 text-black font-mono font-bold text-[9px] uppercase">PLANO ATUAL</span>
               <h4 className="font-heading font-bold text-white text-lg mt-1 uppercase">Black Diamond</h4>
               <p className="text-xs font-mono text-zinc-400">120 Créditos/mês + Rollover automático</p>
            </div>
            <span className="font-mono font-bold text-white text-lg">R$ 189/m</span>
         </div>
      </div>

      {/* Packages */}
      <div className="space-y-3">
         <h3 className="font-heading font-bold uppercase text-white text-base">Pacotes Adicionais</h3>
         <div className="grid grid-cols-3 gap-3">
            {[
              { credits: 20, price: 34.90, bonus: 0 },
              { credits: 50, price: 79.90, bonus: 5 },
              { credits: 100, price: 149.90, bonus: 15 },
            ].map(pkg => (
              <button 
                key={pkg.credits}
                onClick={() => handleRecharge(pkg.credits, pkg.bonus)}
                className="p-4 rounded-xl bg-onyx-900 border border-white/10 hover:border-brand-500/50 transition-all text-center group cursor-pointer"
              >
                 <span className="block font-mono text-2xl font-bold text-white group-hover:text-brand-500 transition-colors">{pkg.credits}</span>
                 <span className="text-[10px] font-heading uppercase text-brand-500">Créditos</span>
                 {pkg.bonus > 0 && <span className="block text-[9px] font-mono text-green-400">+{pkg.bonus} bônus</span>}
                 <span className="block text-xs font-mono text-zinc-400 mt-2">R$ {pkg.price.toFixed(2)}</span>
              </button>
            ))}
         </div>
      </div>
    </div>
  );

  // --- TAB: SHOP ---
  const renderShop = () => (
    <div className="flex flex-col min-h-screen px-6 pt-8 bg-onyx-950 pb-36 animate-in slide-in-from-right duration-300 max-w-lg mx-auto space-y-6">
       <div>
          <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Equipamentos & Nutrição</span>
          <h2 className="font-heading font-bold text-3xl text-white uppercase">Supply Drop</h2>
       </div>

       <div className="grid grid-cols-2 gap-4">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={handleBuyProduct} />
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-500 selection:text-white font-sans relative">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Current Active Tab */}
      {currentTab === 'home' && renderHome()}
      {currentTab === 'explore' && renderExplore()}
      {currentTab === 'wellness' && renderWellness()}
      {currentTab === 'credits' && renderCredits()}
      {currentTab === 'shop' && renderShop()}

      {/* Floating AI Coach */}
      <AICoach onSelectStudio={handleStudioClick} />

      {/* Floating Bottom Nav */}
      <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* MODAL: STUDIO DETAILS & BOOKING */}
      {selectedStudio && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-lg bg-onyx-900 border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="relative h-48 sm:h-56">
                 <img src={selectedStudio.imageUrl} alt={selectedStudio.name} className="w-full h-full object-cover" />
                 <button 
                   onClick={() => setSelectedStudio(null)} 
                   className="absolute top-4 right-4 p-2 bg-black/70 backdrop-blur rounded-full text-white cursor-pointer hover:bg-black"
                 >
                    <X size={20} />
                 </button>
                 <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur px-3 py-1 rounded-lg border border-white/10">
                    <span className="text-xs font-mono text-brand-500 font-bold uppercase">{selectedStudio.category}</span>
                 </div>
              </div>

              <div className="p-6 space-y-4">
                 <div className="flex justify-between items-start">
                    <div>
                       <h3 className="font-heading font-bold text-2xl text-white uppercase">{selectedStudio.name}</h3>
                       <p className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-1">
                          <MapPin size={14} className="text-brand-500" />
                          {selectedStudio.address || selectedStudio.distance}
                       </p>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-mono font-bold text-brand-500">{selectedStudio.creditCost}</span>
                       <span className="block text-[10px] font-mono text-zinc-400 uppercase">Créditos / aula</span>
                    </div>
                 </div>

                 {selectedStudio.description && (
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans border-t border-white/5 pt-3">
                       {selectedStudio.description}
                    </p>
                 )}

                 {selectedStudio.amenities && (
                    <div className="space-y-2">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Comodidades:</span>
                       <div className="flex flex-wrap gap-2">
                          {selectedStudio.amenities.map(item => (
                            <span key={item} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-onyx-950 border border-white/10 text-zinc-300">
                               ✓ {item}
                            </span>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Confirmation state */}
                 {isBookingSuccess ? (
                    <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-center space-y-1">
                       <Check size={28} className="text-green-400 mx-auto" />
                       <h4 className="font-heading font-bold text-green-300 text-lg uppercase">Reserva Confirmada!</h4>
                       <p className="text-xs font-mono text-zinc-300">Apresente seu nome ou passe no balcão do estúdio.</p>
                    </div>
                 ) : (
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                       <div>
                          <span className="text-[10px] font-mono text-zinc-500 block">SEU SALDO ATUAL</span>
                          <span className="text-sm font-mono font-bold text-white">{userCredits} CR</span>
                       </div>
                       <button 
                         onClick={confirmBooking}
                         className="flex-1 py-3.5 bg-brand-500 hover:bg-brand-400 text-black font-heading font-bold uppercase text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,82,0,0.3)] cursor-pointer"
                       >
                          Confirmar Reserva ({selectedStudio.creditCost} CR)
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* MODAL: RECHARGE CREDITS */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-md bg-onyx-900 border border-white/10 rounded-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center">
                 <h3 className="font-heading font-bold text-xl text-white uppercase flex items-center gap-2">
                    <Zap size={20} className="text-brand-500 fill-brand-500" /> Recarregar Energy Core
                 </h3>
                 <button onClick={() => setIsRechargeModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                    <X size={20} />
                 </button>
              </div>

              <div className="space-y-3">
                 {[
                   { credits: 20, price: 34.90, bonus: 0, tag: 'Básico' },
                   { credits: 50, price: 79.90, bonus: 5, tag: 'Mais Popular' },
                   { credits: 100, price: 149.90, bonus: 15, tag: 'Melhor Valor' },
                 ].map(pkg => (
                   <div 
                     key={pkg.credits}
                     onClick={() => handleRecharge(pkg.credits, pkg.bonus)}
                     className="p-4 rounded-xl bg-onyx-950 border border-white/10 hover:border-brand-500 flex justify-between items-center transition-all cursor-pointer group"
                   >
                      <div>
                         <div className="flex items-center gap-2">
                            <span className="font-mono text-xl font-bold text-white group-hover:text-brand-500 transition-colors">{pkg.credits} CR</span>
                            {pkg.bonus > 0 && (
                               <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">+{pkg.bonus} GRÁTIS</span>
                            )}
                         </div>
                         <span className="text-xs font-mono text-zinc-500">{pkg.tag}</span>
                      </div>
                      <span className="font-mono font-bold text-white text-base">R$ {pkg.price.toFixed(2)}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* MODAL: HISTORY */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-md bg-onyx-900 border border-white/10 rounded-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                 <h3 className="font-heading font-bold text-lg text-white uppercase">Histórico de Transações</h3>
                 <button onClick={() => setIsHistoryModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                    <X size={20} />
                 </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                 {bookings.map(b => (
                   <div key={b.id} className="p-3 bg-onyx-950 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                         <h5 className="font-heading font-bold text-white text-sm uppercase">{b.title}</h5>
                         <span className="text-[10px] font-mono text-zinc-500">{b.date} • {b.time}</span>
                      </div>
                      <span className="font-mono font-bold text-brand-500 text-xs">-{b.creditCost || 15} CR</span>
                   </div>
                 ))}
                 <div className="p-3 bg-onyx-950 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                       <h5 className="font-heading font-bold text-white text-sm uppercase">Recarga Mensal Assinatura</h5>
                       <span className="text-[10px] font-mono text-zinc-500">10/11/2025</span>
                    </div>
                    <span className="font-mono font-bold text-green-400 text-xs">+120 CR</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* SLIDE-OVER USER PROFILE */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
           <div className="w-full max-w-sm bg-onyx-900 border-l border-white/10 h-full p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Perfil Aluno</span>
                    <button onClick={() => setIsProfileOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="flex items-center gap-4">
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-brand-500 object-cover" />
                    <div>
                       <h3 className="font-heading font-bold text-xl text-white uppercase">{currentUser.name}</h3>
                       <span className="text-xs font-mono text-brand-500">{currentUser.plan} Member</span>
                       <span className="block text-[10px] font-mono text-zinc-500 mt-0.5">ID: {currentUser.referralCode}</span>
                    </div>
                 </div>

                 <div className="p-4 bg-onyx-950 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                       <span className="text-zinc-400">Saldo em Carteira:</span>
                       <span className="text-brand-500 font-bold">{userCredits} Créditos</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                       <span className="text-zinc-400">Status da Conta:</span>
                       <span className="text-green-400 font-bold">Ativa</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <button 
                      onClick={() => { setIsProfileOpen(false); setCurrentTab('credits'); }}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left font-heading text-sm uppercase text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                       <span>Gerenciar Assinatura</span>
                       <ChevronRight size={16} />
                    </button>
                    <button 
                      onClick={() => { setIsProfileOpen(false); setCurrentTab('wellness'); }}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left font-heading text-sm uppercase text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                       <span>Configurar Metas de Treino</span>
                       <ChevronRight size={16} />
                    </button>
                 </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                 <button 
                   onClick={onReturnToPortal}
                   className="w-full py-3 bg-brand-500/10 hover:bg-brand-500 hover:text-black border border-brand-500/30 text-brand-500 font-heading font-bold text-sm uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                 >
                    <LogOut size={16} /> Trocar Interface (Portal)
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: DIGITAL PASS / QR CODE */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-[85] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-sm bg-onyx-900 border border-brand-500/40 rounded-3xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(255,82,0,0.25)] relative overflow-hidden">
              
              {/* Background ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-center relative z-10">
                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-[10px] font-mono uppercase text-brand-400">
                    <ShieldCheck size={12} /> Passe Oficial Ativo
                 </div>
                 <button onClick={() => setIsPassModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer p-1">
                    <X size={20} />
                 </button>
              </div>

              {/* Student Identification */}
              <div className="relative z-10 flex flex-col items-center">
                 <img src={currentUser.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-brand-500 object-cover shadow-lg mb-2" />
                 <h3 className="font-heading font-bold text-xl uppercase text-white tracking-wide">{currentUser.name}</h3>
                 <span className="text-xs font-mono text-brand-500">{currentUser.plan} • {userCredits} CR</span>
              </div>

              {/* QR Code Container with High Tech Laser */}
              <div className="relative z-10 p-5 bg-white rounded-2xl mx-auto w-56 h-56 flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
                 {/* Laser scan animation */}
                 <div className="absolute top-0 left-0 right-0 h-1 bg-brand-500 shadow-[0_0_12px_#FF5200] animate-[bounce_2.5s_infinite] pointer-events-none" />
                 
                 {/* Stylized QR Code SVG */}
                 <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    {/* Corner Position Detection Patterns */}
                    <rect x="5" y="5" width="26" height="26" fill="black" rx="3" />
                    <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                    <rect x="13" y="13" width="10" height="10" fill="black" rx="1" />

                    <rect x="69" y="5" width="26" height="26" fill="black" rx="3" />
                    <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                    <rect x="77" y="13" width="10" height="10" fill="black" rx="1" />

                    <rect x="5" y="69" width="26" height="26" fill="black" rx="3" />
                    <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                    <rect x="13" y="77" width="10" height="10" fill="black" rx="1" />

                    {/* Data Matrix Dots */}
                    <rect x="36" y="8" width="6" height="6" fill="black" />
                    <rect x="46" y="8" width="6" height="6" fill="black" />
                    <rect x="56" y="16" width="6" height="6" fill="black" />
                    <rect x="36" y="24" width="6" height="6" fill="black" />
                    <rect x="46" y="32" width="8" height="8" fill="#FF5200" rx="1" />
                    
                    <rect x="12" y="38" width="6" height="6" fill="black" />
                    <rect x="24" y="44" width="6" height="6" fill="black" />
                    <rect x="34" y="48" width="6" height="6" fill="black" />
                    <rect x="60" y="36" width="6" height="6" fill="black" />
                    <rect x="74" y="42" width="6" height="6" fill="black" />
                    <rect x="84" y="48" width="6" height="6" fill="black" />

                    <rect x="38" y="64" width="6" height="6" fill="black" />
                    <rect x="48" y="72" width="6" height="6" fill="black" />
                    <rect x="62" y="66" width="6" height="6" fill="black" />
                    <rect x="76" y="74" width="6" height="6" fill="black" />
                    <rect x="86" y="84" width="6" height="6" fill="black" />
                    <rect x="48" y="86" width="6" height="6" fill="black" />
                 </svg>

                 {/* Center Brand Badge */}
                 <div className="absolute inset-0 m-auto w-10 h-10 bg-black rounded-lg border border-brand-500 flex items-center justify-center shadow-lg">
                    <span className="font-heading font-bold text-xs text-brand-500">XP</span>
                 </div>
              </div>

              <div className="space-y-1 relative z-10">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Token Dinâmico de Acesso</span>
                 <p className="font-mono text-sm font-bold text-white tracking-widest">{currentUser.referralCode}-PASS</p>
                 <p className="text-[11px] font-mono text-zinc-400 mt-2">
                    Apresente na recepção da academia parceira para validação instantânea no leitor.
                 </p>
              </div>

              <button 
                onClick={() => setIsPassModalOpen(false)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
              >
                 Fechar Passe
              </button>
           </div>
        </div>
      )}

      {/* FOOD SCANNER MODAL */}
      {isFoodScannerOpen && (
        <FoodScanner onClose={() => setIsFoodScannerOpen(false)} onScanComplete={addMeal} />
      )}
    </div>
  );
};

export default StudentApp;
