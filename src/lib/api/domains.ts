/**
 * Domains API Functions
 * Decision domain endpoints
 */

import api from './axios';
import type { DecisionDomainRead, KnowledgeItemRead } from '@/lib/types';

/**
 * List all decision domains
 */
export async function listDomains(): Promise<DecisionDomainRead[]> {
  const { data } = await api.get<DecisionDomainRead[]>('/domains/');
  return data;
}

/**
 * Get domain by ID
 */
export async function getDomain(domainId: string): Promise<DecisionDomainRead> {
  const { data } = await api.get<DecisionDomainRead>(`/domains/${domainId}`);
  return data;
}

/**
 * Get knowledge items for a domain
 */
export async function getDomainKnowledge(domainId: string): Promise<KnowledgeItemRead[]> {
  const { data } = await api.get<KnowledgeItemRead[]>(`/domains/${domainId}/knowledge`);
  return data;
}
