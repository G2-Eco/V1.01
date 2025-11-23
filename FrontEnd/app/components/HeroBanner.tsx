export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              New Arrivals
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Products
          </h2>
          <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
            Shop the latest trends and exclusive deals on premium items with fast delivery and excellent customer service.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/products"
              className="px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-slate-100 transition-all shadow-xl"
            >
              Shop Now
            </a>
            <a
              href="/categories"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              View Collections
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}