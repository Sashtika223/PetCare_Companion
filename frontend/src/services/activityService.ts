import { api } from './api';
import { ApiResponse, Activity } from '../types';

export const activityService = {
  async getActivitiesByPet(petId: string, activityType?: string): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (activityType && activityType !== 'All') params.append('activityType', activityType);

    const response = await api.get<ApiResponse<Activity[]>>(`/pets/${petId}/activities?${params.toString()}`);
    return response.data.data;
  },

  async createActivity(petId: string, data: Partial<Activity>): Promise<Activity> {
    const response = await api.post<ApiResponse<Activity>>(`/pets/${petId}/activities`, data);
    return response.data.data;
  },

  async updateActivity(id: string, data: Partial<Activity>): Promise<Activity> {
    const response = await api.put<ApiResponse<Activity>>(`/activities/${id}`, data);
    return response.data.data;
  },

  async deleteActivity(id: string): Promise<void> {
    await api.delete(`/activities/${id}`);
  },
};
