import { create } from 'zustand';
import type { UserPreferences } from '@/types';
import storage, { STORAGE_KEYS } from '@/lib/storage';

const DEFAULTS: UserPreferences = {
  accentColor: '#D4AF37',
  notifications: true,
  displayName: 'Builder',
  role: 'Full-Stack Developer',
};

interface PreferencesState {
  prefs: UserPreferences;
  hydrate: () => void;
  updatePrefs: (partial: Partial<UserPreferences>) => void;
  resetPrefs: () => void;
}

export const usePrefsStore = create<PreferencesState>((set) => ({
  prefs: DEFAULTS,

  hydrate() {
    const saved = storage.getItem<UserPreferences>(STORAGE_KEYS.PREFERENCES);
    if (saved) set({ prefs: { ...DEFAULTS, ...saved } });
  },

  updatePrefs(partial) {
    set((state) => {
      const prefs = { ...state.prefs, ...partial };
      storage.setItem(STORAGE_KEYS.PREFERENCES, prefs);
      return { prefs };
    });
  },

  resetPrefs() {
    storage.setItem(STORAGE_KEYS.PREFERENCES, DEFAULTS);
    set({ prefs: DEFAULTS });
  },
}));
