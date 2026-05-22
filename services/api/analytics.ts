import type { AnalyticsData } from '@/types';
import { buildAnalyticsPayload } from '@/lib/analytics';
import type { Task } from '@/types';

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchAnalytics(tasks: Task[]): Promise<AnalyticsData> {
  await delay(300);
  return buildAnalyticsPayload(tasks);
}
