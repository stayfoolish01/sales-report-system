# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリのコードを扱う際のガイダンスを提供します。

## プロジェクト概要

営業日報システム - 営業担当者が日々の訪問活動を記録し、上長が確認・コメントできるWebアプリケーション

## 仕様書

このプロジェクトは以下の仕様書に基づいて開発されます。**すべての開発作業はこれらの仕様書に準拠する必要があります。**

### 📋 要件定義書
**ファイル**: [requirements.md](requirements.md)

システムの概要、主要機能、データ要件、ER図を定義しています。

**主要機能**:
- 日報管理（作成・編集・閲覧）
- コメント機能（上長→部下）
- 顧客マスタ管理
- 営業マスタ管理

**データモデル**:
- SALES_STAFF（営業マスタ）
- DAILY_REPORT（日報）
- VISIT_RECORD（訪問記録）
- CUSTOMER（顧客マスタ）
- COMMENT（コメント）

### 🖼️ 画面定義書
**ファイル**: [screen-design.md](screen-design.md)

全9画面の詳細仕様（レイアウト、入力項目、バリデーション、画面遷移）を定義しています。

**画面一覧**:
- SC-001: ログイン画面
- SC-002: ダッシュボード
- SC-003: 日報作成・編集画面
- SC-004: 日報詳細画面
- SC-005: 日報一覧画面
- SC-006: 顧客マスタ一覧画面
- SC-007: 顧客マスタ登録・編集画面
- SC-008: 営業マスタ一覧画面
- SC-009: 営業マスタ登録・編集画面

### 🔌 API仕様書
**ファイル**: [api-specification.md](api-specification.md)

RESTful APIの詳細仕様（エンドポイント、リクエスト・レスポンス形式、認証、エラーコード）を定義しています。

**主要APIグループ**:
- 認証API (`/auth/*`)
- 日報API (`/reports/*`)
- コメントAPI (`/reports/{id}/comments`, `/comments/*`)
- 顧客マスタAPI (`/customers/*`)
- 営業マスタAPI (`/sales-staff/*`)
- ダッシュボードAPI (`/dashboard`)

**認証方式**: JWT (JSON Web Token)

### ✅ テスト仕様書
**ファイル**: [test-specification.md](test-specification.md)

機能テスト、統合テスト、非機能テストの詳細なテストケース（67ケース以上）を定義しています。

**テスト種別**:
- 機能テスト（認証、日報、コメント、マスタ管理）
- 統合テスト（エンドツーエンドフロー）
- 非機能テスト（パフォーマンス、セキュリティ、レスポンシブ）

## 開発ガイドライン

### 仕様書の優先順位

開発中に仕様が不明確な場合は、以下の優先順位で参照してください：

1. **要件定義書** - システムの基本設計とデータモデル
2. **API仕様書** - バックエンド開発時
3. **画面定義書** - フロントエンド開発時
4. **テスト仕様書** - テスト実装時

### 重要な制約事項

#### データベース制約
- 日報は営業担当者×日付でユニーク（1日1件のみ）
- 訪問順序で訪問記録をソート表示
- コメント種別は'problem'または'plan'のみ
- 上長IDはNULL可（最上位管理者の場合）

#### 権限制御
- **営業担当者（role: general）**
  - 自分の日報のみCRUD可能
  - 顧客マスタは閲覧のみ
  - コメント追加不可

- **上長（role: admin）**
  - すべての日報を閲覧可能
  - 部下の日報にコメント追加可能
  - 顧客マスタ・営業マスタのCRUD可能

#### セキュリティ要件
- パスワードはbcryptでハッシュ化
- SQLインジェクション対策必須
- XSS対策（HTML特殊文字エスケープ）必須
- CSRF対策必須
- アクセストークン有効期限: 1時間

#### バリデーション
- 日報の訪問記録は最低1件必須
- 訪問内容: 500文字以内
- Problem/Plan: 1000文字以内
- コメント: 500文字以内
- パスワード: 8文字以上

