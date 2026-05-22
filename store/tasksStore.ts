import { create } from 'zustand';
import type { Task, TaskStatus, TaskPriority, ActivityEvent } from '@/types';
import storage, { STORAGE_KEYS } from '@/lib/storage';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/services/api/tasks';

interface TasksState {
  tasks: Task[];
  activity: ActivityEvent[];
  isLoading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  addTask: (title: string, priority?: TaskPriority, dueDate?: string) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  setTaskStatus: (id: number, status: TaskStatus) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

function persistTasks(tasks: Task[]) {
  storage.setItem(STORAGE_KEYS.TASKS, tasks);
}

function persistActivity(activity: ActivityEvent[]) {
  storage.setItem(STORAGE_KEYS.ACTIVITY, activity);
}

function pushEvent(
  activity: ActivityEvent[],
  type: ActivityEvent['type'],
  taskTitle: string,
  meta?: string,
): ActivityEvent[] {
  const event: ActivityEvent = {
    id: Date.now() + Math.random(),
    type,
    taskTitle,
    meta,
    timestamp: Date.now(),
  };
  // Keep latest 50 events
  return [event, ...activity].slice(0, 50);
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  activity: [],
  isLoading: false,
  error: null,

  async hydrate() {
    set({ isLoading: true });
    const cachedTasks = storage.getItem<Task[]>(STORAGE_KEYS.TASKS);
    const cachedActivity = storage.getItem<ActivityEvent[]>(STORAGE_KEYS.ACTIVITY) ?? [];

    if (cachedTasks && cachedTasks.length > 0) {
      set({ tasks: cachedTasks, activity: cachedActivity, isLoading: false });
    } else {
      const tasks = await fetchTasks();
      persistTasks(tasks);
      set({ tasks, activity: cachedActivity, isLoading: false });
    }
  },

  async addTask(title, priority = 'medium', dueDate) {
    const task = await createTask(title, priority, dueDate);
    const tasks = [...get().tasks, task];
    const activity = pushEvent(get().activity, 'created', title);
    persistTasks(tasks);
    persistActivity(activity);
    set({ tasks, activity });
  },

  async toggleTask(id) {
    const current = get().tasks.find((t) => t.id === id);
    if (!current) return;
    const newStatus: TaskStatus = current.status === 'done' ? 'todo' : 'done';
    await updateTaskStatus(id, newStatus);
    const tasks = get().tasks.map((t) => t.id === id ? { ...t, status: newStatus } : t);
    const evtType: ActivityEvent['type'] = newStatus === 'done' ? 'completed' : 'uncompleted';
    const activity = pushEvent(get().activity, evtType, current.title);
    persistTasks(tasks);
    persistActivity(activity);
    set({ tasks, activity });
  },

  async setTaskStatus(id, status) {
    const current = get().tasks.find((t) => t.id === id);
    if (!current) return;
    await updateTaskStatus(id, status);
    const tasks = get().tasks.map((t) => t.id === id ? { ...t, status } : t);
    const activity = pushEvent(get().activity, 'status_changed', current.title, status);
    persistTasks(tasks);
    persistActivity(activity);
    set({ tasks, activity });
  },

  async deleteTask(id) {
    const current = get().tasks.find((t) => t.id === id);
    await deleteTask(id);
    const tasks = get().tasks.filter((t) => t.id !== id);
    const activity = current
      ? pushEvent(get().activity, 'deleted', current.title)
      : get().activity;
    persistTasks(tasks);
    persistActivity(activity);
    set({ tasks, activity });
  },
}));
