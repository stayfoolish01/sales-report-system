/**
 * 顧客マスタコントローラー
 *
 * 顧客マスタの参照操作を処理します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { createSuccessResponse, createPaginatedResponse } from '../types/response';
import { ValidationError } from '../errors/AuthError';
import { listCustomersQuerySchema } from '../validators/customer.schemas';

const prisma = new PrismaClient();

/**
 * 顧客一覧取得
 *
 * GET /api/v1/customers
 */
export const listCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // クエリパラメータのバリデーション
    const queryResult = listCustomersQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      throw new ValidationError(queryResult.error.errors[0].message);
    }

    const { page, limit, search } = queryResult.data;

    // 検索条件を構築
    const whereCondition: Prisma.CustomerWhereInput = {};

    if (search) {
      whereCondition.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 総件数を取得
    const total = await prisma.customer.count({
      where: whereCondition,
    });

    // 顧客一覧を取得
    const customers = await prisma.customer.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { companyName: 'asc' },
        { customerName: 'asc' },
      ],
    });

    // レスポンス形式に変換
    const items = customers.map((customer) => ({
      customer_id: customer.customerId,
      customer_name: customer.customerName,
      company_name: customer.companyName,
      department: customer.department,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      created_at: customer.createdAt.toISOString(),
      updated_at: customer.updatedAt.toISOString(),
    }));

    res.json(createPaginatedResponse(items, page, limit, total));
  } catch (error) {
    next(error);
  }
};

/**
 * 顧客詳細取得
 *
 * GET /api/v1/customers/:customerId
 */
export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = parseInt(req.params.customerId, 10);

    if (isNaN(customerId)) {
      throw new ValidationError('顧客IDが無効です');
    }

    // 顧客を取得
    const customer = await prisma.customer.findUnique({
      where: { customerId },
    });

    if (!customer) {
      throw new ValidationError('顧客が見つかりません');
    }

    // レスポンス形式に変換
    const responseData = {
      customer_id: customer.customerId,
      customer_name: customer.customerName,
      company_name: customer.companyName,
      department: customer.department,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      created_at: customer.createdAt.toISOString(),
      updated_at: customer.updatedAt.toISOString(),
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * 顧客検索（オートコンプリート用）
 *
 * GET /api/v1/customers/search
 */
export const searchCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query.q as string;

    if (!query || query.length < 1) {
      res.json(createSuccessResponse({ customers: [] }));
      return;
    }

    // 顧客を検索（最大10件）
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { customerName: { contains: query, mode: 'insensitive' } },
          { companyName: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: [
        { companyName: 'asc' },
        { customerName: 'asc' },
      ],
      select: {
        customerId: true,
        customerName: true,
        companyName: true,
        department: true,
      },
    });

    // レスポンス形式に変換
    const items = customers.map((customer) => ({
      customer_id: customer.customerId,
      customer_name: customer.customerName,
      company_name: customer.companyName,
      department: customer.department,
    }));

    res.json(createSuccessResponse({ customers: items }));
  } catch (error) {
    next(error);
  }
};
