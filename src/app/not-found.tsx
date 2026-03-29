import Link from 'next/link';
import { Wordmark } from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="flex flex-col items-center gap-8 text-center">
        <Wordmark size="lg" />
        
        <div className="space-y-2">
          <h1 className="text-4xl font-light tracking-tight text-ink">
            Page not found
          </h1>
          <p className="text-muted max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="primary">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
