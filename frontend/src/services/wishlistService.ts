import apiClient from './api';
import { ApiResponse, WishlistItem } from '../types';

export const wishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const res = await apiClient.get<ApiResponse<WishlistItem[]>>('/api/wishlist');
    return res.data.data;
  },

  async addToWishlist(productId: number): Promise<WishlistItem> {
    const res = await apiClient.post<ApiResponse<WishlistItem>>('/api/wishlist', { productId });
    return res.data.data;
  },

  async removeFromWishlist(productId: number): Promise<void> {
    await apiClient.delete(`/api/wishlist/${productId}`);
  },
};
