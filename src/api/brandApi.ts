import { httpClient } from './httpClient';
import type { Brand } from '../types';

export const brandApi = {
  getBrands: async (): Promise<Brand[]> => {
    const { data } = await httpClient.get<Brand[]>('/brands');
    return data;
  },

  createBrand: async (name: string, colorHex?: string): Promise<Brand> => {
    const { data } = await httpClient.post<Brand>('/brands', { name, colorHex });
    return data;
  },

  deleteBrand: async (id: number): Promise<void> => {
    await httpClient.delete(`/brands/${id}`);
  },
};