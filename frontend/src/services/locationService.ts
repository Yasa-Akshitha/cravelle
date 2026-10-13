import apiClient from './api';
import { SavedPlace, SavedPlaceRequest, VisitHistory, Restaurant } from '../types';

export const locationService = {
  async getNearbyRestaurants(lat: number, lon: number, radiusKm: number = 7.0): Promise<Restaurant[]> {
    const res = await apiClient.get<Restaurant[]>('/api/locations/restaurants', {
      params: { latitude: lat, longitude: lon, radiusKm }
    });
    return res.data;
  },

  async searchLocations(query: string): Promise<any[]> {
    const res = await apiClient.get<any[]>('/api/locations/search', {
      params: { query }
    });
    return res.data;
  },

  async getSavedPlaces(): Promise<SavedPlace[]> {
    const res = await apiClient.get<SavedPlace[]>('/api/places/saved');
    return res.data;
  },

  async addSavedPlace(place: SavedPlaceRequest): Promise<SavedPlace> {
    const res = await apiClient.post<SavedPlace>('/api/places/saved', place);
    return res.data;
  },

  async deleteSavedPlace(id: number): Promise<void> {
    await apiClient.delete(`/api/places/saved/${id}`);
  },

  async getVisitHistory(): Promise<VisitHistory[]> {
    const res = await apiClient.get<VisitHistory[]>('/api/places/history');
    return res.data;
  },

  async recordVisit(data: { placeName: string; placeType: string; latitude: number; longitude: number; durationMinutes?: number }): Promise<VisitHistory> {
    const res = await apiClient.post<VisitHistory>('/api/places/history', data);
    return res.data;
  },

  async clearVisitHistory(): Promise<void> {
    await apiClient.delete('/api/places/history');
  }
};
