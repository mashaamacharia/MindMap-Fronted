/**
 * Analyze Hook
 * TanStack Query hooks for AI analysis
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as analyzeApi from '@/lib/api/analyze';
import { artifactKeys } from './useArtifacts';

export const analyzeKeys = {
  all: ['analyze'] as const,
  status: (artifactId: string) => [...analyzeKeys.all, 'status', artifactId] as const,
};

/**
 * Hook to trigger AI analysis for a challenge
 * IMPORTANT: challenge_id is sent as query param
 */
export function useAnalyze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (challengeId: string) => analyzeApi.analyze(challengeId),
    onSuccess: () => {
      // Invalidate artifacts list after analysis
      queryClient.invalidateQueries({ queryKey: artifactKeys.all });
    },
  });
}

/**
 * Hook to poll analysis status
 * Refetch every 2 seconds when enabled
 */
export function useAnalyzeStatus(artifactId: string | undefined, enabled = false) {
  return useQuery({
    queryKey: analyzeKeys.status(artifactId ?? ''),
    queryFn: () => analyzeApi.getAnalyzeStatus(artifactId!),
    enabled: !!artifactId && enabled,
    refetchInterval: enabled ? 2000 : false,
  });
}

/**
 * Hook to re-analyze an artifact
 */
export function useReanalyze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artifactId: string) => analyzeApi.reanalyze(artifactId),
    onSuccess: (_, artifactId) => {
      // Invalidate the specific artifact
      queryClient.invalidateQueries({ queryKey: artifactKeys.detail(artifactId) });
    },
  });
}
