/**
 * 顧客マスタAPI ルート
 *
 * 顧客マスタ関連のエンドポイントを定義
 */

import { Router } from 'express';
import {
  listCustomers,
  getCustomer,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customers';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.schemas';

const router = Router();

// すべてのルートで認証が必要
router.use(authenticate);

/**
 * GET /api/v1/customers/search
 * 顧客検索（オートコンプリート用）
 * 注: 詳細取得の前に配置（:customerIdとの競合を防ぐ）
 */
router.get('/search', searchCustomers);

/**
 * GET /api/v1/customers
 * 顧客一覧取得
 */
router.get('/', listCustomers);

/**
 * GET /api/v1/customers/:customerId
 * 顧客詳細取得
 */
router.get('/:customerId', getCustomer);

/**
 * POST /api/v1/customers
 * 顧客作成
 */
router.post('/', validate(createCustomerSchema), createCustomer);

/**
 * PUT /api/v1/customers/:customerId
 * 顧客更新
 */
router.put('/:customerId', validate(updateCustomerSchema), updateCustomer);

/**
 * DELETE /api/v1/customers/:customerId
 * 顧客削除
 */
router.delete('/:customerId', deleteCustomer);

export default router;
