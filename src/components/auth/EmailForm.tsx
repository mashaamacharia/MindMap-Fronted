/**
 * EmailForm
 * Email entry form for detect-path auth flow
 * First step in passwordless authentication
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { emailSchema, type EmailInput } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';

interface EmailFormProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Email entry form component
 * Collects email address for detect-path authentication flow
 */
export function EmailForm({ onSubmit, isLoading, error }: EmailFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: EmailInput) => {
    await onSubmit(data.email);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.'
          }
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          autoFocus
          {...register('email')}
          aria-invalid={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-caption text-red-600">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Checking...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </>
        )}
      </Button>
    </form>
  );
}

export default EmailForm;
