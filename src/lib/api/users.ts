/**
 * Users API Functions
 * User profile management endpoints
 */

import api from './axios';
import type { UserRead, UserUpdate, PaginatedResponse, GenericMessageResponse } from '@/lib/types';

/**
 * Get current user profile
 */
export async function getUserMe(): Promise<UserRead> {
  const { data } = await api.get<UserRead>('/users/me');
  return data;
}

/**
 * Update current user profile
 */
export async function updateUserMe(data: UserUpdate): Promise<UserRead> {
  const { data: response } = await api.patch<UserRead>('/users/me', data);
  return response;
}

/**
 * Complete user profile (required before using AI features)
 */
export async function completeProfile(data: UserUpdate): Promise<UserRead> {
  const { data: response } = await api.patch<UserRead>('/users/me/complete-profile', data);
  return response;
}

/**
 * Delete current user account
 */
export async function deleteUserMe(): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>('/users/me');
  return data;
}

/**
 * List all users (admin)
 */
export async function listUsers(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<UserRead>> {
  const { data } = await api.get<PaginatedResponse<UserRead>>('/users/', {
    params: { page, limit },
  });
  return data;
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<UserRead> {
  const { data } = await api.get<UserRead>(`/users/${userId}`);
  return data;
}
