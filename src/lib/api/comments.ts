/**
 * Comments API Functions
 */

import api from './axios';
import type {
  CommentRead,
  CommentCreate,
  CommentUpdate,
  PaginatedResponse,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * List comments for an artifact
 */
export async function listComments(
  artifactId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<CommentRead>> {
  const { data } = await api.get<PaginatedResponse<CommentRead>>('/comments/', {
    params: { artifact_id: artifactId, page, limit },
  });
  return data;
}

/**
 * Create a new comment
 */
export async function createComment(payload: CommentCreate): Promise<CommentRead> {
  const { data } = await api.post<CommentRead>('/comments/', payload);
  return data;
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: string,
  payload: CommentUpdate
): Promise<CommentRead> {
  const { data } = await api.patch<CommentRead>(`/comments/${commentId}`, payload);
  return data;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/comments/${commentId}`);
  return data;
}

/**
 * Resolve a comment
 */
export async function resolveComment(commentId: string): Promise<CommentRead> {
  const { data } = await api.post<CommentRead>(`/comments/${commentId}/resolve`);
  return data;
}

/**
 * Unresolve a comment
 */
export async function unresolveComment(commentId: string): Promise<CommentRead> {
  const { data } = await api.post<CommentRead>(`/comments/${commentId}/unresolve`);
  return data;
}
