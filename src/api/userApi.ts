import { httpClient } from './httpClient';
import { session } from '../utils/session';
import type { User, AuthResponse } from '../types';

export const userApi = {
  register: async (username: string, email: string, rawPassword: string): Promise<User> => {
    const { data } = await httpClient.post<AuthResponse>('/users/register', {
      username,
      email,
      password: rawPassword,
    });
    if (data.token) {
      session.setToken(data.token);
    }
    session.setUser(data.user);
    return data.user;
  },

  login: async (email: string, rawPassword: string): Promise<User> => {
    const { data } = await httpClient.post<AuthResponse>('/users/login', {
      email,
      password: rawPassword,
    });
    if (data.token) {
      session.setToken(data.token);
    }
    session.setUser(data.user);
    return data.user;
  },

  getUserById: async (id: number): Promise<User> => {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },
};