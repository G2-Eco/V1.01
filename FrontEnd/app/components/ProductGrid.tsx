'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract categories from products
  const categories = ['All', ...new Set(
    products.flatMap(product => {
      try {
        const cats = JSON.parse(product.categories.replace(/^"|"$/g, ''));
        return Array.isArray(cats) ? cats : [];
      } catch {
        return [];
      }
    }).filter(Boolean)
  )].slice(0, 10); // Limit to 10 categories

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => {
        try {
          const productCategories = JSON.parse(product.categories.replace(/^"|"$/g, ''));
          return Array.isArray(productCategories) && productCategories.includes(selectedCategory);
        } catch {
          return false;
        }
      });

  return (
    <div>
      {/* Categories */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Products Count */}
      <div className="mb-6">
        <p className="text-slate-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-4">Try selecting a different category</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
}