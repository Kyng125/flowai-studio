export const COLORS = {
  gold: '#D4AF37',
  bgBase: '#0B0F14',
  bgSidebar: '#0F141C',
  surface: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.10)',
} as const;

export const PRIORITY_META = {
  high:   { label: 'High',   color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  medium: { label: 'Med',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  low:    { label: 'Low',    color: '#6EE7B7', bg: 'rgba(110,231,183,0.12)' },
} as const;

export const STATUS_META = {
  'todo':        { label: 'Todo',        color: 'rgba(255,255,255,0.30)' },
  'in-progress': { label: 'In Progress', color: '#F59E0B' },
  'done':        { label: 'Done',        color: '#6EE7B7' },
} as const;
