import { httpClient } from './client';
import { session } from '../utils/session';
import type { Category } from '../types';

export const categoryApi = {
  getCategories: async (userId?: number): Promise<Category[]> => {
    const activeUserId = userId ?? session.getUserId();
    const { data } = await httpClient.get<Category[]>('/categories', {
      params: { userId: activeUserId },
    });
    return data;
  },

  createCategory: async (name: string, userId?: number): Promise<Category> => {
    const activeUserId = userId ?? session.getUserId();
    const { data } = await httpClient.post<Category>('/categories', null, {
      params: { userId: activeUserId, name },
    });
    return data;
  },
};