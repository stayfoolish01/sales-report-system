# 営業日報システム - 開発タスク一覧

このファイルは開発タスクの全体像を管理します。
各タスクは GitHub Issues として作成し、進捗を管理します。

## 📋 タスク管理方法

- **GitHub Issues**: 各タスクをIssueとして作成
- **GitHub Projects**: カンバンボードで進捗を可視化
- **Labels**: backend, frontend, database, auth, api, ui, bug, documentation
- **Milestones**: Phase 1〜4で管理

## 🎯 開発フェーズ

### Phase 1: 基盤実装（認証・DB）

**優先度: 最高 | ステータス: ✅ 完了**

#### 1.1 データベース・Prisma
- [x] #1 Prismaマイグレーション実行とDB初期化
- [x] #2 Prisma Clientの型定義確認
- [x] #3 データベースシードデータ作成（テスト用営業担当・顧客）

#### 1.2 認証システム（Backend）
- [x] #4 JWT認証ミドルウェア実装（`src/middlewares/auth.ts`）
- [x] #5 パスワードハッシュ化ユーティリティ実装（`src/utils/password.ts`）
- [x] #6 ログインAPI実装（POST `/api/v1/auth/login`）
- [x] #7 ログアウトAPI実装（POST `/api/v1/auth/logout`）
- [x] #8 認証状態確認API実装（GET `/api/v1/auth/me`）
- [x] #9 認証エラーハンドリング実装

#### 1.3 エラーハンドリング・バリデーション（Backend）
- [x] #10 グローバルエラーハンドラー実装（`src/middlewares/errorHandler.ts`）
- [x] #11 Zodバリデーションスキーマ定義（`src/schemas/`）
- [x] #12 バリデーションミドルウェア実装
- [x] #13 共通レスポンス型定義（`src/types/response.ts`）

#### 1.4 認証UI（Frontend）
- [x] #14 shadcn/ui セットアップ（Button, Input, Form, Card等）
- [x] #15 Zustand認証ストア実装（`app/lib/stores/authStore.ts`）
- [x] #16 Axios インスタンス設定（認証ヘッダー自動付与）
- [x] #17 ログイン画面実装（SC-001）
- [x] #18 認証ルートガード実装（`app/middleware.ts`）
- [x] #19 ログアウト機能実装

---

### Phase 2: 日報機能

**優先度: 高 | ステータス: ✅ 完了**

#### 2.1 日報API（Backend）
- [x] #20 日報一覧取得API実装（GET `/api/v1/reports`）
- [x] #21 日報詳細取得API実装（GET `/api/v1/reports/:id`）
- [x] #22 日報作成API実装（POST `/api/v1/reports`）
- [x] #23 日報更新API実装（PUT `/api/v1/reports/:id`）
- [x] #24 日報削除API実装（DELETE `/api/v1/reports/:id`）
- [x] #25 日報提出API実装（POST `/api/v1/reports/:id/submit`）

#### 2.2 日報画面（Frontend）
- [x] #26 ダッシュボード画面実装（SC-002）
- [x] #27 日報一覧画面実装（SC-003）
- [x] #28 日報詳細画面実装（SC-004）
- [x] #29 日報作成・編集画面実装（SC-005）

#### 2.3 共通コンポーネント（Frontend）
- [x] #30 日報カードコンポーネント実装（`app/components/ReportCard.tsx`）
- [x] #31 訪問記録入力コンポーネント実装（`app/components/VisitRecordInput.tsx`）
- [x] #32 ページネーションコンポーネント実装（`app/components/Pagination.tsx`）
- [x] #33 日付範囲ピッカーコンポーネント実装（date-fns使用）
- [x] #34 ローディング・エラー表示コンポーネント

---

### Phase 3: コメント・マスタ管理

**優先度: 中 | ステータス: ✅ 完了**

#### 3.1 コメントAPI（Backend）
- [x] #35 コメント一覧取得API実装（GET `/api/v1/reports/:reportId/comments`）
- [x] #36 コメント作成API実装（POST `/api/v1/reports/:reportId/comments`）
- [x] #37 コメント更新API実装（PUT `/api/v1/comments/:id`）
- [x] #38 コメント削除API実装（DELETE `/api/v1/comments/:id`）

#### 3.2 コメント機能（Frontend）
- [x] #39 コメント一覧コンポーネント実装（`app/components/CommentList.tsx`）
- [x] #40 コメント入力フォーム実装（`app/components/CommentForm.tsx`）
- [x] #41 日報詳細画面にコメント機能統合（SC-004更新）
- [x] #42 未読コメント通知バッジ実装