### コーディング規約

#### API開発
- RESTful設計に準拠
- HTTPステータスコードを適切に使用（200, 201, 204, 400, 401, 403, 404, 409, 500）
- レスポンスは必ず `{ success, data, error }` 形式
- エラーメッセージは日本語で返す
- ページネーションは `page`, `per_page` パラメータを使用

#### フロントエンド開発
- レスポンシブデザイン必須（PC/タブレット/スマートフォン対応）
- ブレークポイント: 768px, 480px
- ローディング表示を実装
- 確認ダイアログ（削除、未保存遷移）を実装
- バリデーションエラーは項目の下に赤字で表示

#### データベース
- テーブル名: スネークケース（例: `sales_staff`, `daily_report`）
- カラム名: スネークケース
- 主キー: `{テーブル名単数形}_id` （例: `sales_id`, `report_id`）
- 外部キー: `{参照テーブル単数形}_id` （例: `customer_id`, `manager_id`）
- タイムスタンプ: `created_at`, `updated_at` を必ず含める

#### テスト
- テストケースIDは `TC-{機能名}-{連番}` 形式（例: TC-AUTH-001）
- 優先度「高」のテストは必ず実装
- セキュリティテストは必須

### 日付・時刻形式
- **API**: ISO 8601形式（`YYYY-MM-DDTHH:MM:SSZ`）
- **画面表示**: 日本語形式（`YYYY年MM月DD日`, `YYYY-MM-DD HH:MM`）

### エラーコード一覧

主要なエラーコード（詳細はAPI仕様書を参照）:
- `VALIDATION_ERROR`: バリデーションエラー（400）
- `INVALID_CREDENTIALS`: 認証エラー（401）
- `FORBIDDEN`: 権限エラー（403）
- `REPORT_NOT_FOUND`: 日報が見つからない（404）
- `REPORT_ALREADY_EXISTS`: 日報が既に存在（409）
- `EMAIL_ALREADY_EXISTS`: メールアドレス重複（409）
- `CUSTOMER_IN_USE`: 顧客使用中（削除不可）（409）

## 開発フロー

### Git/GitHub ワークフロー

このプロジェクトでは**プルリクエスト（PR）ベース**の開発フローを採用しています。

#### 基本フロー

```
1. GitHub Issueを選ぶ
   ↓
2. ブランチを作成（feature/issue-番号-説明）
   ↓
3. 実装
   ↓
4. コミット（Issue番号を含める）
   ↓
5. GitHubにプッシュ
   ↓
6. プルリクエスト作成（Closes #番号）
   ↓
7. レビュー（セルフレビュー）
   ↓
8. マージ
   ↓
9. Issueが自動的にClose
   ↓
10. ブランチ削除
```

#### 詳細な手順

**1. Issueを選ぶ**
```bash
# GitHub Issues または Projects ボードから選択
# 優先度: priority: high > medium > low
# フェーズ: Phase 1 → Phase 2 → Phase 3 → Phase 4
```

**2. ブランチを作成**
```bash
git checkout master
git pull origin master
git checkout -b feature/issue-1-prisma-migration
```

**ブランチ命名規則:**
- `feature/issue-{番号}-{簡単な説明}`
- `bugfix/issue-{番号}-{簡単な説明}`

**3. 実装**
- Issueの完了条件を確認
- 参照ドキュメント（API仕様書、画面定義書等）を参照

**4. コミット**
```bash
git add .
git commit -m "feat: Prismaマイグレーション実行とDB初期化 #1"
```

**コミットメッセージ形式:**
```
<type>: <subject> #<issue番号>

type:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: コードスタイル
- refactor: リファクタリング
- test: テスト追加・修正
- chore: ビルド・ツール関連
```

**5. プッシュ**
```bash
git push origin feature/issue-1-prisma-migration
```

