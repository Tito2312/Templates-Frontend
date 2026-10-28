import axios from 'axios';
import { session } from '../utils/session';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Endpoints donde un 401/400 es parte del flujo normal y no significa "sesión expirada"
const AUTH_ENDPOINTS = ['/users/login', '/users/register'];

let unauthorizedHandler: (() => void) | null = null;

/**
 * Registra qué hacer cuando el backend responde 401 (token inválido o caducado).
 * Lo configura AuthContext para no acoplar este cliente a React.
 */
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

httpClient.interceptors.request.use(
  (config) => {
    const token = session.getToken();
    if (token) {
      // Usar set() previene fallos de asignación en Axios 1.x
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    const isAuthRequest = AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    if (error.response?.status === 401 && !isAuthRequest) {
      session.clear();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);
