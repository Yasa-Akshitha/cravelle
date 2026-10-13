import apiClient from './api';
import { ChatResponse } from '../types';

export const chatService = {
  async sendMessage(message: string, conversationId?: number, userCoordinates?: { lat: number; lon: number }): Promise<ChatResponse> {
    const res = await apiClient.post<ChatResponse>('/api/chat', {
      message,
      conversationId,
      latitude: userCoordinates?.lat,
      longitude: userCoordinates?.lon
    });
    return res.data;
  },

  async getConversations(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/api/chat/conversations');
    return res.data;
  },

  async getConversationById(id: number): Promise<any> {
    const res = await apiClient.get<any>(`/api/chat/conversations/${id}`);
    return res.data;
  }
};
