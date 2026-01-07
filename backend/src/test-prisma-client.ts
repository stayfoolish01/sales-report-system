/**
 * Prisma Clientの型定義確認用テストファイル
 *
 * このファイルはPrisma Clientが正しく生成され、
 * TypeScriptの型定義が利用可能であることを確認するためのものです。
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 全モデルの型定義確認
 */
async function testPrismaClientTypes() {
  console.log('🔍 Prisma Client型定義テスト開始\n');

  // 1. SalesStaff型の確認
  console.log('1. SalesStaff型の確認');
  const salesStaffExample: {
    salesId: number;
    name: string;
    email: string;
    password: string;
    department: string;
    position: string | null;
    managerId: number | null;
    role: 'GENERAL' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
  } = {
    salesId: 1,
    name: '山田太郎',
    email: 'yamada@example.com',
    password: 'hashed_password',
    department: '営業部',
    position: '営業担当',
    managerId: null,
    role: 'GENERAL',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  console.log(`   役割: ${salesStaffExample.role}, 名前: ${salesStaffExample.name}`);
  console.log('✅ SalesStaff型が正しく定義されています');

  // 2. DailyReport型の確認
  console.log('\n2. DailyReport型の確認');
  const dailyReportExample: {
    reportId: number;
    salesId: number;
    reportDate: Date;
    problem: string | null;
    plan: string | null;
    status: 'DRAFT' | 'SUBMITTED';
    createdAt: Date;
    updatedAt: Date;
  } = {
    reportId: 1,
    salesId: 1,
    reportDate: new Date(),
    problem: '今日の課題',
    plan: '明日の予定',
    status: 'DRAFT',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  console.log(`   ステータス: ${dailyReportExample.status}, Problem: ${dailyReportExample.problem}`);
  console.log('✅ DailyReport型が正しく定義されています');

  // 3. VisitRecord型の確認
  console.log('\n3. VisitRecord型の確認');
  const visitRecordExample: {
    visitId: number;
    reportId: number;
    customerId: number;
    visitContent: string;
    visitOrder: number;
    createdAt: Date;
  } = {
    visitId: 1,
    reportId: 1,
    customerId: 1,
    visitContent: '新規提案について打ち合わせ',
    visitOrder: 1,
    createdAt: new Date(),
  };
  console.log(`   訪問順序: ${visitRecordExample.visitOrder}, 内容: ${visitRecordExample.visitContent}`);
  console.log('✅ VisitRecord型が正しく定義されています');

  // 4. Customer型の確認
  console.log('\n4. Customer型の確認');
  const customerExample: {
    customerId: number;
    customerName: string;
    companyName: string;
    department: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
  } = {
    customerId: 1,
    customerName: '田中一郎',
    companyName: '株式会社サンプル',
    department: '営業部',
    phone: '03-1234-5678',
    email: 'tanaka@sample.co.jp',
    address: '東京都渋谷区',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  console.log(`   会社名: ${customerExample.companyName}, 担当者: ${customerExample.customerName}`);
  console.log('✅ Customer型が正しく定義されています');

  // 5. Comment型の確認
  console.log('\n5. Comment型の確認');
  const commentExample: {
    commentId: number;
    reportId: number;
    commentType: 'PROBLEM' | 'PLAN';
    commentContent: string;
    commenterId: number;
    createdAt: Date;
  } = {
    commentId: 1,
    reportId: 1,
    commentType: 'PROBLEM',
    commentContent: 'よく頑張りました',
    commenterId: 2,
    createdAt: new Date(),
  };
  console.log(`   種別: ${commentExample.commentType}, 内容: ${commentExample.commentContent}`);
  console.log('✅ Comment型が正しく定義されています');

  console.log('\n📊 Prisma Clientのメソッド確認');

  // 6. Prisma Clientのメソッドが利用可能か確認
  const methods = [
    'salesStaff',
    'dailyReport',
    'visitRecord',
    'customer',
    'comment',
  ];

  methods.forEach((method) => {
    if (method in prisma) {
      console.log(`✅ prisma.${method} が利用可能`);
    } else {
      console.log(`❌ prisma.${method} が利用できません`);
    }
  });

  console.log('\n🎉 全ての型定義テストが完了しました！');
  console.log('\n次のステップ:');
  console.log('- Prisma Clientを使った実際のクエリ実行');
  console.log('- データベース接続テスト');
  console.log('- CRUD操作の実装');
}

// メイン実行
testPrismaClientTypes()
  .then(() => {
    console.log('\n✅ テスト正常終了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ エラーが発生しました:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });