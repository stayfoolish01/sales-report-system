'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Loader2 } from 'lucide-react';

// 認証不要なパス
const publicPaths = ['/login'];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isChecking || isLoading) return;

    // 未認証で保護されたページにアクセスした場合
    if (!isAuthenticated && !isPublicPath) {
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    // 認証済みでログインページにアクセスした場合
    if (isAuthenticated && isPublicPath) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isLoading, isChecking, isPublicPath, pathname, router]);

  // 認証チェック中はローディング表示
  if (isChecking || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証で保護されたページの場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated && !isPublicPath) {
    return null;
  }

  // 認証済みでログインページの場合は何も表示しない（リダイレクト中）
  if (isAuthenticated && isPublicPath) {
    return null;
  }

  return <>{children}</>;
}
