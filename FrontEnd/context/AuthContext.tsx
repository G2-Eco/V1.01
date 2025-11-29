'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import { setCookie, deleteCookie } from '@/lib/cookies';
import {
  UserResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Ensure cookie is set for middleware
      setCookie('accessToken', token, 7);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const authResponse = await authApi.login(credentials);
    setUser(authResponse.user);

    // Get redirect parameter from URL or default to dashboard
    const redirect = searchParams.get('redirect') || '/dashboard';
    router.push(redirect);
  };

  const register = async (userData: RegisterRequest) => {
    const authResponse = await authApi.register(userData);
    setUser(authResponse.user);

    // Get redirect parameter from URL or default to dashboard
    const redirect = searchParams.get('redirect') || '/dashboard';
    router.push(redirect);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    deleteCookie('accessToken');
    router.push('/');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}