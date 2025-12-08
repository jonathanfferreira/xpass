import React from 'react';
import { ScanLine, Map, Bot, Ticket } from 'lucide-react';

const actions = [
  { icon: ScanLine, label: 'Check-in' },
  { icon: Map, label: 'Map' },
  { icon: Bot, label: 'AI Coach' },
  { icon: Ticket, label: 'Pass' },
];

/**
 * A grid of quick action buttons.
 *
 * Provides easy access to common actions like Check-in, Map, AI Coach, and Pass.
 *
 * @component
 * @returns {JSX.Element} The rendered QuickActions component.
 */
const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {actions.map((action, index) => (
        <button key={index} className="flex flex-col items-center justify-center gap-3 group">
          <div className="w-16 h-16 rounded-2xl bg-onyx-900 border border-white/5 flex items-center justify-center transition-all duration-300 group-hover:border-brand-500/50 group-hover:shadow-[0_0_15px_rgba(255,82,0,0.15)] group-active:scale-95">
            <action.icon size={24} className="text-zinc-400 group-hover:text-brand-500 transition-colors" strokeWidth={1.5} />
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