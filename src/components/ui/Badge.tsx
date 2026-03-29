/**
 * Badge Component
 * M1NDMAP11 Design System
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-charcoal focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-ink text-canvas',
        secondary:
          'border-transparent bg-ecru text-charcoal',
        outline:
          'border-border text-ink',
        success:
          'border-transparent bg-emerald-100 text-emerald-800',
        warning:
          'border-transparent bg-amber-100 text-amber-800',
        destructive:
          'border-transparent bg-red-100 text-red-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
