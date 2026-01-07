/**
 * 訪問記録コントローラー
 *
 * 訪問記録のCRUD操作を処理します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
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
 * 訪問記録一覧取得
 *
 * GET /api/v1/reports/:reportId/visits
 */
export const listVisits = async (
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

    // 日報の存在確認と権限チェック
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    if (!isAdmin && report.salesId !== salesId) {
      throw new ForbiddenError('この日報の訪問記録を閲覧する権限がありません');
    }

    // 訪問記録一覧を取得
    const visits = await prisma.visitRecord.findMany({
      where: { reportId },
      include: {
        customer: {
          select: {
            customerId: true,
            customerName: true,
            companyName: true,
            department: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        visitOrder: 'asc',
      },
    });

    // レスポンス形式に変換
    const items = visits.map((visit) => ({
      visit_id: visit.visitId,
      visit_content: visit.visitContent,
      visit_order: visit.visitOrder,
      created_at: visit.createdAt.toISOString(),
      customer: {
        customer_id: visit.customer.customerId,
        customer_name: visit.customer.customerName,
        company_name: visit.customer.companyName,
        department: visit.customer.department,
        phone: visit.customer.phone,
        email: visit.customer.email,
      },
    }));

    res.json(createSuccessResponse({ visits: items }));
  } catch (error) {
    next(error);
  }
};

/**
 * 訪問記録詳細取得
 *
 * GET /api/v1/reports/:reportId/visits/:visitId
 */
export const getVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);
    const visitId = parseInt(req.params.visitId, 10);

    if (isNaN(reportId) || isNaN(visitId)) {
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
      throw new ForbiddenError('この訪問記録を閲覧する権限がありません');
    }

    // 訪問記録を取得
    const visit = await prisma.visitRecord.findFirst({
      where: { visitId, reportId },
      include: {
        customer: true,
      },
    });

    if (!visit) {
      throw new ValidationError('訪問記録が見つかりません');
    }

    // レスポンス形式に変換
    const responseData = {
      visit_id: visit.visitId,
      visit_content: visit.visitContent,
      visit_order: visit.visitOrder,
      created_at: visit.createdAt.toISOString(),
      customer: {
        customer_id: visit.customer.customerId,
        customer_name: visit.customer.customerName,
        company_name: visit.customer.companyName,
        department: visit.customer.department,
        phone: visit.customer.phone,
        email: visit.customer.email,
        address: visit.customer.address,
      },
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * 訪問記録作成
 *
 * POST /api/v1/reports/:reportId/visits
 */
export const createVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);

    if (isNaN(reportId)) {
      throw new ValidationError('日報IDが無効です');
    }

    const { customer_id, visit_content, visit_order } = req.body;
    const salesId = req.user!.salesId;

    // 日報の存在確認と権限チェック
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    if (report.salesId !== salesId) {
      throw new ForbiddenError('この日報に訪問記録を追加する権限がありません');
    }

    // 提出済みの日報は編集不可
    if (report.status === 'SUBMITTED') {
      throw new ValidationError('提出済みの日報には訪問記録を追加できません');
    }

    // 顧客の存在確認
    const customer = await prisma.customer.findUnique({
      where: { customerId: customer_id },
    });

    if (!customer) {
      throw new ValidationError('指定された顧客が見つかりません');
    }

    // 訪問順を自動設定（指定がない場合）
    let order = visit_order;
    if (!order) {
      const maxOrder = await prisma.visitRecord.aggregate({
        where: { reportId },
        _max: { visitOrder: true },
      });
      order = (maxOrder._max.visitOrder || 0) + 1;
    }

    // 訪問記録を作成
    const visit = await prisma.visitRecord.create({
      data: {
        reportId,
        customerId: customer_id,
        visitContent: visit_content,
        visitOrder: order,
      },
      include: {
        customer: {
          select: {
            customerId: true,
            customerName: true,
            companyName: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      visit_id: visit.visitId,
      visit_content: visit.visitContent,
      visit_order: visit.visitOrder,
      created_at: visit.createdAt.toISOString(),
      customer: {
        customer_id: visit.customer.customerId,
        customer_name: visit.customer.customerName,
        company_name: visit.customer.companyName,
      },
    };

    res.status(201).json(createSuccessResponse(responseData, '訪問記録を作成しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 訪問記録更新
 *
 * PUT /api/v1/reports/:reportId/visits/:visitId
 */
export const updateVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);
    const visitId = parseInt(req.params.visitId, 10);

    if (isNaN(reportId) || isNaN(visitId)) {
      throw new ValidationError('IDが無効です');
    }

    const { customer_id, visit_content, visit_order } = req.body;
    const salesId = req.user!.salesId;

    // 日報の存在確認と権限チェック
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    if (report.salesId !== salesId) {
      throw new ForbiddenError('この訪問記録を更新する権限がありません');
    }

    // 提出済みの日報は編集不可
    if (report.status === 'SUBMITTED') {
      throw new ValidationError('提出済みの日報の訪問記録は更新できません');
    }

    // 訪問記録の存在確認
    const existingVisit = await prisma.visitRecord.findFirst({
      where: { visitId, reportId },
    });

    if (!existingVisit) {
      throw new ValidationError('訪問記録が見つかりません');
    }

    // 更新データを構築
    const updateData: {
      customerId?: number;
      visitContent?: string;
      visitOrder?: number;
    } = {};

    if (customer_id !== undefined) {
      // 顧客の存在確認
      const customer = await prisma.customer.findUnique({
        where: { customerId: customer_id },
      });

      if (!customer) {
        throw new ValidationError('指定された顧客が見つかりません');
      }

      updateData.customerId = customer_id;
    }

    if (visit_content !== undefined) {
      updateData.visitContent = visit_content;
    }

    if (visit_order !== undefined) {
      updateData.visitOrder = visit_order;
    }

    // 訪問記録を更新
    const visit = await prisma.visitRecord.update({
      where: { visitId },
      data: updateData,
      include: {
        customer: {
          select: {
            customerId: true,
            customerName: true,
            companyName: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      visit_id: visit.visitId,
      visit_content: visit.visitContent,
      visit_order: visit.visitOrder,
      created_at: visit.createdAt.toISOString(),
      customer: {
        customer_id: visit.customer.customerId,
        customer_name: visit.customer.customerName,
        company_name: visit.customer.companyName,
      },
    };

    res.json(createSuccessResponse(responseData, '訪問記録を更新しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 訪問記録削除
 *
 * DELETE /api/v1/reports/:reportId/visits/:visitId
 */
export const deleteVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportId = parseInt(req.params.reportId, 10);
    const visitId = parseInt(req.params.visitId, 10);

    if (isNaN(reportId) || isNaN(visitId)) {
      throw new ValidationError('IDが無効です');
    }

    const salesId = req.user!.salesId;

    // 日報の存在確認と権限チェック
    const report = await getReportInfo(reportId);

    if (!report) {
      throw new ValidationError('日報が見つかりません');
    }

    if (report.salesId !== salesId) {
      throw new ForbiddenError('この訪問記録を削除する権限がありません');
    }

    // 提出済みの日報は編集不可
    if (report.status === 'SUBMITTED') {
      throw new ValidationError('提出済みの日報の訪問記録は削除できません');
    }

    // 訪問記録の存在確認
    const existingVisit = await prisma.visitRecord.findFirst({
      where: { visitId, reportId },
    });

    if (!existingVisit) {
      throw new ValidationError('訪問記録が見つかりません');
    }

    // 訪問記録を削除
    await prisma.visitRecord.delete({
      where: { visitId },
    });

    res.json(createSuccessResponse(null, '訪問記録を削除しました'));
  } catch (error) {
    next(error);
  }
};
