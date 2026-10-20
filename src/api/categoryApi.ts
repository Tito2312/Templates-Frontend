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

  updateCategory: async (id: number, name: string) => {
    const response = await httpClient.put(`/categories/${id}`, { name });
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await httpClient.delete(`/categories/${id}`);
  },
};