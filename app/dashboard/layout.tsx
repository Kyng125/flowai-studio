'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Toast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/lib/tokens';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // Splash while hydrating session
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: COLORS.bgBase }}
      >
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: COLORS.bgBase, color: 'white' }}
    >
      <Toast />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <section className="flex-1 p-8 overflow-y-auto">{children}</section>
      </main>
    </div>
  );
}
