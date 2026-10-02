import { api } from './api';
import { ApiResponse, Vaccination } from '../types';

export const vaccinationService = {
  async getVaccinationsByPet(petId: string): Promise<Vaccination[]> {
    const response = await api.get<ApiResponse<Vaccination[]>>(`/pets/${petId}/vaccinations`);
    return response.data.data;
  },

  async createVaccination(petId: string, data: Partial<Vaccination>): Promise<Vaccination> {
    const response = await api.post<ApiResponse<Vaccination>>(`/pets/${petId}/vaccinations`, data);
    return response.data.data;
  },

  async updateVaccination(id: string, data: Partial<Vaccination>): Promise<Vaccination> {
    const response = await api.put<ApiResponse<Vaccination>>(`/vaccinations/${id}`, data);
    return response.data.data;
  },

  async deleteVaccination(id: string): Promise<void> {
    await api.delete(`/vaccinations/${id}`);
  },
};
