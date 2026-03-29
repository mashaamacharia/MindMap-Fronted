/**
 * Spinner Component
 * M1NDMAP11 Design System - Loading indicator
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Spinner({ className, size = 'default' }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-graphite', sizeClasses[size], className)}
      strokeWidth={1.5}
    />
  );
}
