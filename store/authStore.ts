import { create } from 'zustand';
import type { User } from '@/types';
import storage, { STORAGE_KEYS } from '@/lib/storage';
import { loginUser, logoutUser } from '@/services/api/auth';
import type { LoginCredentials } from '@/services/api/auth';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;

  hydrate: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  hydrate() {
    const session = storage.getItem<{ user: User }>(STORAGE_KEYS.AUTH_SESSION);
    if (session?.user) {
      set({ user: session.user, isLoggedIn: true });
    }
  },

  async login(credentials) {
    set({ isLoading: true, error: null });
    const result = await loginUser(credentials);
    if (result.success && result.user) {
      storage.setItem(STORAGE_KEYS.AUTH_SESSION, { user: result.user });
      set({ user: result.user, isLoggedIn: true, isLoading: false });
      return true;
    }
    set({ error: result.error ?? 'Login failed', isLoading: false });
    return false;
  },

  async logout() {
    await logoutUser();
    storage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    set({ user: null, isLoggedIn: false });
  },
}));
