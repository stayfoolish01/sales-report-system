/**
 * 営業担当API ルート
 *
 * 営業担当関連のエンドポイントを定義
 */

import { Router } from 'express';
import {
  listSalesStaff,
  getSalesStaff,
  createSalesStaff,
  updateSalesStaff,
  deleteSalesStaff,
} from '../controllers/salesStaff';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createSalesStaffSchema, updateSalesStaffSchema } from '../validators/salesStaff.schemas';

const router = Router();

// すべてのルートで認証が必要
router.use(authenticate);

/**
 * GET /api/v1/sales-staff
 * 営業担当一覧取得
 */
router.get('/', listSalesStaff);

/**
 * GET /api/v1/sales-staff/:salesId
 * 営業担当詳細取得
 */
router.get('/:salesId', getSalesStaff);

/**
 * POST /api/v1/sales-staff
 * 営業担当作成
 */
router.post('/', validate(createSalesStaffSchema), createSalesStaff);

/**
 * PUT /api/v1/sales-staff/:salesId
 * 営業担当更新
 */
router.put('/:salesId', validate(updateSalesStaffSchema), updateSalesStaff);

/**
 * DELETE /api/v1/sales-staff/:salesId
 * 営業担当削除
 */
router.delete('/:salesId', deleteSalesStaff);

export default router;
