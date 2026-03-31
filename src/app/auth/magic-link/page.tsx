/**
 * Magic Link Page
 * Handles magic link token verification from URL
 * Reads ?token= and verifies with API
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/axios';
import { MagicLinkHandler } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Check } from 'lucide-react';
import * as authApi from '@/lib/api/auth';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/lib/stores';
import type { DetectPathOrg } from '@/lib/types';
import { cn } from '@/lib/utils';

type MagicLinkStep = 'verifying' | 'select_org' | 'pending_approval';

export default function MagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<MagicLinkStep>('verifying');
  const [orgs, setOrgs] = useState<DetectPathOrg[]>([]);
  const [tempToken, setTempToken] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<DetectPathOrg | null>(null);

  // Handle org selection callback
  const handleOrgSelection = (orgList: DetectPathOrg[], token: string) => {
    setOrgs(orgList);
    setTempToken(token);
    setStep('select_org');
  };

  // Handle pending approval callback
  const handlePendingApproval = () => {
    setStep('pending_approval');
  };

  // Select org mutation
  const selectOrgMutation = useMutation({
    mutationFn: (orgId: string) => authApi.selectOrg({ org_id: orgId }, tempToken),
    onSuccess: async (response) => {
      try {
        const [user, authInfo] = await Promise.all([
          api.get('/users/me', { headers: { Authorization: `Bearer ${response.access_token}` } }).then(res => res.data),
          api.get('/auth/me', { headers: { Authorization: `Bearer ${response.access_token}` } }).then(res => res.data),
        ]);

        setAuth({
          user,
          org: {
            id: authInfo.org_id,
            name: response.org.name,
            slug: response.org.slug,
          },
          role: authInfo.role,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        });

        if (!user.profile_completed) {
          router.push('/auth/complete-profile');
        } else {
          router.push('/dashboard');
        }
      } catch {
        toast.error('Failed to complete sign in');
      }
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to select organisation');
    },
  });

  const handleOrgSelect = async () => {
    if (!selectedOrg) return;
    await selectOrgMutation.mutateAsync(selectedOrg.id || selectedOrg.slug);
  };

  const handleBack = () => {
    router.push('/auth/login');
  };

  // Render org selection
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

  // Render pending approval
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

  // Default: verifying magic link
  return (
    <MagicLinkHandler
      onOrgSelection={handleOrgSelection}
      onPendingApproval={handlePendingApproval}
    />
  );
}
