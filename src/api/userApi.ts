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

    if (!data || !data.user) {
      throw new Error('El servidor no retornó los datos del usuario.');
    }

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

    if (!data || !data.user) {
      throw new Error('Credenciales o respuesta inválida del servidor.');
    }

    if (data.token) {
      session.setToken(data.token);
    }
    session.setUser(data.user);

    return data.user;
  },

  // Usuario autenticado según el servidor (incluye el rol vigente)
  me: async (): Promise<User> => {
    const { data } = await httpClient.get<User>('/users/me');
    return data;
  },
};