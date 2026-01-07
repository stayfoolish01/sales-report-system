# 営業日報システム

営業担当者が日々の訪問活動を記録し、上長が確認・コメントできるWebアプリケーション

## プロジェクト概要

このシステムは、営業チームの日報管理を効率化するために開発されています。

### 主要機能

- **日報管理**: 営業担当者が訪問記録、課題・相談（Problem）、明日の予定（Plan）を記録
- **コメント機能**: 上長が部下の日報にコメントを追加
- **顧客マスタ管理**: 顧客情報の一元管理
- **営業マスタ管理**: 営業担当者情報と組織構造の管理
- **ダッシュボード**: 日報の提出状況や未読コメントを一覧表示

## ドキュメント

プロジェクトの詳細な仕様は以下のドキュメントを参照してください：

- [📋 要件定義書](requirements.md) - システムの概要、機能要件、ER図
- [🖼️ 画面定義書](screen-design.md) - 全画面の詳細仕様とUI設計
- [🔌 API仕様書](api-specification.md) - RESTful APIの詳細仕様
- [✅ テスト仕様書](test-specification.md) - テストケースとテスト計画
- [📘 開発ガイド](CLAUDE.md) - 開発時の規約とガイドライン

## 技術スタック

### バックエンド
- **言語**: TypeScript (Node.js 20.x)
- **フレームワーク**: Express.js 4.x
- **ORM**: Prisma 5.x
- **データベース**: PostgreSQL 15.x
- **認証**: JWT (jsonwebtoken + bcrypt)
- **バリデーション**: Zod

### フロントエンド
- **フレームワーク**: Next.js 14.x (App Router)
- **言語**: TypeScript
- **UIライブラリ**: Tailwind CSS 3.x + shadcn/ui
- **状態管理**: Zustand
- **フォーム管理**: React Hook Form + Zod
- **HTTP通信**: Axios

### インフラ
- **コンテナ**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **ホスティング**: Vercel (フロント) + Railway (バック)

詳細は[CLAUDE.md](CLAUDE.md)を参照してください。

## プロジェクト構成

```
sales-report-system/
├── backend/                   # バックエンド (Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── routes/           # ルーティング
│   │   ├── controllers/      # コントローラー
│   │   ├── middlewares/      # ミドルウェア
│   │   ├── utils/            # ユーティリティ
│   │   └── index.ts          # エントリーポイント
│   ├── prisma/
│   │   └── schema.prisma     # Prismaスキーマ
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/                  # フロントエンド (Next.js 14 + TypeScript)
│   ├── app/                  # App Router
│   │   ├── components/       # コンポーネント
│   │   ├── lib/              # ライブラリ
│   │   ├── hooks/            # カスタムフック
│   │   └── types/            # 型定義
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── Dockerfile
├── docker-compose.yml        # Docker構成
├── requirements.md           # 要件定義書
├── screen-design.md          # 画面定義書
├── api-specification.md      # API仕様書
├── test-specification.md     # テスト仕様書
├── CLAUDE.md                 # 開発ガイド
└── README.md                 # このファイル
```

## 開発状況

- ✅ 要件定義書
- ✅ 画面定義書
- ✅ API仕様書
- ✅ テスト仕様書
- ✅ 技術スタック選定完了
- ✅ 開発環境構築完了
- ✅ バックエンドAPI実装完了
- ✅ フロントエンド実装完了
- ✅ CI/CDパイプライン構築完了
- ✅ E2Eテスト実装完了

## セットアップ

### 前提条件

- Node.js 20.x以上
- Docker & Docker Compose
- Git

### 1. リポジトリのクローン

```bash
git clone https://github.com/stayfoolish01/sales-report-system.git
cd sales-report-system
```

### 2. 環境変数の設定

#### バックエンド
```bash
cd backend
cp .env.example .env
# .envファイルを編集してデータベース接続情報などを設定
```

#### フロントエンド
```bash
cd frontend
cp .env.example .env.local
# .env.localファイルを編集してAPI URLなどを設定
```

### 3. Dockerを使用した起動（推奨）

```bash
# ルートディレクトリで実行
docker-compose up -d
```

これにより以下が起動します：
- PostgreSQL (ポート 5432)
- バックエンド (ポート 3001)
- フロントエンド (ポート 3000)

#### Prismaマイグレーション実行

```bash
docker-compose exec backend npx prisma migrate dev
```

#### アクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001
- Health Check: http://localhost:3001/health

### 4. ローカル環境での起動（Docker未使用）

#### バックエンド

```bash
cd backend
npm install
cp .env.example .env
# .envファイルを編集

# PostgreSQLを別途起動しておく

# Prismaマイグレーション
npx prisma migrate dev
npx prisma generate

# 開発サーバー起動
npm run dev
```

#### フロントエンド

```bash
cd frontend
npm install
cp .env.example .env.local
# .env.localファイルを編集

# 開発サーバー起動
npm run dev
```

### 5. 開発用コマンド

#### バックエンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run start        # 本番起動
npm run lint         # Lint実行
npm run format       # フォーマット
npm run test         # テスト実行
npm run prisma:studio # Prisma Studio起動
```

#### フロントエンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run start        # 本番起動
npm run lint         # Lint実行
npm run format       # フォーマット
npm run test:e2e     # E2Eテスト実行
npm run test:e2e:ui  # E2Eテスト（UIモード）
```

## 本番デプロイ

本番環境へのデプロイ手順については、以下のドキュメントを参照してください：

- [デプロイガイド](docs/DEPLOYMENT.md) - Vercel/Railwayへのデプロイ手順
- [Prismaマイグレーション](docs/PRISMA_MIGRATION.md) - DBマイグレーション戦略
- [運用マニュアル](docs/OPERATIONS.md) - 運用・監視・障害対応

### 環境変数（本番環境）

#### バックエンド（Railway）
| 変数名 | 説明 |
|--------|------|
| `DATABASE_URL` | PostgreSQL接続URL（自動設定） |
| `JWT_SECRET` | JWT署名キー（32文字以上） |
| `JWT_EXPIRES_IN` | JWTの有効期限 |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | フロントエンドURL |

#### フロントエンド（Vercel）
| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_API_URL` | バックエンドAPI URL |

## トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のポートを確認
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# プロセスを終了するか、docker-compose.ymlでポート番号を変更
```

### Dockerコンテナのログ確認

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

### データベースのリセット

```bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend npx prisma migrate dev
```

## ライセンス

TBD

## 貢献

TBD

---

**プロジェクト開始日**: 2024-01-15