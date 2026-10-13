import apiClient from './api';
import { ApiResponse, Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await apiClient.get<ApiResponse<Cart>>('/api/cart');
    return res.data.data;
  },

  async addToCart(productVariantId: number, quantity = 1): Promise<Cart> {
    const res = await apiClient.post<ApiResponse<Cart>>('/api/cart/items', { productVariantId, quantity });
    return res.data.data;
  },

  async updateQuantity(itemId: number, quantity: number): Promise<Cart> {
    const res = await apiClient.patch<ApiResponse<Cart>>(`/api/cart/items/${itemId}`, { quantity });
    return res.data.data;
  },

  async removeItem(itemId: number): Promise<Cart> {
    const res = await apiClient.delete<ApiResponse<Cart>>(`/api/cart/items/${itemId}`);
    return res.data.data;
  },

  async clearCart(): Promise<void> {
    await apiClient.delete('/api/cart');
  },
};
