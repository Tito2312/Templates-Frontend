import axios from 'axios';
import { session } from '../utils/session';

export const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

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