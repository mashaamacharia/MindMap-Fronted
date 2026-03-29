/**
 * ErrorMessage Component
 * Reads error.response?.data?.detail, falls back to error.message
 */

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/api/axios';

interface ErrorMessageProps {
  /** Error object or string message */
  error?: Error | unknown | string;
  className?: string;
}

/**
 * ErrorMessage component
 * Displays API error details with proper fallback
 */
export function ErrorMessage({ error, className }: ErrorMessageProps) {
  if (!error) return null;

  const message = typeof error === 'string' ? error : getErrorMessage(error);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-caption text-ink',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;
