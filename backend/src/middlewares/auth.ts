/**
 * JWT認証ミドルウェア
 *
 * リクエストヘッダーからJWTトークンを検証し、
 * 認証済みユーザー情報をreq.userに格納します。
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  MissingTokenError,
  InvalidTokenError,
  ForbiddenError,
} from '../errors/AuthError';

/**
 * JWTペイロード型定義
 */
interface JwtPayload {
  salesId: number;
  email: string;
  role: 'GENERAL' | 'ADMIN';
}

/**
 * JWT認証ミドルウェア
 *
 * Authorization: Bearer <token> 形式のトークンを検証します。
 *
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェアへ
 * @returns 401エラーまたは次のミドルウェアへ
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Authorizationヘッダーを取得
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new MissingTokenError('認証トークンが提供されていません');
    }

    // "Bearer <token>" 形式から<token>部分を抽出
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      throw new MissingTokenError('認証トークンが不正です');
    }

    // JWT_SECRETの確認
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // トークンを検証・デコード
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // req.userに認証済みユーザー情報を格納
    req.user = {
      salesId: decoded.salesId,
      email: decoded.email,
      role: decoded.role,
    };

    // 次のミドルウェアへ
    next();
  } catch (error) {
    // カスタムエラーの場合はそのまま返す
    if (error instanceof MissingTokenError || error instanceof InvalidTokenError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    // トークン検証エラー（jwt.JsonWebTokenErrorまたはTokenExpiredError）
    if (error instanceof jwt.JsonWebTokenError) {
      const invalidTokenError = new InvalidTokenError(
        error instanceof jwt.TokenExpiredError
          ? '認証トークンの有効期限が切れています'
          : '無効な認証トークンです'
      );
      res.status(invalidTokenError.statusCode).json(invalidTokenError.toJSON());
      return;
    }

    // その他のエラーはnextに渡してグローバルエラーハンドラーで処理
    next(error);
  }
};

/**
 * 管理者権限チェックミドルウェア
 *
 * authenticate ミドルウェアの後に使用します。
 * req.user.role が 'ADMIN' でない場合は403エラーを返します。
 *
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェアへ
 * @returns 403エラーまたは次のミドルウェアへ
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    const missingTokenError = new MissingTokenError('認証が必要です');
    res.status(missingTokenError.statusCode).json(missingTokenError.toJSON());
    return;
  }

  if (req.user.role !== 'ADMIN') {
    const forbiddenError = new ForbiddenError('管理者権限が必要です');
    res.status(forbiddenError.statusCode).json(forbiddenError.toJSON());
    return;
  }

  next();
};
