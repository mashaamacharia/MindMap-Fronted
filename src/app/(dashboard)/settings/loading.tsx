import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
