/**
 * Verify Page
 * OTP verification for signup and signin
 * 
 * Response handling:
 * - Has access_token → setAuth() → if !profile_completed → /auth/complete-profile else /dashboard
 * - Has requires_org_selection → show org list → POST /api/v1/auth/select-org
 * - Has status: 'pending_approval' → show "Your request is pending admin approval."
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OtpForm } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Check } from 'lucide-react';
import * as authApi from '@/lib/api/auth';
import { getUserMe } from '@/lib/api/users';
import { getMe } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores';
import type { DetectPathOrg, VerifyOtpResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

type VerifyStep = 'otp' | 'select_org' | 'pending_approval';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const purpose = (searchParams.get('purpose') as 'signup' | 'signin') || 'signin';

  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<VerifyStep>('otp');
  const [orgs, setOrgs] = useState<DetectPathOrg[]>([]);
  const [tempToken, setTempToken] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<DetectPathOrg | null>(null);

  // Handle successful auth
  const handleAuthSuccess = async (accessToken: string, refreshToken?: string | null) => {
    try {
      // Fetch user details and auth info
      const [user, authInfo] = await Promise.all([
        getUserMe(),
        getMe(),
      ]);

      // Set auth state
      setAuth({
        user,
        org: {
          id: authInfo.org_id,
          name: '', // Will be fetched separately if needed
          slug: '',
        },
        role: authInfo.role,
        accessToken,
        refreshToken,
      });

      // Redirect based on profile completion
      if (!user.profile_completed) {
        router.push('/auth/complete-profile');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to complete sign in');
    }
  };

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (code: string) =>
      authApi.verifyOtp({ email, code, purpose }),
    onSuccess: async (response: VerifyOtpResponse) => {
      // Check response type
      if ('requires_org_selection' in response && response.requires_org_selection) {
        // Multiple orgs - need selection
        setOrgs(response.orgs);
        setTempToken(response.temp_token);
        setStep('select_org');
        return;
      }

      if ('status' in response && response.status === 'pending_approval') {
        // Join request pending
        setStep('pending_approval');
        return;
      }

      // Success - has access_token
      if ('access_token' in response) {
        await handleAuthSuccess(response.access_token, response.refresh_token);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid code');
    },
  });

  // Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: () => authApi.resendOtp({ email, purpose }),
    onSuccess: () => {
      toast.success('Code sent! Check your email.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resend code');
    },
  });

  // Select org mutation
  const selectOrgMutation = useMutation({
    mutationFn: (orgId: string) => authApi.selectOrg({ org_id: orgId }, tempToken),
    onSuccess: async (response) => {
      await handleAuthSuccess(response.access_token, response.refresh_token);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to select organisation');
    },
  });

  // Handlers
  const handleOtpSubmit = async (code: string) => {
    await verifyOtpMutation.mutateAsync(code);
  };

  const handleResend = async () => {
    await resendOtpMutation.mutateAsync();
  };

  const handleOrgSelect = async () => {
    if (!selectedOrg) return;
    await selectOrgMutation.mutateAsync(selectedOrg.id || selectedOrg.slug);
  };

  const handleBack = () => {
    router.push('/auth/login');
  };

  // Render based on current step
  if (!email) {
    return (
      <Card className="p-6 text-center">
        <p className="text-body-md text-muted">No email provided</p>
        <Button className="mt-4" onClick={handleBack}>
          Back to login
        </Button>
      </Card>
    );
  }

  if (step === 'select_org') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-h2 font-semibold text-ink">Select organisation</h1>
          <p className="text-body-md text-muted mt-2">
            You belong to multiple organisations. Choose one to continue.
          </p>
        </div>

        <div className="space-y-3">
          {orgs.map((org) => (
            <Card
              key={org.slug}
              className={cn(
                'p-4 cursor-pointer transition-all',
                selectedOrg?.slug === org.slug
                  ? 'border-ink bg-surface'
                  : 'hover:border-muted'
              )}
              onClick={() => setSelectedOrg(org)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-md font-medium">{org.name}</p>
                  <p className="text-caption text-muted">{org.industry}</p>
                </div>
                {selectedOrg?.slug === org.slug && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink">
                    <Check className="h-4 w-4 text-surface" strokeWidth={2} />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button
          className="w-full"
          onClick={handleOrgSelect}
          disabled={!selectedOrg || selectOrgMutation.isPending}
        >
          {selectOrgMutation.isPending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Continuing...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    );
  }

  if (step === 'pending_approval') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-h2 font-semibold text-ink">Your request is with the team.</h2>
        <p className="text-caption text-muted mt-6 max-w-sm">
          {"You'll hear back once an admin approves your access."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Button>
        <div>
          <h1 className="text-h2 font-semibold text-ink">Verify your email</h1>
          <p className="text-body-md text-muted">
            Enter the code we sent you
          </p>
        </div>
      </div>

      <OtpForm
        email={email}
        purpose={purpose}
        onSubmit={handleOtpSubmit}
        onResend={handleResend}
        isLoading={verifyOtpMutation.isPending}
        isResending={resendOtpMutation.isPending}
        error={verifyOtpMutation.error}
      />
    </div>
  );
}
