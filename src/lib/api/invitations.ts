/**
 * Invitations API Functions
 * Organisation invitation management endpoints
 */

import api from './axios';
import type {
  InvitationRead,
  InvitationCreate,
  PaginatedResponse,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * List invitations
 */
export async function listInvitations(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<InvitationRead>> {
  const { data } = await api.get<PaginatedResponse<InvitationRead>>('/invitations/', {
    params: { page, limit },
  });
  return data;
}

/**
 * Create invitation
 */
export async function createInvitation(data: InvitationCreate): Promise<InvitationRead> {
  const { data: response } = await api.post<InvitationRead>('/invitations/', data);
  return response;
}

/**
 * Get invitation by ID
 */
export async function getInvitation(invitationId: string): Promise<InvitationRead> {
  const { data } = await api.get<InvitationRead>(`/invitations/${invitationId}`);
  return data;
}

/**
 * Revoke invitation
 */
export async function revokeInvitation(
  invitationId: string
): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/invitations/${invitationId}`);
  return data;
}

/**
 * Resend invitation email
 */
export async function resendInvitation(
  invitationId: string
): Promise<GenericMessageResponse> {
  const { data } = await api.post<GenericMessageResponse>(
    `/invitations/${invitationId}/resend`
  );
  return data;
}
