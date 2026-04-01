'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OtpForm } from '@/components/auth';
import { getErrorMessage } from '@/lib/api/axios';
import * as authApi from '@/lib/api/auth';

type VerificationStep = 'method_selection' | 'otp_verification' | 'check_email' | 'success';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [step, setStep] = useState<VerificationStep>('method_selection');

  // Request verification mutation
  const requestVerificationMutation = useMutation({
    mutationFn: (method: 'magic_link' | 'otp_code') =>
      authApi.requestVerification({ email, method }),
    onSuccess: (_, method) => {
      if (method === 'magic_link') {
        setStep('check_email');
      } else {
        setStep('otp_verification');
      }
      toast.success('Verification code sent! Check your email.');
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to send verification code');
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (code: string) => authApi.verifyOtp({ email, code, purpose: 'verify' }),
    onSuccess: () => {
      setStep('success');
      toast.success('Email verified successfully!');
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Invalid verification code');
    },
  });

  // Resend magic link mutation
  const resendMagicLinkMutation = useMutation({
    mutationFn: () => authApi.resendMagicLink({ email, purpose: 'verify' }),
    onSuccess: () => {
      toast.success('Verification link sent! Check your email.');
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Failed to resend verification link');
    },
  });

  const handleMethodSelect = (method: 'magic_link' | 'otp_code') => {
    requestVerificationMutation.mutate(method);
  };

  const handleOtpSubmit = async (code: string) => {
    await verifyOtpMutation.mutateAsync(code);
  };

  const handleResend = async () => {
    await resendMagicLinkMutation.mutateAsync();
  };

  if (step === 'success') {
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={1.5} />
        </div>
        <h2 className="text-h2 font-semibold text-ink mb-2">Email Verified!</h2>
        <p className="text-body-md text-muted mb-4">Your account has been verified successfully.</p>
        <p className="text-caption text-muted">Redirecting to login...</p>
      </Card>
    );
  }

  if (step === 'otp_verification') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep('method_selection')}>
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </Button>
          <div>
            <h1 className="text-h2 font-semibold text-ink">Verify your email</h1>
            <p className="text-body-md text-muted">Enter the 6-digit code sent to your email</p>
          </div>
        </div>

        <OtpForm
          email={email}
          purpose="verify"
          onSubmit={handleOtpSubmit}
          onResend={async () => { await requestVerificationMutation.mutateAsync('otp_code'); }}
          isLoading={verifyOtpMutation.isPending}
          isResending={requestVerificationMutation.isPending}
          error={verifyOtpMutation.error}
        />
      </div>
    );
  }

  if (step === 'check_email') {
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface mb-4">
          <Mail className="h-8 w-8 text-charcoal" strokeWidth={1.5} />
        </div>
        <h2 className="text-h2 font-semibold text-ink mb-2">Check your email</h2>
        <p className="text-body-md text-muted mb-4">
          We&apos;ve sent a verification link to
          <br />
          <span className="font-medium text-ink">{email}</span>
        </p>
        <p className="text-caption text-muted mb-6">
          Click the link in your email to verify your account and proceed to login.
        </p>
        <div className="space-y-3">
          <Button
            onClick={handleResend}
            disabled={resendMagicLinkMutation.isPending}
            variant="outline"
            className="w-full"
          >
            {resendMagicLinkMutation.isPending ? 'Sending...' : 'Resend verification link'}
          </Button>
          <Button
            onClick={() => setStep('method_selection')}
            variant="ghost"
            className="w-full"
          >
            Try a different method
          </Button>
        </div>
      </Card>
    );
  }

  // Default: method selection
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/auth/login')}>
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Button>
        <div>
          <h1 className="text-h2 font-semibold text-ink">Verify your email</h1>
          <p className="text-body-md text-muted">Choose how to verify your email address</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-h4 font-medium mb-2">Email verification required</h3>
          <p className="text-body-sm text-muted mb-4">
            Your email <span className="font-medium text-ink">{email}</span> needs to be verified before you can sign in.
          </p>
          <p className="text-body-sm text-muted">
            Choose your preferred verification method:
          </p>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={() => handleMethodSelect('otp_code')}
            disabled={requestVerificationMutation.isPending}
            className="w-full"
          >
            {requestVerificationMutation.isPending ? 'Sending...' : 'Send verification code (OTP)'}
          </Button>
          <Button
            onClick={() => handleMethodSelect('magic_link')}
            disabled={requestVerificationMutation.isPending}
            variant="outline"
            className="w-full"
          >
            {requestVerificationMutation.isPending ? 'Sending...' : 'Send verification link'}
          </Button>
        </div>
      </div>
    </div>
  );
}
