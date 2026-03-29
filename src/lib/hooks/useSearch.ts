/**
 * Search Hook
 * TanStack Query hook for global search
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import * as searchApi from '@/lib/api/search';
import type { SearchParams } from '@/lib/types';

export const searchKeys = {
  all: ['search'] as const,
  query: (params: SearchParams) => [...searchKeys.all, params] as const,
};

/**
 * Hook for global search
 * Only enabled when q.length >= 2
 * staleTime: 30 seconds
 */
export function useSearch(params: SearchParams, enabled = true) {
  const isValidQuery = params.q.length >= 2;

  return useQuery({
    queryKey: searchKeys.query(params),
    queryFn: () => searchApi.search(params),
    enabled: enabled && isValidQuery,
    staleTime: 30 * 1000, // 30 seconds
  });
}
