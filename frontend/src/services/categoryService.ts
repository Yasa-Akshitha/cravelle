import apiClient from './api';
import { ApiResponse, Category, PageResponse, Product } from '../types';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get<ApiResponse<Category[]>>('/api/categories');
    return res.data.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const res = await apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`);
    return res.data.data;
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const res = await apiClient.get<ApiResponse<Category>>(`/api/categories/slug/${slug}`);
    return res.data.data;
  },

  async getCategoryProducts(id: number, page = 0, size = 12): Promise<PageResponse<Product>> {
    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>(`/api/categories/${id}/products`, {
      params: { page, size },
    });
    return res.data.data;
  },
};
