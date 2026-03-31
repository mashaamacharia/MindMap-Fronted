/**
 * SignupForm
 * Full owner signup form - creates new organisation
 * All fields use useConstants() for dropdowns
 * org_slug auto-slugified from org_name but editable
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { signupSchema, type SignupInput } from '@/lib/schemas';
import { useConstants } from '@/lib/hooks';
import { slugify } from '@/lib/utils/slugify';
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
import { Separator } from '@/components/ui/Separator';

interface SignupFormProps {
  email: string;
  onSubmit: (data: SignupInput) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Owner signup form component
 * Creates a new user and organisation
 */
export function SignupForm({
  email,
  onSubmit,
  isLoading,
  error,
}: SignupFormProps) {
  const { data: constants, isLoading: constantsLoading } = useConstants();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email,
      full_name: '',
      job_title: '',
      seniority_level: '',
      primary_function: '',
      location: '',
      org_name: '',
      org_slug: '',
      org_industry: '',
      org_size_category: '',
      org_hq_location: '',
      org_primary_market: '',
    },
  });

  const orgName = watch('org_name');

  // Auto-generate slug from org name
  useEffect(() => {
    if (orgName) {
      setValue('org_slug', slugify(orgName));
    }
  }, [orgName, setValue]);

  const handleFormSubmit = async (data: SignupInput) => {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <ErrorMessage error={error ?? 'Failed to create account. Please try again.'} />
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
            placeholder="Chief Executive Officer"
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
              onValueChange={(value) => setValue('seniority_level', value)}
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
              onValueChange={(value) => setValue('primary_function', value)}
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
      </div>

      <Separator />

      {/* Organisation Info */}
      <div className="space-y-4">
        <h3 className="text-body-lg font-medium">Organisation details</h3>

        <div className="space-y-2">
          <Label htmlFor="org_name">Organisation name</Label>
          <Input
            id="org_name"
            type="text"
            placeholder="Acme Corporation"
            {...register('org_name')}
            aria-invalid={!!errors.org_name}
            disabled={isLoading}
          />
          {errors.org_name && (
            <p className="text-caption text-destructive">{errors.org_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="org_slug">Organisation URL</Label>
          <div className="flex items-center gap-2">
            <span className="text-body-md text-muted">m1ndmap11.com/</span>
            <Input
              id="org_slug"
              type="text"
              placeholder="acme-corporation"
              {...register('org_slug')}
              aria-invalid={!!errors.org_slug}
              disabled={isLoading}
              className="flex-1"
            />
          </div>
          {errors.org_slug && (
            <p className="text-caption text-destructive">{errors.org_slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="org_industry">Industry</Label>
          <Input
            id="org_industry"
            type="text"
            placeholder="Technology"
            {...register('org_industry')}
            aria-invalid={!!errors.org_industry}
            disabled={isLoading}
          />
          {errors.org_industry && (
            <p className="text-caption text-destructive">{errors.org_industry.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="org_size_category">Organisation size</Label>
            <Select
              onValueChange={(value) => setValue('org_size_category', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="org_size_category" aria-invalid={!!errors.org_size_category}>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {constants?.org_size_categories.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.org_size_category && (
              <p className="text-caption text-destructive">{errors.org_size_category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_primary_market">Primary market</Label>
            <Select
              onValueChange={(value) => setValue('org_primary_market', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="org_primary_market" aria-invalid={!!errors.org_primary_market}>
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                {constants?.primary_markets.map((market) => (
                  <SelectItem key={market.value} value={market.value}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.org_primary_market && (
              <p className="text-caption text-destructive">{errors.org_primary_market.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="org_hq_location">Headquarters location</Label>
          <Input
            id="org_hq_location"
            type="text"
            placeholder="San Francisco, USA"
            {...register('org_hq_location')}
            aria-invalid={!!errors.org_hq_location}
            disabled={isLoading}
          />
          {errors.org_hq_location && (
            <p className="text-caption text-destructive">{errors.org_hq_location.message}</p>
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
            Creating account...
          </>
        ) : (
          <>
            Create account
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </>
        )}
      </Button>
    </form>
  );
}

export default SignupForm;
