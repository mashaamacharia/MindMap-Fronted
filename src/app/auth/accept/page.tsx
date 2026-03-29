/**
 * Accept Invitation Page
 * Reads ?token= from URL and renders AcceptInvitationForm
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AcceptInvitationForm } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import * as authApi from '@/lib/api/auth';
import { getUserMe } from '@/lib/api/users';
import { getMe } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores';
import type { DetectPathResponse, AcceptInvitationRequest } from '@/lib/types';
import type { AcceptInvitationInput } from '@/lib/schemas';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { setAuth } = useAuthStore();
  const [invitationData, setInvitationData] = useState<DetectPathResponse | null>(null);

  // For now, we'll show the form directly since we have the token
  // In a real implementation, you might want to validate the token first

  // Accept invitation mutation
  const acceptMutation = useMutation({
    mutationFn: (data: AcceptInvitationInput) => authApi.acceptInvitation(data),
    onSuccess: async (response) => {
      try {
        // Fetch user details
        const [user, authInfo] = await Promise.all([
          getUserMe(),
          getMe(),
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

        toast.success('Welcome! You have joined the organisation.');
        router.push('/dashboard');
      } catch {
        toast.error('Failed to complete setup');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to accept invitation');
    },
  });

  const handleSubmit = async (data: AcceptInvitationInput) => {
    await acceptMutation.mutateAsync(data);
  };

  const handleBack = () => {
    router.push('/auth/login');
  };

  if (!token) {
    return (
      <Card className="p-6">
        <ErrorMessage error="No invitation token provided." />
        <Button className="mt-4 w-full" onClick={handleBack}>
          Back to login
        </Button>
      </Card>
    );
  }

  // For MVP, show a simplified version without pre-fetching invitation details
  // The AcceptInvitationForm will handle the submission
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-semibold text-ink">Accept invitation</h1>
        <p className="text-body-md text-muted mt-2">
          Complete your profile to join the organisation
        </p>
      </div>

      <AcceptInvitationForm
        inviteToken={token}
        orgName="Your Organisation" // Would come from invitation validation
        role="member" // Would come from invitation validation
        invitedByName="Admin" // Would come from invitation validation
        onSubmit={handleSubmit}
        isLoading={acceptMutation.isPending}
        error={acceptMutation.error}
      />
    </div>
  );
}
