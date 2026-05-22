'use client';

import { useUIStore } from '@/store/uiStore';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';
import { TasksPanel } from '@/components/tasks/TasksPanel';
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';

export default function DashboardPage() {
  const activeTab = useUIStore((s) => s.activeTab);

  return (
    <>
      {activeTab === 'dashboard' && <DashboardPanel />}
      {activeTab === 'tasks' && <TasksPanel />}
      {activeTab === 'analytics' && <AnalyticsPanel />}
      {activeTab === 'settings' && <SettingsPanel />}
    </>
  );
}
