#!/bin/bash

# 営業日報システム - GitHub Issues/Milestones/Labels 自動セットアップスクリプト
#
# 使用方法:
#   chmod +x scripts/setup-github.sh
#   ./scripts/setup-github.sh

set -e

REPO="stayfoolish01/sales-report-system"

echo "🚀 営業日報システム - GitHub セットアップ開始"
echo "Repository: $REPO"
echo ""

# ========================================
# 1. Milestones作成
# ========================================
echo "📍 Step 1: Milestonesを作成中..."

gh api repos/$REPO/milestones -f title="Phase 1: 基盤実装（認証・DB）" -f description="認証システム、データベースセットアップ、基本的なエラーハンドリングの実装

## 主要タスク（19タスク）
- Prismaマイグレーション & シードデータ
- JWT認証システム（Backend）
- エラーハンドリング & バリデーション
- ログイン画面（Frontend）

## 完了条件
- [ ] 認証APIが動作する
- [ ] ログイン画面が実装される
- [ ] データベースが初期化される"

gh api repos/$REPO/milestones -f title="Phase 2: 日報機能" -f description="日報のCRUD機能と関連する画面の実装

## 主要タスク（15タスク）
- 日報CRUD API（Backend）
- ダッシュボード画面（Frontend）
- 日報一覧・詳細・作成画面（Frontend）
- 共通コンポーネント

## 完了条件
- [ ] 日報のCRUD操作が動作する
- [ ] ダッシュボードが実装される
- [ ] 日報一覧・詳細・作成画面が実装される"

gh api repos/$REPO/milestones -f title="Phase 3: コメント・マスタ管理" -f description="コメント機能と顧客・営業マスタ管理の実装

## 主要タスク（22タスク）
- コメントAPI・UI実装
- 顧客マスタCRUD実装
- 営業マスタCRUD実装

## 完了条件
- [ ] コメント機能が動作する
- [ ] 顧客マスタCRUDが実装される
- [ ] 営業マスタCRUDが実装される"

gh api repos/$REPO/milestones -f title="Phase 4: テスト・デプロイ" -f description="テスト実装、CI/CD構築、本番デプロイ

## 主要タスク（24タスク）
- 単体テスト・E2Eテスト
- セキュリティ対策
- CI/CD構築
- 本番環境デプロイ

## 完了条件
- [ ] テストカバレッジ80%以上
- [ ] CI/CDパイプライン構築
- [ ] 本番環境デプロイ完了"

echo "✅ Milestones作成完了"
echo ""

# ========================================
# 2. Labels作成
# ========================================
echo "🏷️  Step 2: Labelsを作成中..."

# 既存のデフォルトラベルと競合しないように、存在チェックは省略
# エラーが出ても続行する
gh label create "backend" --color "0052CC" --description "バックエンド実装" --repo $REPO || true
gh label create "frontend" --color "008672" --description "フロントエンド実装" --repo $REPO || true
gh label create "database" --color "5319E7" --description "DB/Prisma関連" --repo $REPO || true
gh label create "auth" --color "FBCA04" --description "認証関連" --repo $REPO || true
gh label create "api" --color "0E8A16" --description "API実装" --repo $REPO || true
gh label create "ui" --color "1D76DB" --description "UIコンポーネント" --repo $REPO || true
gh label create "test" --color "D93F0B" --description "テスト実装" --repo $REPO || true
gh label create "priority: high" --color "B60205" --description "優先度高" --repo $REPO || true
gh label create "priority: medium" --color "FBCA04" --description "優先度中" --repo $REPO || true
gh label create "priority: low" --color "0E8A16" --description "優先度低" --repo $REPO || true

echo "✅ Labels作成完了"
echo ""

# ========================================
# 3. Phase 1の最初のIssuesを作成
# ========================================
echo "📝 Step 3: Phase 1の初期Issuesを作成中..."

# Milestone番号を取得（Phase 1は最初に作成したので番号1）
MILESTONE_1=$(gh api repos/$REPO/milestones --jq '.[] | select(.title=="Phase 1: 基盤実装（認証・DB）") | .number')

# Issue #1: Prismaマイグレーション実行とDB初期化
gh issue create \
  --repo $REPO \
  --title "[Database] Prismaマイグレーション実行とDB初期化" \
  --body "## 概要
Prismaスキーマに基づいてデータベースマイグレーションを実行し、開発環境のDBを初期化します。

