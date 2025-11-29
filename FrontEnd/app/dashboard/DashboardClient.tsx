'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { productApi } from '@/lib/productapi';
import { Product } from '@/types/product';
import { cleanImageUrl, formatPrice } from '@/lib/utils';

import ProductForm from '@/app/components/ProductForm';



function parseCategory(cat: string | undefined): string {
  if (!cat) return 'No category';

  try {
    const parsed = JSON.parse(cat);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
    if (typeof parsed === 'string') {
      return parsed;
    }
  } catch (err) {
    // fallback if not JSON
    return cat;
  }

  return 'No category';
}

export default function DashboardPage() {
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  // Load products
  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token');

      // Transform array fields to JSON strings for backend
      const payload = {
        ...data,
        images: JSON.stringify(data.images),
        colors: JSON.stringify(data.colors),
        sizes: JSON.stringify(data.sizes),
        categories: data.category, // Map category to categories
        initialPrice: data.price, // Map price to initialPrice
        mainImage: data.images[0] || '', // Use first image as main
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload, token);
      } else {
        await productApi.create(payload, token);
      }

      setShowCreateForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token');

      await productApi.delete(id, token);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your products and inventory</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-slate-600">
              Total Products: <span className="font-semibold">{products.length}</span>
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Add New Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={cleanImageUrl(product.mainImage)}
                          alt={product.itemName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{product.itemName}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {parseCategory(product.categories)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        {formatPrice(product.initialPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-amber-400">★</span>
                        <span className="ml-1 text-slate-600">
                          {product.rating ? product.rating.toFixed(1) : 'No rating'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-600">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Product Modal */}
      {(showCreateForm || editingProduct) && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingProduct(null);
          }}
          isLoading={formLoading}
        />
      )}

      <Footer />
    </div>
  );
}