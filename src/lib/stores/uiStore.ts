/**
 * UI Store
 * Zustand store for UI state management
 * Handles sidebar state, modals, toasts, and other UI concerns
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
}

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: Record<string, unknown> | null;
}

interface UIState {
  sidebar: SidebarState;
  modal: ModalState;
  commandPaletteOpen: boolean;
  searchQuery: string;
}

interface UIActions {
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;

  // Modal
  openModal: (type: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Command Palette
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;

  // Search
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Reset
  reset: () => void;
}

const initialState: UIState = {
  sidebar: {
    isOpen: true,
    isCollapsed: false,
  },
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  commandPaletteOpen: false,
  searchQuery: '',
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen },
        })),

      setSidebarOpen: (isOpen) =>
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen },
        })),

      toggleSidebarCollapsed: () =>
        set((state) => ({
          sidebar: { ...state.sidebar, isCollapsed: !state.sidebar.isCollapsed },
        })),

      setSidebarCollapsed: (isCollapsed) =>
        set((state) => ({
          sidebar: { ...state.sidebar, isCollapsed },
        })),

      // Modal actions
      openModal: (type: string, data: Record<string, unknown> | null = null) =>
        set((state) => ({
          modal: { isOpen: true, type, data },
        })),

      closeModal: () =>
        set((state) => ({
          modal: { isOpen: false, type: null, data: null },
        })),

      // Command Palette actions
      toggleCommandPalette: () =>
        set((state) => ({
          commandPaletteOpen: !state.commandPaletteOpen,
        })),

      setCommandPaletteOpen: (isOpen) => set({ commandPaletteOpen: isOpen }),

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      clearSearch: () => set({ searchQuery: '' }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'm1ndmap11-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebar: state.sidebar,
      }),
    }
  )
);

/**
 * Selector hooks for common UI state
 */
export const useSidebar = () => useUIStore((state) => state.sidebar);
export const useModal = () => useUIStore((state) => state.modal);
export const useCommandPalette = () => useUIStore((state) => state.commandPaletteOpen);
export const useSearchQuery = () => useUIStore((state) => state.searchQuery);
