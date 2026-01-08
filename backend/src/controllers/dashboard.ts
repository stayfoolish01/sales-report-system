/**
 * ダッシュボードコントローラー
 *
 * ダッシュボードの概要データを取得します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSuccessResponse } from '../types/response';

const prisma = new PrismaClient();

/**
 * ダッシュボード概要データ取得
 *
 * GET /api/v1/dashboard/summary
 *
 * レスポンス:
 * - unsubmitted_reports: 自分の未提出日報数
 * - unread_comments: 未読コメント数（簡易実装: 直近7日の自分の日報へのコメント数）
 * - subordinates_unsubmitted: 部下の未提出日報数（管理者のみ）
 * - today_visits: 本日の訪問件数
 * - this_month_reports: 今月の日報数
 */
export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salesId = req.user!.salesId;
    const isAdmin = req.user!.role === 'ADMIN';

    // 今日の日付（UTCベースで日付のみを比較するため）
    // 日報のreportDateはYYYY-MM-DD形式で保存され、UTC 00:00:00として扱われる
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD形式
    const today = new Date(todayStr + 'T00:00:00.000Z');
    const tomorrow = new Date(todayStr + 'T00:00:00.000Z');
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // 今月の初日と来月の初日（UTCベース）
    const year = now.getFullYear();
    const month = now.getMonth();
    const thisMonthStart = new Date(Date.UTC(year, month, 1));
    const nextMonthStart = new Date(Date.UTC(year, month + 1, 1));

    // 直近7日間（UTCベース）
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

    // 自分の未提出日報（下書き状態の日報）の詳細を取得
    const unsubmittedReportsList = await prisma.dailyReport.findMany({
      where: {
        salesId,
        status: 'DRAFT',
      },
      select: {
        reportId: true,
        reportDate: true,
      },
      orderBy: {
        reportDate: 'desc',
      },
    });

    // 直近7日の自分の日報へのコメント（簡易的な未読コメント実装）
    const recentCommentsList = await prisma.comment.findMany({
      where: {
        report: {
          salesId,
        },
        createdAt: {
          gte: sevenDaysAgo,
        },
        // 自分以外からのコメント
        commenterId: {
          not: salesId,
        },
      },
      select: {
        commentId: true,
        commentContent: true,
        createdAt: true,
        commenter: {
          select: {
            name: true,
          },
        },
        report: {
          select: {
            reportId: true,
            reportDate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 本日の訪問件数
    const todayVisits = await prisma.visitRecord.count({
      where: {
        report: {
          salesId,
          reportDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
    });

    // 今月の日報数
    const thisMonthReports = await prisma.dailyReport.count({
      where: {
        salesId,
        reportDate: {
          gte: thisMonthStart,
          lt: nextMonthStart,
        },
      },
    });

    // 部下の未提出日報数（管理者のみ）
    let subordinatesUnsubmitted = 0;
    if (isAdmin) {
      // 自分が上長の部下を取得
      const subordinates = await prisma.salesStaff.findMany({
        where: {
          managerId: salesId,
        },
        select: {
          salesId: true,
        },
      });

      const subordinateIds = subordinates.map((s) => s.salesId);

      if (subordinateIds.length > 0) {
        subordinatesUnsubmitted = await prisma.dailyReport.count({
          where: {
            salesId: {
              in: subordinateIds,
            },
            status: 'DRAFT',
          },
        });
      }
    }

    const responseData = {
      unsubmitted_reports: unsubmittedReportsList.length,
      unsubmitted_reports_list: unsubmittedReportsList.map((r) => ({
        report_id: r.reportId,
        report_date: r.reportDate.toISOString().split('T')[0],
      })),
      unread_comments: recentCommentsList.length,
      recent_comments_list: recentCommentsList.map((c) => ({
        comment_id: c.commentId,
        comment_content: c.commentContent.substring(0, 50) + (c.commentContent.length > 50 ? '...' : ''),
        created_at: c.createdAt.toISOString(),
        commenter_name: c.commenter.name,
        report_id: c.report.reportId,
        report_date: c.report.reportDate.toISOString().split('T')[0],
      })),
      subordinates_unsubmitted: subordinatesUnsubmitted,
      today_visits: todayVisits,
      this_month_reports: thisMonthReports,
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};
