'use client';

import { useAuthStore } from '@/lib/stores/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-lg">
          ようこそ、<span className="font-semibold">{user?.name}</span> さん
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {user?.department} / {user?.position || '役職なし'}
        </p>
        <p className="text-sm text-muted-foreground">
          権限: {user?.role === 'admin' ? '管理者' : '一般'}
        </p>
      </div>

      <p className="mt-8 text-center text-muted-foreground">
        ダッシュボード画面は Issue #26 で実装予定です
      </p>
    </div>
  );
}
