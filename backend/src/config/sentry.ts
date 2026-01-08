import * as Sentry from '@sentry/node';
import { Express, Request, Response, NextFunction } from 'express';

/**
 * Sentryの初期化
 * 環境変数 SENTRY_DSN が設定されている場合のみ有効化
 */
export function initSentry(app: Express): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    console.log('📊 Sentry: DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // パスワードなどの機密情報をフィルタリング
      if (event.request?.data) {
        const data = event.request.data as Record<string, unknown>;
        if (typeof data === 'object' && data !== null) {
          if ('password' in data) {
            data.password = '[FILTERED]';
          }
        }
      }
      return event;
    },
  });

  // Sentry v8+ uses setupExpressErrorHandler
  Sentry.setupExpressErrorHandler(app);

  console.log('📊 Sentry: Initialized successfully');
}

/**
 * Sentryリクエストハンドラー
 * Sentry v8+ではミドルウェアは自動的に設定されるため、
 * パススルーミドルウェアを返す
 */
export function sentryRequestHandler() {
  return (_req: Request, _res: Response, next: NextFunction) => next();
}

/**
 * Sentryトレースハンドラー
 * Sentry v8+ではトレースは自動的に設定されるため、
 * パススルーミドルウェアを返す
 */
export function sentryTracingHandler() {
  return (_req: Request, _res: Response, next: NextFunction) => next();
}

/**
 * Sentryエラーハンドラー
 * Sentry v8+ではsetupExpressErrorHandlerで設定されるため、
 * パススルーミドルウェアを返す
 */
export function sentryErrorHandler() {
  return (err: Error, _req: Request, _res: Response, next: NextFunction) => next(err);
}

/**
 * 手動でエラーをキャプチャ
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (!process.env.SENTRY_DSN) {
    console.error('Error (Sentry not configured):', error);
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureException(error);
  });
}

/**
 * 手動でメッセージをキャプチャ
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  if (!process.env.SENTRY_DSN) {
    console.log(`Message (Sentry not configured) [${level}]:`, message);
    return;
  }

  Sentry.captureMessage(message, level);
}

/**
 * ユーザー情報をセット
 */
export function setUser(user: { id: number; email: string; name: string }): void {
  if (!process.env.SENTRY_DSN) return;

  Sentry.setUser({
    id: user.id.toString(),
    email: user.email,
    username: user.name,
  });
}

/**
 * ユーザー情報をクリア
 */
export function clearUser(): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.setUser(null);
}
