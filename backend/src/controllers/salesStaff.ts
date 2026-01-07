/**
 * 営業担当コントローラー
 *
 * 営業担当のCRUD操作を処理します。
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { createSuccessResponse, createPaginatedResponse } from '../types/response';
import { ValidationError, ForbiddenError } from '../errors/AuthError';
import { listSalesStaffQuerySchema } from '../validators/salesStaff.schemas';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

/**
 * 営業担当一覧取得
 *
 * GET /api/v1/sales-staff
 */
export const listSalesStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ取得可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('営業担当一覧を取得する権限がありません');
    }

    // クエリパラメータのバリデーション
    const queryResult = listSalesStaffQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      throw new ValidationError(queryResult.error.errors[0].message);
    }

    const { page, limit, search, department, role } = queryResult.data;

    // 検索条件を構築
    const whereCondition: Prisma.SalesStaffWhereInput = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (department) {
      whereCondition.department = department;
    }

    if (role) {
      whereCondition.role = role as Role;
    }

    // 総件数を取得
    const total = await prisma.salesStaff.count({
      where: whereCondition,
    });

    // 営業担当一覧を取得
    const staffList = await prisma.salesStaff.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        manager: {
          select: {
            salesId: true,
            name: true,
          },
        },
      },
      orderBy: [
        { department: 'asc' },
        { name: 'asc' },
      ],
    });

    // レスポンス形式に変換
    const items = staffList.map((staff) => ({
      sales_id: staff.salesId,
      name: staff.name,
      email: staff.email,
      department: staff.department,
      position: staff.position,
      role: staff.role.toLowerCase(),
      manager: staff.manager
        ? {
            sales_id: staff.manager.salesId,
            name: staff.manager.name,
          }
        : null,
      created_at: staff.createdAt.toISOString(),
      updated_at: staff.updatedAt.toISOString(),
    }));

    res.json(createPaginatedResponse(items, page, limit, total));
  } catch (error) {
    next(error);
  }
};

/**
 * 営業担当詳細取得
 *
 * GET /api/v1/sales-staff/:salesId
 */
