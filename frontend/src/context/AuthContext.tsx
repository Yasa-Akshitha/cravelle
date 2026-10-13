import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cravelle_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cravelle_token');
      const storedUser = localStorage.getItem('cravelle_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('cravelle_user', JSON.stringify(freshUser));
        } catch {
          localStorage.removeItem('cravelle_token');
          localStorage.removeItem('cravelle_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (res: AuthResponse) => {
    const authUser: User = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      phone: res.phone,
      avatarUrl: res.avatarUrl
    };
    localStorage.setItem('cravelle_token', res.token);
    localStorage.setItem('cravelle_user', JSON.stringify(authUser));
    setToken(res.token);
    setUser(authUser);
  };

  const login = async (email: string, pass: string) => {
    const res = await authService.login({ email, password: pass });
    handleAuthSuccess(res);
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    const res = await authService.register({ name, email, password: pass, phone });
    handleAuthSuccess(res);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('cravelle_user', JSON.stringify(updated));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ROLE_ADMIN' || (user?.role as any) === 'ADMIN',
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
