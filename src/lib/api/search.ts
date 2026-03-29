/**
 * Search API Functions
 * Global search endpoint
 */

import api from './axios';
import type { SearchResponse, SearchParams } from '@/lib/types';

/**
 * Global search
 * IMPORTANT: q must be at least 2 characters
 */
export async function search(params: SearchParams): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>('/search/', {
    params: {
      q: params.q,
      types: params.types,
      domain: params.domain,
      limit: params.limit,
    },
  });
  return data;
}
