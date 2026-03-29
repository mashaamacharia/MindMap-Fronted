'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="flex flex-col items-center gap-8 text-center">
        <Wordmark size="lg" />
        
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-600" strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Something went wrong
          </h1>
          <p className="text-muted max-w-md">
            We encountered an unexpected error. Please try again or contact
            support if the problem persists.
          </p>
          {error.digest && (
            <p className="text-xs text-muted">Error ID: {error.digest}</p>
          )}
        </div>

        <Button onClick={reset} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Try again
        </Button>
      </div>
    </div>
  );
}
