/**
 * Projects Hooks
 * TanStack Query hooks for project operations
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as projectsApi from '@/lib/api/projects';
import type { ProjectCreate, ProjectUpdate } from '@/lib/types';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...projectKeys.lists(), page, limit] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  summary: (id: string) => [...projectKeys.detail(id), 'summary'] as const,
  exports: (id: string) => [...projectKeys.detail(id), 'exports'] as const,
};

/**
 * Hook to list projects
 */
export function useProjects(page = 1, limit = 20) {
  return useQuery({
    queryKey: projectKeys.list(page, limit),
    queryFn: () => projectsApi.listProjects(page, limit),
  });
}

/**
 * Hook to get a single project
 */
export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(projectId ?? ''),
    queryFn: () => projectsApi.getProject(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Hook to get project summary
 */
export function useProjectSummary(projectId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.summary(projectId ?? ''),
    queryFn: () => projectsApi.getProjectSummary(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Hook to get project exports
 */
export function useProjectExports(projectId: string | undefined, page = 1, limit = 20) {
  return useQuery({
    queryKey: projectKeys.exports(projectId ?? ''),
    queryFn: () => projectsApi.getProjectExports(projectId!, page, limit),
    enabled: !!projectId,
  });
}

/**
 * Hook to create a project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: ProjectUpdate;
    }) => projectsApi.updateProject(projectId, data),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.deleteProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Hook to archive a project
 */
export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.archiveProject(projectId),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Hook to unarchive a project
 */
export function useUnarchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.unarchiveProject(projectId),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Hook to duplicate a project
 */
export function useDuplicateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.duplicateProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
