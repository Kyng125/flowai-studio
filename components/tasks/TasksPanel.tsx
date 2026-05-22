'use client';

import { useState } from 'react';
import { TaskItem } from '@/components/tasks/TaskItem';
import { useTasks } from '@/hooks/useTasks';
import { useUIStore } from '@/store/uiStore';
import { COLORS, PRIORITY_META } from '@/lib/tokens';
import type { TaskStatus, TaskPriority } from '@/types';

type FilterOption = 'all' | TaskStatus;
type SortOption = 'created' | 'priority' | 'due' | 'status';

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_ORDER: Record<TaskStatus, number> = { 'in-progress': 0, 'todo': 1, 'done': 2 };

export function TasksPanel() {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('created');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { filteredTasks, isLoading, addTask, toggleTask, setTaskStatus, deleteTask } = useTasks(filter);
  const showToast = useUIStore((s) => s.showToast);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (sort === 'status') return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (sort === 'due') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    return b.createdAt - a.createdAt; // newest first
  });

  async function handleAdd() {
    if (!newTaskTitle.trim()) return;
    setIsAdding(true);
    await addTask(newTaskTitle.trim(), newPriority, newDueDate || undefined);
    setNewTaskTitle('');
    setNewDueDate('');
    setNewPriority('medium');
    setShowForm(false);
    setIsAdding(false);
    showToast('Task added', 'success');
  }

  async function handleToggle(id: number) {
    await toggleTask(id);
    showToast('Task updated');
  }

  async function handleDelete(id: number) {
    await deleteTask(id);
    showToast('Task deleted', 'error');
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    await setTaskStatus(id, status);
    showToast('Status updated');
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Task System</h3>
          <p className="text-xs text-white/35 mt-0.5">{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
          style={{ background: showForm ? 'rgba(255,255,255,0.08)' : COLORS.gold, color: showForm ? 'white' : COLORS.bgBase }}
        >
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {/* New task form */}
      {showForm && (
        <div
          className="p-4 rounded-xl border space-y-3"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: COLORS.border }}
        >
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="w-full px-4 py-2.5 rounded-lg border text-sm text-white placeholder-white/25 outline-none bg-transparent"
            style={{ borderColor: COLORS.border }}
            placeholder="Task title…"
            autoFocus
            disabled={isAdding}
          />
          <div className="flex gap-3 flex-wrap">
            {/* Priority picker */}
            <div className="flex gap-1.5">
              {(Object.keys(PRIORITY_META) as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewPriority(p)}
                  className="text-xs px-2.5 py-1 rounded-full border transition-all"
                  style={{
                    color: newPriority === p ? PRIORITY_META[p].color : 'rgba(255,255,255,0.35)',
                    borderColor: newPriority === p ? `${PRIORITY_META[p].color}60` : 'rgba(255,255,255,0.1)',
                    background: newPriority === p ? PRIORITY_META[p].bg : 'transparent',
                  }}
                >
                  {PRIORITY_META[p].label}
                </button>
              ))}
            </div>
            {/* Due date */}
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="text-xs px-3 py-1 rounded-lg border bg-transparent text-white/60 outline-none"
              style={{ borderColor: COLORS.border, colorScheme: 'dark' }}
            />
            <button
              onClick={handleAdd}
              disabled={isAdding || !newTaskTitle.trim()}
              className="ml-auto px-4 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-85 disabled:opacity-30"
              style={{ background: COLORS.gold, color: COLORS.bgBase }}
            >
              {isAdding ? 'Adding…' : 'Add Task'}
            </button>
          </div>
        </div>
      )}

      {/* Filters + Sort */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1 flex-1 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: filter === opt.value ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: filter === opt.value ? 'white' : 'rgba(255,255,255,0.40)',
                border: `1px solid ${filter === opt.value ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-xs px-3 py-1.5 rounded-lg border bg-transparent text-white/50 outline-none"
          style={{ borderColor: COLORS.border }}
        >
          <option value="created">Newest</option>
          <option value="priority">Priority</option>
          <option value="due">Due Date</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-white/25 text-sm">No tasks found.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-xs underline underline-offset-2"
            style={{ color: COLORS.gold }}
          >
            Add your first task
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
