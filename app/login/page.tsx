'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { COLORS } from '@/lib/tokens';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  async function handleSubmit() {
    const success = await login({ email, password });
    if (success) router.push('/dashboard');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: COLORS.bgBase, color: 'white' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl border backdrop-blur-xl"
        style={{ background: 'rgba(255,255,255,0.04)', borderColor: COLORS.border }}
      >
        <h1 className="text-2xl font-semibold text-center">
          FlowAI <span style={{ color: COLORS.gold }}>.studio</span>
        </h1>
        <p className="text-center text-white/40 text-sm mt-2">
          Executive SaaS Access Portal
        </p>

        <div className="mt-8 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-white/30 outline-none"
            style={{ background: 'rgba(0,0,0,0.4)', borderColor: COLORS.border }}
            placeholder="Email"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-white/30 outline-none"
            style={{ background: 'rgba(0,0,0,0.4)', borderColor: COLORS.border }}
            placeholder="Password"
            autoComplete="current-password"
          />

          {error && (
            <p className="text-xs text-red-400 px-1">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: COLORS.gold, color: COLORS.bgBase }}
          >
            {isLoading ? 'Signing in…' : 'Enter Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
