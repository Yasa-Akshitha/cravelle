import apiClient from './api';
import { Address, ApiResponse, Order } from '../types';

export const orderService = {
  async createOrder(addressId: number, paymentMethod = 'CASH_ON_DELIVERY'): Promise<Order> {
    const res = await apiClient.post<ApiResponse<Order>>('/api/orders', { addressId, paymentMethod });
    return res.data.data;
  },

  async getUserOrders(): Promise<Order[]> {
    const res = await apiClient.get<ApiResponse<Order[]>>('/api/orders');
    return res.data.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const res = await apiClient.get<ApiResponse<Order>>(`/api/orders/${id}`);
    return res.data.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const res = await apiClient.post<ApiResponse<Order>>(`/api/orders/${id}/cancel`);
    return res.data.data;
  },
};
