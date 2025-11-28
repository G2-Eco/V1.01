'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { safeParseJSON } from '@/lib/utils';

interface CategoryClientProps {
  categoryName: string;
  initialProducts: Product[];
  allProducts: Product[];
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name' | 'rating';

export default function CategoryClient({ categoryName, initialProducts, allProducts }: CategoryClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<'all' | 'under25' | '25to50' | 'over50'>('all');

  // Extract subcategories from all products in this category
  const subcategories = useMemo(() => {
    const subcategorySet = new Set<string>();
    
    allProducts.forEach(product => {
      try {
        const productCategories = JSON.parse(product.categories.replace(/^"|"$/g, ''));
        if (Array.isArray(productCategories) && productCategories.includes(categoryName)) {
          productCategories.forEach(cat => {
            if (cat !== categoryName) {
              subcategorySet.add(cat);
            }
          });
        }
      } catch {
        // Ignore parsing errors
      }
    });
    
    return Array.from(subcategorySet).slice(0, 10);
  }, [allProducts, categoryName]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = initialProducts.filter(product => {
      const price = product.initialPrice || 0;
      const matchesPrice = 
        priceRange === 'all' ||
        (priceRange === 'under25' && price < 25) ||
        (priceRange === '25to50' && price >= 25 && price <= 50) ||
        (priceRange === 'over50' && price > 50);
      
      return matchesPrice;
    });

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.initialPrice || 0) - (b.initialPrice || 0);
        case 'price-high':
          return (b.initialPrice || 0) - (a.initialPrice || 0);
        case 'name':
          return a.itemName.localeCompare(b.itemName);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialProducts, sortBy, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
        <a href="/" className="hover:text-indigo-600">Home</a>
        <span>/</span>
        <span className="text-slate-900 font-medium capitalize">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 capitalize">{categoryName}</h1>
        <p className="text-slate-600">
          {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8">
            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Subcategories</h3>
                <div className="space-y-2">
                  {subcategories.map((subcategory) => (
                    <a
                      key={subcategory}
                      href={`/categories/${encodeURIComponent(subcategory)}`}
                      className="block text-slate-600 hover:text-indigo-600 transition-colors capitalize"
                    >
                      {subcategory}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'under25', label: 'Under $25' },
                  { value: '25to50', label: '$25 - $50' },
                  { value: 'over50', label: 'Over $50' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      value={option.value}
                      checked={priceRange === option.value}
                      onChange={(e) => setPriceRange(e.target.value as any)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'featured', label: 'Featured' },
                  { value: 'name', label: 'Name: A-Z' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Highest Rated' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Mobile Filters */}
          <div className="lg:hidden flex flex-wrap gap-3 mb-6">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Prices</option>
              <option value="under25">Under $25</option>
              <option value="25to50">$25 - $50</option>
              <option value="over50">Over $50</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="featured">Featured</option>
              <option value="name">Name: A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Products */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your filters</p>
              <button
                onClick={() => {
                  setPriceRange('all');
                  setSortBy('featured');
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}