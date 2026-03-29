/**
 * Admin API Functions
 */

import api from './axios';
import type {
  User,
  AdminUserListParams,
  AdminUserUpdate,
  AdminUserCreate,
  AdminStats,
  AuditLogEntry,
  AuditLogParams,
  PaginatedResponse,
} from '@/lib/types';

/**
 * List all users (admin only)
 */
export async function listUsers(
  params?: AdminUserListParams
): Promise<PaginatedResponse<User>> {
  const { data } = await api.get<PaginatedResponse<User>>('/admin/users', {
    params,
  });
  return data;
}

/**
 * Get a single user by ID (admin only)
 */
export async function getUser(userId: string): Promise<User> {
  const { data } = await api.get<User>(`/admin/users/${userId}`);
  return data;
}

/**
 * Create a new user (admin only)
 */
export async function createUser(payload: AdminUserCreate): Promise<User> {
  const { data } = await api.post<User>('/admin/users', payload);
  return data;
}

/**
 * Update a user (admin only)
 */
export async function updateUser(
  userId: string,
  payload: AdminUserUpdate
): Promise<User> {
  const { data } = await api.patch<User>(`/admin/users/${userId}`, payload);
  return data;
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

/**
 * Activate a user (admin only)
 */
export async function activateUser(userId: string): Promise<User> {
  const { data } = await api.post<User>(`/admin/users/${userId}/activate`);
  return data;
}

/**
 * Deactivate a user (admin only)
 */
export async function deactivateUser(userId: string): Promise<User> {
  const { data } = await api.post<User>(`/admin/users/${userId}/deactivate`);
  return data;
}

/**
 * Get admin dashboard stats
 */
export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/admin/stats');
  return data;
}

/**
 * Get audit logs
 */
export async function getAuditLogs(
  params?: AuditLogParams
): Promise<PaginatedResponse<AuditLogEntry>> {
  const { data } = await api.get<PaginatedResponse<AuditLogEntry>>(
    '/admin/audit-logs',
    { params }
  );
  return data;
}
