import type { Task, TaskStats, AnalyticsData } from '@/types';

export function computeTaskStats(tasks: Task[]): TaskStats {
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;

  return {
    total: tasks.length,
    done,
    inProgress,
    todo,
    efficiency: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
  };
}

export function buildAnalyticsPayload(tasks: Task[]): AnalyticsData {
  return {
    weeklyProgress: [25, 50, 35, 80, 60, 95],
    stats: computeTaskStats(tasks),
  };
}
