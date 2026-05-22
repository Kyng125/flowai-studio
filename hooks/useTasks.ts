'use client';

import { useEffect, useMemo } from 'react';
import { useTasksStore } from '@/store/tasksStore';
import { computeTaskStats } from '@/lib/analytics';
import type { TaskStatus } from '@/types';

export function useTasks(filter: TaskStatus | 'all' = 'all') {
  const {
    tasks, activity, isLoading, error,
    hydrate, addTask, toggleTask, setTaskStatus, deleteTask,
  } = useTasksStore();

  useEffect(() => { hydrate(); }, [hydrate]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const stats = useMemo(() => computeTaskStats(tasks), [tasks]);

  return {
    tasks, filteredTasks, activity, stats,
    isLoading, error,
    addTask, toggleTask, setTaskStatus, deleteTask,
  };
}
