/**
 * MagicLinkHandler
 * Handles magic link token verification from URL
 * Reads ?token= param and verifies with API
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { verifyMagicLink } from '@/lib/api/auth';
import { api, getErrorMessage } from '@/lib/api/axios';
import { useAuthStore } from '@/lib/stores';
import type { VerifyOtpResponse, DetectPathOrg } from '@/lib/types';
import { SoundWave } from '@/components/ui/SoundWave';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

interface MagicLinkHandlerProps {
  onOrgSelection?: (orgs: DetectPathOrg[], tempToken: string) => void;
  onPendingApproval?: () => void;
}

/**
 * Magic link verification handler component
 * Processes token from URL and handles response variants
 */
export function MagicLinkHandler({
  onOrgSelection,
  onPendingApproval,
}: MagicLinkHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<Error | null>(null);
  const [stage, setStage] = useState<'verifying' | 'almost' | 'redirecting' | 'idle'>('verifying');

  const verifyMutation = useMutation({
    mutationFn: (token: string) => verifyMagicLink(token),
    onMutate: () => {
      setStage('verifying');
    },
    onSuccess: async (response: VerifyOtpResponse) => {
      // Check response type
      if ('requires_org_selection' in response && response.requires_org_selection) {
        // Multiple orgs - need selection
        onOrgSelection?.(response.orgs, response.temp_token);
        return;
      }

      if ('status' in response && response.status === 'pending_approval') {
        // Join request pending
        onPendingApproval?.();
        return;
      }

      // Check if this is a verification success (no access_token, just success message)
      if ('message' in response && !('access_token' in response)) {
        // Email verification successful
        setStage('idle');
        toast.success('Email verified successfully! You can now proceed to login.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
        return;
      }

      // Success - has access_token (normal signin flow)
      if ('access_token' in response) {
        try {
          // indicate we're finishing up, then fetch user details and auth info with the new token
          setStage('almost');
          const [user, authInfo] = await Promise.all([
            api.get('/users/me', {
              headers: { Authorization: `Bearer ${response.access_token}` }
            }).then(res => res.data),
            api.get('/auth/me', {
              headers: { Authorization: `Bearer ${response.access_token}` }
            }).then(res => res.data),
          ]);

          // Set auth state
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

          // Redirect based on profile completion
          setStage('redirecting');
          if (!user.profile_completed) {
            await router.push('/auth/complete-profile');
          } else {
            await router.push('/analyze');
          }
          setStage('idle');
        } catch (err) {
          const message = getErrorMessage(err);
          setError(new Error(message));
          setStage('idle');
        }
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      setError(new Error(message));
      setStage('idle');
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    } else {
      setError(new Error('No magic link token provided'));
    }
  }, [token]);

  if (!token) {
    return (
      <Card className="p-6">
        <ErrorMessage error="Invalid magic link. No token provided." />
        <Button
          className="mt-4 w-full"
          onClick={() => router.push('/auth/login')}
        >
          Back to login
        </Button>
      </Card>
    );
  }

  if (stage === 'verifying' || verifyMutation.isPending) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <SoundWave state="thinking" className="w-80 max-w-full" />
        <p className="text-body-md text-muted">Verifying your link...</p>
      </div>
    );
  }

  if (stage === 'almost') {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <SoundWave state="thinking" className="w-80 max-w-full" />
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <p className="text-body-md text-muted">Almost there — finishing sign in...</p>
        </div>
      </div>
    );
  }

  if (stage === 'redirecting') {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <Spinner size="lg" />
        <p className="text-body-md text-muted">Finalizing sign in ...</p>
      </div>
    );
  }

  if (error || verifyMutation.isError) {
    return (
      <Card className="p-6">
        <ErrorMessage
          error={
            error?.message ||
            (verifyMutation.error ? getErrorMessage(verifyMutation.error) : undefined) ||
            'Failed to verify magic link. It may have expired.'
          }
        />

        <Button
          className="mt-4 w-full"
          onClick={() => router.push('/auth/login')}
        >
          Back to login
        </Button>
      </Card>
    );
  }

  return null;
}

export default MagicLinkHandler;
