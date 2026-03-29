/**
 * Auth Hooks
 * TanStack Query hooks for passwordless authentication
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import * as authApi from '@/lib/api/auth';
import * as usersApi from '@/lib/api/users';
import type { UserUpdate } from '@/lib/types';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

/**
 * Hook to get current auth info (user_id, org_id, role, email)
 */
export function useAuthMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getMe(),
    retry: false,
  });
}

/**
 * Hook to get current user profile
 */
export function useMe() {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const user = await usersApi.getUserMe();
      setUser(user);
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update current user profile
 */
export function useUpdateMe() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserUpdate) => usersApi.updateUserMe(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(authKeys.user(), updatedUser);
    },
  });
}

/**
 * Hook to complete user profile
 */
export function useCompleteProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserUpdate) => usersApi.completeProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(authKeys.user(), updatedUser);
      router.push('/dashboard');
    },
  });
}

/**
 * Hook to delete current user account
 */
export function useDeleteMe() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => usersApi.deleteUserMe(),
    onSuccess: () => {
      clearAuth();
      router.push('/');
    },
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push('/auth/login');
    },
    onError: () => {
      // Even if the API call fails, clear local state
      clearAuth();
      queryClient.clear();
      router.push('/auth/login');
    },
  });
}

/**
 * Hook for detect-path (email entry)
 */
export function useDetectPath() {
  return useMutation({
    mutationFn: (email: string) => authApi.detectPath({ email }),
  });
}

/**
 * Hook for requesting sign-in (magic link or OTP)
 */
export function useRequestSignin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; method: 'magic_link' | 'otp_code' }) =>
      authApi.requestSignin(data),
    onSuccess: (_, variables) => {
      if (variables.method === 'otp_code') {
        router.push(`/auth/verify?email=${encodeURIComponent(variables.email)}&purpose=signin`);
      }
      // For magic_link, stay on page and show "Check your email" message
    },
  });
}

/**
 * Hook for verifying OTP
 */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: { email: string; code: string; purpose: 'signup' | 'signin' }) =>
      authApi.verifyOtp(data),
  });
}

/**
 * Hook for resending OTP
 */
export function useResendOtp() {
  return useMutation({
    mutationFn: (data: { email: string; purpose: 'signup' | 'signin' }) =>
      authApi.resendOtp(data),
  });
}

/**
 * Hook for verifying magic link
 */
export function useVerifyMagicLink() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyMagicLink(token),
  });
}

/**
 * Hook for org owner signup
 */
export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (_, variables) => {
      router.push(`/auth/verify?email=${encodeURIComponent(variables.email)}&purpose=signup`);
    },
  });
}

/**
 * Hook for signup and request to join org
 */
export function useSignupAndRequest() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signupAndRequest,
    onSuccess: (_, variables) => {
      router.push(`/auth/verify?email=${encodeURIComponent(variables.email)}&purpose=signup`);
    },
  });
}

/**
 * Hook for accepting invitation
 */
export function useAcceptInvitation() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.acceptInvitation,
    onSuccess: async (response) => {
      // Fetch user details and set auth
      const [user, authInfo] = await Promise.all([
        usersApi.getUserMe(),
        authApi.getMe(),
      ]);

      setAuth({
        user,
        org: {
          id: authInfo.org_id,
          name: '',
          slug: '',
        },
        role: authInfo.role,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      });

      router.push('/dashboard');
    },
  });
}

/**
 * Hook for selecting org (multi-org users)
 */
export function useSelectOrg() {
  return useMutation({
    mutationFn: authApi.selectOrg,
  });
}
