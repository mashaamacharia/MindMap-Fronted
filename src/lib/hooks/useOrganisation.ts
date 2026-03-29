/**
 * Organisation Hooks
 * TanStack Query hooks for organisation and member management
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as orgsApi from '@/lib/api/organisations';
import type { OrganisationUpdate, OrgMemberUpdate, TransferOwnershipRequest } from '@/lib/types';
import { useAuthStore } from '@/lib/stores/authStore';

export const orgKeys = {
  all: ['organisations'] as const,
  detail: (id: string) => [...orgKeys.all, id] as const,
  bySlug: (slug: string) => [...orgKeys.all, 'slug', slug] as const,
  members: (id: string) => [...orgKeys.all, id, 'members'] as const,
};

/**
 * Hook to get organisation by ID
 */
export function useOrg(orgId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.detail(orgId ?? ''),
    queryFn: () => orgsApi.getOrg(orgId!),
    enabled: !!orgId,
  });
}

/**
 * Hook to get organisation by slug
 */
export function useOrgBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: orgKeys.bySlug(slug ?? ''),
    queryFn: () => orgsApi.getOrgBySlug(slug!),
    enabled: !!slug,
  });
}

/**
 * Hook to get organisation members
 */
export function useOrgMembers(orgId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.members(orgId ?? ''),
    queryFn: () => orgsApi.listMembers(orgId!),
    enabled: !!orgId,
  });
}

/**
 * Hook to update organisation
 */
export function useUpdateOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: OrganisationUpdate }) =>
      orgsApi.updateOrg(orgId, data),
    onSuccess: (updatedOrg) => {
      queryClient.setQueryData(orgKeys.detail(updatedOrg.id), updatedOrg);
      queryClient.invalidateQueries({ queryKey: orgKeys.bySlug(updatedOrg.slug) });
    },
  });
}

/**
 * Hook to change member role
 */
export function useChangeMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orgId,
      userId,
      data,
    }: {
      orgId: string;
      userId: string;
      data: OrgMemberUpdate;
    }) => orgsApi.changeMemberRole(orgId, userId, data),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.members(orgId) });
    },
  });
}

/**
 * Hook to remove member
 */
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, userId }: { orgId: string; userId: string }) =>
      orgsApi.removeMember(orgId, userId),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.members(orgId) });
    },
  });
}

/**
 * Hook to transfer ownership
 * Clears auth and redirects to login after success
 */
export function useTransferOwnership() {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: TransferOwnershipRequest }) =>
      orgsApi.transferOwnership(orgId, data),
    onSuccess: () => {
      clearAuth();
      // Redirect handled by component
    },
  });
}
