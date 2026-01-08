/**
 * 日報コントローラー
 *
 * 日報のCRUD操作を処理します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Status } from '@prisma/client';
import { createSuccessResponse, createPaginatedResponse } from '../types/response';
import { ValidationError, ForbiddenError } from '../errors/AuthError';

const prisma = new PrismaClient();

/**
 * 日報一覧取得
 *
 * GET /api/v1/reports
 */
export const listReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page: pageStr = '1', limit: limitStr = '10', start_date, end_date, status } = req.query as {
      page?: string;
      limit?: string;
      start_date?: string;
      end_date?: string;
      status?: Status;
    };

    // クエリパラメータを数値に変換
    const page = parseInt(pageStr, 10) || 1;
    const limit = parseInt(limitStr, 10) || 10;

    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    // フィルター条件を構築
    const where: {
      salesId?: number;
      reportDate?: { gte?: Date; lte?: Date };
      status?: Status;
    } = {};

    // 一般ユーザーは自分の日報のみ取得
    if (!isAdmin) {
      where.salesId = salesId;
    }

    // 日付範囲フィルター
    if (start_date || end_date) {
      where.reportDate = {};
      if (start_date) {
        where.reportDate.gte = new Date(start_date);
      }
      if (end_date) {
        where.reportDate.lte = new Date(end_date);
      }
    }

    // ステータスフィルター
    if (status) {
      where.status = status;
    }

    // 総件数を取得
    const total = await prisma.dailyReport.count({ where });

    // 日報一覧を取得
    const reports = await prisma.dailyReport.findMany({
      where,
      include: {
        salesStaff: {
          select: {
            salesId: true,
            name: true,
            department: true,
          },
        },
        visitRecords: {
          include: {
            customer: {
              select: {
                customerId: true,
                customerName: true,
                companyName: true,
              },
            },
          },
          orderBy: {
            visitOrder: 'asc',
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        reportDate: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // レスポンス形式に変換
    const items = reports.map((report) => ({
      report_id: report.reportId,
      report_date: report.reportDate.toISOString().split('T')[0],
      problem: report.problem,
      plan: report.plan,
      status: report.status.toLowerCase(),
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
      sales_staff: {
        sales_id: report.salesStaff.salesId,
        name: report.salesStaff.name,
        department: report.salesStaff.department,
      },
      visit_records: report.visitRecords.map((visit) => ({
        visit_id: visit.visitId,
        visit_content: visit.visitContent,
        visit_order: visit.visitOrder,
        customer: {
          customer_id: visit.customer.customerId,
          customer_name: visit.customer.customerName,
          company_name: visit.customer.companyName,
        },
      })),
      comment_count: report._count.comments,
    }));

    res.json(createPaginatedResponse(items, page, limit, total));
  } catch (error) {
    next(error);
  }
};

/**
 * 日報詳細取得
 *
 * GET /api/v1/reports/:id
 */
export const getReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.id, 10);

    if (isNaN(reportId)) {
      throw new ValidationError('日報IDが無効です');
    }

    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    const report = await prisma.dailyReport.findUnique({
      where: { reportId },
      include: {
        salesStaff: {
          select: {
            salesId: true,
            name: true,
            department: true,
            position: true,
          },
        },
        visitRecords: {
          include: {
            customer: true,
          },
          orderBy: {
            visitOrder: 'asc',
          },
        },
        comments: {
          include: {
            commenter: {
              select: {
                salesId: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    // 権限チェック: 一般ユーザーは自分の日報のみ閲覧可能
    if (!isAdmin && report.salesId !== salesId) {
      throw new ForbiddenError('この日報を閲覧する権限がありません');
    }

    // レスポンス形式に変換
    const responseData = {
      report_id: report.reportId,
      report_date: report.reportDate.toISOString().split('T')[0],
      problem: report.problem,
      plan: report.plan,
      status: report.status.toLowerCase(),
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
      sales_staff: {
        sales_id: report.salesStaff.salesId,
        name: report.salesStaff.name,
        department: report.salesStaff.department,
        position: report.salesStaff.position,
      },
      visit_records: report.visitRecords.map((visit) => ({
        visit_id: visit.visitId,
        visit_content: visit.visitContent,
        visit_order: visit.visitOrder,
        customer: {
          customer_id: visit.customer.customerId,
          customer_name: visit.customer.customerName,
          company_name: visit.customer.companyName,
          department: visit.customer.department,
          phone: visit.customer.phone,
          email: visit.customer.email,
        },
      })),
      comments: report.comments.map((comment) => ({
        comment_id: comment.commentId,
        comment_type: comment.commentType.toLowerCase(),
        comment_content: comment.commentContent,
        created_at: comment.createdAt.toISOString(),
        commenter: {
          sales_id: comment.commenter.salesId,
          name: comment.commenter.name,
        },
      })),
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * 日報作成
 *
 * POST /api/v1/reports
 */
export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { report_date, problem, plan, status, visits } = req.body;
    const salesId = req.user!.salesId;

    // 同じ日付の日報が既に存在するかチェック
    const existingReport = await prisma.dailyReport.findUnique({
      where: {
        salesId_reportDate: {
          salesId,
          reportDate: new Date(report_date),
        },
      },
    });

    if (existingReport) {
      throw new ValidationError('指定された日付の日報は既に存在します');
    }

    // デバッグログ
    console.log('Creating report with visits:', JSON.stringify(visits));

    // 日報と訪問記録をトランザクションで作成
    const report = await prisma.$transaction(async (tx) => {
      // 日報を作成
      const newReport = await tx.dailyReport.create({
        data: {
          salesId,
          reportDate: new Date(report_date),
          problem: problem || null,
          plan: plan || null,
          status: status || 'DRAFT',
        },
      });

      // 訪問記録がある場合は作成
      if (visits && Array.isArray(visits) && visits.length > 0) {
        await tx.visitRecord.createMany({
          data: visits.map((visit: { customer_id: number; content: string }, index: number) => ({
            reportId: newReport.reportId,
            customerId: visit.customer_id,
            visitContent: visit.content || '',
            visitOrder: index + 1,
          })),
        });
      }

      // 作成した日報を関連データと一緒に取得
      return tx.dailyReport.findUnique({
        where: { reportId: newReport.reportId },
        include: {
          salesStaff: {
            select: {
              salesId: true,
              name: true,
              department: true,
            },
          },
          visitRecords: {
            include: {
              customer: {
                select: {
                  customerId: true,
                  customerName: true,
                  companyName: true,
                },
              },
            },
            orderBy: {
              visitOrder: 'asc',
            },
          },
        },
      });
    });

    if (!report) {
      throw new ValidationError('日報の作成に失敗しました');
    }

    // レスポンス形式に変換
    const responseData = {
      report_id: report.reportId,
      report_date: report.reportDate.toISOString().split('T')[0],
      problem: report.problem,
      plan: report.plan,
      status: report.status.toLowerCase(),
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
      sales_staff: {
        sales_id: report.salesStaff.salesId,
        name: report.salesStaff.name,
        department: report.salesStaff.department,
      },
      visit_records: report.visitRecords.map((visit) => ({
        visit_id: visit.visitId,
        visit_content: visit.visitContent,
        visit_order: visit.visitOrder,
        customer: {
          customer_id: visit.customer.customerId,
          customer_name: visit.customer.customerName,
          company_name: visit.customer.companyName,
        },
      })),
    };

    res.status(201).json(createSuccessResponse(responseData, '日報を作成しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 日報更新
 *
 * PUT /api/v1/reports/:id
 */
export const updateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.id, 10);

    if (isNaN(reportId)) {
      throw new ValidationError('日報IDが無効です');
    }

    const { problem, plan, status } = req.body;
    const salesId = req.user!.salesId;

    // 日報を取得
    const existingReport = await prisma.dailyReport.findUnique({
      where: { reportId },
    });

    if (!existingReport) {
      throw new ValidationError('日報が見つかりません');
    }

    // 権限チェック: 自分の日報のみ更新可能
    if (existingReport.salesId !== salesId) {
      throw new ForbiddenError('この日報を更新する権限がありません');
    }

    // 提出済みの日報は更新不可
    if (existingReport.status === 'SUBMITTED') {
      throw new ValidationError('提出済みの日報は更新できません');
    }

    // 更新データを構築
    const updateData: {
      problem?: string | null;
      plan?: string | null;
      status?: Status;
    } = {};

    if (problem !== undefined) {
      updateData.problem = problem;
    }
    if (plan !== undefined) {
      updateData.plan = plan;
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    // 日報を更新
    const report = await prisma.dailyReport.update({
      where: { reportId },
      data: updateData,
      include: {
        salesStaff: {
          select: {
            salesId: true,
            name: true,
            department: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      report_id: report.reportId,
      report_date: report.reportDate.toISOString().split('T')[0],
      problem: report.problem,
      plan: report.plan,
      status: report.status.toLowerCase(),
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
      sales_staff: {
        sales_id: report.salesStaff.salesId,
        name: report.salesStaff.name,
        department: report.salesStaff.department,
      },
    };

    res.json(createSuccessResponse(responseData, '日報を更新しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 日報削除
 *
 * DELETE /api/v1/reports/:id
 */
export const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.id, 10);

    if (isNaN(reportId)) {
      throw new ValidationError('日報IDが無効です');
    }

    const salesId = req.user!.salesId;

    // 日報を取得
    const existingReport = await prisma.dailyReport.findUnique({
      where: { reportId },
    });

    if (!existingReport) {
      throw new ValidationError('日報が見つかりません');
    }

    // 権限チェック: 自分の日報のみ削除可能
    if (existingReport.salesId !== salesId) {
      throw new ForbiddenError('この日報を削除する権限がありません');
    }

    // 提出済みの日報は削除不可
    if (existingReport.status === 'SUBMITTED') {
      throw new ValidationError('提出済みの日報は削除できません');
    }

    // 日報を削除（関連する訪問記録とコメントも削除される）
    await prisma.dailyReport.delete({
      where: { reportId },
    });

    res.json(createSuccessResponse(null, '日報を削除しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 日報ステータス更新（提出/下書きに戻す）
 *
 * PATCH /api/v1/reports/:id/status
 */
export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.id, 10);

    if (isNaN(reportId)) {
      throw new ValidationError('日報IDが無効です');
    }

    const { status } = req.body;
    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    // 日報を取得
    const existingReport = await prisma.dailyReport.findUnique({
      where: { reportId },
    });

    if (!existingReport) {
      throw new ValidationError('日報が見つかりません');
    }

    // 権限チェック
    // - 提出(SUBMITTED): 自分の日報のみ
    // - 下書きに戻す(DRAFT): 自分の日報または管理者
    if (status === 'SUBMITTED') {
      if (existingReport.salesId !== salesId) {
        throw new ForbiddenError('この日報を提出する権限がありません');
      }
    } else if (status === 'DRAFT') {
      if (!isAdmin && existingReport.salesId !== salesId) {
        throw new ForbiddenError('この日報のステータスを変更する権限がありません');
      }
    }

    // 同じステータスへの変更は無視
    if (existingReport.status === status) {
      throw new ValidationError(`既に${status === 'SUBMITTED' ? '提出済み' : '下書き'}です`);
    }

    // ステータスを更新
    const report = await prisma.dailyReport.update({
      where: { reportId },
      data: { status },
      include: {
        salesStaff: {
          select: {
            salesId: true,
            name: true,
            department: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      report_id: report.reportId,
      report_date: report.reportDate.toISOString().split('T')[0],
      problem: report.problem,
      plan: report.plan,
      status: report.status.toLowerCase(),
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
      sales_staff: {
        sales_id: report.salesStaff.salesId,
        name: report.salesStaff.name,
        department: report.salesStaff.department,
      },
    };

    const message = status === 'SUBMITTED' ? '日報を提出しました' : '日報を下書きに戻しました';
    res.json(createSuccessResponse(responseData, message));
  } catch (error) {
    next(error);
  }
};
