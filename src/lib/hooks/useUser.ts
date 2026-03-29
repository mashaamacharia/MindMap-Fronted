/**
 * User Hooks
 * TanStack Query hooks for user operations
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '@/lib/api/users';
import { useAuthStore } from '@/lib/stores';
import type { UserUpdate } from '@/lib/types';

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...userKeys.lists(), page, limit] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

/**
 * Hook to get current user profile
 */
export function useUserMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => usersApi.getUserMe(),
  });
}

/**
 * Hook to update current user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: UserUpdate) => usersApi.updateUserMe(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.me(), updatedUser);
      // Also update auth store
      setUser(updatedUser);
    },
  });
}

/**
 * Hook to complete user profile
 */
export function useCompleteProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: UserUpdate) => usersApi.completeProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.me(), updatedUser);
      setUser(updatedUser);
    },
  });
}

/**
 * Hook to delete current user account
 */
export function useDeleteAccount() {
  const { logout } = useAuthStore.getState();

  return useMutation({
    mutationFn: () => usersApi.deleteUserMe(),
    onSuccess: () => {
      logout();
    },
  });
}

/**
 * Hook to list all users (admin)
 */
export function useUsers(page = 1, limit = 20) {
  return useQuery({
    queryKey: userKeys.list(page, limit),
    queryFn: () => usersApi.listUsers(page, limit),
  });
}

/**
 * Hook to get a user by ID
 */
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(userId ?? ''),
    queryFn: () => usersApi.getUser(userId!),
    enabled: !!userId,
  });
}
