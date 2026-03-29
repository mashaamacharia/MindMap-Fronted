/**
 * Comments Hooks
 * TanStack Query hooks for comment operations
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as commentsApi from '@/lib/api/comments';
import type { CommentCreate, CommentUpdate } from '@/lib/types';

export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (artifactId: string, page: number) => [...commentKeys.lists(), artifactId, page] as const,
  detail: (id: string) => [...commentKeys.all, 'detail', id] as const,
};

/**
 * Hook to list comments for an artifact
 */
export function useComments(artifactId: string | undefined, page = 1) {
  return useQuery({
    queryKey: commentKeys.list(artifactId ?? '', page),
    queryFn: () => commentsApi.listComments(artifactId!, page),
    enabled: !!artifactId,
  });
}

/**
 * Hook to create a comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreate) => commentsApi.createComment(data),
    onSuccess: (_, variables) => {
      // Invalidate the list for this artifact
      queryClient.invalidateQueries({
        queryKey: commentKeys.lists(),
      });
    },
  });
}

/**
 * Hook to update a comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: CommentUpdate;
    }) => commentsApi.updateComment(commentId, data),
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.deleteComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.removeQueries({ queryKey: commentKeys.detail(commentId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}

/**
 * Hook to resolve a comment
 */
export function useResolveComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.resolveComment(commentId),
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}

/**
 * Hook to unresolve a comment
 */
export function useUnresolveComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.unresolveComment(commentId),
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}
