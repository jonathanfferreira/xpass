import React, { useState } from 'react';
import { Star, MapPin, Heart } from 'lucide-react';
import { Studio } from '../types';

interface StudioCardProps {
  studio: Studio;
  onClick?: () => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, onClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div 
      onClick={onClick}
      className="relative flex gap-4 p-4 rounded-2xl bg-onyx-900 hover:bg-onyx-800 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/50 border border-white/5 hover:border-brand-500/30"
    >
      {/* Image */}
      <div className="relative w-24 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-onyx-800">
        <img 
          src={studio.imageUrl} 
          alt={studio.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10">
          <Star size={10} className="text-brand-500 fill-brand-500" />
          <span className="text-[10px] font-mono font-bold text-white">{studio.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
             <h3 className="font-heading font-medium text-lg text-white group-hover:text-brand-500 transition-colors uppercase tracking-wide leading-tight">
               {studio.name}
             </h3>
             {/* Favorite Button */}
             <button 
                onClick={toggleFavorite}
                className="p-1.5 -mr-1 -mt-1 hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
             >
                <Heart 
                  size={16} 
                  className={`transition-all duration-300 ${isFavorite ? 'text-brand-500 fill-brand-500 scale-110' : 'text-zinc-600 hover:text-zinc-300'}`} 
                />
                {isAnimating && (
                   <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20" />
                )}
             </button>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">{studio.category}</p>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div className="flex items-center text-zinc-500 text-xs font-mono">
            <MapPin size={12} className="mr-1 text-zinc-400" />
            <span>{studio.distance}</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-lg group-hover:border-brand-500/40 transition-colors">
             <span className="text-sm font-mono font-bold text-white">{studio.creditCost}</span>
             <span className="text-[10px] font-heading font-bold text-brand-500">CR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
