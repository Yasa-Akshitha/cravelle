import apiClient from './api';
import { DashboardStats, Order, Restaurant, Dish } from '../types';

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get<DashboardStats>('/api/admin/dashboard/stats');
    return res.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const res = await apiClient.get<Order[]>('/api/admin/orders');
    return res.data;
  },

  async updateOrderStatus(orderId: number, status: string, note?: string): Promise<Order> {
    const res = await apiClient.put<Order>(`/api/admin/orders/${orderId}/status`, null, {
      params: { status, note }
    });
    return res.data;
  },

  async createRestaurant(data: any): Promise<Restaurant> {
    const res = await apiClient.post<Restaurant>('/api/admin/restaurants', data);
    return res.data;
  },

  async updateRestaurant(id: number, data: any): Promise<Restaurant> {
    const res = await apiClient.put<Restaurant>(`/api/admin/restaurants/${id}`, data);
    return res.data;
  },

  async deleteRestaurant(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/restaurants/${id}`);
  },

  async createDish(restaurantId: number, data: any): Promise<Dish> {
    const res = await apiClient.post<Dish>(`/api/admin/restaurants/${restaurantId}/dishes`, data);
    return res.data;
  },

  async toggleDishAvailability(dishId: number): Promise<Dish> {
    const res = await apiClient.patch<Dish>(`/api/admin/dishes/${dishId}/toggle-availability`);
    return res.data;
  },

  async deleteDish(dishId: number): Promise<void> {
    await apiClient.delete(`/api/admin/dishes/${dishId}`);
  }
};
