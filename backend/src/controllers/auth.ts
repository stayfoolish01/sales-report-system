/**
 * 認証コントローラー
 *
 * ログイン、ログアウト、トークンリフレッシュなどの認証処理
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

/**
 * ログイン
 *
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // バリデーション
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'メールアドレスとパスワードは必須です',
        },
      });
      return;
    }

    // ユーザー検索
    const user = await prisma.salesStaff.findUnique({
      where: { email },
      include: {
        manager: {
          select: {
            salesId: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'メールアドレスまたはパスワードが正しくありません',
        },
      });
      return;
    }

    // パスワード検証
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'メールアドレスまたはパスワードが正しくありません',
        },
      });
      return;
    }

    // JWTトークン生成
    const token = generateToken({
      salesId: user.salesId,
      email: user.email,
      role: user.role,
    });

    // レスポンス
    res.json({
      success: true,
      data: {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          sales_id: user.salesId,
          name: user.name,
          email: user.email,
          department: user.department,
          position: user.position,
          role: user.role.toLowerCase(),
          manager: user.manager
            ? {
                sales_id: user.manager.salesId,
                name: user.manager.name,
              }
            : null,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'ログイン処理中にエラーが発生しました',
      },
    });
  }
};

/**
 * ログアウト
 *
 * POST /api/v1/auth/logout
 *
 * JWTはステートレスなため、サーバー側では特別な処理は不要。
 * クライアント側でトークンを削除することでログアウトを実現。
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // JWTベースの認証では、サーバー側でトークンを無効化できない
    // クライアント側でトークンを削除する必要がある
    // 将来的にトークンブラックリストを実装する場合はここで処理

    res.json({
      success: true,
      message: 'ログアウトしました',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'ログアウト処理中にエラーが発生しました',
      },
    });
  }
};

/**
 * 認証状態確認（現在のユーザー情報取得）
 *
 * GET /api/v1/auth/me
 *
 * JWTトークンから現在のユーザー情報を取得して返却します。
 */
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    // authenticateミドルウェアでreq.userに認証情報が格納されている
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

    // データベースから最新のユーザー情報を取得
    const user = await prisma.salesStaff.findUnique({
      where: { salesId: req.user.salesId },
      include: {
        manager: {
          select: {
            salesId: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'ユーザーが見つかりません',
        },
      });
      return;
    }

    // レスポンス
    res.json({
      success: true,
      data: {
        user: {
          sales_id: user.salesId,
          name: user.name,
          email: user.email,
          department: user.department,
          position: user.position,
          role: user.role.toLowerCase(),
          manager: user.manager
            ? {
                sales_id: user.manager.salesId,
                name: user.manager.name,
              }
            : null,
        },
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'ユーザー情報取得中にエラーが発生しました',
      },
    });
  }
};
