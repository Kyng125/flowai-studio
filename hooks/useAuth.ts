'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * useAuth — wraps the auth store with hydration on mount.
 * Use this hook (not the store directly) in components.
 */
export function useAuth() {
  const { user, isLoggedIn, isLoading, error, hydrate, login, logout } =
    useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return { user, isLoggedIn, isLoading, error, login, logout };
}