export const getSalesStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ取得可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('営業担当情報を取得する権限がありません');
    }

    const salesId = parseInt(req.params.salesId, 10);

    if (isNaN(salesId)) {
      throw new ValidationError('営業担当IDが無効です');
    }

    // 営業担当を取得
    const staff = await prisma.salesStaff.findUnique({
      where: { salesId },
      include: {
        manager: {
          select: {
            salesId: true,
            name: true,
          },
        },
        subordinates: {
          select: {
            salesId: true,
            name: true,
          },
        },
      },
    });

    if (!staff) {
      throw new ValidationError('営業担当が見つかりません');
    }

    // レスポンス形式に変換
    const responseData = {
      sales_id: staff.salesId,
      name: staff.name,
      email: staff.email,
      department: staff.department,
      position: staff.position,
      role: staff.role.toLowerCase(),
      manager: staff.manager
        ? {
            sales_id: staff.manager.salesId,
            name: staff.manager.name,
          }
        : null,
      subordinates: staff.subordinates.map((sub) => ({
        sales_id: sub.salesId,
        name: sub.name,
      })),
      created_at: staff.createdAt.toISOString(),
      updated_at: staff.updatedAt.toISOString(),
    };

    res.json(createSuccessResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * 営業担当作成
 *
 * POST /api/v1/sales-staff
 */
export const createSalesStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ作成可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('営業担当を作成する権限がありません');
    }

    const { name, email, password, department, position, manager_id, role } = req.body;

    // メールアドレスの重複確認
    const existingStaff = await prisma.salesStaff.findUnique({
      where: { email },
    });

    if (existingStaff) {
      throw new ValidationError('このメールアドレスは既に使用されています');
    }

    // 上長が存在するか確認
    if (manager_id) {
      const manager = await prisma.salesStaff.findUnique({
        where: { salesId: manager_id },
      });

      if (!manager) {
        throw new ValidationError('指定された上長が見つかりません');
      }
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(password);

    // 営業担当を作成
    const staff = await prisma.salesStaff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department,
        position: position || null,
        managerId: manager_id || null,
        role: role || 'GENERAL',
      },
      include: {
        manager: {
          select: {
            salesId: true,
            name: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      sales_id: staff.salesId,
      name: staff.name,
      email: staff.email,
      department: staff.department,
      position: staff.position,
      role: staff.role.toLowerCase(),
      manager: staff.manager
        ? {
            sales_id: staff.manager.salesId,
            name: staff.manager.name,
          }
        : null,
      created_at: staff.createdAt.toISOString(),
      updated_at: staff.updatedAt.toISOString(),
    };

    res.status(201).json(createSuccessResponse(responseData, '営業担当を作成しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 営業担当更新
 *
 * PUT /api/v1/sales-staff/:salesId
 */
export const updateSalesStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ更新可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('営業担当を更新する権限がありません');
    }

    const salesId = parseInt(req.params.salesId, 10);

    if (isNaN(salesId)) {
      throw new ValidationError('営業担当IDが無効です');
    }

    const { name, email, password, department, position, manager_id, role } = req.body;

    // 営業担当の存在確認
    const existingStaff = await prisma.salesStaff.findUnique({
      where: { salesId },
    });

    if (!existingStaff) {
      throw new ValidationError('営業担当が見つかりません');
    }

    // メールアドレスの重複確認（自分以外）
    if (email) {
      const duplicateEmail = await prisma.salesStaff.findFirst({
        where: {
          email,
          salesId: { not: salesId },
        },
      });

      if (duplicateEmail) {
        throw new ValidationError('このメールアドレスは既に使用されています');
      }
    }

    // 上長が存在するか確認
    if (manager_id) {
      // 自分自身を上長に設定することはできない
      if (manager_id === salesId) {
        throw new ValidationError('自分自身を上長に設定することはできません');
      }

      const manager = await prisma.salesStaff.findUnique({
        where: { salesId: manager_id },
      });

      if (!manager) {
        throw new ValidationError('指定された上長が見つかりません');
      }
    }

    // 更新データを構築
    const updateData: Prisma.SalesStaffUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    if (password !== undefined) {
      updateData.password = await hashPassword(password);
    }
    if (department !== undefined) {
      updateData.department = department;
    }
    if (position !== undefined) {
      updateData.position = position;
    }
    if (manager_id !== undefined) {
      updateData.manager = manager_id
        ? { connect: { salesId: manager_id } }
        : { disconnect: true };
    }
    if (role !== undefined) {
      updateData.role = role;
    }

    // 営業担当を更新
    const staff = await prisma.salesStaff.update({
      where: { salesId },
      data: updateData,
      include: {
        manager: {
          select: {
            salesId: true,
            name: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    const responseData = {
      sales_id: staff.salesId,
      name: staff.name,
      email: staff.email,
      department: staff.department,
      position: staff.position,
      role: staff.role.toLowerCase(),
      manager: staff.manager
        ? {
            sales_id: staff.manager.salesId,
            name: staff.manager.name,
          }
        : null,
      created_at: staff.createdAt.toISOString(),
      updated_at: staff.updatedAt.toISOString(),
    };

    res.json(createSuccessResponse(responseData, '営業担当を更新しました'));
  } catch (error) {
    next(error);
  }
};

/**
 * 営業担当削除
 *
 * DELETE /api/v1/sales-staff/:salesId
 */
export const deleteSalesStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 管理者のみ削除可能
    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('営業担当を削除する権限がありません');
    }

    const salesId = parseInt(req.params.salesId, 10);

    if (isNaN(salesId)) {
      throw new ValidationError('営業担当IDが無効です');
    }

    // 自分自身は削除できない
    if (salesId === req.user!.salesId) {
      throw new ValidationError('自分自身を削除することはできません');
    }

    // 営業担当の存在確認
    const existingStaff = await prisma.salesStaff.findUnique({
      where: { salesId },
    });

    if (!existingStaff) {
      throw new ValidationError('営業担当が見つかりません');
    }

    // 日報が存在するか確認
    const reportCount = await prisma.dailyReport.count({
      where: { salesId },
    });

    if (reportCount > 0) {
      throw new ValidationError('この営業担当には日報が存在するため削除できません');
    }

    // 部下が存在するか確認
    const subordinateCount = await prisma.salesStaff.count({
      where: { managerId: salesId },
    });

    if (subordinateCount > 0) {
      throw new ValidationError('この営業担当には部下が存在するため削除できません');
    }

    // 営業担当を削除
    await prisma.salesStaff.delete({
      where: { salesId },
    });

    res.json(createSuccessResponse(null, '営業担当を削除しました'));
  } catch (error) {
    next(error);
  }
};
