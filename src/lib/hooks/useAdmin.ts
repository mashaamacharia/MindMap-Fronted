/**
 * Admin Hooks
 * TanStack Query hooks for admin operations
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '@/lib/api/admin';
import type {
  AdminUserListParams,
  AdminUserUpdate,
  AdminUserCreate,
  AuditLogParams,
} from '@/lib/types';

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (params?: AdminUserListParams) =>
    [...adminKeys.users(), 'list', params] as const,
  userDetail: (id: string) => [...adminKeys.users(), 'detail', id] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  auditLogs: (params?: AuditLogParams) =>
    [...adminKeys.all, 'audit-logs', params] as const,
};

/**
 * Hook to list users (admin)
 */
export function useAdminUsers(params?: AdminUserListParams) {
  return useQuery({
    queryKey: adminKeys.userList(params),
    queryFn: () => adminApi.listUsers(params),
  });
}

/**
 * Hook to get a single user (admin)
 */
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminKeys.userDetail(userId),
    queryFn: () => adminApi.getUser(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to create a user (admin)
 */
export function useAdminCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminUserCreate) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to update a user (admin)
 */
export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: AdminUserUpdate;
    }) => adminApi.updateUser(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        adminKeys.userDetail(updatedUser.id),
        updatedUser
      );
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

/**
 * Hook to delete a user (admin)
 */
export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: adminKeys.userDetail(userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to activate a user (admin)
 */
export function useAdminActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.activateUser(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        adminKeys.userDetail(updatedUser.id),
        updatedUser
      );
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to deactivate a user (admin)
 */
export function useAdminDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.deactivateUser(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        adminKeys.userDetail(updatedUser.id),
        updatedUser
      );
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

/**
 * Hook to get admin stats
 */
export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminApi.getAdminStats(),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get audit logs
 */
export function useAuditLogs(params?: AuditLogParams) {
  return useQuery({
    queryKey: adminKeys.auditLogs(params),
    queryFn: () => adminApi.getAuditLogs(params),
  });
}
