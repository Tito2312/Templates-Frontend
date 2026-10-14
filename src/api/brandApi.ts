import { httpClient } from './client';
import { session } from '../utils/session';
import type { Brand } from '../types';

export const brandApi = {
  getBrands: async (userId?: number): Promise<Brand[]> => {
    const activeUserId = userId ?? session.getUserId();
    const { data } = await httpClient.get<Brand[]>('/brands', {
      params: { userId: activeUserId },
    });
    return data;
  },

  createBrand: async (name: string, userId?: number): Promise<Brand> => {
    const activeUserId = userId ?? session.getUserId();
    const { data } = await httpClient.post<Brand>('/brands', null, {
      params: { userId: activeUserId, name },
    });
    return data;
  },
};