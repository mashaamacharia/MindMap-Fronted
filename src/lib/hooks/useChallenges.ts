/**
 * Challenges Hooks
 * TanStack Query hooks for challenge operations
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as challengesApi from '@/lib/api/challenges';
import type { ChallengeCreate } from '@/lib/types';

export const challengeKeys = {
  all: ['challenges'] as const,
  lists: () => [...challengeKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...challengeKeys.lists(), page, limit] as const,
  details: () => [...challengeKeys.all, 'detail'] as const,
  detail: (id: string) => [...challengeKeys.details(), id] as const,
};

/**
 * Hook to list challenges
 */
export function useChallenges(page = 1, limit = 20) {
  return useQuery({
    queryKey: challengeKeys.list(page, limit),
    queryFn: () => challengesApi.listChallenges(page, limit),
  });
}

/**
 * Hook to get a single challenge
 */
export function useChallenge(challengeId: string | undefined) {
  return useQuery({
    queryKey: challengeKeys.detail(challengeId ?? ''),
    queryFn: () => challengesApi.getChallenge(challengeId!),
    enabled: !!challengeId,
  });
}

/**
 * Hook to create a challenge
 */
export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChallengeCreate) => challengesApi.createChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
    },
  });
}

/**
 * Hook to delete a challenge
 */
export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (challengeId: string) => challengesApi.deleteChallenge(challengeId),
    onSuccess: (_, challengeId) => {
      queryClient.removeQueries({ queryKey: challengeKeys.detail(challengeId) });
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
    },
  });
}
