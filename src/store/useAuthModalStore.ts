'use client';

import { create } from 'zustand';

interface AuthModalState {
  isOpen: boolean;
  redirectUrl: string | null;
  onSuccess?: () => void;
  openAuthModal: (options?: { redirectUrl?: string; onSuccess?: () => void }) => void;
  closeAuthModal: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  redirectUrl: null,
  onSuccess: undefined,
  openAuthModal: (options) =>
    set({
      isOpen: true,
      redirectUrl: options?.redirectUrl || null,
      onSuccess: options?.onSuccess,
    }),
  closeAuthModal: () =>
    set({
      isOpen: false,
      redirectUrl: null,
      onSuccess: undefined,
    }),
}));