#### 3.3 顧客マスタAPI（Backend）
- [x] #43 顧客一覧取得API実装（GET `/api/v1/customers`）
- [x] #44 顧客詳細取得API実装（GET `/api/v1/customers/:id`）
- [x] #45 顧客作成API実装（POST `/api/v1/customers`）
- [x] #46 顧客更新API実装（PUT `/api/v1/customers/:id`）
- [x] #47 顧客削除API実装（DELETE `/api/v1/customers/:id`）

#### 3.4 顧客マスタ画面（Frontend）
- [x] #48 顧客一覧画面実装（SC-006）
- [x] #49 顧客作成・編集画面実装（SC-007）

#### 3.5 営業マスタAPI（Backend）
- [x] #50 営業担当一覧取得API実装（GET `/api/v1/sales-staff`）
- [x] #51 営業担当詳細取得API実装（GET `/api/v1/sales-staff/:id`）
- [x] #52 営業担当作成API実装（POST `/api/v1/sales-staff`）
- [x] #53 営業担当更新API実装（PUT `/api/v1/sales-staff/:id`）
- [x] #54 営業担当削除API実装（DELETE `/api/v1/sales-staff/:id`）

#### 3.6 営業マスタ画面（Frontend）
- [x] #55 営業担当一覧画面実装（SC-008）
- [x] #56 営業担当作成・編集画面実装（SC-009）

---

### Phase 4: テスト・デプロイ

**優先度: 中 | ステータス: ✅ 完了**

#### 4.1 テスト実装（Backend）
- [x] #57 認証APIのテスト実装（Jest + Supertest）
- [x] #58 日報APIのテスト実装
- [x] #59 コメントAPIのテスト実装
- [x] #60 顧客マスタAPIのテスト実装
- [x] #61 営業マスタAPIのテスト実装
- [x] #62 統合テスト実装

#### 4.2 E2Eテスト（Frontend）
- [x] #63 Playwright or Cypress セットアップ
- [x] #64 ログインフローE2Eテスト
- [x] #65 日報作成フローE2Eテスト
- [x] #66 コメント機能E2Eテスト

#### 4.3 パフォーマンス・セキュリティ
- [x] #67 APIレスポンスタイム計測と最適化
- [x] #68 SQLインジェクション対策確認
- [x] #69 XSS対策確認
- [x] #70 CSRF対策実装
- [x] #71 レート制限（Rate Limiting）実装

#### 4.4 CI/CD・デプロイ
- [x] #72 GitHub Actions CI設定（Lint + Test）
- [x] #73 Vercel フロントエンドデプロイ設定
- [x] #74 Railway バックエンドデプロイ設定
- [x] #75 本番環境用環境変数設定
- [x] #76 Prisma本番マイグレーション戦略

#### 4.5 ドキュメント・運用
- [x] #77 API仕様書のSwagger/OpenAPI化
- [x] #78 README.mdに本番デプロイ手順追加
- [x] #79 運用マニュアル作成（バックアップ、ロールバック等）
- [x] #80 エラー監視設定（Sentry等）

---

## 📊 進捗状況

### Phase 1: 基盤実装
- [x] 19/19 タスク完了 ✅

### Phase 2: 日報機能
- [x] 15/15 タスク完了 ✅

### Phase 3: コメント・マスタ管理
- [x] 22/22 タスク完了 ✅

### Phase 4: テスト・デプロイ
- [x] 24/24 タスク完了 ✅

**全体進捗: 80/80 タスク完了（100%）** 🎉

---

## 🏷️ ラベル一覧

| ラベル | 説明 |
|--------|------|
| `backend` | バックエンド実装 |
| `frontend` | フロントエンド実装 |
| `database` | DB/Prisma関連 |
| `auth` | 認証関連 |
| `api` | API実装 |
| `ui` | UIコンポーネント |
| `test` | テスト実装 |
| `documentation` | ドキュメント作成 |
| `bug` | バグ修正 |
| `enhancement` | 機能追加 |

---

## 🚀 今後の作業手順

### 1. ローカル動作確認
```bash
# Backend起動
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend起動（別ターミナル）
cd frontend
npm install
npm run dev
```

### 2. 本番デプロイ
- **Frontend**: Vercel にデプロイ
- **Backend**: Railway にデプロイ
- **Database**: Railway PostgreSQL または Supabase

詳細は以下のドキュメントを参照：
- [README.md](./README.md) - デプロイ手順
- [docs/OPERATIONS.md](./docs/OPERATIONS.md) - 運用マニュアル
- [docs/PRISMA_MIGRATION.md](./docs/PRISMA_MIGRATION.md) - マイグレーション戦略

---

最終更新: 2026-01-08
