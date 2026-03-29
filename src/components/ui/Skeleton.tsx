/**
 * Skeleton Component
 * M1NDMAP11 Design System - Loading placeholder
 */

import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-ecru', className)}
      {...props}
    />
  );
}

export { Skeleton };
