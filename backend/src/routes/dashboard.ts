/**
 * ダッシュボードAPI ルート
 *
 * ダッシュボード関連のエンドポイントを定義
 */

import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard';
import { authenticate } from '../middlewares/auth';

const router = Router();

// すべてのルートで認証が必要
router.use(authenticate);

/**
 * GET /api/v1/dashboard/summary
 * ダッシュボード概要データ取得
 */
router.get('/summary', getDashboardSummary);

export default router;
