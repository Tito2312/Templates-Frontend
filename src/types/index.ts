export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface TemplateResponse {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  usageCount: number;
  brandId?: number | null;
  brandName?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRequest {
  title: string;
  content: string;
  imageUrl?: string | null;
  brandId?: number | null;
  categoryId?: number | null;
  userId?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface Brand {
  id: number;
  name: string;
  colorHex?: string;
}