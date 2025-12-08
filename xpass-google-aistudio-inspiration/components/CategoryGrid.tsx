import React from 'react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (id: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.name;
        
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.name)}
            className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 overflow-hidden ${
              isSelected 
                ? 'bg-brand-500/10 border-brand-500 shadow-[0_0_15px_rgba(255,82,0,0.2)]' 
                : 'bg-onyx-900 border-white/5 hover:border-white/20'
            }`}
          >
            {/* Background Mesh */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            
            <div className={`relative z-10 p-3 rounded-full mb-2 transition-all duration-300 ${
              isSelected ? 'bg-brand-500 text-black' : 'bg-white/5 text-zinc-400 group-hover:text-white'
            }`}>
              <Icon size={20} />
            </div>
            
            <span className={`relative z-10 text-[10px] font-heading uppercase tracking-wider transition-colors ${
              isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
            }`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;