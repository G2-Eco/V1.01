import { productApi } from '@/lib/productapi';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductDetailClient from '@/app/components/ProductDetailClient';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Force dynamic rendering (don't try to fetch at build time)
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params promise
  const { id } = await params;
  let product = null;

  try {
    product = await productApi.getById(parseInt(id));
  } catch (error) {
    console.error('Failed to load product:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <ProductDetailClient initialProduct={product} />
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  // Await the params promise
  const { id } = await params;

  try {
    const product = await productApi.getById(parseInt(id));
    return {
      title: `${product.itemName} - ShopHub`,
      description: `Buy ${product.itemName} at ShopHub. ${product.ingredients ? product.ingredients.substring(0, 160) + '...' : 'Premium quality product.'}`,
    };
  } catch {
    return {
      title: 'Product Not Found - ShopHub',
      description: 'Product not found',
    };
  }
}