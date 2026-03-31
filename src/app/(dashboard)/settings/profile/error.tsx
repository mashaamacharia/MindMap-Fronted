/**
 * Profile error boundary
 */
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 bg-canvas">
      <p className="text-body-md text-ink">Failed to load your profile.</p>
      <p className="text-caption text-muted">{error.message}</p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
