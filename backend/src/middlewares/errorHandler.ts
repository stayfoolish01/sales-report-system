/**
 * グローバルエラーハンドラーミドルウェア
 *
 * すべてのエラーを一元的に処理し、統一されたエラーレスポンスを返します。
 */

import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../errors/AuthError';

/**
 * グローバルエラーハンドラー
 *
 * すべてのエラーをキャッチし、適切なHTTPレスポンスを返します。
 * カスタムエラークラスの場合は、そのエラー情報を使用します。
 * それ以外のエラーは500エラーとして処理します。
 *
 * @param err - エラーオブジェクト
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェア（未使用）
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // カスタムエラークラス（AuthError）の場合
  if (err instanceof AuthError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  // 本番環境ではスタックトレースを非表示
  const isDevelopment = process.env.NODE_ENV === 'development';

  // その他のエラーは500エラーとして処理
  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'サーバー内部エラーが発生しました',
      ...(isDevelopment && { stack: err.stack }),
    },
  });
};

/**
 * 404エラーハンドラー
 *
 * 存在しないエンドポイントへのリクエストを処理します。
 *
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `エンドポイント ${req.method} ${req.path} が見つかりません`,
    },
  });
};
