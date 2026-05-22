'use client';

import { useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { useTasks } from '@/hooks/useTasks';
import { useUIStore } from '@/store/uiStore';
import { COLORS, STATUS_META, PRIORITY_META } from '@/lib/tokens';
import type { ActivityEvent } from '@/types';

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const EVENT_ICONS: Record<ActivityEvent['type'], string> = {
  created: '＋',
  completed: '✓',
  uncompleted: '↺',
  deleted: '×',
  status_changed: '→',
};

const EVENT_COLORS: Record<ActivityEvent['type'], string> = {
  created: '#D4AF37',
  completed: '#6EE7B7',
  uncompleted: 'rgba(255,255,255,0.4)',
  deleted: '#EF4444',
  status_changed: '#F59E0B',
};

function QuickAddTask() {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { addTask } = useTasks();
  const showToast = useUIStore((s) => s.showToast);

  async function handleAdd() {
    if (!title.trim()) return;
    setIsAdding(true);
    await addTask(title.trim());
    setTitle('');
    setIsAdding(false);
    showToast('Task added', 'success');
  }

  return (
    <div className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="Quick-add a task…"
        disabled={isAdding}
        className="flex-1 px-3 py-2 rounded-lg border text-sm text-white placeholder-white/25 outline-none bg-transparent"
        style={{ borderColor: COLORS.border }}
      />
      <button
        onClick={handleAdd}
        disabled={isAdding || !title.trim()}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-85 disabled:opacity-30"
        style={{ background: COLORS.gold, color: COLORS.bgBase }}
      >
        {isAdding ? '…' : 'Add'}
      </button>
    </div>
  );
}

function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-xs text-white/25 py-6 text-center">
        No activity yet — start completing tasks.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {events.slice(0, 8).map((e) => (
        <li key={e.id} className="flex items-start gap-3">
          <span
            className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{
              background: `${EVENT_COLORS[e.type]}20`,
              color: EVENT_COLORS[e.type],
              border: `1px solid ${EVENT_COLORS[e.type]}40`,
            }}
          >
            {EVENT_ICONS[e.type]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80 truncate">
              {e.taskTitle}
              {e.meta && (
                <span className="text-white/40 ml-1 text-xs">→ {e.meta}</span>
              )}
            </p>
          </div>
          <span className="text-xs text-white/25 flex-shrink-0">{timeAgo(e.timestamp)}</span>
        </li>
      ))}
    </ul>
  );
}

export function DashboardPanel() {
  const { stats, activity, isLoading, tasks } = useTasks();

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date(new Date().toISOString().split('T')[0]);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold">Executive Overview</h3>
        <p className="text-xs text-white/35 mt-1">Real-time summary of your workspace</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Completed" value={stats.done} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Efficiency" value={`${stats.efficiency}%`} />
      </div>

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}
        >
          <span className="text-red-400 font-bold">!</span>
          <span className="text-red-300">
            {overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} overdue:{' '}
            <span className="text-white/60">
              {overdueTasks.map((t) => t.title).join(', ')}
            </span>
          </span>
        </div>
      )}

      {/* Bottom row: Quick Add + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Add */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        >
          <div>
            <p className="text-sm font-medium mb-1">Quick Add Task</p>
            <p className="text-xs text-white/35">Add directly from the overview</p>
          </div>
          <QuickAddTask />
          {/* Status breakdown mini-bar */}
          <div className="pt-2">
            <p className="text-xs text-white/35 mb-2">Status breakdown</p>
            <div className="flex gap-3">
              {(['todo', 'in-progress', 'done'] as const).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: STATUS_META[s].color }}
                  />
                  <span className="text-xs text-white/50">{STATUS_META[s].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div
          className="p-5 rounded-xl border"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Activity Feed</p>
            <span className="text-xs text-white/30">{activity.length} events</span>
          </div>
          <ActivityFeed events={activity} />
        </div>
      </div>
    </div>
  );
}
