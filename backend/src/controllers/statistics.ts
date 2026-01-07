/**
 * 統計コントローラー
 *
 * 日報件数等の統計情報を提供します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSuccessResponse } from '../types/response';

const prisma = new PrismaClient();

/**
 * ダッシュボード統計取得
 *
 * GET /api/v1/statistics/dashboard
 */
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    // 今日の日付
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 今月の開始日
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 今週の開始日（月曜日）
    const startOfWeek = new Date(today);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // 基本フィルター（一般ユーザーは自分のデータのみ）
    const baseWhere = isAdmin ? {} : { salesId };

    // 総日報数
    const totalReports = await prisma.dailyReport.count({
      where: baseWhere,
    });

    // 今月の日報数
    const monthlyReports = await prisma.dailyReport.count({
      where: {
        ...baseWhere,
        reportDate: {
          gte: startOfMonth,
        },
      },
    });

    // 今週の日報数
    const weeklyReports = await prisma.dailyReport.count({
      where: {
        ...baseWhere,
        reportDate: {
          gte: startOfWeek,
        },
      },
    });

    // 下書き中の日報数
    const draftReports = await prisma.dailyReport.count({
      where: {
        ...baseWhere,
        status: 'DRAFT',
      },
    });

    // 提出済みの日報数
    const submittedReports = await prisma.dailyReport.count({
      where: {
        ...baseWhere,
        status: 'SUBMITTED',
      },
    });

    // 今月の訪問記録数
    const monthlyVisits = await prisma.visitRecord.count({
      where: {
        report: {
          ...baseWhere,
          reportDate: {
            gte: startOfMonth,
          },
        },
      },
    });

    // 今月のコメント数
    const monthlyComments = await prisma.comment.count({
      where: {
        report: {
          ...baseWhere,
          reportDate: {
            gte: startOfMonth,
          },
        },
      },
    });

    // 管理者向け追加統計
    let adminStats = {};
    if (isAdmin) {
      // 全営業担当者数
      const totalSalesStaff = await prisma.salesStaff.count({
        where: { role: 'GENERAL' },
      });

      // 今日日報を提出した人数
      const todaySubmitters = await prisma.dailyReport.groupBy({
        by: ['salesId'],
        where: {
          reportDate: {
            gte: today,
          },
          status: 'SUBMITTED',
        },
      });

      // 今月の日報未提出者（今月1回も日報を作成していない人）
      const reportersThisMonth = await prisma.dailyReport.groupBy({
        by: ['salesId'],
        where: {
          reportDate: {
            gte: startOfMonth,
          },
        },
      });

      const reporterIds = reportersThisMonth.map((r) => r.salesId);
      const noReportStaff = await prisma.salesStaff.count({
        where: {
          role: 'GENERAL',
          salesId: {
            notIn: reporterIds,
          },
        },
      });

      adminStats = {
        total_sales_staff: totalSalesStaff,
        today_submitters: todaySubmitters.length,
        no_report_this_month: noReportStaff,
      };
    }

    const responseData = {
      total_reports: totalReports,
      monthly_reports: monthlyReports,
      weekly_reports: weeklyReports,
      draft_reports: draftReports,
      submitted_reports: submittedReports,
      monthly_visits: monthlyVisits,
      monthly_comments: monthlyComments,
      ...(isAdmin ? { admin_stats: adminStats } : {}),
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * 月別統計取得
 *
 * GET /api/v1/statistics/monthly
 */
export const getMonthlyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';
    const { year, month } = req.query;

    // デフォルトは今月
    const targetYear = year ? parseInt(year as string, 10) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month as string, 10) - 1 : new Date().getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    // 基本フィルター
    const baseWhere = isAdmin ? {} : { salesId };

    // 月間の日報数（日別）
    const reports = await prisma.dailyReport.findMany({
      where: {
        ...baseWhere,
        reportDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        reportId: true,
        reportDate: true,
        status: true,
        _count: {
          select: {
            visitRecords: true,
            comments: true,
          },
        },
      },
      orderBy: {
        reportDate: 'asc',
      },
    });

    // 日別統計を集計
    const dailyStats = reports.map((report) => ({
      date: report.reportDate.toISOString().split('T')[0],
      report_id: report.reportId,
      status: report.status.toLowerCase(),
      visit_count: report._count.visitRecords,
      comment_count: report._count.comments,
    }));

    // サマリー
    const summary = {
      total_reports: reports.length,
      submitted_reports: reports.filter((r) => r.status === 'SUBMITTED').length,
      draft_reports: reports.filter((r) => r.status === 'DRAFT').length,
      total_visits: reports.reduce((sum, r) => sum + r._count.visitRecords, 0),
      total_comments: reports.reduce((sum, r) => sum + r._count.comments, 0),
    };

    const responseData = {
      year: targetYear,
      month: targetMonth + 1,
      summary,
      daily_stats: dailyStats,
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * 顧客別訪問統計取得
 *
 * GET /api/v1/statistics/customers
 */
export const getCustomerStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';
    const { year, month } = req.query;

    // デフォルトは今月
    const targetYear = year ? parseInt(year as string, 10) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month as string, 10) - 1 : new Date().getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    // 基本フィルター
    const reportWhere = isAdmin
      ? { reportDate: { gte: startDate, lte: endDate } }
      : { salesId, reportDate: { gte: startDate, lte: endDate } };

    // 顧客別訪問回数
    const customerVisits = await prisma.visitRecord.groupBy({
      by: ['customerId'],
      where: {
        report: reportWhere,
      },
      _count: {
        visitId: true,
      },
      orderBy: {
        _count: {
          visitId: 'desc',
        },
      },
      take: 10,
    });

    // 顧客情報を取得
    const customerIds = customerVisits.map((cv) => cv.customerId);
    const customers = await prisma.customer.findMany({
      where: {
        customerId: {
          in: customerIds,
        },
      },
      select: {
        customerId: true,
        customerName: true,
        companyName: true,
      },
    });

    // 顧客情報をマップに変換
    const customerMap = new Map(customers.map((c) => [c.customerId, c]));

    // レスポンス形式に変換
    const items = customerVisits.map((cv) => {
      const customer = customerMap.get(cv.customerId);
      return {
        customer_id: cv.customerId,
        customer_name: customer?.customerName || '',
        company_name: customer?.companyName || '',
        visit_count: cv._count.visitId,
      };
    });

    const responseData = {
      year: targetYear,
      month: targetMonth + 1,
      top_customers: items,
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};
