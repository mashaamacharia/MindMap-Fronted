/**
 * Analyze API Functions
 * AI analysis endpoints
 * 
 * CRITICAL: challenge_id is sent as a query param, not a request body
 */

import api from './axios';
import type { ArtifactRead, ArtifactStatusResponse } from '@/lib/types';

/**
 * Trigger AI analysis for a challenge
 * IMPORTANT: challenge_id is a QUERY PARAM, not body
 */
export async function analyze(challengeId: string): Promise<ArtifactRead> {
  const { data } = await api.post<ArtifactRead>(
    `/analyze/?challenge_id=${encodeURIComponent(challengeId)}`
  );
  return data;
}

/**
 * Get analysis status
 */
export async function getAnalyzeStatus(artifactId: string): Promise<ArtifactStatusResponse> {
  const { data } = await api.get<ArtifactStatusResponse>(`/analyze/status/${artifactId}`);
  return data;
}

/**
 * Re-analyze an existing artifact
 */
export async function reanalyze(artifactId: string): Promise<ArtifactRead> {
  const { data } = await api.post<ArtifactRead>(`/analyze/reanalyze/${artifactId}`);
  return data;
}
