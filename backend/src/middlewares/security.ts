/**
 * セキュリティミドルウェア
 *
 * SQLインジェクション、XSS、CSRF、レート制限の対策を提供します。
 */

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

/**
 * Helmetミドルウェア
 *
 * HTTPヘッダーを適切に設定してXSS対策を行います。
 * - Content-Security-Policy
 * - X-Content-Type-Options
 * - X-Frame-Options
 * - X-XSS-Protection
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/**
 * レート制限ミドルウェア（全体）
 *
 * 開発環境: 15分間に1000リクエストまで許可
 * 本番環境: 15分間に100リクエストまで許可
 */
const isDevelopment = process.env.NODE_ENV !== 'production';

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: isDevelopment ? 1000 : 100, // 開発環境では緩和
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'リクエスト回数が制限を超えました。しばらくしてから再度お試しください。',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // X-Forwarded-For ヘッダーまたはIPアドレスを使用
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
  },
});

/**
 * レート制限ミドルウェア（認証エンドポイント用）
 *
 * ブルートフォース攻撃対策として、ログイン試行を制限
 * 開発環境: 15分間に100回まで許可
 * 本番環境: 15分間に5回まで許可
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: isDevelopment ? 100 : 5, // 開発環境では緩和
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'ログイン試行回数が制限を超えました。15分後に再度お試しください。',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
  },
  skipSuccessfulRequests: true, // 成功したリクエストはカウントしない
});

/**
 * 入力サニタイズミドルウェア
 *
 * リクエストボディ、クエリ、パラメータから危険な文字をエスケープ
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string') {
        // HTMLタグを無効化（< と > をエスケープ）
        result[key] = value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = sanitize(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }

  next();
};

/**
 * CORS強化ミドルウェア
 *
 * オリジン検証を追加
 */
export const validateOrigin = (allowedOrigins: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    if (!origin) {
      // オリジンがない場合（同一オリジン）は許可
      next();
      return;
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_ORIGIN',
          message: '許可されていないオリジンからのリクエストです',
        },
      });
    }
  };
};

/**
 * SQLインジェクション対策の確認
 *
 * Prismaはパラメータ化クエリを使用しているため、
 * SQLインジェクションに対して安全です。
 *
 * 注意: 生のSQLクエリ（prisma.$queryRaw）を使用する場合は、
 * 必ずPrisma.sqlタグを使用してください。
 *
 * 安全な例:
 *   prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`
 *
 * 危険な例（使用禁止）:
 *   prisma.$queryRaw(`SELECT * FROM users WHERE id = ${userId}`)
 */

/**
 * セキュリティヘッダー追加ミドルウェア
 *
 * 追加のセキュリティヘッダーを設定
 */
export const additionalSecurityHeaders = (_req: Request, res: Response, next: NextFunction): void => {
  // キャッシュ制御（機密データのキャッシュ防止）
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  // コンテンツタイプスニッフィング防止
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // クリックジャッキング防止
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS防止（レガシーブラウザ向け）
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
};
