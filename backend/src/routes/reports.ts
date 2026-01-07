/**
 * 日報API ルート
 *
 * 日報関連のエンドポイントを定義
 */

import { Router } from 'express';
import {
  listReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  updateStatus,
} from '../controllers/reports';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createReportSchema, updateReportSchema, updateStatusSchema } from '../validators/report.schemas';

const router = Router();

// すべてのルートで認証が必要
router.use(authenticate);

/**
 * GET /api/v1/reports
 * 日報一覧取得
 */
router.get('/', listReports);

/**
 * GET /api/v1/reports/:id
 * 日報詳細取得
 */
router.get('/:id', getReport);

/**
 * POST /api/v1/reports
 * 日報作成
 */
router.post('/', validate(createReportSchema), createReport);

/**
 * PUT /api/v1/reports/:id
 * 日報更新
 */
router.put('/:id', validate(updateReportSchema), updateReport);

/**
 * DELETE /api/v1/reports/:id
 * 日報削除
 */
router.delete('/:id', deleteReport);

/**
 * PATCH /api/v1/reports/:id/status
 * 日報ステータス更新（提出/下書きに戻す）
 */
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);

export default router;
