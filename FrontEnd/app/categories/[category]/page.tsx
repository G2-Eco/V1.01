import { productApi } from '@/lib/productapi';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CategoryClient from '@/app/components/CategoryClient';
import { notFound } from 'next/navigation';
import { Product } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params promise
  const { category } = await params;

  let products: Product[] = [];
  const categoryName = decodeURIComponent(category);

  try {
    products = await productApi.getAll();
  } catch (error) {
    console.error('Failed to load products:', error);
  }

  // Filter products by category
  const categoryProducts = products.filter(product => {
    try {
      const productCategories = JSON.parse(product.categories.replace(/^"|"$/g, ''));
      return Array.isArray(productCategories) && productCategories.includes(categoryName);
    } catch {
      return false;
    }
  });

  if (categoryProducts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Header />
      <CategoryClient
        categoryName={categoryName}
        initialProducts={categoryProducts}
        allProducts={products}
      />
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  // Await the params promise
  const { category } = await params;
  const categoryName = decodeURIComponent(category);

  return {
    title: `${categoryName} - ShopHub`,
    description: `Browse our collection of ${categoryName} products at ShopHub. Find the best quality ${categoryName.toLowerCase()} items with fast shipping.`,
  };
}