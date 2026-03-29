/**
 * Constants Hook
 * TanStack Query hooks for fetching application constants
 * 
 * IMPORTANT: Always use this hook for dropdown options.
 * Never hardcode seniority levels, functions, org sizes, markets, or plans.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import * as constantsApi from '@/lib/api/constants';

export const constantKeys = {
  all: ['constants'] as const,
};

/**
 * Hook to get all application constants
 * staleTime: Infinity - constants rarely change
 */
export function useConstants() {
  return useQuery({
    queryKey: constantKeys.all,
    queryFn: () => constantsApi.getConstants(),
    staleTime: Infinity,
  });
}
