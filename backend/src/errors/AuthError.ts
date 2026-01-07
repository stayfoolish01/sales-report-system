/**
 * 認証エラークラス
 *
 * 認証関連のエラーをカスタムエラークラスとして定義し、
 * 統一的なエラーハンドリングを実現します。
 */

/**
 * ベース認証エラークラス
 */
export class AuthError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    // プロトタイプチェーンを正しく設定
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  /**
   * エラーレスポンスオブジェクトを生成
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.errorCode,
        message: this.message,
      },
    };
  }
}

/**
 * 認証情報が無効な場合のエラー（401 Unauthorized）
 */
export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'メールアドレスまたはパスワードが正しくありません') {
    super(message, 401, 'INVALID_CREDENTIALS');
    this.name = 'InvalidCredentialsError';
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

/**
 * トークンが無効または期限切れの場合のエラー（401 Unauthorized）
 */
export class InvalidTokenError extends AuthError {
  constructor(message: string = '認証トークンが無効または期限切れです') {
    super(message, 401, 'INVALID_TOKEN');
    this.name = 'InvalidTokenError';
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

/**
 * トークンが提供されていない場合のエラー（401 Unauthorized）
 */
export class MissingTokenError extends AuthError {
  constructor(message: string = '認証トークンが提供されていません') {
    super(message, 401, 'MISSING_TOKEN');
    this.name = 'MissingTokenError';
    Object.setPrototypeOf(this, MissingTokenError.prototype);
  }
}

/**
 * 権限が不足している場合のエラー（403 Forbidden）
 */
export class ForbiddenError extends AuthError {
  constructor(message: string = 'この操作を実行する権限がありません') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * ユーザーが見つからない場合のエラー（404 Not Found）
 */
export class UserNotFoundError extends AuthError {
  constructor(message: string = 'ユーザーが見つかりません') {
    super(message, 404, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

/**
 * バリデーションエラー（400 Bad Request）
 */
export class ValidationError extends AuthError {
  constructor(message: string = '入力値が無効です') {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
