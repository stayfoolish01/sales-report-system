import apiClient from './client';
import type { LoginRequest, LoginResponse, AuthError, User } from '../types/auth';
import { AxiosError } from 'axios';

// ログインAPI
export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials
  );
  return response.data;
}

// ログアウトAPI
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    // APIの成功・失敗に関わらずトークンをクリア
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }
}

// 認証状態確認API
export async function getMe(): Promise<User> {
  const response = await apiClient.get<{ success: boolean; data: { user: User } }>(
    '/auth/me'
  );
  return response.data.data.user;
}

// エラーレスポンスからメッセージを取得
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const authError = error.response?.data as AuthError | undefined;
    if (authError?.error?.message) {
      return authError.error.message;
    }
  }
  return 'ログインに失敗しました。しばらく経ってから再度お試しください。';
}
