import apiClient from './api';
import { ApiResponse, PageResponse, Product, Review } from '../types';

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<PageResponse<Product>> {
    const params: Record<string, any> = {};
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;
    if (filters.page !== undefined) params.page = filters.page;
    if (filters.size !== undefined) params.size = filters.size;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortDir) params.sortDir = filters.sortDir;

    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>('/api/products', { params });
    return res.data.data;
  },

  async getNewArrivals(): Promise<Product[]> {
    const res = await apiClient.get<ApiResponse<Product[]>>('/api/products/new-arrivals');
    return res.data.data;
  },

  async getProductById(id: number): Promise<Product> {
    const res = await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`);
    return res.data.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await apiClient.get<ApiResponse<Product>>(`/api/products/slug/${slug}`);
    return res.data.data;
  },

  async getRelatedProducts(id: number): Promise<Product[]> {
    const res = await apiClient.get<ApiResponse<Product[]>>(`/api/products/${id}/related`);
    return res.data.data;
  },

  async getReviews(productId: number): Promise<Review[]> {
    const res = await apiClient.get<ApiResponse<Review[]>>(`/api/products/${productId}/reviews`);
    return res.data.data;
  },

  async submitReview(productId: number, rating: number, comment: string): Promise<Review> {
    const res = await apiClient.post<ApiResponse<Review>>(`/api/products/${productId}/reviews`, { rating, comment });
    return res.data.data;
  },
};
