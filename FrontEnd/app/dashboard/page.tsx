'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductForm from '@/app/components/ProductForm';
import { productApi } from '@/lib/productapi';
import { Product } from '@/types/product';
import { cleanImageUrl, formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Redirect if not admin
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦', color: 'bg-blue-50 text-blue-600' },
    { label: 'Low Stock', value: '12', icon: '⚠️', color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Revenue', value: '$45,231', icon: '💰', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Active Orders', value: '24', icon: '🚀', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, {user?.firstName}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-slate-400 text-sm font-medium">Last 30 days</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Products Inventory</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          <img
                            src={cleanImageUrl(product.mainImage)}
                            alt={product.itemName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{product.itemName}</p>
                          <p className="text-xs text-slate-500">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        {product.categories ? JSON.parse(product.categories.replace(/^"|"$/g, ''))[0] : 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        {formatPrice(product.initialPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="ml-1 text-slate-700 font-medium text-sm">
                          {product.rating ? product.rating.toFixed(1) : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        In Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-16 bg-slate-50/50">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900">No products found</h3>
              <p className="text-slate-500 mt-1">Get started by adding your first product.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Product Form Modal */}
      {(showCreateForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowCreateForm(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowCreateForm(false);
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}