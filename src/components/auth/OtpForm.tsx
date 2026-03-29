/**
 * OtpForm
 * 6-digit OTP verification form
 * Used for both signup and signin verification
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { otpSchema, type OtpInput } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';

interface OtpFormProps {
  email: string;
  purpose: 'signup' | 'signin';
  onSubmit: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  isResending?: boolean;
  error?: Error | null;
}

const RESEND_COOLDOWN = 60; // seconds

/**
 * OTP verification form component
 * 6-digit code entry with resend functionality
 */
export function OtpForm({
  email,
  purpose,
  onSubmit,
  onResend,
  isLoading,
  isResending,
  error,
}: OtpFormProps) {
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  const codeValue = watch('code');

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (codeValue?.length === 6 && /^\d{6}$/.test(codeValue)) {
      handleSubmit(handleFormSubmit)();
    }
  }, [codeValue]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleFormSubmit = async (data: OtpInput) => {
    await onSubmit(data.code);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await onResend();
    setResendCooldown(RESEND_COOLDOWN);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-body-md text-muted">
          We sent a verification code to
        </p>
        <p className="text-body-md font-medium text-ink">{email}</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : 'Invalid code. Please try again.'
            }
          />
        )}

        <div className="space-y-2">
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            autoComplete="one-time-code"
            autoFocus
            {...register('code')}
            aria-invalid={!!errors.code}
            disabled={isLoading}
            className="text-center text-h3 tracking-widest"
          />
          {errors.code && (
            <p className="text-caption text-red-600 text-center">
              {errors.code.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || codeValue?.length !== 6}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Verifying...
            </>
          ) : (
            <>
              Verify
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-caption text-muted mb-2">
          {"Didn't receive the code?"}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
        >
          {isResending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            `Resend in ${resendCooldown}s`
          ) : (
            <>
              <RotateCcw className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Resend code
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default OtpForm;
