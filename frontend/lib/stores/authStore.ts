import { create } from 'zustand';
import type { User, LoginRequest } from '../types/auth';
import {
  login as loginApi,
  logout as logoutApi,
  getMe,
  getAuthErrorMessage,
} from '../api/auth';

// トークンをクッキーに設定（ミドルウェアで読み取るため）
function setTokenCookie(token: string, expiresIn: number) {
  if (typeof document !== 'undefined') {
    const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
    document.cookie = `access_token=${token}; expires=${expires}; path=/; SameSite=Lax`;
  }
}

// トークンクッキーを削除
function removeTokenCookie() {
  if (typeof document !== 'undefined') {
    document.cookie =
      'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // アクション
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginApi(credentials);

      // トークンをlocalStorageとクッキーに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access_token);
        setTokenCookie(response.data.access_token, response.data.expires_in);
      }

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
    } finally {
      // トークンをlocalStorageとクッキーから削除
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        removeTokenCookie();
      }
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    // トークンがない場合は認証チェックをスキップ
    if (
      typeof window !== 'undefined' &&
      !localStorage.getItem('access_token')
    ) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await getMe();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      // 認証エラーの場合はトークンをクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        removeTokenCookie();
      }
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
