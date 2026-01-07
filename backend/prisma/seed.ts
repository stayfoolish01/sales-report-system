/**
 * データベースシードデータ
 *
 * 開発・テスト用の初期データを投入します。
 *
 * 実行方法:
 *   npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータ投入開始...\n');

  // パスワードのハッシュ化（全員共通: "password123"）
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ========================================
  // 1. 営業マスタ（SalesStaff）
  // ========================================
  console.log('📊 営業マスタデータ投入中...');

  // 1-1. 管理者（マネージャー）
  const manager = await prisma.salesStaff.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: '佐藤部長',
      email: 'manager@example.com',
      password: hashedPassword,
      department: '営業部',
      position: '部長',
      role: 'ADMIN',
      managerId: null, // 最上位管理者
    },
  });
  console.log(`  ✅ 管理者: ${manager.name} (ID: ${manager.salesId})`);

  // 1-2. 一般営業担当者（5名）
  const salesStaff1 = await prisma.salesStaff.upsert({
    where: { email: 'yamada@example.com' },
    update: {},
    create: {
      name: '山田太郎',
      email: 'yamada@example.com',
      password: hashedPassword,
      department: '営業部',
      position: '営業担当',
      role: 'GENERAL',
      managerId: manager.salesId,
    },
  });
  console.log(`  ✅ 営業担当: ${salesStaff1.name} (ID: ${salesStaff1.salesId})`);

  const salesStaff2 = await prisma.salesStaff.upsert({
    where: { email: 'tanaka@example.com' },
    update: {},
    create: {
      name: '田中花子',
      email: 'tanaka@example.com',
      password: hashedPassword,
      department: '営業部',
      position: '営業担当',
      role: 'GENERAL',
      managerId: manager.salesId,
    },
  });
  console.log(`  ✅ 営業担当: ${salesStaff2.name} (ID: ${salesStaff2.salesId})`);

  const salesStaff3 = await prisma.salesStaff.upsert({
    where: { email: 'suzuki@example.com' },
    update: {},
    create: {
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      password: hashedPassword,
      department: '営業部',
      position: '営業担当',
      role: 'GENERAL',
      managerId: manager.salesId,
    },
  });
  console.log(`  ✅ 営業担当: ${salesStaff3.name} (ID: ${salesStaff3.salesId})`);

  const salesStaff4 = await prisma.salesStaff.upsert({
    where: { email: 'watanabe@example.com' },
    update: {},
    create: {
      name: '渡辺次郎',
      email: 'watanabe@example.com',
      password: hashedPassword,
      department: '営業部',
      position: '営業担当',
      role: 'GENERAL',
      managerId: manager.salesId,
    },
  });
  console.log(`  ✅ 営業担当: ${salesStaff4.name} (ID: ${salesStaff4.salesId})`);

  const salesStaff5 = await prisma.salesStaff.upsert({
    where: { email: 'takahashi@example.com' },
    update: {},
    create: {
      name: '高橋美咲',
      email: 'takahashi@example.com',
      password: hashedPassword,
      department: '営業部',
      position: '営業担当',
      role: 'GENERAL',
      managerId: manager.salesId,
    },
  });
  console.log(`  ✅ 営業担当: ${salesStaff5.name} (ID: ${salesStaff5.salesId})`);

  // ========================================
  // 2. 顧客マスタ（Customer）
  // ========================================
  console.log('\n🏢 顧客マスタデータ投入中...');

  const customer1 = await prisma.customer.upsert({
    where: { customerId: 1 },
    update: {},
    create: {
      customerName: '伊藤健太',
      companyName: '株式会社アルファ',
      department: '営業部',
      phone: '03-1111-2222',
      email: 'ito@alpha.co.jp',
      address: '東京都千代田区丸の内1-1-1',
    },
  });
  console.log(`  ✅ 顧客: ${customer1.companyName} - ${customer1.customerName}`);

  const customer2 = await prisma.customer.upsert({
    where: { customerId: 2 },
    update: {},
    create: {
      customerName: '木村真由美',
      companyName: '株式会社ベータ',
      department: '購買部',
      phone: '03-2222-3333',
      email: 'kimura@beta.co.jp',
      address: '東京都港区赤坂2-2-2',
    },
  });
  console.log(`  ✅ 顧客: ${customer2.companyName} - ${customer2.customerName}`);

  const customer3 = await prisma.customer.upsert({
    where: { customerId: 3 },
    update: {},
    create: {
      customerName: '林雄一',
      companyName: '株式会社ガンマ',
      department: '情報システム部',
      phone: '03-3333-4444',
      email: 'hayashi@gamma.co.jp',
      address: '東京都渋谷区道玄坂3-3-3',
    },
  });
  console.log(`  ✅ 顧客: ${customer3.companyName} - ${customer3.customerName}`);

  const customer4 = await prisma.customer.upsert({
    where: { customerId: 4 },
    update: {},
    create: {
      customerName: '中村裕子',
      companyName: '株式会社デルタ',
      department: '総務部',
      phone: '03-4444-5555',
      email: 'nakamura@delta.co.jp',
      address: '東京都新宿区西新宿4-4-4',
    },
  });
  console.log(`  ✅ 顧客: ${customer4.companyName} - ${customer4.customerName}`);

  const customer5 = await prisma.customer.upsert({
    where: { customerId: 5 },
    update: {},
    create: {
      customerName: '小林誠',
      companyName: '株式会社イプシロン',
      department: '営業企画部',
      phone: '03-5555-6666',
      email: 'kobayashi@epsilon.co.jp',
      address: '東京都品川区大崎5-5-5',
    },
  });
  console.log(`  ✅ 顧客: ${customer5.companyName} - ${customer5.customerName}`);

  const customer6 = await prisma.customer.upsert({
    where: { customerId: 6 },
    update: {},
    create: {
      customerName: '加藤直樹',
      companyName: '株式会社ゼータ',
      department: '開発部',
      phone: '03-6666-7777',
      email: 'kato@zeta.co.jp',
      address: '東京都目黒区中目黒6-6-6',
    },
  });
  console.log(`  ✅ 顧客: ${customer6.companyName} - ${customer6.customerName}`);

  const customer7 = await prisma.customer.upsert({
    where: { customerId: 7 },
    update: {},
    create: {
      customerName: '吉田明子',
      companyName: '株式会社イータ',
      department: '人事部',
      phone: '03-7777-8888',
      email: 'yoshida@eta.co.jp',
      address: '東京都世田谷区三軒茶屋7-7-7',
    },
  });
  console.log(`  ✅ 顧客: ${customer7.companyName} - ${customer7.customerName}`);

  const customer8 = await prisma.customer.upsert({
    where: { customerId: 8 },
    update: {},
    create: {
      customerName: '山本和也',
      companyName: '株式会社シータ',
      department: '経営企画部',
      phone: '03-8888-9999',
      email: 'yamamoto@theta.co.jp',
      address: '東京都中央区銀座8-8-8',
    },
  });
  console.log(`  ✅ 顧客: ${customer8.companyName} - ${customer8.customerName}`);

  const customer9 = await prisma.customer.upsert({
    where: { customerId: 9 },
    update: {},
    create: {
      customerName: '井上さおり',
      companyName: '株式会社イオタ',
      department: '広報部',
      phone: '03-9999-0000',
      email: 'inoue@iota.co.jp',
      address: '東京都豊島区池袋9-9-9',
    },
  });
  console.log(`  ✅ 顧客: ${customer9.companyName} - ${customer9.customerName}`);

  const customer10 = await prisma.customer.upsert({
    where: { customerId: 10 },
    update: {},
    create: {
      customerName: '松本拓也',
      companyName: '株式会社カッパ',
      department: 'マーケティング部',
      phone: '03-0000-1111',
      email: 'matsumoto@kappa.co.jp',
      address: '東京都江東区有明10-10-10',
    },
  });
  console.log(`  ✅ 顧客: ${customer10.companyName} - ${customer10.customerName}`);

  console.log('\n✅ シードデータ投入完了！');
  console.log('\n📝 投入されたデータ:');
  console.log(`  - 営業担当: 6名（管理者1名 + 一般5名）`);
  console.log(`  - 顧客: 10社`);
  console.log('\n🔐 ログイン情報:');
  console.log(`  管理者: manager@example.com / password123`);
  console.log(`  営業担当: yamada@example.com / password123`);
  console.log(`            (他の営業担当も同じパスワード)`);
  console.log('\n💡 確認方法:');
  console.log(`  npx prisma studio`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ エラーが発生しました:', e);
    await prisma.$disconnect();
    process.exit(1);
  });