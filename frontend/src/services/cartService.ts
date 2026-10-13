import apiClient from './api';
import { Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await apiClient.get<Cart>('/api/cart');
    return res.data;
  },

  async addItem(dishId: number, quantity: number = 1): Promise<Cart> {
    const res = await apiClient.post<Cart>('/api/cart/items', {
      dishId,
      quantity
    });
    return res.data;
  },

  async updateItem(itemId: number, quantity: number): Promise<Cart> {
    const res = await apiClient.put<Cart>(`/api/cart/items/${itemId}`, {
      quantity
    });
    return res.data;
  },

  async removeItem(itemId: number): Promise<Cart> {
    const res = await apiClient.delete<Cart>(`/api/cart/items/${itemId}`);
    return res.data;
  },

  async clearCart(): Promise<void> {
    await apiClient.delete('/api/cart');
  }
};
