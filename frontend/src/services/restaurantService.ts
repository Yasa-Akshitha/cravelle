import apiClient from './api';
import { Restaurant, RestaurantDetail, Dish, Cuisine, PageResponse } from '../types';

export interface RestaurantFilterParams {
  query?: string;
  cuisine?: string;
  pureVeg?: boolean;
  minRating?: number;
  priceRange?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const restaurantService = {
  async getAll(params?: RestaurantFilterParams): Promise<PageResponse<Restaurant>> {
    const res = await apiClient.get<PageResponse<Restaurant>>('/api/restaurants', { params });
    return res.data;
  },

  async getById(id: number): Promise<RestaurantDetail> {
    const res = await apiClient.get<RestaurantDetail>(`/api/restaurants/${id}`);
    return res.data;
  },

  async getMenu(restaurantId: number): Promise<any[]> {
    const res = await apiClient.get<any[]>(`/api/restaurants/${restaurantId}/menu`);
    return res.data;
  },

  async getDishById(dishId: number): Promise<Dish> {
    const res = await apiClient.get<Dish>(`/api/dishes/${dishId}`);
    return res.data;
  },

  async getCuisines(): Promise<Cuisine[]> {
    const res = await apiClient.get<Cuisine[]>('/api/cuisines');
    return res.data;
  }
};
