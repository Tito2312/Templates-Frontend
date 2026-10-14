import { httpClient } from './client';
import type { User } from '../types';

export const userApi = {
  register: async (username: string, email: string, password: string): Promise<User> => {
    const { data } = await httpClient.post<User>(
      `/users/register?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    return data;
  },

  login: async (email: string, rawPassword: string): Promise<User> => {
    const { data } = await httpClient.post<User>('/users/login', {
      email,
      password: rawPassword,
    });
    return data;
  },

  getUserById: async (id: number): Promise<User> => {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },
};