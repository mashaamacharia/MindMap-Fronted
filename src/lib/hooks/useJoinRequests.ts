/**
 * Join Requests Hooks
 * TanStack Query hooks for organisation join requests
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as joinRequestsApi from '@/lib/api/join_requests';
import type { JoinRequestStatus, JoinRequestApprove, JoinRequestDecline } from '@/lib/types';

export const joinRequestKeys = {
  all: ['join-requests'] as const,
  list: (page: number, limit: number, status?: JoinRequestStatus) =>
    [...joinRequestKeys.all, 'list', page, limit, status] as const,
  detail: (id: string) => [...joinRequestKeys.all, id] as const,
};

/**
 * Hook to list join requests
 */
export function useJoinRequests(page = 1, limit = 20, status?: JoinRequestStatus) {
  return useQuery({
    queryKey: joinRequestKeys.list(page, limit, status),
    queryFn: () => joinRequestsApi.listJoinRequests(page, limit, status),
  });
}

/**
 * Hook to approve a join request
 */
export function useApproveJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: JoinRequestApprove }) =>
      joinRequestsApi.approveJoinRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: joinRequestKeys.all });
    },
  });
}

/**
 * Hook to decline a join request
 */
export function useDeclineJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: JoinRequestDecline }) =>
      joinRequestsApi.declineJoinRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: joinRequestKeys.all });
    },
  });
}

/**
 * Hook to cancel a join request (by requester)
 */
export function useCancelJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => joinRequestsApi.cancelJoinRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: joinRequestKeys.all });
    },
  });
}
