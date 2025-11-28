import Header from './components/Header';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import ProductsClient from './components/ProductsClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Header />
      <HeroBanner />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Products</h2>
          <p className="text-slate-600">Discover our carefully curated collection</p>
        </div>
        <ProductsClient />
      </main>
      <Footer />
    </div>
  );
}