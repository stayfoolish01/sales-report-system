/**
 * 顧客マスタコントローラー
 *
 * 顧客マスタのCRUD操作を処理します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { createSuccessResponse, createPaginatedResponse } from '../types/response';
import { ValidationError, ForbiddenError } from '../errors/AuthError';
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

/**
 * 顧客作成
 *
 * POST /api/v1/customers
 */
export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ作成可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('顧客を作成する権限がありません');
    }

    const { customer_name, company_name, department, phone, email, address } = req.body;

    // 顧客を作成
    const customer = await prisma.customer.create({
      data: {
        customerName: customer_name,
        companyName: company_name,
        department: department || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
      },
    });

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

    res.status(201).json(createSuccessResponse(responseData, '顧客を作成しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 顧客更新
 *
 * PUT /api/v1/customers/:customerId
 */
export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ更新可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('顧客を更新する権限がありません');
    }

    const customerId = parseInt(req.params.customerId, 10);

    if (isNaN(customerId)) {
      throw new ValidationError('顧客IDが無効です');
    }

    const { customer_name, company_name, department, phone, email, address } = req.body;

    // 顧客の存在確認
    const existingCustomer = await prisma.customer.findUnique({
      where: { customerId },
    });

    if (!existingCustomer) {
      throw new ValidationError('顧客が見つかりません');
    }

    // 更新データを構築
    const updateData: Prisma.CustomerUpdateInput = {};

    if (customer_name !== undefined) {
      updateData.customerName = customer_name;
    }
    if (company_name !== undefined) {
      updateData.companyName = company_name;
    }
    if (department !== undefined) {
      updateData.department = department;
    }
    if (phone !== undefined) {
      updateData.phone = phone;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    if (address !== undefined) {
      updateData.address = address;
    }

    // 顧客を更新
    const customer = await prisma.customer.update({
      where: { customerId },
      data: updateData,
    });

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

    res.json(createSuccessResponse(responseData, '顧客を更新しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 顧客削除
 *
 * DELETE /api/v1/customers/:customerId
 */
export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ削除可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('顧客を削除する権限がありません');
    }

    const customerId = parseInt(req.params.customerId, 10);

    if (isNaN(customerId)) {
      throw new ValidationError('顧客IDが無効です');
    }

    // 顧客の存在確認
    const existingCustomer = await prisma.customer.findUnique({
      where: { customerId },
    });

    if (!existingCustomer) {
      throw new ValidationError('顧客が見つかりません');
    }

    // 訪問記録が存在するか確認
    const visitCount = await prisma.visitRecord.count({
      where: { customerId },
    });

    if (visitCount > 0) {
      throw new ValidationError('この顧客には訪問記録が存在するため削除できません');
    }

    // 顧客を削除
    await prisma.customer.delete({
      where: { customerId },
    });

    res.json(createSuccessResponse(null, '顧客を削除しました'));
  } catch (error) {
    next(error);
  }
};
