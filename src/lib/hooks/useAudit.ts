/**
 * Audit Hooks
 * TanStack Query hooks for audit logs
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import * as auditApi from '@/lib/api/audit';
import type { AuditLogParams } from '@/lib/types';

export const auditKeys = {
  all: ['audit'] as const,
  list: (params?: AuditLogParams) => [...auditKeys.all, 'list', params] as const,
};

/**
 * Hook to get audit logs
 */
export function useAuditLogs(params?: AuditLogParams) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditApi.listAuditLogs(params),
  });
}
