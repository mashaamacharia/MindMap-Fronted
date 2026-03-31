/**
 * Artifacts Hooks
 * TanStack Query hooks for artifact operations
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as artifactsApi from '@/lib/api/artifacts';
import type { ArtifactUpdate } from '@/lib/types';

export const artifactKeys = {
  all: ['artifacts'] as const,
  lists: () => [...artifactKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...artifactKeys.lists(), page, limit] as const,
  details: () => [...artifactKeys.all, 'detail'] as const,
  detail: (id: string) => [...artifactKeys.details(), id] as const,
  versions: (id: string) => [...artifactKeys.detail(id), 'versions'] as const,
  context: (id: string) => [...artifactKeys.detail(id), 'context'] as const,
};

/**
 * Hook to list artifacts
 */
export function useArtifacts(page = 1, limit = 10) {
  return useQuery({
    queryKey: artifactKeys.list(page, limit),
    queryFn: () => artifactsApi.listArtifacts(page, limit),
  });
}

/**
 * Hook to get a single artifact
 */
export function useArtifact(artifactId: string | undefined) {
  return useQuery({
    queryKey: artifactKeys.detail(artifactId ?? ''),
    queryFn: () => artifactsApi.getArtifact(artifactId!),
    enabled: !!artifactId,
  });
}

/**
 * Hook to get artifact context (AI + knowledge snapshots)
 */
export function useArtifactContext(artifactId: string | undefined) {
  return useQuery({
    queryKey: artifactKeys.context(artifactId ?? ''),
    queryFn: () => artifactsApi.getArtifactContext(artifactId!),
    enabled: !!artifactId,
  });
}

/**
 * Hook to update an artifact
 */
export function useUpdateArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      artifactId,
      data,
    }: {
      artifactId: string;
      data: ArtifactUpdate;
    }) => artifactsApi.updateArtifact(artifactId, data),
    onSuccess: (updatedArtifact) => {
      queryClient.setQueryData(artifactKeys.detail(updatedArtifact.id), updatedArtifact);
      queryClient.invalidateQueries({ queryKey: artifactKeys.lists() });
    },
  });
}

/**
 * Hook to delete an artifact
 */
export function useDeleteArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artifactId: string) => artifactsApi.deleteArtifact(artifactId),
    onSuccess: (_, artifactId) => {
      queryClient.removeQueries({ queryKey: artifactKeys.detail(artifactId) });
      queryClient.invalidateQueries({ queryKey: artifactKeys.lists() });
    },
  });
}

/**
 * Hook to approve an artifact (ADMIN+ only)
 */
export function useApproveArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artifactId: string) => artifactsApi.approveArtifact(artifactId),
    onSuccess: (updatedArtifact) => {
      queryClient.setQueryData(artifactKeys.detail(updatedArtifact.id), updatedArtifact);
      queryClient.invalidateQueries({ queryKey: artifactKeys.lists() });
    },
  });
}

/**
 * Hook to share an artifact
 */
export function useShareArtifact() {
  return useMutation({
    mutationFn: (artifactId: string) => artifactsApi.shareArtifact(artifactId),
  });
}
