/**
 * コメントコントローラー
 *
 * コメントのCRUD操作を処理します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, CommentType } from '@prisma/client';
import { createSuccessResponse } from '../types/response';
import { ValidationError, ForbiddenError } from '../errors/AuthError';

const prisma = new PrismaClient();

/**
 * 日報の情報を取得するヘルパー関数
 */
const getReportInfo = async (
  reportId: number
): Promise<{ reportId: number; salesId: number; status: string } | null> => {
  const report = await prisma.dailyReport.findUnique({
    where: { reportId },
    select: { reportId: true, salesId: true, status: true },
  });
  return report;
};

/**
 * コメント一覧取得
 *
 * GET /api/v1/reports/:reportId/comments
 */
export const listComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);

    if (isNaN(reportId)) {
      throw new ValidationError('日報IDが無効です');
    }

    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';
    const { comment_type } = req.query;

    // 日報の存在確認と権限チェック
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    if (!isAdmin && report.salesId !== salesId) {
      throw new ForbiddenError('この日報のコメントを閲覧する権限がありません');
    }

    // クエリ条件を構築
    const whereCondition: { reportId: number; commentType?: CommentType } = {
      reportId,
    };

    if (comment_type) {
      whereCondition.commentType = comment_type as CommentType;
    }

    // コメント一覧を取得
    const comments = await prisma.comment.findMany({
      where: whereCondition,
      include: {
        commenter: {
          select: {
            salesId: true,
            name: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // レスポンス形式に変換
    const items = comments.map((comment) => ({
      comment_id: comment.commentId,
      comment_type: comment.commentType,
      comment_content: comment.commentContent,
      created_at: comment.createdAt.toISOString(),
      commenter: {
        sales_id: comment.commenter.salesId,
        name: comment.commenter.name,
        department: comment.commenter.department,
        position: comment.commenter.position,
      },
    }));

    res.json(createSuccessResponse({ comments: items }));
  } catch (error) {
    next(error);
  }
};

/**
 * コメント詳細取得
 *
 * GET /api/v1/reports/:reportId/comments/:commentId
 */
export const getComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);
    const commentId = parseInt(req.params.commentId, 10);

    if (isNaN(reportId) || isNaN(commentId)) {
      throw new ValidationError('IDが無効です');
    }

    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    // 日報の存在確認と権限チェック
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    if (!isAdmin && report.salesId !== salesId) {
      throw new ForbiddenError('このコメントを閲覧する権限がありません');
    }

    // コメントを取得
    const comment = await prisma.comment.findFirst({
      where: { commentId, reportId },
      include: {
        commenter: {
          select: {
            salesId: true,
            name: true,
            department: true,
            position: true,
          },
        },
      },
    });

    if (!comment) {
      throw new ValidationError('コメントが見つかりません');
    }

    // レスポンス形式に変換
    const responseData = {
      comment_id: comment.commentId,
      comment_type: comment.commentType,
      comment_content: comment.commentContent,
      created_at: comment.createdAt.toISOString(),
      commenter: {
        sales_id: comment.commenter.salesId,
        name: comment.commenter.name,
        department: comment.commenter.department,
        position: comment.commenter.position,
      },
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * コメント作成
 *
 * POST /api/v1/reports/:reportId/comments
 */
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);

    if (isNaN(reportId)) {
      throw new ValidationError('日報IDが無効です');
    }

    const { comment_type, comment_content } = req.body;
    const commenterId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    // 日報の存在確認
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    // 日報作成者本人または管理者のみコメント可能
    if (!isAdmin && report.salesId !== commenterId) {
      throw new ForbiddenError('この日報にコメントを追加する権限がありません');
    }

    // コメントを作成
    const comment = await prisma.comment.create({
      data: {
        reportId,
        commentType: comment_type as CommentType,
        commentContent: comment_content,
        commenterId,
      },
      include: {
        commenter: {
          select: {
            salesId: true,
            name: true,
            department: true,
            position: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      comment_id: comment.commentId,
      comment_type: comment.commentType,
      comment_content: comment.commentContent,
      created_at: comment.createdAt.toISOString(),
      commenter: {
        sales_id: comment.commenter.salesId,
        name: comment.commenter.name,
        department: comment.commenter.department,
        position: comment.commenter.position,
      },
    };

    res.status(201).json(createSuccessResponse(responseData, 'コメントを作成しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * コメント更新
 *
 * PUT /api/v1/reports/:reportId/comments/:commentId
 */
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);
    const commentId = parseInt(req.params.commentId, 10);

    if (isNaN(reportId) || isNaN(commentId)) {
      throw new ValidationError('IDが無効です');
    }

    const { comment_content } = req.body;
    const salesId = req.user!.salesId;

    // 日報の存在確認
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    // コメントの存在確認
    const existingComment = await prisma.comment.findFirst({
      where: { commentId, reportId },
    });

    if (!existingComment) {
      throw new ValidationError('コメントが見つかりません');
    }

    // コメント投稿者本人のみ更新可能
    if (existingComment.commenterId !== salesId) {
      throw new ForbiddenError('このコメントを更新する権限がありません');
    }

    // コメントを更新
    const comment = await prisma.comment.update({
      where: { commentId },
      data: {
        commentContent: comment_content,
      },
      include: {
        commenter: {
          select: {
            salesId: true,
            name: true,
            department: true,
            position: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      comment_id: comment.commentId,
      comment_type: comment.commentType,
      comment_content: comment.commentContent,
      created_at: comment.createdAt.toISOString(),
      commenter: {
        sales_id: comment.commenter.salesId,
        name: comment.commenter.name,
        department: comment.commenter.department,
        position: comment.commenter.position,
      },
    };

    res.json(createSuccessResponse(responseData, 'コメントを更新しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * コメント削除
 *
 * DELETE /api/v1/reports/:reportId/comments/:commentId
 */
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);
    const commentId = parseInt(req.params.commentId, 10);

    if (isNaN(reportId) || isNaN(commentId)) {
      throw new ValidationError('IDが無効です');
    }

    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    // 日報の存在確認
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    // コメントの存在確認
    const existingComment = await prisma.comment.findFirst({
      where: { commentId, reportId },
    });

    if (!existingComment) {
      throw new ValidationError('コメントが見つかりません');
    }

    // コメント投稿者本人または管理者のみ削除可能
    if (!isAdmin && existingComment.commenterId !== salesId) {
      throw new ForbiddenError('このコメントを削除する権限がありません');
    }

    // コメントを削除
    await prisma.comment.delete({
      where: { commentId },
    });

    res.json(createSuccessResponse(null, 'コメントを削除しました'));
  } catch (error) {
    next(error);
  }
};
