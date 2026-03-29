/**
 * Knowledge Hooks
 * TanStack Query hooks for knowledge operations (public + admin)
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as knowledgeApi from '@/lib/api/knowledge';
import * as adminKnowledgeApi from '@/lib/api/admin_knowledge';
import type { KnowledgeItemCreate, KnowledgeItemUpdate } from '@/lib/types';

interface ListKnowledgeParams {
  domain_code?: string;
  page?: number;
  limit?: number;
}

export const knowledgeKeys = {
  all: ['knowledge'] as const,
  lists: () => [...knowledgeKeys.all, 'list'] as const,
  list: (params?: ListKnowledgeParams) => [...knowledgeKeys.lists(), params] as const,
  details: () => [...knowledgeKeys.all, 'detail'] as const,
  detail: (id: string) => [...knowledgeKeys.details(), id] as const,
  admin: () => [...knowledgeKeys.all, 'admin'] as const,
  adminList: (page: number, limit: number) => [...knowledgeKeys.admin(), 'list', page, limit] as const,
  adminDetail: (id: string) => [...knowledgeKeys.admin(), 'detail', id] as const,
};

/**
 * Hook to list published knowledge items
 */
export function useKnowledge(params?: ListKnowledgeParams) {
  return useQuery({
    queryKey: knowledgeKeys.list(params),
    queryFn: () => knowledgeApi.listKnowledge(params),
  });
}

/**
 * Hook to get a single knowledge item
 */
export function useKnowledgeItem(knowledgeId: string | undefined) {
  return useQuery({
    queryKey: knowledgeKeys.detail(knowledgeId ?? ''),
    queryFn: () => knowledgeApi.getKnowledgeItem(knowledgeId!),
    enabled: !!knowledgeId,
  });
}

// Admin hooks

/**
 * Hook to list all knowledge items (admin)
 */
export function useAdminKnowledge(page = 1, limit = 20) {
  return useQuery({
    queryKey: knowledgeKeys.adminList(page, limit),
    queryFn: () => adminKnowledgeApi.listAdminKnowledge(page, limit),
  });
}

/**
 * Hook to create a knowledge item
 */
export function useCreateKnowledgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: KnowledgeItemCreate) => adminKnowledgeApi.createKnowledgeItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.admin() });
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.lists() });
    },
  });
}

/**
 * Hook to update a knowledge item
 */
export function useUpdateKnowledgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: KnowledgeItemUpdate }) =>
      adminKnowledgeApi.updateKnowledgeItem(id, data),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(knowledgeKeys.adminDetail(updatedItem.id), updatedItem);
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.admin() });
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.lists() });
    },
  });
}

/**
 * Hook to delete a knowledge item
 */
export function useDeleteKnowledgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminKnowledgeApi.deleteKnowledgeItem(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: knowledgeKeys.adminDetail(id) });
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.admin() });
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.lists() });
    },
  });
}

/**
 * Hook to publish a knowledge item
 */
export function usePublishKnowledgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminKnowledgeApi.publishKnowledgeItem(id),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(knowledgeKeys.adminDetail(updatedItem.id), updatedItem);
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.admin() });
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.lists() });
    },
  });
}

/**
 * Hook to unpublish a knowledge item
 */
export function useUnpublishKnowledgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminKnowledgeApi.unpublishKnowledgeItem(id),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(knowledgeKeys.adminDetail(updatedItem.id), updatedItem);
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.admin() });
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.lists() });
    },
  });
}
