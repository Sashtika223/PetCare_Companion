import { api } from './api';
import { ApiResponse, Pet } from '../types';

export const petService = {
  async getPets(species?: string, search?: string): Promise<Pet[]> {
    const params = new URLSearchParams();
    if (species && species !== 'All') params.append('species', species);
    if (search) params.append('search', search);

    const response = await api.get<ApiResponse<Pet[]>>(`/pets?${params.toString()}`);
    return response.data.data;
  },

  async getPetById(id: string): Promise<Pet> {
    const response = await api.get<ApiResponse<Pet>>(`/pets/${id}`);
    return response.data.data;
  },

  async createPet(data: Partial<Pet>): Promise<Pet> {
    const response = await api.post<ApiResponse<Pet>>('/pets', data);
    return response.data.data;
  },

  async updatePet(id: string, data: Partial<Pet>): Promise<Pet> {
    const response = await api.put<ApiResponse<Pet>>(`/pets/${id}`, data);
    return response.data.data;
  },

  async deletePet(id: string): Promise<void> {
    await api.delete(`/pets/${id}`);
  },
};
