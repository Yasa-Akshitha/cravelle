import apiClient from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', { email, password });
    return res.data.data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', { name, email, password });
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('cravelle_token');
      localStorage.removeItem('cravelle_user');
    }
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/api/auth/me');
    return res.data.data;
  },

  async updateProfile(name: string): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>('/api/auth/profile', { name });
    return res.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/api/auth/change-password', { currentPassword, newPassword });
  },
};
