import apiClient from './api';
import { Order, OrderTracking } from '../types';

export interface CreateOrderPayload {
  restaurantId: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'RAZORPAY_TEST' | 'UPI';
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await apiClient.post<Order>('/api/orders', payload);
    return res.data;
  },

  async getOrders(): Promise<Order[]> {
    const res = await apiClient.get<Order[]>('/api/orders');
    return res.data;
  },

  async getOrderById(orderId: number): Promise<Order> {
    const res = await apiClient.get<Order>(`/api/orders/${orderId}`);
    return res.data;
  },

  async cancelOrder(orderId: number): Promise<Order> {
    const res = await apiClient.post<Order>(`/api/orders/${orderId}/cancel`);
    return res.data;
  },

  async getTracking(orderId: number): Promise<OrderTracking> {
    const res = await apiClient.get<OrderTracking>(`/api/orders/${orderId}/tracking`);
    return res.data;
  },

  // Internal simulated step transition for demo workflow
  async simulateNextStep(orderId: number): Promise<OrderTracking> {
    const res = await apiClient.post<OrderTracking>(`/api/orders/${orderId}/simulate-step`);
    return res.data;
  }
};
