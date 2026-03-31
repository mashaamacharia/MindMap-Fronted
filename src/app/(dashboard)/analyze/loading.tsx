/**
 * Analyze loading skeleton
 */
import { Skeleton } from '@/components/ui/Skeleton';

export default function AnalyzeLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-canvas">
      <Skeleton className="h-10 w-48 mb-10" />
      <Skeleton className="h-[120px] w-full max-w-2xl mb-6 rounded-xl" />
      <Skeleton className="h-4 w-40 mb-8" />
      <Skeleton className="h-40 w-full max-w-2xl rounded-xl" />
    </div>
  );
}
