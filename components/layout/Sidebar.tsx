'use client';

import { useEffect } from 'react';
import { COLORS } from '@/lib/tokens';
import { useUIStore, type NavTab } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { usePrefsStore } from '@/store/prefsStore';
import { useTasksStore } from '@/store/tasksStore';

const NAV_ITEMS: { id: NavTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'tasks',     label: 'Tasks',     icon: '▣' },
  { id: 'analytics', label: 'Analytics', icon: '◈' },
  { id: 'settings',  label: 'Settings',  icon: '◎' },
];

export function Sidebar() {
  const { activeTab, setActiveTab } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const { prefs, hydrate } = usePrefsStore();
  const tasks = useTasksStore((s) => s.tasks);

  useEffect(() => { hydrate(); }, [hydrate]);

  const todoCount = tasks.filter((t) => t.status === 'todo').length;

  return (
    <aside
      className="w-64 border-r flex-shrink-0 p-6 flex flex-col"
      style={{ background: COLORS.bgSidebar, borderColor: COLORS.border }}
    >
      {/* Brand */}
      <div className="mb-8">
        <h1 className="text-lg font-semibold tracking-wide">
          FlowAI<span style={{ color: prefs.accentColor }}>.studio</span>
        </h1>
        <p className="text-xs text-white/35 mt-1">{prefs.role || user?.role}</p>
      </div>

      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                flex items-center gap-3
                ${isActive ? 'text-white' : 'text-white/45 hover:text-white/75 hover:bg-white/5'}`}
              style={
                isActive
                  ? {
                      background: `${prefs.accentColor}18`,
                      borderLeft: `2px solid ${prefs.accentColor}`,
                    }
                  : {}
              }
            >
              <span className="text-base leading-none opacity-60">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.id === 'tasks' && todoCount > 0 && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${prefs.accentColor}30`, color: prefs.accentColor }}
                >
                  {todoCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="mt-6 pt-4 border-t"
        style={{ borderColor: COLORS.border }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: `${prefs.accentColor}25`, color: prefs.accentColor }}
          >
            {(prefs.displayName || user?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white/80 truncate">
              {prefs.displayName || user?.name}
            </p>
            <p className="text-[10px] text-white/35 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
