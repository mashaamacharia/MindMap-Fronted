/**
 * Knowledge API Functions
 * Public read-only knowledge endpoints
 */

import api from './axios';
import type { KnowledgeItemRead, PaginatedResponse } from '@/lib/types';

interface ListKnowledgeParams {
  q?: string;
  domain_code?: string;
  page?: number;
  limit?: number;
}

/**
 * List published knowledge items
 */
export async function listKnowledge(
  params?: ListKnowledgeParams
): Promise<PaginatedResponse<KnowledgeItemRead>> {
  const { data } = await api.get<PaginatedResponse<KnowledgeItemRead>>('/knowledge/', {
    params: {
      q: params?.q,
      domain_code: params?.domain_code,
      page: params?.page ?? 1,
      limit: params?.limit ?? 8,
    },
  });
  return data;
}

/**
 * Get a single knowledge item by ID
 */
export async function getKnowledgeItem(knowledgeId: string): Promise<KnowledgeItemRead> {
  const { data } = await api.get<KnowledgeItemRead>(`/knowledge/${knowledgeId}`);
  return data;
}
