/**
 * Domains Hook
 * TanStack Query hooks for decision domains
 * 
 * IMPORTANT: Use this for domain filter tabs, domain selects, domain badges.
 * Never hardcode domain values.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import * as domainsApi from '@/lib/api/domains';

export const domainKeys = {
  all: ['domains'] as const,
  detail: (id: string) => [...domainKeys.all, id] as const,
  knowledge: (id: string) => [...domainKeys.all, id, 'knowledge'] as const,
};

/**
 * Hook to get all decision domains
 * staleTime: 10 minutes
 */
export function useDomains() {
  return useQuery({
    queryKey: domainKeys.all,
    queryFn: () => domainsApi.listDomains(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get a single domain by ID
 */
export function useDomain(domainId: string | undefined) {
  return useQuery({
    queryKey: domainKeys.detail(domainId ?? ''),
    queryFn: () => domainsApi.getDomain(domainId!),
    enabled: !!domainId,
  });
}

/**
 * Hook to get knowledge items for a domain
 */
export function useDomainKnowledge(domainId: string | undefined) {
  return useQuery({
    queryKey: domainKeys.knowledge(domainId ?? ''),
    queryFn: () => domainsApi.getDomainKnowledge(domainId!),
    enabled: !!domainId,
  });
}
