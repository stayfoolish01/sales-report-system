import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// APIクライアントの設定
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// リクエストインターセプター：認証トークンを自動付与
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ブラウザ環境でのみlocalStorageにアクセス
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター：認証エラー時の処理
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 認証エラー時はトークンをクリアしてログイン画面へ
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // ログインページ以外の場合はリダイレクト
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
