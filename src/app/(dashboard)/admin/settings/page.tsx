'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateOrgSchema, type UpdateOrgInput } from '@/lib/schemas';
import { useOrg, useUpdateOrg, useConstants } from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

export default function OrgSettingsPage() {
  const { membership } = useAuthStore();
  const { data: org, isLoading } = useOrg(membership?.org_id);
  const { data: constants } = useConstants();
  const updateOrg = useUpdateOrg();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateOrgInput>({
    resolver: zodResolver(updateOrgSchema),
    values: org ? {
      name: org.name || '',
      industry: org.industry || '',
      size_category: org.size_category || undefined,
      hq_location: org.hq_location || '',
      primary_market: org.primary_market || undefined,
    } : undefined,
  });

  const onSubmit = async (data: UpdateOrgInput) => {
    if (!membership?.org_id) return;
    try {
      await updateOrg.mutateAsync({
        orgId: membership.org_id,
        data,
      });
      toast.success('Organization settings updated');
    } catch {
      toast.error('Failed to update organization');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-ink">Organization Settings</h2>
        <p className="text-sm text-muted">Update your organization details and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">General Information</CardTitle>
          <CardDescription>
            Basic details about your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Organization slug</Label>
              <Input
                id="slug"
                value={org?.slug || ''}
                disabled
                className="bg-surface"
              />
              <p className="text-xs text-muted">
                The slug is unique and cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Organization name</Label>
              <Input
                id="name"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                {...register('industry')}
                placeholder="e.g. Technology, Finance, Healthcare"
                aria-invalid={!!errors.industry}
              />
              {errors.industry && (
                <p className="text-sm text-red-600">{errors.industry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hq_location">Headquarters location</Label>
              <Input
                id="hq_location"
                {...register('hq_location')}
                placeholder="e.g. San Francisco, CA"
                aria-invalid={!!errors.hq_location}
              />
              {errors.hq_location && (
                <p className="text-sm text-red-600">{errors.hq_location.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="size_category">Organization size</Label>
                <Select
                  value={watch('size_category') || ''}
                  onValueChange={(v) => setValue('size_category', v as UpdateOrgInput['size_category'], { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {constants?.organization_sizes?.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_market">Primary market</Label>
                <Select
                  value={watch('primary_market') || ''}
                  onValueChange={(v) => setValue('primary_market', v as UpdateOrgInput['primary_market'], { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {constants?.primary_markets?.map((market) => (
                      <SelectItem key={market.value} value={market.value}>
                        {market.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-ink">Plan</p>
                <p className="text-xs text-muted capitalize">{org?.plan || 'Free'}</p>
              </div>
              <Button
                type="submit"
                disabled={!isDirty || updateOrg.isPending}
              >
                {updateOrg.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