**6. プルリクエスト作成**
```bash
gh pr create \
  --title "feat: Prismaマイグレーション実行とDB初期化" \
  --body "Closes #1

## 概要
Prismaマイグレーションを実行し、データベースを初期化しました。

## 変更内容
- prisma migrate devを実行
- 5つのテーブルが作成されることを確認

## テスト
- [x] マイグレーションが正常に完了
- [x] テーブルが作成された"
```

**PRの本文に必ず含めるもの:**
- `Closes #番号` - マージ時にIssueを自動Close
- 概要
- 変更内容
- テスト結果

**7. レビュー**
- コードが動作するか
- コーディング規約に従っているか
- セキュリティ上の問題がないか

**8. マージ**
```bash
gh pr merge --merge
```

**9. Issueが自動Close**
- `Closes #番号` により自動的にCloseされる
- GitHub Projectsのカードも自動的に「Done」に移動

**10. ブランチ削除**
```bash
git checkout master
git pull origin master
git branch -d feature/issue-1-prisma-migration
```

### 新機能追加時
1. GitHub Issueを確認
2. 要件定義書で仕様を確認
3. 画面定義書でUI/UXを確認
4. API仕様書でエンドポイント設計を確認
5. ブランチ作成
6. バックエンド実装
7. フロントエンド実装
8. テスト仕様書に基づいてテスト実装・実行
9. プルリクエスト作成
10. コードレビュー
11. マージ

### 不具合修正時
1. GitHub Issueを作成（バグ報告テンプレート使用）
2. テスト仕様書で関連テストケースを確認
3. 不具合の原因を特定（仕様書と照らし合わせ）
4. ブランチ作成（`bugfix/issue-番号-説明`）
5. 修正実装
6. 関連テストケースを再実行
7. リグレッションテスト
8. プルリクエスト作成
9. マージ

### 仕様変更時
1. **必ず該当する仕様書を更新**
2. 影響範囲を調査（データベース、API、画面、テスト）
3. 変更履歴を仕様書に記録
4. GitHub Issueを作成
5. 関連する実装をすべて更新
6. テストケースを追加・更新
7. プルリクエスト作成（複数に分けることも検討）

### タスク管理

**GitHub Issues + Projects を使用:**
- **Issues**: 全80タスクが作成済み（Phase 1-4）
- **Projects**: カンバンボードで進捗管理
- **Milestones**: Phase 1-4の進捗率を可視化

**確認先:**
- Issues: https://github.com/stayfoolish01/sales-report-system/issues
- Projects: https://github.com/users/stayfoolish01/projects
- Milestones: https://github.com/stayfoolish01/sales-report-system/milestones

**タスク一覧:**
- [TASKS.md](TASKS.md) - 全80タスクの詳細リスト

**開発の進め方:**
- Phase 1から順番に進める
- 各IssueをPR経由でCloseしていく
- Milestonesで進捗を確認

## 技術スタック

### バックエンド
- **言語**: TypeScript (Node.js 20.x LTS)
- **ランタイム**: Node.js 20.x LTS
- **フレームワーク**: Express.js 4.x
- **ORM**: Prisma 5.x
- **データベース**: PostgreSQL 15.x
- **認証**: jsonwebtoken + bcrypt
- **バリデーション**: Zod
- **API文書化**: Swagger (OpenAPI 3.0)
- **環境変数管理**: dotenv

### フロントエンド
- **フレームワーク**: Next.js 14.x (App Router)
- **言語**: TypeScript
- **UIライブラリ**: Tailwind CSS 3.x + shadcn/ui
- **状態管理**: Zustand
- **フォーム管理**: React Hook Form + Zod
- **HTTP通信**: Axios
- **日付処理**: date-fns
- **アイコン**: Lucide React

### 開発ツール
- **パッケージマネージャー**: npm / pnpm
- **リンター**: ESLint
- **フォーマッター**: Prettier
- **型チェック**: TypeScript Compiler
- **Git Hooks**: Husky + lint-staged

