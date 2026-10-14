import { httpClient } from './httpClient';
import type { Category } from '../types';

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await httpClient.get<Category[]>('/categories');
    return data;
  },

  createCategory: async (name: string): Promise<Category> => {
    const { data } = await httpClient.post<Category>('/categories', { name });
    return data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await httpClient.delete(`/categories/${id}`);
  },
};