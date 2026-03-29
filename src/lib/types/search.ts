/**
 * Search Types
 * Search result interfaces
 */

export interface SearchResultItem {
  id: string;
  type: 'artifact' | 'project' | 'knowledge';
  title: string;
  excerpt: string;
  domain_code: string | null;
  relevance: number;
  created_at: string;
  status?: string | null;
  project_id?: string | null;
  project_title?: string | null;
  artifact_count?: number | null;
  published_at?: string | null;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: Record<string, SearchResultItem[]>;
}

export interface SearchParams {
  q: string;
  types?: string;
  domain?: string | null;
  limit?: number;
}
