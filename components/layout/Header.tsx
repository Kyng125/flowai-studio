'use client';

import { COLORS } from '@/lib/tokens';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { usePrefsStore } from '@/store/prefsStore';
import { useTasksStore } from '@/store/tasksStore';
import { useRouter } from 'next/navigation';

const TAB_LABELS: Record<string, string> = {
  dashboard: 'Executive Overview',
  tasks: 'Task System',
  analytics: 'Analytics Engine',
  settings: 'Settings',
};

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { showToast, activeTab } = useUIStore();
  const prefs = usePrefsStore((s) => s.prefs);
  const tasks = useTasksStore((s) => s.tasks);
  const router = useRouter();

  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;

  async function handleLogout() {
    await logout();
    showToast('Signed out', 'default');
    router.push('/login');
  }

  return (
    <header
      className="h-14 border-b flex items-center justify-between px-6 flex-shrink-0 gap-4"
      style={{ borderColor: COLORS.border }}
    >
      {/* Page title */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-white/70">
          {TAB_LABELS[activeTab] ?? activeTab}
        </h2>
        {inProgressCount > 0 && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
          >
            {inProgressCount} in progress
          </span>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {prefs.notifications && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: prefs.accentColor, boxShadow: `0 0 6px ${prefs.accentColor}` }}
            title="Notifications active"
          />
        )}
        <span className="text-xs text-white/30 hidden md:block">
          {user?.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs text-white/30 hover:text-white/70 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
