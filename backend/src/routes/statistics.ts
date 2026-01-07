/**
 * 統計API ルート
 *
 * 統計関連のエンドポイントを定義
 */

import { Router } from 'express';
import {
  getDashboardStats,
  getMonthlyStats,
  getCustomerStats,
} from '../controllers/statistics';
import { authenticate } from '../middlewares/auth';

const router = Router();

// すべてのルートで認証が必要
router.use(authenticate);

/**
 * GET /api/v1/statistics/dashboard
 * ダッシュボード統計取得
 */
router.get('/dashboard', getDashboardStats);

/**
 * GET /api/v1/statistics/monthly
 * 月別統計取得
 */
router.get('/monthly', getMonthlyStats);

/**
 * GET /api/v1/statistics/customers
 * 顧客別訪問統計取得
 */
router.get('/customers', getCustomerStats);

export default router;
