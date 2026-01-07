// 認証関連の型定義

export interface Manager {
  sales_id: number;
  name: string;
}

export interface User {
  sales_id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  role: 'general' | 'admin';
  manager: Manager | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
  };
}

export interface AuthError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
