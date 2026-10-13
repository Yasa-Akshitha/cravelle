import apiClient from './api';
import { RecommendationResponse, Restaurant } from '../types';

export const recommendationService = {
  async getNearby(lat: number, lon: number): Promise<RecommendationResponse> {
    const res = await apiClient.get<RecommendationResponse>('/api/recommendations/nearby', {
      params: { latitude: lat, longitude: lon }
    });
    return res.data;
  },

  async getPersonalized(lat?: number, lon?: number): Promise<RecommendationResponse> {
    const res = await apiClient.get<RecommendationResponse>('/api/recommendations/personalized', {
      params: { latitude: lat, longitude: lon }
    });
    return res.data;
  },

  async askRecommendation(prompt: string, lat?: number, lon?: number, budget?: number): Promise<{ answer: string; recommendedRestaurants: Restaurant[] }> {
    const res = await apiClient.post<{ answer: string; recommendedRestaurants: Restaurant[] }>('/api/recommendations/ask', {
      prompt,
      latitude: lat,
      longitude: lon,
      budget
    });
    return res.data;
  }
};
