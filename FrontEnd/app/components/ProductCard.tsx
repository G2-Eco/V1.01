'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { safeParseJSON, cleanImageUrl, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const colors = safeParseJSON<string[]>(product.colors, []);
  const categories = safeParseJSON<string[]>(product.categories, []);
  const imageUrl = cleanImageUrl(product.mainImage);
  const isProductFavorite = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 block"
    >
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <img
          src={imageUrl || '/placeholder-image.jpg'}
          alt={product.itemName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
          }}
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
        >
          <svg 
            className={`w-5 h-5 ${isProductFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Category Tag */}
        {categories.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 shadow-sm">
              {categories[0]}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[56px]">
          {product.itemName}
        </h3>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-1">Available colors:</p>
            <div className="flex flex-wrap gap-1">
              {colors.slice(0, 3).map((color, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium"
                >
                  {color}
                </span>
              ))}
              {colors.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                  +{colors.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(product.rating!)
                      ? 'text-amber-400 fill-amber-400'
                      : star === Math.ceil(product.rating!) && product.rating! % 1 > 0
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-slate-500">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-slate-900">
            {formatPrice(product.initialPrice)}
          </span>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}