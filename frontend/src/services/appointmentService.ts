import { api } from './api';
import { ApiResponse, Appointment } from '../types';

export const appointmentService = {
  async getAppointments(petId?: string, status?: string): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (petId) params.append('petId', petId);
    if (status && status !== 'All') params.append('status', status);

    const response = await api.get<ApiResponse<Appointment[]>>(`/appointments?${params.toString()}`);
    return response.data.data;
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return response.data.data;
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, data);
    return response.data.data;
  },

  async deleteAppointment(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },
};
