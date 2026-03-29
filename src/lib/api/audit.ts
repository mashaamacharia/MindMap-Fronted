/**
 * Audit API Functions
 * Audit log endpoints
 */

import api from './axios';
import type { AuditLogRead, AuditLogParams, PaginatedResponse } from '@/lib/types';

/**
 * List audit logs
 */
export async function listAuditLogs(
  params?: AuditLogParams
): Promise<PaginatedResponse<AuditLogRead>> {
  const { data } = await api.get<PaginatedResponse<AuditLogRead>>('/audit/', {
    params: {
      user_id: params?.user_id,
      action: params?.action,
      resource_type: params?.resource_type,
      from_date: params?.from_date,
      to_date: params?.to_date,
      page: params?.page ?? 1,
      limit: params?.limit ?? 25,
    },
  });
  return data;
}
