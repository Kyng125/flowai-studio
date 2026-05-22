import type { Task, TaskStatus } from '@/types';
import { COLORS, PRIORITY_META, STATUS_META } from '@/lib/tokens';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

const STATUS_CYCLE: TaskStatus[] = ['todo', 'in-progress', 'done'];

function formatDue(dueDate?: string): { label: string; overdue: boolean } | null {
  if (!dueDate) return null;
  const today = new Date().toISOString().split('T')[0];
  const overdue = dueDate < today;
  const d = new Date(dueDate + 'T00:00:00');
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { label, overdue };
}

export function TaskItem({ task, onToggle, onDelete, onStatusChange }: TaskItemProps) {
  const pm = PRIORITY_META[task.priority];
  const sm = STATUS_META[task.status];
  const due = formatDue(task.dueDate);

  function cycleStatus(e: React.MouseEvent) {
    e.stopPropagation();
    const idx = STATUS_CYCLE.indexOf(task.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onStatusChange(task.id, next);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(task.id);
  }

  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 hover:bg-white/[0.07] cursor-pointer"
      style={{ background: COLORS.surface, borderColor: COLORS.border }}
      onClick={() => onToggle(task.id)}
    >
      {/* Checkbox */}
      <div
        className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
        style={{
          borderColor: task.status === 'done' ? '#6EE7B7' : 'rgba(255,255,255,0.2)',
          background: task.status === 'done' ? '#6EE7B7' : 'transparent',
        }}
      >
        {task.status === 'done' && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="#0B0F14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Title */}
      <span
        className={`flex-1 text-sm min-w-0 truncate ${
          task.status === 'done' ? 'line-through text-white/35' : 'text-white/90'
        }`}
      >
        {task.title}
      </span>

      {/* Due date */}
      {due && (
        <span
          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            color: due.overdue ? '#EF4444' : 'rgba(255,255,255,0.35)',
            background: due.overdue ? 'rgba(239,68,68,0.12)' : 'transparent',
          }}
        >
          {due.overdue ? '⚠ ' : ''}{due.label}
        </span>
      )}

      {/* Priority badge */}
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide"
        style={{ color: pm.color, background: pm.bg }}
      >
        {pm.label}
      </span>

      {/* Status badge — click to cycle */}
      <button
        onClick={cycleStatus}
        className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 border transition-opacity hover:opacity-70"
        style={{
          color: sm.color,
          borderColor: `${sm.color}40`,
          background: `${sm.color}10`,
        }}
        title="Click to cycle status"
      >
        {sm.label}
      </button>

      {/* Delete — appears on hover */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-white/40 hover:text-red-400 transition-all flex-shrink-0 w-5 h-5 flex items-center justify-center rounded"
        title="Delete task"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
