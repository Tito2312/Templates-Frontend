import { httpClient } from './client';
import type { User } from '../types';

export const userApi = {
  register: async (username: string, email: string, password: string): Promise<User> => {
    const { data } = await httpClient.post<User>(
      `/users/register?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    return data;
  },

  login: async (username: string, password: string): Promise<User> => {
    const { data } = await httpClient.post<User>(
      `/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    );
    return data;
  },

  getUserById: async (id: number): Promise<User> => {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },
};