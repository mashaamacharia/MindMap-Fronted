import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </div>
  );
}
