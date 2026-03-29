/**
 * Admin Knowledge API Functions
 * Superadmin knowledge management endpoints
 */

import api from './axios';
import type {
  KnowledgeItemRead,
  KnowledgeItemCreate,
  KnowledgeItemUpdate,
  PaginatedResponse,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * List all knowledge items (admin)
 */
export async function listAdminKnowledge(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<KnowledgeItemRead>> {
  const { data } = await api.get<PaginatedResponse<KnowledgeItemRead>>('/admin/knowledge/', {
    params: { page, limit },
  });
  return data;
}

/**
 * Create knowledge item
 */
export async function createKnowledgeItem(
  data: KnowledgeItemCreate
): Promise<KnowledgeItemRead> {
  const { data: response } = await api.post<KnowledgeItemRead>('/admin/knowledge/', data);
  return response;
}

/**
 * Get knowledge item by ID (admin)
 */
export async function getAdminKnowledgeItem(id: string): Promise<KnowledgeItemRead> {
  const { data } = await api.get<KnowledgeItemRead>(`/admin/knowledge/${id}`);
  return data;
}

/**
 * Update knowledge item
 */
export async function updateKnowledgeItem(
  id: string,
  data: KnowledgeItemUpdate
): Promise<KnowledgeItemRead> {
  const { data: response } = await api.patch<KnowledgeItemRead>(
    `/admin/knowledge/${id}`,
    data
  );
  return response;
}

/**
 * Delete knowledge item
 */
export async function deleteKnowledgeItem(id: string): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/admin/knowledge/${id}`);
  return data;
}

/**
 * Publish knowledge item
 */
export async function publishKnowledgeItem(id: string): Promise<KnowledgeItemRead> {
  const { data } = await api.post<KnowledgeItemRead>(`/admin/knowledge/${id}/publish`);
  return data;
}

/**
 * Unpublish knowledge item
 */
export async function unpublishKnowledgeItem(id: string): Promise<KnowledgeItemRead> {
  const { data } = await api.post<KnowledgeItemRead>(`/admin/knowledge/${id}/unpublish`);
  return data;
}
