'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import { setCookie, deleteCookie } from '@/lib/cookies';
import { decodeJWT, getRoleFromToken } from '@/lib/jwtUtils';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Decode JWT to get role
      const payload = decodeJWT(token);

      if (payload) {
        // Get stored user data and update with decoded role
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Override role with JWT payload role (source of truth)
          userData.role = payload.role;
          setUser(userData);
        } else {
          // If no stored user, create minimal user object from JWT
          setUser({
            id: 0,
            email: payload.sub,
            firstName: '',
            lastName: '',
            emailVerified: false,
            role: payload.role,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }

        // Ensure cookie is set for middleware
        setCookie('accessToken', token, 7);
      } else {
        // Invalid token, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const authResponse = await authApi.login(credentials);

    // Decode the JWT to get the role
    const payload = decodeJWT(authResponse.accessToken);
    if (payload) {
      // Update user with role from JWT
      const userWithRole = {
        ...authResponse.user,
        role: payload.role
      };
      setUser(userWithRole);

      // Update localStorage with correct role
      localStorage.setItem('user', JSON.stringify(userWithRole));
    } else {
      setUser(authResponse.user);
    }

    // Get redirect parameter from URL or default to dashboard
    const redirect = searchParams.get('redirect') || '/';
    router.push(redirect);
  };

  const register = async (userData: RegisterRequest) => {
    const authResponse = await authApi.register(userData);

    // Decode the JWT to get the role
    const payload = decodeJWT(authResponse.accessToken);
    if (payload) {
      // Update user with role from JWT
      const userWithRole = {
        ...authResponse.user,
        role: payload.role
      };
      setUser(userWithRole);

      // Update localStorage with correct role
      localStorage.setItem('user', JSON.stringify(userWithRole));
    } else {
      setUser(authResponse.user);
    }

    // Get redirect parameter from URL or default to home
    const redirect = searchParams.get('redirect') || '/';
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