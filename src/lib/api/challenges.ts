/**
 * Challenges API Functions
 */

import api from './axios';
import type {
  ChallengeRead,
  ChallengeCreate,
  PaginatedResponse,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * List challenges
 */
export async function listChallenges(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<ChallengeRead>> {
  const { data } = await api.get<PaginatedResponse<ChallengeRead>>('/challenges/', {
    params: { page, limit },
  });
  return data;
}

/**
 * Create a new challenge
 */
export async function createChallenge(payload: ChallengeCreate): Promise<ChallengeRead> {
  const { data } = await api.post<ChallengeRead>('/challenges/', payload);
  return data;
}

/**
 * Get a single challenge by ID
 */
export async function getChallenge(challengeId: string): Promise<ChallengeRead> {
  const { data } = await api.get<ChallengeRead>(`/challenges/${challengeId}`);
  return data;
}

/**
 * Delete a challenge
 */
export async function deleteChallenge(
  challengeId: string
): Promise<GenericMessageResponse> {
  const { data } = await api.delete<GenericMessageResponse>(`/challenges/${challengeId}`);
  return data;
}
