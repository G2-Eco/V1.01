'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favoriteIds: Set<number>;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavoriteIds(new Set(JSON.parse(savedFavorites)));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds)));
    }
  }, [favoriteIds, isLoaded]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const isFavorite = (id: number) => {
    return favoriteIds.has(id);
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteIds,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}