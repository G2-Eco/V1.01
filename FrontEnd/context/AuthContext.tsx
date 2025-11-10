'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Ensure cookie is set
      setCookie('accessToken', token, 7);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const authResponse = await authApi.login(credentials);
    setUser(authResponse.user);
    router.push('/dashboard');
  };

  const register = async (userData: RegisterRequest) => {
    const authResponse = await authApi.register(userData);
    setUser(authResponse.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    deleteCookie('accessToken');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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