import { httpClient } from './client';
import type { User } from '../types';

export const userApi = {
  register: async (username: string, email: string, password: string): Promise<User> => {
    const { data } = await httpClient.post<User>('/users/register', null, {
      params: { username, email, password },
    });
    return data;
  },

  getUserById: async (id: number): Promise<User> => {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },
};