## 実装内容
- \`prisma migrate dev\` を実行してマイグレーションを適用
- データベーステーブルが正しく作成されることを確認
- Prisma Clientの型定義が生成されることを確認

## 完了条件
- [ ] マイグレーションが正常に完了する
- [ ] 5つのテーブル（SalesStaff, DailyReport, VisitRecord, Customer, Comment）が作成される
- [ ] Prisma Clientが生成され、型が利用可能になる

## 参照
- \`backend/prisma/schema.prisma\`
- 要件定義書: ER図
- TASKS.md #1" \
  --label "database,priority: high" \
  --milestone "$MILESTONE_1"

# Issue #2: Prisma Clientの型定義確認
gh issue create \
  --repo $REPO \
  --title "[Database] Prisma Clientの型定義確認" \
  --body "## 概要
Prisma Clientが生成した型定義を確認し、TypeScriptプロジェクトで正しく利用できることを検証します。

## 実装内容
- \`@prisma/client\` のimportが動作することを確認
- モデルの型（SalesStaff, DailyReport等）が利用可能か確認
- 簡単なクエリ例を作成して動作確認

## 完了条件
- [ ] Prisma Clientがインポートできる
- [ ] 全モデルの型定義が利用可能
- [ ] サンプルクエリが正常に動作する

## 参照
- backend/prisma/schema.prisma
- TASKS.md #2" \
  --label "database,backend" \
  --milestone "$MILESTONE_1"

# Issue #3: データベースシードデータ作成
gh issue create \
  --repo $REPO \
  --title "[Database] データベースシードデータ作成（テスト用営業担当・顧客）" \
  --body "## 概要
開発・テスト用のシードデータを作成します。営業担当、顧客マスタの初期データを投入します。

## 実装内容
- \`backend/prisma/seed.ts\` を作成
- テスト用営業担当者データ（5名程度）
  - 一般営業担当者（GENERAL）
  - 管理者（ADMIN）
  - マネージャー（MANAGER）
- テスト用顧客データ（10社程度）
- package.jsonに\`prisma.seed\`設定を追加

## 完了条件
- [ ] シードスクリプトが作成される
- [ ] \`npx prisma db seed\` でデータ投入が成功する
- [ ] 投入されたデータがPrisma Studioで確認できる

## 参照
- 要件定義書: 営業マスタ、顧客マスタ
- TASKS.md #3" \
  --label "database,backend" \
  --milestone "$MILESTONE_1"

# Issue #4: JWT認証ミドルウェア実装
gh issue create \
  --repo $REPO \
  --title "[Backend] JWT認証ミドルウェア実装" \
  --body "## 概要
JWTトークンを検証する認証ミドルウェアを実装します。

## 実装内容
- \`backend/src/middlewares/auth.ts\` を作成
- リクエストヘッダーから\`Authorization: Bearer <token>\`を抽出
- JWTトークンを検証（jsonwebtoken使用）
- デコードしたユーザー情報を\`req.user\`に格納
- 無効なトークンの場合は401エラーを返す

## 完了条件
- [ ] ミドルウェアが正しくトークンを検証する
- [ ] 無効なトークンで401エラーを返す
- [ ] \`req.user\`にユーザー情報が格納される
- [ ] TypeScript型定義が正しい

## 参照
- API仕様書: 3.1 認証API
- CLAUDE.md: 認証フロー
- TASKS.md #4" \
  --label "backend,auth,priority: high" \
  --milestone "$MILESTONE_1"

# Issue #5: パスワードハッシュ化ユーティリティ実装
gh issue create \
  --repo $REPO \
  --title "[Backend] パスワードハッシュ化ユーティリティ実装" \
  --body "## 概要
bcryptを使用したパスワードハッシュ化・検証のユーティリティ関数を実装します。

## 実装内容
- \`backend/src/utils/password.ts\` を作成
- \`hashPassword(password: string): Promise<string>\` 関数
  - bcryptでハッシュ化（saltRounds: 10）
- \`comparePassword(password: string, hash: string): Promise<boolean>\` 関数
  - 平文パスワードとハッシュを比較

## 完了条件
- [ ] hashPassword関数が動作する
- [ ] comparePassword関数が正しく検証する
- [ ] テストケースを追加（任意）

## 参照
- API仕様書: 3.1.1 ログインAPI
- TASKS.md #5" \
  --label "backend,auth" \
  --milestone "$MILESTONE_1"

echo "✅ Phase 1の初期Issues作成完了"
echo ""

# ========================================
# 完了メッセージ
# ========================================
echo "🎉 セットアップ完了！"
echo ""
echo "作成されたもの:"
echo "  ✅ Milestones: 4個（Phase 1〜4）"
echo "  ✅ Labels: 10個（backend, frontend, database等）"
echo "  ✅ Issues: 5個（Phase 1の最初のタスク）"
echo ""
echo "次のステップ:"
echo "  1. GitHub Projectsでタスクを確認: https://github.com/$REPO/projects"
echo "  2. 最初のIssue（#1 Prismaマイグレーション）から着手"
echo "  3. 必要に応じてTASKS.mdから追加のIssueを作成"
echo ""
echo "開発を開始しましょう！ 🚀"