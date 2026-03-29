/**
 * Knowledge Types
 * Knowledge items and decision domains
 */

import type { KnowledgeItemStatus } from './roles';

export interface KnowledgeItemRead {
  id: string;
  title: string;
  body: string;
  summary: string;
  domain_id: string;
  domain_code?: string | null;
  status: KnowledgeItemStatus;
  created_by: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  creator_name?: string | null;
}

export interface KnowledgeItemCreate {
  title: string;
  body: string;
  summary: string;
  domain_id: string;
}

export interface KnowledgeItemUpdate {
  title?: string | null;
  body?: string | null;
  summary?: string | null;
  domain_id?: string | null;
}

export interface DecisionDomainRead {
  id: string;
  code: string;
  title: string;
  description: string;
  display_order: number;
}

// Re-export KnowledgeItemStatus from roles for convenience
export type { KnowledgeItemStatus } from './roles';
