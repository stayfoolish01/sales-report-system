/**
 * 共通レスポンス型定義
 *
 * すべてのAPIレスポンスで使用する統一された型を定義します。
 */

/**
 * エラー情報の型定義
 */
export interface ApiError {
  /** エラーコード（例: 'VALIDATION_ERROR', 'UNAUTHORIZED'） */
  code: string;
  /** エラーメッセージ（ユーザー向け） */
  message: string;
  /** 追加情報（開発環境でのみ使用） */
  stack?: string;
}

/**
 * 成功レスポンスの型定義
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * エラーレスポンスの型定義
 */
export interface ErrorResponse {
  success: false;
  error: ApiError;
}

/**
 * APIレスポンスの型定義（成功またはエラー）
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * ページネーション情報の型定義
 */
export interface PaginationMeta {
  /** 現在のページ番号（1から開始） */
  page: number;
  /** 1ページあたりの件数 */
  limit: number;
  /** 総件数 */
  total: number;
  /** 総ページ数 */
  totalPages: number;
}

/**
 * ページネーション付きレスポンスの型定義
 */
export interface PaginatedResponse<T> {
  success: true;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

/**
 * ユーザー情報の型定義（レスポンス用）
 */
export interface UserResponse {
  sales_id: number;
  name: string;
  email: string;
  department: string | null;
  position: string | null;
  role: string;
  manager: {
    sales_id: number;
    name: string;
  } | null;
}

/**
 * ログインレスポンスのdata部分の型定義
 */
export interface LoginResponseData {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: UserResponse;
}

/**
 * 成功レスポンスを生成するヘルパー関数
 */
export const createSuccessResponse = <T>(data: T, message?: string): SuccessResponse<T> => {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
};

/**
 * エラーレスポンスを生成するヘルパー関数
 */
export const createErrorResponse = (code: string, message: string, stack?: string): ErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(stack && { stack }),
    },
  };
};

/**
 * ページネーション付きレスポンスを生成するヘルパー関数
 */
export const createPaginatedResponse = <T>(
  items: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => {
  return {
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};