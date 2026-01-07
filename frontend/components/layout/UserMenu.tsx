'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/authStore';

export function UserMenu() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{user.name}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* ドロップダウンメニュー */}
          <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border bg-card shadow-lg">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.department}</p>
              <p className="text-xs text-muted-foreground">
                {user.role === 'admin' ? '管理者' : '一般'}
              </p>
            </div>
            <div className="p-1">
              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
