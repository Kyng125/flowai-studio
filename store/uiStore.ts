import { create } from 'zustand';

export type NavTab = 'dashboard' | 'tasks' | 'analytics' | 'settings';

interface UIState {
  activeTab: NavTab;
  toast: string;
  toastType: 'default' | 'success' | 'error';

  setActiveTab: (tab: NavTab) => void;
  showToast: (message: string, type?: 'default' | 'success' | 'error', duration?: number) => void;
  clearToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'dashboard',
  toast: '',
  toastType: 'default',

  setActiveTab(tab) {
    set({ activeTab: tab });
  },

  showToast(message, type = 'default', duration = 2500) {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: message, toastType: type });
    toastTimer = setTimeout(() => set({ toast: '' }), duration);
  },

  clearToast() {
    set({ toast: '' });
  },
}));
