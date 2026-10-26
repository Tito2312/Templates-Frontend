import axios from 'axios';
import type { ApiError } from '../types';

/**
 * Devuelve un mensaje legible a partir de un error de la API.
 * Usa el "message" del JSON de error del backend y, si no existe, el texto de respaldo.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Inténtalo de nuevo en unos segundos.';
    }
    const data = error.response.data as Partial<ApiError> | string | undefined;
    if (data && typeof data === 'object' && data.message) {
      return data.message;
    }
  }
  return fallback;
};

/** true cuando el servidor no respondió (caído, sin red o despertando en Render). */
export const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;
