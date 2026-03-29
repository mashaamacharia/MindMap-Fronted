/**
 * Artifacts API Functions
 */

import api from './axios';
import type {
  ArtifactRead,
  ArtifactUpdate,
  ArtifactContextResponse,
  PaginatedResponse,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * List artifacts
 */
export async function listArtifacts(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<ArtifactRead>> {
  const { data } = await api.get<PaginatedResponse<ArtifactRead>>('/artifacts/', {
    params: { page, limit },
  });
  return data;
}

/**
 * Get a single artifact by ID
 */
export async function getArtifact(artifactId: string): Promise<ArtifactRead> {
  const { data } = await api.get<ArtifactRead>(`/artifacts/${artifactId}`);
  return data;
}

/**
 * Update an artifact
 */
export async function updateArtifact(
  artifactId: string,
  payload: ArtifactUpdate
): Promise<ArtifactRead> {
  const { data } = await api.patch<ArtifactRead>(`/artifacts/${artifactId}`, payload);
  return data;
}

/**
 * Delete an artifact
 */
export async function deleteArtifact(
  artifactId: string
): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/artifacts/${artifactId}`);
  return data;
}

/**
 * Approve an artifact (ADMIN+ only)
 */
export async function approveArtifact(artifactId: string): Promise<ArtifactRead> {
  const { data } = await api.post<ArtifactRead>(`/artifacts/${artifactId}/approve`);
  return data;
}

/**
 * Get artifact version history
 */
export async function getArtifactVersions(artifactId: string): Promise<ArtifactRead[]> {
  const { data } = await api.get<ArtifactRead[]>(`/artifacts/${artifactId}/versions`);
  return data;
}

/**
 * Share an artifact (generate shareable link)
 */
export async function shareArtifact(
  artifactId: string
): Promise<{ share_url: string }> {
  const { data } = await api.post<{ share_url: string }>(
    `/artifacts/${artifactId}/share`
  );
  return data;
}

/**
 * Get artifact context (AI + knowledge snapshots)
 */
export async function getArtifactContext(
  artifactId: string
): Promise<ArtifactContextResponse> {
  const { data } = await api.get<ArtifactContextResponse>(
    `/artifacts/${artifactId}/context`
  );
  return data;
}
