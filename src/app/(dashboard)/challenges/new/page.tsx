'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCreateChallenge } from '@/lib/hooks';
import type { CreateChallengeInput } from '@/lib/schemas';
import { ChallengeForm } from '@/components/analyze';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

function NewChallengeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project') || undefined;

  const createChallenge = useCreateChallenge();

  const handleSubmit = async (data: CreateChallengeInput) => {
    const challenge = await createChallenge.mutateAsync(data);
    router.push(`/challenges/${challenge.id}`);
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/challenges">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="sr-only">Back to challenges</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Define New Challenge
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Challenge Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ChallengeForm
              defaultProjectId={projectId}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/challenges')}
              isLoading={createChallenge.isPending}
              error={createChallenge.error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewChallengePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <NewChallengeContent />
    </Suspense>
  );
}
