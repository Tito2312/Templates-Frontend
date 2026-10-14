import { httpClient } from './client';
import { session } from '../utils/session';
import type { TemplateResponse, TemplateRequest } from '../types';

export const templateApi = {
  searchTemplates: async (
    query: string = '',
    brandId: string = '',
    categoryId: string = '',
    userId?: number
  ): Promise<TemplateResponse[]> => {
    const activeUserId = userId ?? session.getUserId();

    const params = new URLSearchParams({
      userId: activeUserId.toString(),
    });

    if (query) params.append('q', query);
    if (brandId) params.append('brandId', brandId);
    if (categoryId) params.append('categoryId', categoryId);

    const { data } = await httpClient.get<TemplateResponse[]>(`/templates/search?${params.toString()}`);
    return data;
  },

  createTemplate: async (payload: TemplateRequest, userId?: number): Promise<TemplateResponse> => {
    const activeUserId = userId ?? session.getUserId();
    const { data } = await httpClient.post<TemplateResponse>('/templates', payload, {
      params: { userId: activeUserId },
    });
    return data;
  },

  incrementUsage: async (templateId: number, userId?: number): Promise<void> => {
    const activeUserId = userId ?? session.getUserId();
    await httpClient.post(`/templates/${templateId}/use`, null, {
      params: { userId: activeUserId },
    });
  },

  deleteTemplate: async (templateId: number, userId?: number): Promise<void> => {
    const activeUserId = userId ?? session.getUserId();
    await httpClient.delete(`/templates/${templateId}`, {
      params: { userId: activeUserId },
    });
  },

  updateTemplate: async (id: number, template: TemplateRequest): Promise<TemplateResponse> => {
    const { data } = await httpClient.put<TemplateResponse>(`/templates/${id}`, template);
    return data;
  },
};