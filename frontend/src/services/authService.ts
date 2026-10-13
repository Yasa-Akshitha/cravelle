import apiClient from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/api/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('cravelle_token', res.data.token);
      localStorage.setItem('cravelle_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/api/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('cravelle_token', res.data.token);
      localStorage.setItem('cravelle_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<User>('/api/auth/me');
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('cravelle_token');
    localStorage.removeItem('cravelle_user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('cravelle_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('cravelle_token');
  }
};
