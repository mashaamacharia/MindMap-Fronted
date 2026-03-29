'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex xl:min-h-[400px] flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-ink">
            Something went wrong
          </h2>
          <p className="text-sm text-muted max-w-md">
            We couldn't load this page. Please try again.
          </p>
        </div>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Try again
        </Button>
      </div>
    </div>
  );
}
