import React from 'react';
import { Category } from '../types';

interface FeatureCardProps {
  category: Category;
  onClick: () => void;
}

/**
 * A featured card component for categories.
 *
 * Displays a category with a background image, an icon, and the category name.
 * Designed to highlight popular or featured categories.
 *
 * @component
 * @param {FeatureCardProps} props - The component props.
 * @param {Category} props.category - The category data to display.
 * @param {Function} props.onClick - Callback function when the card is clicked.
 * @returns {JSX.Element} The rendered FeatureCard component.
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ category, onClick }) => {
  const Icon = category.icon;
  
  return (
    <button 
      onClick={onClick}
      className="relative w-full h-32 rounded-xl overflow-hidden group border border-white/5 hover:border-brand-500/50 transition-all duration-300"
    >
      {/* Background Image with Overlay */}
      <img 
        src={category.imageUrl} 
        alt={category.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="p-1.5 bg-brand-500 rounded-lg text-white shadow-[0_0_10px_rgba(255,82,0,0.4)]">
           <Icon size={16} />
        </div>
        <span className="font-heading font-bold text-white text-lg tracking-wide uppercase shadow-black drop-shadow-md">
          {category.name}
        </span>
      </div>
    </button>
  );
};

export default FeatureCard;