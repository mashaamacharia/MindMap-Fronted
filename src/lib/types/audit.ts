/**
 * Audit Types
 * Audit log interfaces
 */

export interface AuditLogRead {
  id: string;
  org_id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user_name?: string | null;
}

export interface AuditLogParams {
  user_id?: string;
  action?: string;
  resource_type?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}
