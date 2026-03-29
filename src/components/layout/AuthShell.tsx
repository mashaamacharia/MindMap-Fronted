/**
 * AuthShell
 * Full-screen canvas background, centered content max-width 440px, Wordmark at top
 * Used for all authentication pages
 */

'use client';

import { Wordmark } from '@/components/ui/Wordmark';
import { SoundWave } from '@/components/ui/SoundWave';
import { cn } from '@/lib/utils';

interface AuthShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Authentication shell layout component
 * Provides centered container with wordmark for auth pages
 */
export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Header with Wordmark */}
      <header className="flex h-20 items-center justify-center px-4">
        <Wordmark size="sm" showLogo />
      </header>

      <div className="flex justify-center -mt-6">
        <SoundWave state="idle" className="w-80 opacity-60" />
      </div>

      {/* Main content - centered, max-width 440px */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className={cn('w-full max-w-[440px]', className)}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex h-16 items-center justify-center px-4">
        <p className="text-caption text-muted">
          &copy; {new Date().getFullYear()} M1NDMAP11. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default AuthShell;
