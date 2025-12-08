import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

/**
 * A card component representing a product in the shop.
 *
 * Displays the product image, tags, brand, name, and price.
 * Includes a quick add-to-cart button that appears on hover.
 *
 * @component
 * @param {ProductCardProps} props - The component props.
 * @param {Product} props.product - The product data to display.
 * @returns {JSX.Element} The rendered ProductCard component.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative flex flex-col bg-onyx-900 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-brand-500/50 hover:shadow-[0_0_20px_rgba(255,82,0,0.15)]">
      
      {/* Tags */}
      {product.tags && (
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          {product.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-black/80 backdrop-blur text-[9px] font-mono font-bold text-white uppercase border border-white/10 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-onyx-800">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-900 via-transparent to-transparent opacity-60" />
        
        {/* Quick Add Button (appears on hover) */}
        <button className="absolute bottom-2 right-2 w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
          <ShoppingCart size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">{product.brand}</span>
        <h3 className="text-sm text-white font-medium leading-tight mb-2 line-clamp-2 min-h-[2.5em]">{product.name}</h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
             {product.originalPrice && (
               <span className="text-[10px] text-zinc-600 line-through">
                 {product.currency === 'BRL' ? `R$ ${product.originalPrice.toFixed(2)}` : `${product.originalPrice} CR`}
               </span>
             )}
             <span className={`font-mono font-bold ${product.currency === 'credits' ? 'text-brand-500' : 'text-white'}`}>
               {product.currency === 'BRL' ? `R$ ${product.price.toFixed(2)}` : `${product.price} CR`}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;