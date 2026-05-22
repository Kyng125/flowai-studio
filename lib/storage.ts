/**
 * Storage utility — wraps localStorage with JSON safety,
 * SSR guards, and a typed API.
 */
const storage = {
  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      console.warn(`[storage] Failed to parse key "${key}"`);
      return null;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`[storage] Failed to set key "${key}"`);
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn(`[storage] Failed to remove key "${key}"`);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch {
      console.warn('[storage] Failed to clear storage');
    }
  },
};

export default storage;

export const STORAGE_KEYS = {
  AUTH_SESSION: 'flowai_session',
  TASKS: 'flowai_tasks',
  ACTIVITY: 'flowai_activity',
  PREFERENCES: 'flowai_preferences',
} as const;
