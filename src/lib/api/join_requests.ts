/**
 * Join Requests API Functions
 * Organisation join request management endpoints
 */

import api from './axios';
import type {
  JoinRequestRead,
  JoinRequestApprove,
  JoinRequestDecline,
  JoinRequestStatus,
  PaginatedResponse,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * List join requests
 */
export async function listJoinRequests(
  page = 1,
  limit = 20,
  status?: JoinRequestStatus
): Promise<PaginatedResponse<JoinRequestRead>> {
  const { data } = await api.get<PaginatedResponse<JoinRequestRead>>('/join-requests/', {
    params: { page, limit, status },
  });
  return data;
}

/**
 * Get join request by ID
 */
export async function getJoinRequest(requestId: string): Promise<JoinRequestRead> {
  const { data } = await api.get<JoinRequestRead>(`/join-requests/${requestId}`);
  return data;
}

/**
 * Approve join request
 */
export async function approveJoinRequest(
  requestId: string,
  data: JoinRequestApprove
): Promise<JoinRequestRead> {
  const { data: response } = await api.post<JoinRequestRead>(
    `/join-requests/${requestId}/approve`,
    data
  );
  return response;
}

/**
 * Decline join request
 */
export async function declineJoinRequest(
  requestId: string,
  data: JoinRequestDecline
): Promise<JoinRequestRead> {
  const { data: response } = await api.post<JoinRequestRead>(
    `/join-requests/${requestId}/decline`,
    data
  );
  return response;
}

/**
 * Cancel join request (by requester)
 */
export async function cancelJoinRequest(
  requestId: string
): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/join-requests/${requestId}`);
  return data;
}
