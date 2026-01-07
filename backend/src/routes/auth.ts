/**
 * 認証API ルート
 *
 * 認証関連のエンドポイントを定義
 */

import { Router } from 'express';
import { login, logout, me } from '../controllers/auth';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validators/auth.schemas';
import { authRateLimiter } from '../middlewares/security';

const router = Router();

/**
 * POST /api/v1/auth/login
 * ログイン（レート制限: 15分間に5回まで）
 */
router.post('/login', authRateLimiter, validate(loginSchema), login);

/**
 * POST /api/v1/auth/logout
 * ログアウト（認証必要）
 */
router.post('/logout', authenticate, logout);

/**
 * GET /api/v1/auth/me
 * 認証状態確認（現在のユーザー情報取得）
 */
router.get('/me', authenticate, me);

export default router;
