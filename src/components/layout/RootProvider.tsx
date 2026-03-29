/**
 * RootProvider
 * Combines QueryClientProvider, Zustand hydration guard, and Toaster
 * Uses staleTime: 60s, retry: 1 as per spec
 */

'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/lib/stores';

interface RootProviderProps {
  children: React.ReactNode;
}

/**
 * Root provider that wraps the entire application
 * Handles QueryClient setup, Zustand hydration, and toast notifications
 */
export function RootProvider({ children }: RootProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isHydrated: authHydrated, setHydrated } = useAuthStore();

  // Create QueryClient with default options
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 60 seconds
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  // Handle Zustand hydration
  useEffect(() => {
    // Mark as hydrated after first render
    setIsHydrated(true);
    if (!authHydrated) {
      setHydrated(true);
    }
  }, [authHydrated, setHydrated]);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-surface text-ink border border-border',
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-ink)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default RootProvider;
