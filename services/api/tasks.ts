import type { Task, TaskStatus, TaskPriority } from '@/types';

const MOCK_DELAY = 300;

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'Design landing page', status: 'done', priority: 'high', createdAt: Date.now() - 86400000 * 3 },
  { id: 2, title: 'Build API endpoints', status: 'in-progress', priority: 'high', createdAt: Date.now() - 86400000 * 2 },
  { id: 3, title: 'Refine UI spacing', status: 'todo', priority: 'medium', createdAt: Date.now() - 86400000 },
  { id: 4, title: 'Write unit tests', status: 'todo', priority: 'low', dueDate: '2025-06-01', createdAt: Date.now() - 3600000 },
];

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchTasks(): Promise<Task[]> {
  await delay(MOCK_DELAY);
  return DEFAULT_TASKS;
}

export async function createTask(
  title: string,
  priority: TaskPriority = 'medium',
  dueDate?: string,
): Promise<Task> {
  await delay(MOCK_DELAY);
  return { id: Date.now(), title, status: 'todo', priority, dueDate, createdAt: Date.now() };
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<{ id: number; status: TaskStatus }> {
  await delay(150);
  return { id, status };
}

export async function deleteTask(id: number): Promise<{ id: number }> {
  await delay(150);
  return { id };
}
