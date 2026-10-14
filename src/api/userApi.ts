import { httpClient } from './httpClient';
import { session } from '../utils/session';
import type { User, AuthResponse } from '../types';

export const userApi = {
  // Registro de usuario
  register: async (username: string, email: string, rawPassword: string): Promise<User> => {
    const { data } = await httpClient.post<AuthResponse>('/users/register', {
      username,
      email,
      password: rawPassword,
    });
    session.setToken(data.token);
    session.setUser(data.user);
    return data.user;
  },

  // Inicio de sesión
  login: async (email: string, rawPassword: string): Promise<User> => {
    const { data } = await httpClient.post<AuthResponse>('/users/login', {
      email,
      password: rawPassword,
    });
    session.setToken(data.token);
    session.setUser(data.user);
    return data.user;
  },

  // Obtener información del usuario por ID
  getUserById: async (id: number): Promise<User> => {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },
};