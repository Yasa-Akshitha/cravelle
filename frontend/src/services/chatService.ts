import apiClient from './api';
import { ApiResponse, ChatMessage, ChatResponse } from '../types';

export const chatService = {
  async sendMessage(message: string, guestSessionId?: string): Promise<ChatResponse> {
    const res = await apiClient.post<ApiResponse<ChatResponse>>('/api/chat', {
      message,
      guestSessionId,
    });
    return res.data.data;
  },

  async getHistory(guestSessionId?: string): Promise<{ conversationId: number; messages: ChatMessage[] }> {
    const params = guestSessionId ? { guestSessionId } : {};
    const res = await apiClient.get<ApiResponse<{ conversationId: number; messages: ChatMessage[] }>>('/api/chat/history', { params });
    return res.data.data;
  },

  async clearHistory(guestSessionId?: string): Promise<void> {
    const params = guestSessionId ? { guestSessionId } : {};
    await apiClient.delete('/api/chat/history', { params });
  },
};
