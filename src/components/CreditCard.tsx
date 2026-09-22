import React from 'react';
import { Plus, Zap } from 'lucide-react';

interface CreditCardProps {
  credits: number;
  onRecharge?: () => void;
  onViewHistory?: () => void;
}

const CreditCard: React.FC<CreditCardProps> = ({ credits, onRecharge, onViewHistory }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-onyx-900 border border-white/10 shadow-2xl group">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-500/20 rounded-full blur-[80px] group-hover:bg-brand-500/30 transition-all duration-700 pointer-events-none" />
      
      <div className="relative p-6 flex flex-col items-center">
        
        {/* Core Header */}
        <div className="w-full flex justify-between items-center mb-6 z-10">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand-500 fill-brand-500" />
            <span className="font-heading font-bold text-lg tracking-wider text-white uppercase">Energy Core</span>
          </div>
          <button 
            onClick={onViewHistory}
            className="text-xs font-mono text-zinc-500 hover:text-brand-400 transition-colors cursor-pointer"
          >
            HISTÓRICO
          </button>
        </div>

        {/* Energy Value */}
        <div className="relative z-10 py-4 flex flex-col items-center justify-center">
          <div className="relative">
            <span className="font-mono text-6xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,82,0,0.3)]">
              {credits}
            </span>
            {/* Animated Ring */}
            <div className="absolute -inset-8 rounded-full border border-brand-500/20 animate-pulse pointer-events-none"></div>
          </div>
          <span className="text-brand-500 font-heading text-sm tracking-[0.2em] mt-2 uppercase text-glow">
            Créditos Disponíveis
          </span>
        </div>

        {/* Action Bar */}
        <div className="mt-6 w-full z-10">
          <button 
            onClick={onRecharge}
            className="w-full relative overflow-hidden bg-white/5 hover:bg-brand-500/20 border border-white/10 hover:border-brand-500/50 text-white font-heading tracking-wide uppercase font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 group/btn cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus size={18} className="text-brand-500 group-hover/btn:text-white transition-colors" />
              <span>Recarregar Créditos</span>
            </div>
            {/* Shine Effect */}
            <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover/btn:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
