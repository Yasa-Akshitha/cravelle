import apiClient from './api';
import { Address, ApiResponse } from '../types';

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const res = await apiClient.get<ApiResponse<Address[]>>('/api/addresses');
    return res.data.data;
  },

  async createAddress(address: Address): Promise<Address> {
    const res = await apiClient.post<ApiResponse<Address>>('/api/addresses', address);
    return res.data.data;
  },

  async updateAddress(id: number, address: Address): Promise<Address> {
    const res = await apiClient.patch<ApiResponse<Address>>(`/api/addresses/${id}`, address);
    return res.data.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/api/addresses/${id}`);
  },
};
