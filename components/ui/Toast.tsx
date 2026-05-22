'use client';

import { useUIStore } from '@/store/uiStore';

export function Toast() {
  const toast = useUIStore((s) => s.toast);
  const toastType = useUIStore((s) => s.toastType);

  if (!toast) return null;

  const bg =
    toastType === 'error'
      ? '#EF4444'
      : toastType === 'success'
      ? '#6EE7B7'
      : '#ffffff';
  const color = toastType === 'success' ? '#0B0F14' : toastType === 'error' ? '#fff' : '#0B0F14';

  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium
        transition-all duration-300"
      style={{ background: bg, color }}
    >
      {toast}
    </div>
  );
}
