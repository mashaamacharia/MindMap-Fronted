/**
 * Login Page
 * Email entry + detect-path authentication flow
 * 
 * Flow:
 * 1. User enters email → POST /api/v1/auth/detect-path
 * 2. Based on response:
 *    - 'owner_signup' → Show SignupForm
 *    - 'returning_user' → Show SigninMethodForm
 *    - 'invited_member' → Show AcceptInvitationForm
 *    - 'join_request' → Show SignupAndRequestForm
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/axios';
import {
  EmailForm,
  SignupForm,
  SignupAndRequestForm,
  SigninMethodForm,
  AcceptInvitationForm,
} from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import * as authApi from '@/lib/api/auth';
import type {
  DetectPathResponse,
  SignupRequest,
  SignupAndRequest,
  AcceptInvitationRequest,
} from '@/lib/types';
import type {
  SignupInput,
  SignupAndRequestInput,
  AcceptInvitationInput,
} from '@/lib/schemas';

type AuthStep = 
  | 'email'
  | 'owner_signup'
  | 'returning_user'
  | 'invited_member'
  | 'join_request'
  | 'check_email';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const nextUrl = searchParams.get('next') || '/dashboard';

  const [step, setStep] = useState<AuthStep>(token ? 'invited_member' : 'email');
  const [email, setEmail] = useState('');
  const [detectPathData, setDetectPathData] = useState<DetectPathResponse | null>(null);

  // Detect path mutation
  const detectPathMutation = useMutation({
    mutationFn: (email: string) => authApi.detectPath({ email }),
    onSuccess: (data) => {
      setDetectPathData(data);
      setStep(data.path);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to check email');
    },
  });

  // Signup mutation (owner_signup)
  const signupMutation = useMutation({
    mutationFn: (data: SignupInput) => authApi.signup(data),
    onSuccess: () => {
      router.push(`/auth/verify?email=${encodeURIComponent(email)}&purpose=signup`);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to create account');
    },
  });

  // Signup and request mutation (join_request)
  const signupAndRequestMutation = useMutation({
    mutationFn: (data: SignupAndRequestInput) => authApi.signupAndRequest(data),
    onSuccess: () => {
      router.push(`/auth/verify?email=${encodeURIComponent(email)}&purpose=signup`);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to submit request');
    },
  });

  // Request signin mutation (returning_user)
  const requestSigninMutation = useMutation({
    mutationFn: (method: 'magic_link' | 'otp_code') =>
      authApi.requestSignin({ email, method }),
    onSuccess: (_, method) => {
      if (method === 'magic_link') {
        setStep('check_email');
      } else {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}&purpose=signin`);
      }
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to send signin');
    },
  });

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: (data: AcceptInvitationInput) => authApi.acceptInvitation(data),
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to accept invitation');
    },
  });

  // Handlers
  const handleEmailSubmit = async (emailValue: string) => {
    setEmail(emailValue);
    await detectPathMutation.mutateAsync(emailValue);
  };

  const handleSignupSubmit = async (data: SignupRequest) => {
    await signupMutation.mutateAsync(data);
  };

  const handleSignupAndRequestSubmit = async (data: SignupAndRequest) => {
    await signupAndRequestMutation.mutateAsync(data);
  };

  const handleSigninMethodSubmit = async (method: 'magic_link' | 'otp_code') => {
    await requestSigninMutation.mutateAsync(method);
  };

  const handleAcceptInvitationSubmit = async (data: AcceptInvitationRequest) => {
    await acceptInvitationMutation.mutateAsync(data);
  };

  const handleBack = () => {
    setStep('email');
    setEmail('');
    setDetectPathData(null);
  };

  // Render based on current step
  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-h2 font-semibold text-ink">Sign in to M1NDMAP11</h1>
              <p className="text-body-md text-muted mt-2">
                Enter your email to continue
              </p>
            </div>
            <EmailForm
              onSubmit={handleEmailSubmit}
              isLoading={detectPathMutation.isPending}
              error={detectPathMutation.error}
            />
          </div>
        );

      case 'owner_signup':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </Button>
              <div>
                <h1 className="text-h2 font-semibold text-ink">Create your account</h1>
                <p className="text-body-md text-muted">
                  Set up your organisation on M1NDMAP11
                </p>
              </div>
            </div>
            <SignupForm
              email={email}
              onSubmit={handleSignupSubmit}
              isLoading={signupMutation.isPending}
              error={signupMutation.error}
            />
          </div>
        );

      case 'returning_user':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </Button>
              <div>
                <h1 className="text-h2 font-semibold text-ink">Welcome back</h1>
                <p className="text-body-md text-muted">
                  Choose how to sign in
                </p>
              </div>
            </div>
            <SigninMethodForm
              email={email}
              onSubmit={handleSigninMethodSubmit}
              isLoading={requestSigninMutation.isPending}
              error={requestSigninMutation.error}
            />
          </div>
        );

      case 'join_request':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </Button>
              <div>
                <h1 className="text-h2 font-semibold text-ink">Join organisation</h1>
                <p className="text-body-md text-muted">
                  Request access to your team
                </p>
              </div>
            </div>
            {detectPathData?.org && (
              <SignupAndRequestForm
                email={email}
                org={detectPathData.org}
                onSubmit={handleSignupAndRequestSubmit}
                isLoading={signupAndRequestMutation.isPending}
                error={signupAndRequestMutation.error}
              />
            )}
          </div>
        );

      case 'invited_member':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-h2 font-semibold text-ink">Accept invitation</h1>
              <p className="text-body-md text-muted">
                Complete your profile to join
              </p>
            </div>
            {detectPathData?.org && detectPathData?.invitation && token && (
              <AcceptInvitationForm
                inviteToken={token}
                orgName={detectPathData.org.name}
                role={detectPathData.invitation.role}
                invitedByName={detectPathData.invitation.invited_by_name}
                onSubmit={handleAcceptInvitationSubmit}
                isLoading={acceptInvitationMutation.isPending}
                error={acceptInvitationMutation.error}
              />
            )}
          </div>
        );

      case 'check_email':
        return (
          <Card className="p-6 text-center">
            <h2 className="text-h2 font-semibold text-ink">Check your email</h2>
            <p className="text-body-md text-muted mt-2">
              We sent a magic link to
            </p>
            <p className="text-body-md font-medium text-ink">{email}</p>
            <p className="text-caption text-muted mt-4">
              Click the link in your email to sign in. The link expires in 15 minutes.
            </p>
            <Button
              variant="ghost"
              className="mt-6"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Try a different email
            </Button>
          </Card>
        );

      default:
        return null;
    }
  };

  return <div className="w-full">{renderStep()}</div>;
}
