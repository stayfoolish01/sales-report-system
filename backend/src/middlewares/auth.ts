/**
 * JWT認証ミドルウェア
 *
 * リクエストヘッダーからJWTトークンを検証し、
 * 認証済みユーザー情報をreq.userに格納します。
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '認証トークンが提供されていません',
        },
      });
      return;
    }

    // "Bearer <token>" 形式から<token>部分を抽出
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '認証トークンが不正です',
        },
      });
      return;
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
    // トークン検証エラー
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '無効な認証トークンです',
        },
      });
      return;
    }

    // トークン期限切れエラー
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '認証トークンの有効期限が切れています',
        },
      });
      return;
    }

    // その他のエラー
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '認証処理中にエラーが発生しました',
      },
    });
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
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '認証が必要です',
      },
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: '管理者権限が必要です',
      },
    });
    return;
  }

  next();
};
