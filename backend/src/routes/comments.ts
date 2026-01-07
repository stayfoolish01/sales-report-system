/**
 * コメントAPI ルート
 *
 * コメント関連のエンドポイントを定義
 */

import { Router } from 'express';
import {
  listComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comments';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.schemas';

const router = Router({ mergeParams: true });

// すべてのルートで認証が必要
router.use(authenticate);

/**
 * GET /api/v1/reports/:reportId/comments
 * コメント一覧取得
 */
router.get('/', listComments);

/**
 * GET /api/v1/reports/:reportId/comments/:commentId
 * コメント詳細取得
 */
router.get('/:commentId', getComment);

/**
 * POST /api/v1/reports/:reportId/comments
 * コメント作成
 */
router.post('/', validate(createCommentSchema), createComment);

/**
 * PUT /api/v1/reports/:reportId/comments/:commentId
 * コメント更新
 */
router.put('/:commentId', validate(updateCommentSchema), updateComment);

/**
 * DELETE /api/v1/reports/:reportId/comments/:commentId
 * コメント削除
 */
router.delete('/:commentId', deleteComment);

export default router;
