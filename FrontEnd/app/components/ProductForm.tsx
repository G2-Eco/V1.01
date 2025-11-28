'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { productApi } from '@/lib/productapi';

interface ProductFormProps {
    product?: Product | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
    const [formData, setFormData] = useState({
        itemName: product?.itemName || '',
        mainImage: product?.mainImage || '',
        initialPrice: product?.initialPrice || 0,
        rating: product?.rating || 0,
        categories: product?.categories || '[]',
        colors: product?.colors || '[]',
        sizes: product?.sizes || '[]',
        ingredients: product?.ingredients || '',
        tags: product?.tags || '[]',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No authentication token');

            const payload: Omit<Product, 'id'> = {
                itemName: formData.itemName,
                mainImage: formData.mainImage,
                initialPrice: formData.initialPrice,
                rating: formData.rating,
                categories: formData.categories,
                colors: formData.colors,
                sizes: formData.sizes,
                ingredients: formData.ingredients,
                ingredientsFull: formData.ingredients || '',
                tags: formData.tags,
                otherAttributes: '',
                customerReviews: ''
            };

            if (product) {
                await productApi.update(product.id, payload, token);
            } else {
                await productApi.create(payload, token);
            }

            onSuccess();
        } catch (err) {
            setError('Failed to save product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {product ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.itemName}
                                    onChange={(e) => handleChange('itemName', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    placeholder="e.g. Premium Wireless Headphones"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.mainImage}
                                    onChange={(e) => handleChange('mainImage', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.initialPrice}
                                        onChange={(e) => handleChange('initialPrice', parseFloat(e.target.value))}
                                        required
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (0-5)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={formData.rating}
                                    onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Categories</label>
                                <textarea
                                    value={formData.categories}
                                    onChange={(e) => handleChange('categories', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white font-mono text-sm"
                                    placeholder='["Electronics", "Audio"]'
                                />
                                <p className="mt-1 text-xs text-gray-500">Enter as a JSON array</p>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients / Description</label>
                                <textarea
                                    value={formData.ingredients}
                                    onChange={(e) => handleChange('ingredients', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    placeholder="Product details..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-semibold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    product ? 'Update Product' : 'Create Product'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
