import { httpClient } from './httpClient';
import type { TemplateResponse, TemplateRequest, PaginatedResponse } from '../types';

export const templateApi = {
  searchTemplates: async (
    query: string = '',
    brand: string = '',
    category: string = '',
    page: number = 0,
    size: number = 9
  ): Promise<PaginatedResponse<TemplateResponse>> => {
    const { data } = await httpClient.get<PaginatedResponse<TemplateResponse>>('/templates', {
      params: { query, brand, category, page, size },
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