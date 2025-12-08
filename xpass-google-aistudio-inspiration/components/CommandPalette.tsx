import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Wallet, Users, LayoutGrid, LifeBuoy, LogOut, Command } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onLogout }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { id: 'overview', label: 'Go to Overview', icon: LayoutGrid, action: () => onNavigate('overview') },
    { id: 'financial', label: 'Go to Financial', icon: Wallet, action: () => onNavigate('financial') },
    { id: 'support', label: 'Go to Support', icon: LifeBuoy, action: () => onNavigate('support') },
    { id: 'logout', label: 'Log Out', icon: LogOut, action: onLogout },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
           filteredCommands[selectedIndex].action();
           onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-onyx-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Input */}
        <div className="flex items-center px-4 py-4 border-b border-white/5">
          <Search size={20} className="text-zinc-500 mr-3" />
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none"
          />
          <span className="text-[10px] font-mono text-zinc-600 border border-white/10 px-1.5 rounded">ESC</span>
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
           {filteredCommands.length === 0 ? (
             <div className="p-8 text-center text-zinc-500 text-xs font-mono">No commands found.</div>
           ) : (
             filteredCommands.map((cmd, index) => {
               const Icon = cmd.icon;
               const isSelected = index === selectedIndex;
               return (
                 <button
                   key={cmd.id}
                   onClick={() => { cmd.action(); onClose(); }}
                   onMouseEnter={() => setSelectedIndex(index)}
                   className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${isSelected ? 'bg-brand-500 text-black' : 'text-zinc-400 hover:bg-white/5'}`}
                 >
                   <div className="flex items-center gap-3">
                     <Icon size={16} />
                     <span className="font-heading uppercase tracking-wide">{cmd.label}</span>
                   </div>
                   {isSelected && <ArrowRight size={14} />}
                 </button>
               );
             })
           )}
        </div>
        
        <div className="bg-onyx-950 px-4 py-2 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
           <span>XPASS OS Admin Console</span>
           <div className="flex gap-2">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;