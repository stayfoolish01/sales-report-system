/**
 * 訪問記録API ルート
 *
 * 訪問記録関連のエンドポイントを定義
 */

import { Router } from 'express';
import {
  listVisits,
  getVisit,
  createVisit,
  updateVisit,
  deleteVisit,
} from '../controllers/visits';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createVisitSchema, updateVisitSchema } from '../validators/visit.schemas';

const router = Router({ mergeParams: true });

// すべてのルートで認証が必要
router.use(authenticate);

/**
 * GET /api/v1/reports/:reportId/visits
 * 訪問記録一覧取得
 */
router.get('/', listVisits);

/**
 * GET /api/v1/reports/:reportId/visits/:visitId
 * 訪問記録詳細取得
 */
router.get('/:visitId', getVisit);

/**
 * POST /api/v1/reports/:reportId/visits
 * 訪問記録作成
 */
router.post('/', validate(createVisitSchema), createVisit);

/**
 * PUT /api/v1/reports/:reportId/visits/:visitId
 * 訪問記録更新
 */
router.put('/:visitId', validate(updateVisitSchema), updateVisit);

/**
 * DELETE /api/v1/reports/:reportId/visits/:visitId
 * 訪問記録削除
 */
router.delete('/:visitId', deleteVisit);

export default router;
