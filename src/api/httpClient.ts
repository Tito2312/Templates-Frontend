import axios from 'axios';
import { session } from '../utils/session';

export const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

httpClient.interceptors.request.use((config) => {
  const token = session.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});