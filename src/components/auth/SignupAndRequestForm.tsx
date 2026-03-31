/**
 * SignupAndRequestForm
 * Signup and request to join existing organisation
 * Used when detect-path returns 'join_request'
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { signupAndRequestSchema, type SignupAndRequestInput } from '@/lib/schemas';
import { useConstants } from '@/lib/hooks';
import type { DetectPathOrg } from '@/lib/types';
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

interface SignupAndRequestFormProps {
  email: string;
  org: DetectPathOrg;
  onSubmit: (data: SignupAndRequestInput) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Signup and request to join form component
 * For users whose email domain matches an existing org
 */
export function SignupAndRequestForm({
  email,
  org,
  onSubmit,
  isLoading,
  error,
}: SignupAndRequestFormProps) {
  const { data: constants, isLoading: constantsLoading } = useConstants();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupAndRequestInput>({
    resolver: zodResolver(signupAndRequestSchema),
    defaultValues: {
      email,
      full_name: '',
      job_title: '',
      seniority_level: undefined,
      primary_function: undefined,
      location: '',
      org_slug: org.slug,
      requested_role: 'member',
    },
  });

  const handleFormSubmit = async (data: SignupAndRequestInput) => {
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
      {/* Org info */}
      <Card className="p-4 bg-canvas">
        <p className="text-body-md text-muted">
          Request to join
        </p>
        <p className="text-h3 font-semibold text-ink">{org.name}</p>
        <p className="text-caption text-muted mt-1">{org.industry}</p>
      </Card>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <ErrorMessage error={error ?? 'Failed to submit request. Please try again.'} />
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
              <p className="text-caption text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-canvas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Job title</Label>
            <Input
              id="job_title"
              type="text"
              placeholder="Product Manager"
              {...register('job_title')}
              aria-invalid={!!errors.job_title}
              disabled={isLoading}
            />
            {errors.job_title && (
              <p className="text-caption text-destructive">{errors.job_title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seniority_level">Seniority level</Label>
              <Select
                onValueChange={(value) =>
                  setValue('seniority_level', value as SignupAndRequestInput['seniority_level'])
                }
                disabled={isLoading}
              >
                <SelectTrigger id="seniority_level" aria-invalid={!!errors.seniority_level}>
                  <SelectValue placeholder="Select level" />
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
                <p className="text-caption text-destructive">{errors.seniority_level.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_function">Primary function</Label>
              <Select
                onValueChange={(value) =>
                  setValue('primary_function', value as SignupAndRequestInput['primary_function'])
                }
                disabled={isLoading}
              >
                <SelectTrigger id="primary_function" aria-invalid={!!errors.primary_function}>
                  <SelectValue placeholder="Select function" />
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
                <p className="text-caption text-destructive">{errors.primary_function.message}</p>
              )}
            </div>
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
              <p className="text-caption text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requested_role">Requested role</Label>
            <Select
              defaultValue="member"
              onValueChange={(value) =>
                setValue('requested_role', value as 'member' | 'viewer')
              }
              disabled={isLoading}
            >
              <SelectTrigger id="requested_role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-caption text-muted">
              Members can create projects and analyze challenges. Viewers can only view content.
            </p>
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
              Submitting request...
            </>
          ) : (
            <>
              Request to join
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default SignupAndRequestForm;
