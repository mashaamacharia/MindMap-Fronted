/**
 * SuccessMessage Component
 * Inline confirmation message, caption size, ink color
 */

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessMessageProps {
  message?: string;
  className?: string;
}

/**
 * SuccessMessage component
 * Displays inline success confirmation
 */
export function SuccessMessage({ message, className }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-caption text-ink',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Check className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span>{message}</span>
    </div>
  );
}

export default SuccessMessage;
