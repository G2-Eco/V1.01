'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { safeParseJSON, cleanImageUrl, formatPrice } from '@/lib/utils';

interface ProductDetailClientProps {
  initialProduct: Product;
}

interface Review {
  name: string | null;
  rating: number;
  review?: string;
  title?: string;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const product = initialProduct;
  
  const colors = safeParseJSON<string[]>(product.colors, []);
  const sizes = safeParseJSON<string[]>(product.sizes, []);
  const categories = safeParseJSON<string[]>(product.categories, []);
  const reviews = safeParseJSON<Review[]>(product.customerReviews, []);
  const attributes = safeParseJSON<Array<{name: string, value: string}>>(product.otherAttributes, []);
  
  const imageUrl = cleanImageUrl(product.mainImage);
  const isProductFavorite = isFavorite(product.id);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : product.rating || 0;

  const handleAddToCart = () => {
    addToCart(product);
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const handleBuyNow = () => {
    addToCart(product);
    // Redirect to cart page
    window.location.href = '/cart';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
        <a href="/" className="hover:text-indigo-600">Home</a>
        <span>/</span>
        {categories.length > 0 && (
          <>
            <a href={`/categories/${categories[0]}`} className="hover:text-indigo-600 capitalize">
              {categories[0]}
            </a>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 font-medium">{product.itemName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="aspect-square rounded-2xl bg-white border border-slate-200 overflow-hidden mb-4">
            <img
              src={imageUrl}
              alt={product.itemName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.itemName}</h1>
              
              {/* Rating */}
              {averageRating > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(averageRating)
                            ? 'text-amber-400 fill-amber-400'
                            : star === Math.ceil(averageRating) && averageRating % 1 > 0
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
                  <span className="text-slate-600">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>
            
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors ml-4"
            >
              <svg 
                className={`w-6 h-6 ${isProductFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Price */}
          {product.initialPrice && (
            <div className="text-4xl font-bold text-slate-900 mb-6">
              {formatPrice(product.initialPrice)}
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      selectedColor === color
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      selectedSize === size
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-slate-900 text-white py-4 px-6 rounded-xl hover:bg-slate-800 transition-colors font-semibold text-lg"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          {attributes.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-4 text-xl">Product Details</h3>
              <div className="space-y-3">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-3">
                    <strong className="text-slate-900">{attr.name}:</strong>
                    <p className="text-slate-600 mt-1">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <div className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-4 text-xl">Ingredients</h3>
              <p className="text-slate-600 leading-relaxed">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h2>
          <div className="grid gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-semibold text-slate-900">
                      {review.name || 'Anonymous'}
                    </span>
                  </div>
                </div>
                {review.title && (
                  <h4 className="font-semibold text-slate-900 mb-2 text-lg">{review.title}</h4>
                )}
                {review.review && (
                  <p className="text-slate-600 leading-relaxed">{review.review}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products - You can implement this by fetching products from the same category */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">You May Also Like</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">More products coming soon...</p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}