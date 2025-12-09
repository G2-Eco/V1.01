'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface ProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export default function ProductForm({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) {
    const [formData, setFormData] = useState({
        itemName: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        brand: '',
        sku: '',
        weight: '',
        dimensions: '',
        materials: '',
        tags: '',
        ingredients: '',
        images: [] as string[],
        colors: [] as string[],
        sizes: [] as string[],
        rating: 0
    });

    useEffect(() => {
        if (initialData) {
            // Helper to parse JSON strings safely
            const parseJsonArray = (jsonString: string | undefined | null): string[] => {
                if (!jsonString) return [];
                try {
                    const parsed = JSON.parse(jsonString);
                    return Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                    return [];
                }
            };

            setFormData({
                itemName: initialData.itemName || '',
                description: initialData.description || '',
                price: initialData.price?.toString() || initialData.initialPrice?.toString() || '',
                quantity: initialData.quantity?.toString() || '',
                category: initialData.category || initialData.categories || '',
                brand: initialData.brand || '',
                sku: initialData.sku || '',
                weight: initialData.weight?.toString() || '',
                dimensions: initialData.dimensions || '',
                materials: initialData.materials || '',
                tags: initialData.tags || '',
                ingredients: initialData.ingredients || '',
                images: parseJsonArray(initialData.images),
                colors: parseJsonArray(initialData.colors),
                sizes: parseJsonArray(initialData.sizes),
                rating: initialData.rating || 0
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare other attributes
        const otherAttributes = {
            description: formData.description,
            quantity: parseInt(formData.quantity) || 0,
            brand: formData.brand,
            sku: formData.sku,
            weight: parseFloat(formData.weight) || 0,
            dimensions: formData.dimensions,
            materials: formData.materials
        };

        // Construct the payload matching the backend Product entity
        const submissionData = {
            itemName: formData.itemName,
            initialPrice: parseFloat(formData.price) || 0,
            mainImage: formData.images.length > 0 ? formData.images[0] : '',
            images: JSON.stringify(formData.images), // Store all images in a JSON string if backend supports it, or just rely on mainImage
            // Actually backend doesn't have 'images' field anymore, so maybe we should put it in otherAttributes?
            // But let's stick to mainImage for now, and maybe put extra images in otherAttributes if needed.
            // For now, let's just map mainImage.

            categories: formData.category, // Backend expects String
            tags: formData.tags,
            ingredients: formData.ingredients,
            rating: initialData ? initialData.rating : 0,

            // JSON fields
            colors: JSON.stringify(formData.colors),
            sizes: JSON.stringify(formData.sizes),
            otherAttributes: JSON.stringify(otherAttributes),
            customerReviews: initialData?.customerReviews || '[]',
            ingredientsFull: formData.ingredients // Map to both for safety
        };

        await onSubmit(submissionData);
    };

    // Helper for array fields (colors, sizes, images)
    const handleArrayAdd = (field: 'colors' | 'sizes' | 'images', value: string) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
        }
    };

    const handleArrayRemove = (field: 'colors' | 'sizes' | 'images', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {initialData ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Info */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Home">Home</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Images */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Images</h3>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    placeholder="Enter image URL"
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleArrayAdd('images', e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        handleArrayAdd('images', input.value);
                                        input.value = '';
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleArrayRemove('images', idx)}
                                            className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Variants */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Variants</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Colors</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Add color"
                                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleArrayAdd('colors', e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.colors.map((color, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-sm">
                                            {color}
                                            <button type="button" onClick={() => handleArrayRemove('colors', idx)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sizes</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Add size"
                                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleArrayAdd('sizes', e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.sizes.map((size, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-sm">
                                            {size}
                                            <button type="button" onClick={() => handleArrayRemove('sizes', idx)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 text-slate-700 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