### テスト
- **ユニットテスト**: Jest
- **E2Eテスト**: Playwright (検討中)
- **APIテスト**: Supertest
- **フロントエンドテスト**: React Testing Library

### インフラ・デプロイ
- **コンテナ**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **ホスティング（フロント）**: Vercel
- **ホスティング（バック）**: Railway / Render
- **データベースホスティング**: Supabase / Railway

### 技術選定の理由

#### TypeScript統一
- フロント・バック両方でTypeScriptを使用することで型の共有が可能
- 型安全性によりバグの早期発見とリファクタリングの容易性を実現
- APIのリクエスト/レスポンス型を共有できる

#### Next.js 14 (App Router)
- React Server Componentsで初期表示が高速
- App Routerで最新のReact機能を活用
- ファイルベースルーティングで直感的な開発
- Vercelで簡単デプロイ

#### Prisma
- 型安全なDB操作
- マイグレーション管理が優れている
- Prisma Studioでデータの可視化が容易
- TypeScriptとの統合が完璧

#### Tailwind CSS + shadcn/ui
- ユーティリティファーストで開発速度が速い
- shadcn/uiで美しいコンポーネントを素早く構築
- カスタマイズ性が高い
- バンドルサイズが小さい

#### Zustand
- シンプルで学習コストが低い
- Reduxより軽量
- TypeScriptサポートが優れている
- グローバル状態管理に最適

#### Zod
- TypeScriptファーストなバリデーションライブラリ
- React Hook FormやPrismaと相性が良い
- フロント・バック両方で使用可能
- 型推論が強力

## プロジェクト構成（予定）

```
sales-report-system/
├── docs/                      # 仕様書
│   ├── requirements.md
│   ├── screen-design.md
│   ├── api-specification.md
│   └── test-specification.md
├── backend/                   # バックエンド
│   ├── src/
│   │   ├── routes/           # ルーティング
│   │   ├── controllers/      # コントローラー
│   │   ├── models/           # データモデル
│   │   ├── middlewares/      # ミドルウェア（認証等）
│   │   └── utils/            # ユーティリティ
│   ├── tests/                # テスト
│   └── prisma/               # DB スキーマ（ORM使用時）
├── frontend/                  # フロントエンド
│   ├── src/
│   │   ├── components/       # コンポーネント
│   │   ├── pages/            # ページ
│   │   ├── hooks/            # カスタムフック
│   │   ├── services/         # API通信
│   │   └── utils/            # ユーティリティ
│   └── tests/                # テスト
├── database/                  # データベース
│   ├── migrations/           # マイグレーション
│   └── seeds/                # シードデータ
├── docker-compose.yml        # Docker構成
└── README.md                 # プロジェクト説明
```

## 注意事項

### 開発時の必須チェック
- [ ] 仕様書に記載された要件を満たしているか
- [ ] 権限制御が正しく実装されているか
- [ ] バリデーションが実装されているか
- [ ] セキュリティ対策（SQLインジェクション、XSS、CSRF）が実装されているか
- [ ] エラーハンドリングが適切か
- [ ] レスポンシブ対応されているか
- [ ] テストケースが実装されているか

### コミットメッセージ
以下の形式を推奨:
```
[機能名] 変更内容の要約

詳細説明（必要に応じて）

関連: TC-XXX-XXX（関連するテストケースID）
```

例:
```
[日報] 日報作成APIを実装

- POST /reports エンドポイントを追加
- バリデーション機能を実装
- 訪問記録の同時作成に対応

関連: TC-REPORT-001, TC-REPORT-002, TC-REPORT-003
```

## 参考情報

### 仕様書の場所
すべての仕様書は `sales-report-system/` ディレクトリ直下に配置されています。

### 質問・不明点
仕様に不明点がある場合は、該当する仕様書を確認してください。
仕様書に記載がない場合は、プロジェクトオーナーに確認の上、仕様書を更新してください。

---

**最終更新**: 2024-01-15
**バージョン**: 1.0.0