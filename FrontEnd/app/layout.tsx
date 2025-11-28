import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopHub - Premium Shopping',
  description: 'Votre destination de confiance pour des produits premium',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                {children}
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}