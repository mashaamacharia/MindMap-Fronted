'use client';

import Link from 'next/link';
import { AlertCircle, UserCircle, ArrowRight } from 'lucide-react';
import { useUserMe } from '@/lib/hooks/useUser';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function ProfileCompletionBanner() {
  const { data: user, isLoading } = useUserMe();

  if (isLoading || !user || user.profile_completed) {
    return null;
  }

  return (
    <Card className="mb-8 border-amber-200 bg-amber-50">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <UserCircle className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-900">
              Complete your profile
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Add your job title, role, and location to get personalized decision templates and better collaboration features.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <Button asChild variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 font-medium">
            <Link href="/settings/profile">
              Complete profile
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
