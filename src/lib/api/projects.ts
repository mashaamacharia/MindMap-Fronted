/**
 * Projects API Functions
 */

import api from './axios';
import type {
  ProjectRead,
  ProjectCreate,
  ProjectUpdate,
  ProjectSummary,
  ExportRecordRead,
  PaginatedResponse,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * List all projects
 */
export async function listProjects(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<ProjectRead>> {
  const { data } = await api.get<PaginatedResponse<ProjectRead>>('/projects/', {
    params: { page, limit },
  });
  return data;
}

/**
 * Create a new project
 */
export async function createProject(payload: ProjectCreate): Promise<ProjectRead> {
  const { data } = await api.post<ProjectRead>('/projects/', payload);
  return data;
}

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string): Promise<ProjectRead> {
  const { data } = await api.get<ProjectRead>(`/projects/${projectId}`);
  return data;
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  payload: ProjectUpdate
): Promise<ProjectRead> {
  const { data } = await api.patch<ProjectRead>(`/projects/${projectId}`, payload);
  return data;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/projects/${projectId}`);
  return data;
}

/**
 * Archive a project
 */
export async function archiveProject(projectId: string): Promise<ProjectRead> {
  const { data } = await api.post<ProjectRead>(`/projects/${projectId}/archive`);
  return data;
}

/**
 * Unarchive a project
 */
export async function unarchiveProject(projectId: string): Promise<ProjectRead> {
  const { data } = await api.post<ProjectRead>(`/projects/${projectId}/unarchive`);
  return data;
}

/**
 * Duplicate a project
 */
export async function duplicateProject(projectId: string): Promise<ProjectRead> {
  const { data } = await api.post<ProjectRead>(`/projects/${projectId}/duplicate`);
  return data;
}

/**
 * Get project summary (with counts)
 */
export async function getProjectSummary(projectId: string): Promise<ProjectSummary> {
  const { data } = await api.get<ProjectSummary>(`/projects/${projectId}/summary`);
  return data;
}

/**
 * Get project exports
 */
export async function getProjectExports(
  projectId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<ExportRecordRead>> {
  const { data } = await api.get<PaginatedResponse<ExportRecordRead>>(
    `/projects/${projectId}/exports`,
    { params: { page, limit } }
  );
  return data;
}
