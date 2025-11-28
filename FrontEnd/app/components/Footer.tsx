export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg">ShopHub</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Your trusted destination for premium products and exceptional shopping experience.
          </p>
          <p className="text-slate-500 text-sm">&copy; 2024 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}