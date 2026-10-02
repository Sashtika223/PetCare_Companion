import { api } from './api';
import { ApiResponse, Medication } from '../types';

export const medicationService = {
  async getMedicationsByPet(petId: string): Promise<Medication[]> {
    const response = await api.get<ApiResponse<Medication[]>>(`/pets/${petId}/medications`);
    return response.data.data;
  },

  async createMedication(petId: string, data: Partial<Medication>): Promise<Medication> {
    const response = await api.post<ApiResponse<Medication>>(`/pets/${petId}/medications`, data);
    return response.data.data;
  },

  async updateMedication(id: string, data: Partial<Medication>): Promise<Medication> {
    const response = await api.put<ApiResponse<Medication>>(`/medications/${id}`, data);
    return response.data.data;
  },

  async deleteMedication(id: string): Promise<void> {
    await api.delete(`/medications/${id}`);
  },
};
