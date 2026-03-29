/**
 * AcceptInvitationForm
 * Form for accepting an organisation invitation
 * Uses useConstants() for dropdown options
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { acceptInvitationSchema, type AcceptInvitationInput } from '@/lib/schemas';
import { useConstants } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

interface AcceptInvitationFormProps {
  inviteToken: string;
  orgName: string;
  role: string;
  invitedByName: string;
  onSubmit: (data: AcceptInvitationInput) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Accept invitation form component
 * Collects user profile details for new member joining via invitation
 */
export function AcceptInvitationForm({
  inviteToken,
  orgName,
  role,
  invitedByName,
  onSubmit,
  isLoading,
  error,
}: AcceptInvitationFormProps) {
  const { data: constants, isLoading: constantsLoading } = useConstants();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AcceptInvitationInput>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      invite_token: inviteToken,
      full_name: '',
      job_title: '',
      seniority_level: undefined,
      primary_function: undefined,
      location: '',
    },
  });

  const handleFormSubmit = async (data: AcceptInvitationInput) => {
    await onSubmit(data);
  };

  if (constantsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invitation info */}
      <Card className="p-4 bg-canvas">
        <p className="text-body-md text-muted">
          You have been invited to join
        </p>
        <p className="text-h3 font-semibold text-ink">{orgName}</p>
        <p className="text-caption text-muted mt-2">
          Invited by {invitedByName} as {role}
        </p>
      </Card>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : 'Failed to accept invitation. Please try again.'
            }
          />
        )}

        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-body-lg font-medium">Your details</h3>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Jane Smith"
              autoComplete="name"
              {...register('full_name')}
              aria-invalid={!!errors.full_name}
              disabled={isLoading}
            />
            {errors.full_name && (
              <p className="text-caption text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Job title</Label>
            <Input
              id="job_title"
              type="text"
              placeholder="Chief Strategy Officer"
              {...register('job_title')}
              aria-invalid={!!errors.job_title}
              disabled={isLoading}
            />
            {errors.job_title && (
              <p className="text-caption text-red-600">{errors.job_title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniority_level">Seniority level</Label>
            <Select
              onValueChange={(value) =>
                setValue('seniority_level', value as AcceptInvitationInput['seniority_level'])
              }
              disabled={isLoading}
            >
              <SelectTrigger id="seniority_level" aria-invalid={!!errors.seniority_level}>
                <SelectValue placeholder="Select seniority level" />
              </SelectTrigger>
              <SelectContent>
                {constants?.seniority_levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.seniority_level && (
              <p className="text-caption text-red-600">{errors.seniority_level.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_function">Primary function</Label>
            <Select
              onValueChange={(value) =>
                setValue('primary_function', value as AcceptInvitationInput['primary_function'])
              }
              disabled={isLoading}
            >
              <SelectTrigger id="primary_function" aria-invalid={!!errors.primary_function}>
                <SelectValue placeholder="Select primary function" />
              </SelectTrigger>
              <SelectContent>
                {constants?.primary_functions.map((func) => (
                  <SelectItem key={func.value} value={func.value}>
                    {func.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.primary_function && (
              <p className="text-caption text-red-600">{errors.primary_function.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="New York, USA"
              {...register('location')}
              aria-invalid={!!errors.location}
              disabled={isLoading}
            />
            {errors.location && (
              <p className="text-caption text-red-600">{errors.location.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Joining...
            </>
          ) : (
            <>
              Accept invitation
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default AcceptInvitationForm;
