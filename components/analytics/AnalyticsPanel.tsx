'use client';

import { useMemo } from 'react';
import { BarChart } from '@/components/analytics/BarChart';
import { RingChart } from '@/components/analytics/RingChart';
import { Sparkline } from '@/components/analytics/Sparkline';
import { useTasks } from '@/hooks/useTasks';
import { usePrefsStore } from '@/store/prefsStore';
import { COLORS } from '@/lib/tokens';

const WEEKLY_DATA = [25, 50, 35, 80, 60, 95];
const TREND_DATA = [10, 22, 18, 35, 28, 50, 42, 60, 55, 72, 68, 80];

function StatLine({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: COLORS.border }}>
      <span className="text-sm text-white/55">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-white">{value}</span>
        {sub && <p className="text-[10px] text-white/30">{sub}</p>}
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  const { stats, tasks, isLoading } = useTasks();
  const accentColor = usePrefsStore((s) => s.prefs.accentColor);

  const ringSegments = useMemo(() => [
    { label: 'Done', value: stats.done, color: '#6EE7B7' },
    { label: 'In Progress', value: stats.inProgress, color: '#F59E0B' },
    { label: 'Todo', value: stats.todo, color: 'rgba(255,255,255,0.15)' },
  ], [stats]);

  const streakDays = useMemo(() => {
    const completedDates = tasks
      .filter((t) => t.status === 'done')
      .map((t) => new Date(t.createdAt).toDateString());
    return new Set(completedDates).size;
  }, [tasks]);

  const productivityScore = useMemo(() => {
    if (stats.total === 0) return 0;
    const efficiencyWeight = stats.efficiency * 0.6;
    const inProgressWeight = (stats.inProgress / Math.max(stats.total, 1)) * 100 * 0.4;
    return Math.min(100, Math.round(efficiencyWeight + inProgressWeight));
  }, [stats]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Analytics Engine</h3>
        <p className="text-xs text-white/35 mt-1">Performance intelligence for your workflow</p>
      </div>

      {/* Top KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Efficiency', value: `${stats.efficiency}%`, sub: 'tasks completed' },
          { label: 'Productivity Score', value: `${productivityScore}`, sub: 'out of 100' },
          { label: 'Active Days', value: streakDays, sub: 'days with completions' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="p-4 rounded-xl border text-center"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          >
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-3xl font-semibold" style={{ color: accentColor }}>{kpi.value}</p>
            <p className="text-[10px] text-white/30 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Mid row: Ring + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status distribution */}
        <div
          className="p-5 rounded-xl border"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        >
          <p className="text-xs text-white/40 mb-4 uppercase tracking-widest">Status Distribution</p>
          <div className="flex items-center gap-6">
            <RingChart
              segments={ringSegments}
              centerLabel={`${stats.efficiency}%`}
              centerSub="done"
            />
            <div className="space-y-2 flex-1">
              {ringSegments.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs text-white/55">{s.label}</span>
                  </div>
                  <span className="text-xs font-medium">{s.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: COLORS.border }}>
                <span className="text-xs text-white/35">Total</span>
                <span className="text-xs font-medium">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics breakdown */}
        <div
          className="p-5 rounded-xl border"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        >
          <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">Metrics</p>
          <StatLine label="Total Tasks" value={stats.total} />
          <StatLine label="Completed" value={stats.done} sub={`${stats.efficiency}% of total`} />
          <StatLine label="In Progress" value={stats.inProgress} />
          <StatLine label="Backlog" value={stats.todo} />
          <StatLine label="Productivity Score" value={`${productivityScore} / 100`} />
        </div>
      </div>

      {/* Trend line */}
      <div
        className="p-5 rounded-xl border"
        style={{ background: COLORS.surface, borderColor: COLORS.border }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Completion Trend</p>
            <p className="text-[10px] text-white/25 mt-0.5">12-week rolling view</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
            <span className="text-[10px] text-white/35">Completions</span>
          </div>
        </div>
        <Sparkline data={TREND_DATA} width={700} height={64} color={accentColor} />
      </div>

      {/* Weekly bar chart */}
      <div
        className="p-5 rounded-xl border"
        style={{ background: COLORS.surface, borderColor: COLORS.border }}
      >
        <p className="text-xs text-white/40 mb-4 uppercase tracking-widest">Weekly Progress</p>
        <BarChart data={WEEKLY_DATA} accentColor={accentColor} />
      </div>
    </div>
  );
}
