/**
 * Constants API Functions
 * 
 * IMPORTANT: All dropdown options MUST be fetched from this API.
 * Never hardcode seniority levels, functions, org sizes, markets, or plans.
 */

import api from './axios';
import type { ConstantsResponse } from '@/lib/types';

/**
 * Get all application constants
 * Returns seniority levels, primary functions, org sizes, primary markets, org plans
 * No auth required
 */
export async function getConstants(): Promise<ConstantsResponse> {
  const { data } = await api.get<ConstantsResponse>('/constants/');
  return data;
}
