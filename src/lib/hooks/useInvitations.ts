/**
 * Invitations Hooks
 * TanStack Query hooks for organisation invitations
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as invitationsApi from '@/lib/api/invitations';
import type { InvitationCreate } from '@/lib/types';

export const invitationKeys = {
  all: ['invitations'] as const,
  list: (page: number, limit: number) => [...invitationKeys.all, 'list', page, limit] as const,
  detail: (id: string) => [...invitationKeys.all, id] as const,
};

/**
 * Hook to list invitations
 */
export function useInvitations(page = 1, limit = 20) {
  return useQuery({
    queryKey: invitationKeys.list(page, limit),
    queryFn: () => invitationsApi.listInvitations(page, limit),
  });
}

/**
 * Hook to create an invitation
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvitationCreate) => invitationsApi.createInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
    },
  });
}

/**
 * Hook to revoke an invitation
 */
export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => invitationsApi.revokeInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
    },
  });
}

/**
 * Hook to resend an invitation
 */
export function useResendInvitation() {
  return useMutation({
    mutationFn: (invitationId: string) => invitationsApi.resendInvitation(invitationId),
  });
}
