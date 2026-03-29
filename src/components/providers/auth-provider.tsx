'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores';
import { Toaster } from 'sonner';

/**
 * AuthProvider
 * Handles Zustand hydration and provides global toaster
 * The actual auth state is managed by Zustand's persist middleware
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isHydrated: authHydrated, setHydrated, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Mark as hydrated after first render
    setIsHydrated(true);
    if (!authHydrated) {
      setHydrated(true);
    }
    setIsLoading(false);
  }, [authHydrated, setHydrated, setIsLoading]);

  // Prevent hydration mismatch - render null briefly on server
  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-surface text-ink border border-border',
        }}
      />
    </>
  );
}
