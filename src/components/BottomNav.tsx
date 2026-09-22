import React from 'react';
import { Home, Search, Activity, Zap, ShoppingBag } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explore', icon: Search, label: 'Buscar' },
    { id: 'wellness', icon: Activity, label: 'Meu Plano' },
    { id: 'credits', icon: Zap, label: 'Créditos' },
    { id: 'shop', icon: ShoppingBag, label: 'Loja' },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-lg mx-auto">
      <div className="absolute inset-0 bg-onyx-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/90" />
      
      <div className="relative flex justify-between items-center px-2 py-3">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center w-full group relative py-1 cursor-pointer"
            >
              <div className={`transition-all duration-300 transform ${isActive ? 'text-brand-500 -translate-y-1' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,82,0,0.6)]' : ''} />
              </div>
              
              <span className={`text-[9px] font-mono mt-1 uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-500 shadow-[0_0_5px_#FF5200]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
