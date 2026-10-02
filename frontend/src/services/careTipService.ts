import { api } from './api';
import { ApiResponse, CareTip } from '../types';

export const careTipService = {
  async getCareTips(category?: string, species?: string, search?: string): Promise<CareTip[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (species && species !== 'All') params.append('species', species);
    if (search) params.append('search', search);

    const response = await api.get<ApiResponse<CareTip[]>>(`/care-tips?${params.toString()}`);
    return response.data.data;
  },

  async getCareTipById(id: string): Promise<CareTip> {
    const response = await api.get<ApiResponse<CareTip>>(`/care-tips/${id}`);
    return response.data.data;
  },
};
