import { api } from './api';
import { ApiResponse, AuthData, User } from '../types';
import { RegisterInput, LoginInput } from '../validators/authSchema';

export const authService = {
  async register(data: RegisterInput): Promise<AuthData> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', data);
    return response.data.data;
  },

  async login(data: LoginInput): Promise<AuthData> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network logout errors
    } finally {
      localStorage.removeItem('pet_care_token');
      localStorage.removeItem('pet_care_user');
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
};
