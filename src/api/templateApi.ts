import { httpClient } from './httpClient';
import type { TemplateResponse, TemplateRequest } from '../types';

export const templateApi = {
  searchTemplates: async (
    query?: string,
    brandId?: string,
    categoryId?: string
  ): Promise<TemplateResponse[]> => {
    const { data } = await httpClient.get<TemplateResponse[]>('/templates/search', {
      params: { query, brandId, categoryId },
    });
    return data;
  },

  createTemplate: async (payload: TemplateRequest): Promise<TemplateResponse> => {
    const { data } = await httpClient.post<TemplateResponse>('/templates', payload);
    return data;
  },

  updateTemplate: async (id: number, payload: TemplateRequest): Promise<TemplateResponse> => {
    const { data } = await httpClient.put<TemplateResponse>(`/templates/${id}`, payload);
    return data;
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await httpClient.delete(`/templates/${id}`);
  },

  incrementUsage: async (id: number): Promise<void> => {
    await httpClient.post(`/templates/${id}/increment-usage`);
  },
};