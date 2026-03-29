/**
 * Auth Store
 * Zustand store for authentication state management
 * 
 * State includes tokens, user, org, and role.
 * Also mirrors accessToken to a cookie for Next.js middleware to read.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserRead, OrgRole } from '@/lib/types';

interface OrgInfo {
  id: string;
  name: string;
  slug: string;
}

export interface MembershipInfo {
  org_id: string;
  org_name: string;
  org_slug: string;
  role: OrgRole;
}

interface AuthState {
  user: UserRead | null;
  org: OrgInfo | null;
  role: OrgRole | null;
  membership: MembershipInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isSuperadmin: boolean;
  isLoading: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  setAuth: (params: {
    user: UserRead;
    org: OrgInfo;
    role: OrgRole;
    accessToken: string;
    refreshToken?: string | null;
    isSuperadmin?: boolean;
  }) => void;
  clearAuth: () => void;
  setTokens: (accessToken: string, refreshToken?: string | null) => void;
  setUser: (user: UserRead) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHydrated: (isHydrated: boolean) => void;
}

const initialState: AuthState = {
  user: null,
  org: null,
  role: null,
  membership: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isSuperadmin: false,
  isLoading: true,
  isHydrated: false,
};

/**
 * Set cookie for middleware access
 */
function setTokenCookie(token: string | null) {
  if (typeof document === 'undefined') return;
  
  if (token) {
    document.cookie = `m1ndmap11-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    document.cookie = 'm1ndmap11-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: ({ user, org, role, accessToken, refreshToken, isSuperadmin }) => {
        setTokenCookie(accessToken);
        set({
          user,
          org,
          role,
          membership: {
            org_id: org.id,
            org_name: org.name,
            org_slug: org.slug,
            role,
          },
          accessToken,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
          isSuperadmin: isSuperadmin ?? false,
          isLoading: false,
        });
      },

      clearAuth: () => {
        setTokenCookie(null);
        set({
          ...initialState,
          isLoading: false,
          isHydrated: true,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        setTokenCookie(accessToken);
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
        });
      },

      setUser: (user) => set({ user }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: 'm1ndmap11-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        org: state.org,
        role: state.role,
        membership: state.membership,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isSuperadmin: state.isSuperadmin,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          state.setIsLoading(false);
          // Restore token cookie on hydration
          if (state.accessToken) {
            setTokenCookie(state.accessToken);
          }
        }
      },
    }
  )
);

/**
 * Selector hooks for common auth state
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useOrg = () => useAuthStore((state) => state.org);
export const useRole = () => useAuthStore((state) => state.role);
export const useMembership = () => useAuthStore((state) => state.membership);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsSuperadmin = () => useAuthStore((state) => state.isSuperadmin);
export const useIsAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthHydrated = () => useAuthStore((state) => state.isHydrated);
