import apiClient from './api';
import { ApiResponse, Category, DashboardStats, Order, PageResponse, Product } from '../types';

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/api/admin/dashboard');
    return res.data.data;
  },

  async createProduct(data: any): Promise<Product> {
    const res = await apiClient.post<ApiResponse<Product>>('/api/admin/products', data);
    return res.data.data;
  },

  async updateProduct(id: number, data: any): Promise<Product> {
    const res = await apiClient.put<ApiResponse<Product>>(`/api/admin/products/${id}`, data);
    return res.data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/products/${id}`);
  },

  async createCategory(data: any): Promise<Category> {
    const res = await apiClient.post<ApiResponse<Category>>('/api/admin/categories', data);
    return res.data.data;
  },

  async updateCategory(id: number, data: any): Promise<Category> {
    const res = await apiClient.put<ApiResponse<Category>>(`/api/admin/categories/${id}`, data);
    return res.data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/categories/${id}`);
  },

  async getAllOrders(page = 0, size = 20): Promise<PageResponse<Order>> {
    const res = await apiClient.get<ApiResponse<PageResponse<Order>>>('/api/admin/orders', {
      params: { page, size },
    });
    return res.data.data;
  },

  async updateOrderStatus(id: number, orderStatus: string, paymentStatus?: string): Promise<Order> {
    const res = await apiClient.patch<ApiResponse<Order>>(`/api/admin/orders/${id}/status`, {
      orderStatus,
      paymentStatus,
    });
    return res.data.data;
  },

  async deleteReview(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/reviews/${id}`);
  },

  async getSubscribers(): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>('/api/admin/subscribers');
    return res.data.data;
  },

  async subscribeNewsletter(email: string): Promise<void> {
    await apiClient.post('/api/newsletter/subscribe', { email });
  },
};
