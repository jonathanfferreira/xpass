import React from 'react';
import { ScanLine, Map, Bot, Ticket } from 'lucide-react';

interface QuickActionsProps {
  onAction?: (actionName: string) => void;
}

const actions = [
  { id: 'checkin', icon: ScanLine, label: 'Check-in' },
  { id: 'map', icon: Map, label: 'Mapa' },
  { id: 'coach', icon: Bot, label: 'AI Coach' },
  { id: 'pass', icon: Ticket, label: 'Passe' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {actions.map((action) => (
        <button 
          key={action.id} 
          onClick={() => onAction && onAction(action.id)}
          className="flex flex-col items-center justify-center gap-2 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-onyx-900 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-brand-500/50 group-hover:shadow-[0_0_15px_rgba(255,82,0,0.15)] group-active:scale-95">
            <action.icon size={22} className="text-zinc-400 group-hover:text-brand-500 transition-colors" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-heading font-medium uppercase tracking-wider text-zinc-500 group-hover:text-white transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
