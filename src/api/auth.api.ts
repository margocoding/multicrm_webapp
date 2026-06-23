// src/api/auth.api.ts
import { baseApi } from './base.api';

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await baseApi.post('/auth/login', dto);
    return data;
  },

  async getProfile(): Promise<AuthUser> {
    const { data } = await baseApi.get('/auth/profile');
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await baseApi.post('/auth/change-password', { currentPassword, newPassword });
  },
};