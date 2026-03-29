/**
 * API Types
 * Common API response shapes and pagination
 */

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GenericMessageResponse {
  message: string;
}

export interface ConstantOption {
  value: string;
  label: string;
}

export interface ConstantsResponse {
  seniority_levels: ConstantOption[];
  primary_functions: ConstantOption[];
  org_size_categories: ConstantOption[];
  primary_markets: ConstantOption[];
  org_plans: ConstantOption[];
}

export interface ApiError {
  detail: string;
  code?: string;
  field?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export type ListParams = PaginationParams & SortParams;
