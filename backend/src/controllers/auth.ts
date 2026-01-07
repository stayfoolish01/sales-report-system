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
