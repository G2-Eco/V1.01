'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, DollarSign, Tag } from 'lucide-react';
import { Product } from '@/types/product';
import { productApi } from '@/lib/productapi';
import ProductForm from '@/app/components/ProductForm';
import { useAuth } from '@/context/AuthContext';

export default function ProductManagerClient() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.categories && product.categories.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
      setFilteredProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (!token) {
        setError('You must be logged in to perform this action');
        return;
      }

      if (editingProduct) {
        await productApi.update(editingProduct.id, data, token);
      } else {
        await productApi.create(data, token);
      }
      await loadProducts();
      closeModal();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    if (!token) {
      setError('You must be logged in to delete products');
      return;
    }
    try {
      await productApi.delete(id, token);
      await loadProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const openModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Helper to get stock from otherAttributes (since it's not a direct field anymore)
  const getStock = (product: Product) => {
    try {
      const attrs = JSON.parse(product.otherAttributes || '{}');
      return attrs.quantity || 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Product Manager</h1>
                <p className="text-sm text-slate-500">Manage your inventory</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Products</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{products.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Value</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  ${products.reduce((sum, p) => sum + (p.initialPrice || 0) * getStock(p), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Categories</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {new Set(products.map(p => p.categories)).size}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                  <img
                    src={product.mainImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
                    alt={product.itemName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(product)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-indigo-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                      {product.categories}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">
                    {product.itemName}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900">
                      ${(product.initialPrice || 0).toFixed(2)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStock(product) > 10
                        ? 'bg-emerald-100 text-emerald-700'
                        : getStock(product) > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                      {getStock(product) > 0 ? `${getStock(product)} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600">Try adjusting your search or add a new product</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isLoading={loading}
        />
      )}
    </div>
  );
}