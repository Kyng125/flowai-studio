import type { User } from '@/types';

const MOCK_DELAY = 600;

const MOCK_USER: User = {
  name: 'Builder',
  role: 'Full-Stack Developer',
  email: 'builder@flowai.studio',
};

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user: User | null;
  error?: string;
}

export async function loginUser(_credentials: LoginCredentials): Promise<LoginResult> {
  await delay(MOCK_DELAY);
  // Mock: always succeeds. Wire real API here.
  return { success: true, user: MOCK_USER };
}

export async function logoutUser(): Promise<void> {
  await delay(200);
}

export async function fetchSession(): Promise<User | null> {
  await delay(100);
  return null; // Handled by storage layer; this is the API stub.
}
