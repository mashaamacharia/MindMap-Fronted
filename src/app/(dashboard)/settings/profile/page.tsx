/**
 * Profile Page
 * /profile — Dedicated user profile page, separate from general /settings.
 * Shows avatar initials block, personal info editable, membership card, account status.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  User,
  MapPin,
  Briefcase,
  Shield,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { updateUserSchema, type UpdateUserInput } from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores';
import { useUpdateProfile, useConstants } from '@/lib/hooks';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Spinner } from '@/components/ui/Spinner';

function formatDateShort(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(name?: string | null) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { user, membership, role } = useAuthStore();
  const { data: constants, isLoading: constantsLoading } = useConstants();
  const updateProfile = useUpdateProfile();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      full_name: user?.full_name ?? '',
      job_title: user?.job_title ?? '',
      seniority_level: user?.seniority_level ?? undefined,
      primary_function: user?.primary_function ?? undefined,
      location: user?.location ?? '',
    },
  });

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profile updated.');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-h2 font-semibold text-ink">Your profile</h1>
          <p className="text-body-md text-muted mt-1">
            Your decision workspace identity.
          </p>
        </div>

        {/* ── Avatar + Quick Info ── */}
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start gap-6">
              {/* Avatar block */}
              <div
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-charcoal text-ecru text-h3 font-medium select-none"
                aria-hidden="true"
              >
                {getInitials(user?.full_name)}
              </div>

              {/* Quick info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <p className="text-h3 font-medium text-ink truncate">
                    {user?.full_name || 'Your Name'}
                  </p>
                  <p className="text-body-md text-muted truncate">{user?.email}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {/* Role badge */}
                  {role && (
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <Shield className="h-3 w-3" strokeWidth={1.5} />
                      {role}
                    </Badge>
                  )}

                  {/* Verified badge */}
                  {user?.is_verified ? (
                    <Badge variant="default" className="flex items-center gap-1.5 bg-charcoal text-ecru border-charcoal">
                      <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1.5 text-muted">
                      <AlertCircle className="h-3 w-3" strokeWidth={1.5} />
                      Unverified
                    </Badge>
                  )}

                  {/* Profile complete */}
                  {user?.profile_completed && (
                    <Badge variant="outline" className="flex items-center gap-1.5 text-muted">
                      <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
                      Profile complete
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {user?.job_title && (
                <div className="flex items-center gap-2 text-caption text-muted">
                  <Briefcase className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{user.job_title}</span>
                </div>
              )}
              {user?.location && (
                <div className="flex items-center gap-2 text-caption text-muted">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
              {user?.created_at && (
                <div className="flex items-center gap-2 text-caption text-muted">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>Joined {formatDateShort(user.created_at)}</span>
                </div>
              )}
              {user?.last_login_at && (
                <div className="flex items-center gap-2 text-caption text-muted">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>Last login {formatDateShort(user.last_login_at)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Edit form ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" strokeWidth={1.5} />
              Personal information
            </CardTitle>
            <CardDescription>Update your name, role and location.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  aria-invalid={!!errors.full_name}
                  placeholder="Your full name"
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name.message}</p>
                )}
              </div>

              {/* Job title */}
              <div className="space-y-2">
                <Label htmlFor="job_title">Job title</Label>
                <Input
                  id="job_title"
                  {...register('job_title')}
                  aria-invalid={!!errors.job_title}
                  placeholder="e.g. Chief Strategy Officer"
                />
                {errors.job_title && (
                  <p className="text-sm text-destructive">{errors.job_title.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  aria-invalid={!!errors.location}
                  placeholder="e.g. London, UK"
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>

              {/* Seniority + Function */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Seniority level</Label>
                  {constantsLoading ? (
                    <div className="h-10 rounded-md border border-border bg-surface animate-pulse" />
                  ) : (
                    <Select
                      value={watch('seniority_level') ?? ''}
                      onValueChange={(v) =>
                        setValue('seniority_level', v as UpdateUserInput['seniority_level'], {
                          shouldDirty: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {constants?.seniority_levels?.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Primary function</Label>
                  {constantsLoading ? (
                    <div className="h-10 rounded-md border border-border bg-surface animate-pulse" />
                  ) : (
                    <Select
                      value={watch('primary_function') ?? ''}
                      onValueChange={(v) =>
                        setValue('primary_function', v as UpdateUserInput['primary_function'], {
                          shouldDirty: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select function" />
                      </SelectTrigger>
                      <SelectContent>
                        {constants?.primary_functions?.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-2">
                {saved && (
                  <p className="text-caption text-muted flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Saved
                  </p>
                )}
                <div className="ml-auto">
                  <Button
                    type="submit"
                    disabled={!isDirty || updateProfile.isPending}
                    className="flex items-center gap-2"
                  >
                    {updateProfile.isPending && <Spinner size="sm" />}
                    {updateProfile.isPending ? 'Saving…' : 'Save changes'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ── Membership card ── */}
        {membership && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" strokeWidth={1.5} />
                Organisation
              </CardTitle>
              <CardDescription>Your current workspace membership.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-canvas px-4 py-3">
                <div>
                  <p className="text-body-md font-medium text-ink">{membership.org_name}</p>
                  <p className="text-caption text-muted">{membership.org_slug}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {membership.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Email (read-only) ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Verified email address. Cannot be changed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="email-display"
              type="email"
              value={user?.email ?? ''}
              disabled
              className="bg-canvas text-muted"
              aria-label="Email address (read-only)"
            />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
