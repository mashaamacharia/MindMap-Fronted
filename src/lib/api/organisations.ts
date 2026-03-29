/**
 * Organisations API Functions
 * Organisation and member management endpoints
 */

import api from './axios';
import type {
  OrganisationRead,
  OrganisationUpdate,
  OrgMemberRead,
  OrgMemberUpdate,
  TransferOwnershipRequest,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * Get organisation by slug
 */
export async function getOrgBySlug(slug: string): Promise<OrganisationRead> {
  const { data } = await api.get<OrganisationRead>(`/organisations/by-slug/${slug}`);
  return data;
}

/**
 * Get organisation by ID
 */
export async function getOrg(orgId: string): Promise<OrganisationRead> {
  const { data } = await api.get<OrganisationRead>(`/organisations/${orgId}`);
  return data;
}

/**
 * Update organisation
 */
export async function updateOrg(
  orgId: string,
  data: OrganisationUpdate
): Promise<OrganisationRead> {
  const { data: response } = await api.patch<OrganisationRead>(
    `/organisations/${orgId}`,
    data
  );
  return response;
}

/**
 * Delete organisation
 */
export async function deleteOrg(orgId: string): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/organisations/${orgId}`);
  return data;
}

/**
 * List organisation members
 */
export async function listMembers(orgId: string): Promise<OrgMemberRead[]> {
  const { data } = await api.get<OrgMemberRead[]>(`/organisations/${orgId}/members`);
  return data;
}

/**
 * Change member role
 */
export async function changeMemberRole(
  orgId: string,
  userId: string,
  data: OrgMemberUpdate
): Promise<OrgMemberRead> {
  const { data: response } = await api.patch<OrgMemberRead>(
    `/organisations/${orgId}/members/${userId}`,
    data
  );
  return response;
}

/**
 * Remove member from organisation
 */
export async function removeMember(
  orgId: string,
  userId: string
): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(
    `/organisations/${orgId}/members/${userId}`
  );
  return data;
}

/**
 * Transfer ownership to another member
 */
export async function transferOwnership(
  orgId: string,
  data: TransferOwnershipRequest
): Promise<GenericMessageResponse> {
  const { data: response } = await api.post<GenericMessageResponse>(
    `/organisations/${orgId}/transfer-ownership`,
    data
  );
  return response;
}
