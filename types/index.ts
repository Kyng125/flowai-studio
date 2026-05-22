export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO date string YYYY-MM-DD
  createdAt: number; // unix ms timestamp
}

export interface ActivityEvent {
  id: number;
  type: 'created' | 'completed' | 'uncompleted' | 'deleted' | 'status_changed';
  taskTitle: string;
  meta?: string; // extra context e.g. new status
  timestamp: number;
}

export interface User {
  name: string;
  role: string;
  email: string;
}

export interface UserPreferences {
  accentColor: string;
  notifications: boolean;
  displayName: string;
  role: string;
}

export interface AuthSession {
  isLoggedIn: boolean;
  user: User | null;
}

export interface TaskStats {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  efficiency: number;
}

export interface AnalyticsData {
  weeklyProgress: number[];
  stats: TaskStats;
}
