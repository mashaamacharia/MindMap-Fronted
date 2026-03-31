/**
 * SigninMethodForm
 * Method selection for returning users (magic link or OTP)
 */

'use client';

import { useState } from 'react';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

type SigninMethod = 'magic_link' | 'otp_code';

interface SigninMethodFormProps {
  email: string;
  onSubmit: (method: SigninMethod) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Signin method selection component
 * Allows returning users to choose between magic link or OTP
 */
export function SigninMethodForm({
  email,
  onSubmit,
  isLoading,
  error,
}: SigninMethodFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<SigninMethod | null>(null);

  const handleSubmit = async () => {
    if (!selectedMethod) return;
    await onSubmit(selectedMethod);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-body-md text-muted">
          Welcome back
        </p>
        <p className="text-body-lg font-medium text-ink">{email}</p>
      </div>

      {error && (
        <ErrorMessage error={error ?? 'Failed to send signin. Please try again.'} />
      )}

      <div className="space-y-3">
        <p className="text-body-md text-muted text-center">
          How would you like to sign in?
        </p>

        <Card
          className={cn(
            'p-4 cursor-pointer transition-all',
            selectedMethod === 'magic_link'
              ? 'border-ink bg-surface'
              : 'hover:border-muted'
          )}
          onClick={() => setSelectedMethod('magic_link')}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedMethod === 'magic_link' ? 'bg-ink text-surface' : 'bg-canvas text-muted'
            )}>
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-body-md font-medium">Magic link</p>
              <p className="text-caption text-muted">
                {"We'll send you a link to sign in instantly"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={cn(
            'p-4 cursor-pointer transition-all',
            selectedMethod === 'otp_code'
              ? 'border-ink bg-surface'
              : 'hover:border-muted'
          )}
          onClick={() => setSelectedMethod('otp_code')}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedMethod === 'otp_code' ? 'bg-ink text-surface' : 'bg-canvas text-muted'
            )}>
              <KeyRound className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-body-md font-medium">One-time code</p>
              <p className="text-caption text-muted">
                {"We'll send you a 6-digit code to enter"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={!selectedMethod || isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Sending...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </>
        )}
      </Button>
    </div>
  );
}

export default SigninMethodForm;
