#!/bin/bash

# 営業日報システム - 全Issue一括作成スクリプト
# TASKS.mdの全80タスクをGitHub Issuesとして作成

set -e

REPO="stayfoolish01/sales-report-system"
MILESTONE_1="Phase 1: 基盤実装（認証・DB）"
MILESTONE_2="Phase 2: 日報機能"
MILESTONE_3="Phase 3: コメント・マスタ管理"
MILESTONE_4="Phase 4: テスト・デプロイ"

echo "🚀 営業日報システム - 全Issue作成開始"
echo "Repository: $REPO"
echo ""
echo "既に作成済み: Issue #1-5"
echo "これから作成: Issue #6-80 (75個)"
echo ""

# ========================================
# Phase 1: 基盤実装（残り14個）
# ========================================
echo "📍 Phase 1の残りIssueを作成中..."

# #6 ログインAPI実装
gh issue create --repo $REPO --title "[Backend] ログインAPI実装" \
  --body "## 概要
ユーザー認証のためのログインAPIを実装します。

## 実装内容
- \`POST /api/v1/auth/login\` エンドポイント作成
- メール・パスワードでの認証
- JWTトークン発行
- レスポンスにトークンとユーザー情報を含める

## 完了条件
- [ ] ログインAPIが正常に動作する
- [ ] 正しい認証情報でトークンが発行される
- [ ] 誤った認証情報で401エラーを返す
- [ ] レスポンスフォーマットがAPI仕様書通り

## 参照
- API仕様書: 3.1.1 ログインAPI
- TASKS.md #6" \
  --label "backend,auth,api,priority: high" \
  --milestone "$MILESTONE_1"

# #7 ログアウトAPI実装
gh issue create --repo $REPO --title "[Backend] ログアウトAPI実装" \
  --body "## 概要
ログアウト処理のAPIを実装します。

## 実装内容
- \`POST /api/v1/auth/logout\` エンドポイント作成
- トークン無効化処理（必要に応じて）
- セッションクリア

## 完了条件
- [ ] ログアウトAPIが正常に動作する
- [ ] レスポンスフォーマットがAPI仕様書通り

## 参照
- API仕様書: 3.1.2 ログアウトAPI
- TASKS.md #7" \
  --label "backend,auth,api" \
  --milestone "$MILESTONE_1"

# #8 認証状態確認API実装
gh issue create --repo $REPO --title "[Backend] 認証状態確認API実装" \
  --body "## 概要
現在のユーザー情報を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/auth/me\` エンドポイント作成
- JWTトークンから現在のユーザー情報を取得
- ユーザー情報をレスポンスとして返す

## 完了条件
- [ ] 認証状態確認APIが正常に動作する
- [ ] 正しいトークンでユーザー情報が返る
- [ ] 無効なトークンで401エラーを返す

## 参照
- API仕様書: 3.1.3 認証状態確認API
- TASKS.md #8" \
  --label "backend,auth,api" \
  --milestone "$MILESTONE_1"

# #9 認証エラーハンドリング実装
gh issue create --repo $REPO --title "[Backend] 認証エラーハンドリング実装" \
  --body "## 概要
認証関連のエラーハンドリングを統一的に実装します。

## 実装内容
- 認証エラー時のレスポンス形式統一
- エラーコード定義（UNAUTHORIZED等）
- エラーメッセージの国際化対応（日本語）

## 完了条件
- [ ] 認証エラーが適切にハンドリングされる
- [ ] エラーレスポンスがAPI仕様書通り
- [ ] エラーログが適切に出力される

## 参照
- API仕様書: 4. エラーコード
- TASKS.md #9" \
  --label "backend,auth" \
  --milestone "$MILESTONE_1"

# #10 グローバルエラーハンドラー実装
gh issue create --repo $REPO --title "[Backend] グローバルエラーハンドラー実装" \
  --body "## 概要
アプリケーション全体のエラーハンドリングミドルウェアを実装します。

## 実装内容
- \`backend/src/middlewares/errorHandler.ts\` を作成
- 全エラーをキャッチして統一レスポンス形式に変換
- エラーログ出力
- 開発環境ではスタックトレース表示

## 完了条件
- [ ] エラーハンドラーが動作する
- [ ] エラーレスポンスが統一される
- [ ] エラーログが出力される

## 参照
- CLAUDE.md: エラーハンドリング
- TASKS.md #10" \
  --label "backend,priority: high" \
  --milestone "$MILESTONE_1"

# #11 Zodバリデーションスキーマ定義
gh issue create --repo $REPO --title "[Backend] Zodバリデーションスキーマ定義" \
  --body "## 概要
Zodを使用したリクエストバリデーションスキーマを定義します。

## 実装内容
- \`backend/src/schemas/\` ディレクトリ作成
- 各エンティティのスキーマ定義
  - auth.schema.ts（ログイン）
  - report.schema.ts（日報）
  - customer.schema.ts（顧客）
  - salesStaff.schema.ts（営業担当）

## 完了条件
- [ ] 全スキーマが定義される
- [ ] TypeScript型が自動推論される
- [ ] バリデーションルールがAPI仕様書通り

## 参照
- API仕様書: 各エンドポイントのリクエストフォーマット
- TASKS.md #11" \
  --label "backend" \
  --milestone "$MILESTONE_1"

# #12 バリデーションミドルウェア実装
gh issue create --repo $REPO --title "[Backend] バリデーションミドルウェア実装" \
  --body "## 概要
Zodスキーマを使ったバリデーションミドルウェアを実装します。

## 実装内容
- \`backend/src/middlewares/validate.ts\` を作成
- リクエストボディのバリデーション
- バリデーションエラー時は400エラー返却
- エラーメッセージをわかりやすく整形

## 完了条件
- [ ] バリデーションミドルウェアが動作する
- [ ] バリデーションエラーで400エラーを返す
- [ ] エラーメッセージが日本語で表示される

## 参照
- TASKS.md #12" \
  --label "backend" \
  --milestone "$MILESTONE_1"

# #13 共通レスポンス型定義
gh issue create --repo $REPO --title "[Backend] 共通レスポンス型定義" \
  --body "## 概要
APIレスポンスの共通型を定義します。

## 実装内容
- \`backend/src/types/response.ts\` を作成
- 成功レスポンス型: \`{ success: true, data: T }\`
- エラーレスポンス型: \`{ success: false, error: {...} }\`
- ページネーションレスポンス型

## 完了条件
- [ ] 型定義が作成される
- [ ] 全APIで統一されたレスポンス形式が使用される

## 参照
- API仕様書: 2. 共通仕様
- TASKS.md #13" \
  --label "backend" \
  --milestone "$MILESTONE_1"

# #14 shadcn/ui セットアップ
gh issue create --repo $REPO --title "[Frontend] shadcn/ui セットアップ" \
  --body "## 概要
shadcn/uiコンポーネントライブラリをセットアップします。

## 実装内容
- shadcn/ui初期化
- 必要なコンポーネントをインストール
  - Button
  - Input
  - Form
  - Card
  - Select
  - Textarea
  - Dialog
  - Table
  - Toast

## 完了条件
- [ ] shadcn/uiがセットアップされる
- [ ] 基本コンポーネントがインストールされる
- [ ] サンプルページで動作確認できる

## 参照
- TASKS.md #14" \
  --label "frontend,ui,priority: high" \
  --milestone "$MILESTONE_1"

# #15 Zustand認証ストア実装
gh issue create --repo $REPO --title "[Frontend] Zustand認証ストア実装" \
  --body "## 概要
Zustandで認証状態を管理するストアを実装します。

## 実装内容
- \`app/lib/stores/authStore.ts\` を作成
- 状態: user, token, isAuthenticated
- アクション: login, logout, setUser
- localStorageへのトークン永続化

## 完了条件
- [ ] 認証ストアが動作する
- [ ] ログイン状態が保持される
- [ ] リロード後も認証状態が維持される

## 参照
- TASKS.md #15" \
  --label "frontend,auth" \
  --milestone "$MILESTONE_1"

# #16 Axios インスタンス設定
gh issue create --repo $REPO --title "[Frontend] Axios インスタンス設定" \
  --body "## 概要
認証ヘッダー自動付与機能を持つAxiosインスタンスを設定します。

## 実装内容
- \`app/lib/api/client.ts\` を作成
- ベースURL設定
- リクエストインターセプター（Authorizationヘッダー自動付与）
- レスポンスインターセプター（401エラー時の自動ログアウト）

## 完了条件
- [ ] Axiosインスタンスが動作する
- [ ] 認証トークンが自動付与される
- [ ] 401エラー時に自動ログアウトする

## 参照
- TASKS.md #16" \
  --label "frontend,api" \
  --milestone "$MILESTONE_1"

# #17 ログイン画面実装
gh issue create --repo $REPO --title "[Frontend] ログイン画面実装" \
  --body "## 概要
ログイン画面を実装します。

## 実装内容
- \`app/(auth)/login/page.tsx\` を作成
- メールアドレス・パスワード入力フォーム
- React Hook Form + Zod統合
- ログインボタン
- エラーメッセージ表示

## 完了条件
- [ ] ログイン画面が表示される
- [ ] バリデーションが動作する
- [ ] ログイン成功でダッシュボードに遷移
- [ ] ログイン失敗でエラーメッセージ表示

## 参照
- 画面定義書: SC-001 ログイン画面
- TASKS.md #17" \
  --label "frontend,auth,ui,priority: high" \
  --milestone "$MILESTONE_1"

# #18 認証ルートガード実装
gh issue create --repo $REPO --title "[Frontend] 認証ルートガード実装" \
  --body "## 概要
未認証ユーザーを保護ルートからリダイレクトする機能を実装します。

## 実装内容
- \`app/middleware.ts\` を作成
- 未認証時はログイン画面にリダイレクト
- 認証済み時はダッシュボードアクセス許可

## 完了条件
- [ ] ルートガードが動作する
- [ ] 未認証時にログイン画面へリダイレクトされる
- [ ] 認証済み時は保護ルートにアクセスできる

## 参照
- TASKS.md #18" \
  --label "frontend,auth,priority: high" \
  --milestone "$MILESTONE_1"

# #19 ログアウト機能実装
gh issue create --repo $REPO --title "[Frontend] ログアウト機能実装" \
  --body "## 概要
ログアウト機能を実装します。

## 実装内容
- ログアウトボタンコンポーネント作成
- ログアウトAPI呼び出し
- 認証ストアのクリア
- ログイン画面へリダイレクト

## 完了条件
- [ ] ログアウトボタンが動作する
- [ ] ログアウト後にログイン画面に戻る
- [ ] ストアとlocalStorageがクリアされる

## 参照
- TASKS.md #19" \
  --label "frontend,auth" \
  --milestone "$MILESTONE_1"

echo "✅ Phase 1完了（Issue #6-19）"
echo ""

# ========================================
# Phase 2: 日報機能（15個）
# ========================================
echo "📍 Phase 2のIssueを作成中..."

# #20 日報一覧取得API実装
gh issue create --repo $REPO --title "[Backend] 日報一覧取得API実装" \
  --body "## 概要
日報の一覧を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/reports\` エンドポイント作成
- ページネーション対応
- フィルタリング機能（日付範囲、担当者、ステータス）
- ソート機能

## 完了条件
- [ ] 日報一覧APIが動作する
- [ ] ページネーションが正しく動作する
- [ ] フィルタリングが動作する
- [ ] レスポンスフォーマットがAPI仕様書通り

## 参照
- API仕様書: 3.2.1 日報一覧取得
- TASKS.md #20" \
  --label "backend,api,priority: high" \
  --milestone "$MILESTONE_2"

# #21 日報詳細取得API実装
gh issue create --repo $REPO --title "[Backend] 日報詳細取得API実装" \
  --body "## 概要
指定IDの日報詳細を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/reports/:id\` エンドポイント作成
- 訪問記録も含めて取得
- コメントも含めて取得
- 存在しないIDで404エラー

## 完了条件
- [ ] 日報詳細APIが動作する
- [ ] 訪問記録が含まれる
- [ ] コメントが含まれる
- [ ] 存在しないIDで404エラー

## 参照
- API仕様書: 3.2.2 日報詳細取得
- TASKS.md #21" \
  --label "backend,api,priority: high" \
  --milestone "$MILESTONE_2"

# #22 日報作成API実装
gh issue create --repo $REPO --title "[Backend] 日報作成API実装" \
  --body "## 概要
新規日報を作成するAPIを実装します。

## 実装内容
- \`POST /api/v1/reports\` エンドポイント作成
- 訪問記録の一括作成対応
- バリデーション（必須項目チェック）
- 同一日の重複チェック

## 完了条件
- [ ] 日報作成APIが動作する
- [ ] 訪問記録が同時に作成される
- [ ] バリデーションが動作する
- [ ] 重複登録時にエラーを返す

## 参照
- API仕様書: 3.2.3 日報作成
- TASKS.md #22" \
  --label "backend,api,priority: high" \
  --milestone "$MILESTONE_2"

# #23 日報更新API実装
gh issue create --repo $REPO --title "[Backend] 日報更新API実装" \
  --body "## 概要
既存日報を更新するAPIを実装します。

## 実装内容
- \`PUT /api/v1/reports/:id\` エンドポイント作成
- 訪問記録の追加・更新・削除対応
- ステータス変更制限（SUBMITTED後は編集不可等）

## 完了条件
- [ ] 日報更新APIが動作する
- [ ] 訪問記録が更新される
- [ ] 権限チェックが動作する

## 参照
- API仕様書: 3.2.4 日報更新
- TASKS.md #23" \
  --label "backend,api,priority: high" \
  --milestone "$MILESTONE_2"

# #24 日報削除API実装
gh issue create --repo $REPO --title "[Backend] 日報削除API実装" \
  --body "## 概要
日報を削除するAPIを実装します。

## 実装内容
- \`DELETE /api/v1/reports/:id\` エンドポイント作成
- カスケード削除（訪問記録・コメントも削除）
- 権限チェック（自分の日報のみ削除可能）

## 完了条件
- [ ] 日報削除APIが動作する
- [ ] 関連データもカスケード削除される
- [ ] 権限チェックが動作する

## 参照
- API仕様書: 3.2.5 日報削除
- TASKS.md #24" \
  --label "backend,api" \
  --milestone "$MILESTONE_2"

# #25 日報提出API実装
gh issue create --repo $REPO --title "[Backend] 日報提出API実装" \
  --body "## 概要
下書き日報を提出状態に変更するAPIを実装します。

## 実装内容
- \`POST /api/v1/reports/:id/submit\` エンドポイント作成
- ステータスをDRAFT→SUBMITTEDに変更
- 提出後は編集不可にする

## 完了条件
- [ ] 日報提出APIが動作する
- [ ] ステータスが変更される
- [ ] 提出済み日報は再提出できない

## 参照
- API仕様書: 3.2.6 日報提出
- TASKS.md #25" \
  --label "backend,api,priority: high" \
  --milestone "$MILESTONE_2"

# #26 ダッシュボード画面実装
gh issue create --repo $REPO --title "[Frontend] ダッシュボード画面実装" \
  --body "## 概要
ダッシュボード画面を実装します。

## 実装内容
- \`app/(dashboard)/page.tsx\` を作成
- 日報提出状況一覧表示（カレンダー形式）
- 未読コメント件数表示
- 今週の提出状況サマリー

## 完了条件
- [ ] ダッシュボードが表示される
- [ ] 日報提出状況が確認できる
- [ ] 未読コメント数が表示される

## 参照
- 画面定義書: SC-002 ダッシュボード
- TASKS.md #26" \
  --label "frontend,ui,priority: high" \
  --milestone "$MILESTONE_2"

# #27 日報一覧画面実装
gh issue create --repo $REPO --title "[Frontend] 日報一覧画面実装" \
  --body "## 概要
日報一覧画面を実装します。

## 実装内容
- \`app/(dashboard)/reports/page.tsx\` を作成
- テーブル形式で日報一覧表示
- ページネーション実装
- フィルタリング機能（日付範囲、担当者、ステータス）
- 各行クリックで詳細画面へ遷移

## 完了条件
- [ ] 日報一覧が表示される
- [ ] ページネーションが動作する
- [ ] フィルタリングが動作する
- [ ] 詳細画面に遷移できる

## 参照
- 画面定義書: SC-003 日報一覧
- TASKS.md #27" \
  --label "frontend,ui,priority: high" \
  --milestone "$MILESTONE_2"

# #28 日報詳細画面実装
gh issue create --repo $REPO --title "[Frontend] 日報詳細画面実装" \
  --body "## 概要
日報詳細画面を実装します。

## 実装内容
- \`app/(dashboard)/reports/[id]/page.tsx\` を作成
- 訪問記録一覧表示
- Problem/Plan表示
- コメント一覧表示（Phase 3で実装）
- 編集・削除ボタン

## 完了条件
- [ ] 日報詳細が表示される
- [ ] 訪問記録が表示される
- [ ] 編集・削除ボタンが動作する

## 参照
- 画面定義書: SC-004 日報詳細
- TASKS.md #28" \
  --label "frontend,ui,priority: high" \
  --milestone "$MILESTONE_2"

# #29 日報作成・編集画面実装
gh issue create --repo $REPO --title "[Frontend] 日報作成・編集画面実装" \
  --body "## 概要
日報作成・編集画面を実装します。

## 実装内容
- \`app/(dashboard)/reports/new/page.tsx\` を作成
- \`app/(dashboard)/reports/edit/[id]/page.tsx\` を作成
- React Hook Form + Zod統合
- 訪問記録の動的追加・削除
- 顧客選択（セレクトボックス or 検索モーダル）
- 下書き保存・提出機能

## 完了条件
- [ ] 日報作成画面が表示される
- [ ] 日報編集画面が表示される
- [ ] バリデーションが動作する
- [ ] 訪問記録を追加・削除できる
- [ ] 下書き保存・提出ができる

## 参照
- 画面定義書: SC-005 日報作成・編集
- TASKS.md #29" \
  --label "frontend,ui,priority: high" \
  --milestone "$MILESTONE_2"

# #30-34 共通コンポーネント
gh issue create --repo $REPO --title "[Frontend] 日報カードコンポーネント実装" \
  --body "## 概要
日報一覧で使用するカードコンポーネントを実装します。

## 実装内容
- \`app/components/ReportCard.tsx\` を作成
- 日報の基本情報表示
- ステータスバッジ表示
- クリック時の遷移

## 完了条件
- [ ] カードコンポーネントが動作する
- [ ] 再利用可能な設計になっている

## 参照
- TASKS.md #30" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_2"

gh issue create --repo $REPO --title "[Frontend] 訪問記録入力コンポーネント実装" \
  --body "## 概要
訪問記録を入力するコンポーネントを実装します。

## 実装内容
- \`app/components/VisitRecordInput.tsx\` を作成
- 顧客選択
- 訪問内容入力
- 追加・削除ボタン

## 完了条件
- [ ] 訪問記録入力コンポーネントが動作する
- [ ] 動的に追加・削除できる

## 参照
- TASKS.md #31" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_2"

gh issue create --repo $REPO --title "[Frontend] ページネーションコンポーネント実装" \
  --body "## 概要
ページネーションコンポーネントを実装します。

## 実装内容
- \`app/components/Pagination.tsx\` を作成
- ページ番号表示
- 前へ・次へボタン
- ページサイズ選択

## 完了条件
- [ ] ページネーションコンポーネントが動作する
- [ ] 再利用可能な設計になっている

## 参照
- TASKS.md #32" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_2"

gh issue create --repo $REPO --title "[Frontend] 日付範囲ピッカーコンポーネント実装" \
  --body "## 概要
日付範囲選択コンポーネントを実装します。

## 実装内容
- \`app/components/DateRangePicker.tsx\` を作成
- date-fns使用
- 開始日・終了日選択

## 完了条件
- [ ] 日付範囲ピッカーが動作する
- [ ] date-fnsで日付処理されている

## 参照
- TASKS.md #33" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_2"

gh issue create --repo $REPO --title "[Frontend] ローディング・エラー表示コンポーネント" \
  --body "## 概要
ローディング・エラー表示コンポーネントを実装します。

## 実装内容
- \`app/components/Loading.tsx\` を作成
- \`app/components/ErrorMessage.tsx\` を作成
- スピナー表示
- エラーメッセージ表示

## 完了条件
- [ ] ローディングコンポーネントが動作する
- [ ] エラーメッセージコンポーネントが動作する

## 参照
- TASKS.md #34" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_2"

echo "✅ Phase 2完了（Issue #20-34）"
echo ""

# ========================================
# Phase 3: コメント・マスタ管理（22個）
# ========================================
echo "📍 Phase 3のIssueを作成中..."

# #35-38 コメントAPI
gh issue create --repo $REPO --title "[Backend] コメント一覧取得API実装" \
  --body "## 概要
指定日報のコメント一覧を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/reports/:reportId/comments\` エンドポイント作成
- コメント一覧を日時順で取得
- コメント作成者情報も含める

## 完了条件
- [ ] コメント一覧APIが動作する
- [ ] レスポンスフォーマットがAPI仕様書通り

## 参照
- API仕様書: 3.3.1 コメント一覧取得
- TASKS.md #35" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] コメント作成API実装" \
  --body "## 概要
日報にコメントを追加するAPIを実装します。

## 実装内容
- \`POST /api/v1/reports/:reportId/comments\` エンドポイント作成
- コメント内容のバリデーション
- コメント作成者を自動設定

## 完了条件
- [ ] コメント作成APIが動作する
- [ ] バリデーションが動作する

## 参照
- API仕様書: 3.3.2 コメント作成
- TASKS.md #36" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] コメント更新API実装" \
  --body "## 概要
既存コメントを更新するAPIを実装します。

## 実装内容
- \`PUT /api/v1/comments/:id\` エンドポイント作成
- 権限チェック（自分のコメントのみ編集可能）
- 更新日時の記録

## 完了条件
- [ ] コメント更新APIが動作する
- [ ] 権限チェックが動作する

## 参照
- API仕様書: 3.3.3 コメント更新
- TASKS.md #37" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] コメント削除API実装" \
  --body "## 概要
コメントを削除するAPIを実装します。

## 実装内容
- \`DELETE /api/v1/comments/:id\` エンドポイント作成
- 権限チェック（自分のコメントのみ削除可能）

## 完了条件
- [ ] コメント削除APIが動作する
- [ ] 権限チェックが動作する

## 参照
- API仕様書: 3.3.4 コメント削除
- TASKS.md #38" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

# #39-42 コメント機能（Frontend）
gh issue create --repo $REPO --title "[Frontend] コメント一覧コンポーネント実装" \
  --body "## 概要
コメント一覧を表示するコンポーネントを実装します。

## 実装内容
- \`app/components/CommentList.tsx\` を作成
- コメント一覧表示
- 作成者・日時表示
- 編集・削除ボタン（自分のコメントのみ）

## 完了条件
- [ ] コメント一覧が表示される
- [ ] 編集・削除ボタンが表示される

## 参照
- TASKS.md #39" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Frontend] コメント入力フォーム実装" \
  --body "## 概要
コメント入力フォームを実装します。

## 実装内容
- \`app/components/CommentForm.tsx\` を作成
- テキストエリア
- 送信ボタン
- バリデーション

## 完了条件
- [ ] コメント入力フォームが動作する
- [ ] コメント送信できる

## 参照
- TASKS.md #40" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Frontend] 日報詳細画面にコメント機能統合" \
  --body "## 概要
日報詳細画面にコメント機能を統合します。

## 実装内容
- SC-004（日報詳細画面）にコメント機能追加
- コメント一覧表示
- コメント入力フォーム表示

## 完了条件
- [ ] 日報詳細画面でコメントが表示される
- [ ] コメント追加ができる

## 参照
- 画面定義書: SC-004 日報詳細
- TASKS.md #41" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Frontend] 未読コメント通知バッジ実装" \
  --body "## 概要
未読コメント数を表示するバッジを実装します。

## 実装内容
- ダッシュボードに未読コメント数表示
- 日報一覧に未読コメントバッジ表示

## 完了条件
- [ ] 未読コメント数が表示される
- [ ] バッジが正しく動作する

## 参照
- TASKS.md #42" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

# #43-47 顧客マスタAPI
gh issue create --repo $REPO --title "[Backend] 顧客一覧取得API実装" \
  --body "## 概要
顧客一覧を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/customers\` エンドポイント作成
- 検索機能（顧客名、顧客コード）
- ページネーション対応

## 完了条件
- [ ] 顧客一覧APIが動作する
- [ ] 検索機能が動作する
- [ ] ページネーションが動作する

## 参照
- API仕様書: 3.4.1 顧客一覧取得
- TASKS.md #43" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 顧客詳細取得API実装" \
  --body "## 概要
指定IDの顧客詳細を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/customers/:id\` エンドポイント作成
- 顧客詳細情報を返す

## 完了条件
- [ ] 顧客詳細APIが動作する
- [ ] 存在しないIDで404エラー

## 参照
- API仕様書: 3.4.2 顧客詳細取得
- TASKS.md #44" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 顧客作成API実装" \
  --body "## 概要
新規顧客を作成するAPIを実装します。

## 実装内容
- \`POST /api/v1/customers\` エンドポイント作成
- バリデーション（必須項目チェック）
- 顧客コード重複チェック

## 完了条件
- [ ] 顧客作成APIが動作する
- [ ] バリデーションが動作する
- [ ] 重複登録時にエラーを返す

## 参照
- API仕様書: 3.4.3 顧客作成
- TASKS.md #45" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 顧客更新API実装" \
  --body "## 概要
既存顧客を更新するAPIを実装します。

## 実装内容
- \`PUT /api/v1/customers/:id\` エンドポイント作成
- バリデーション
- 顧客コード重複チェック

## 完了条件
- [ ] 顧客更新APIが動作する
- [ ] バリデーションが動作する

## 参照
- API仕様書: 3.4.4 顧客更新
- TASKS.md #46" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 顧客削除API実装" \
  --body "## 概要
顧客を削除するAPIを実装します。

## 実装内容
- \`DELETE /api/v1/customers/:id\` エンドポイント作成
- 削除前チェック（訪問記録が紐付いている場合は削除不可）

## 完了条件
- [ ] 顧客削除APIが動作する
- [ ] 訪問記録がある場合にエラーを返す

## 参照
- API仕様書: 3.4.5 顧客削除
- TASKS.md #47" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

# #48-49 顧客マスタ画面
gh issue create --repo $REPO --title "[Frontend] 顧客一覧画面実装" \
  --body "## 概要
顧客一覧画面を実装します。

## 実装内容
- \`app/(dashboard)/customers/page.tsx\` を作成
- テーブル形式で顧客一覧表示
- 検索機能（顧客名、顧客コード）
- ページネーション
- 新規登録ボタン

## 完了条件
- [ ] 顧客一覧が表示される
- [ ] 検索機能が動作する
- [ ] ページネーションが動作する

## 参照
- 画面定義書: SC-006 顧客一覧
- TASKS.md #48" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Frontend] 顧客作成・編集画面実装" \
  --body "## 概要
顧客作成・編集画面を実装します。

## 実装内容
- \`app/(dashboard)/customers/new/page.tsx\` を作成
- \`app/(dashboard)/customers/edit/[id]/page.tsx\` を作成
- React Hook Form + Zod統合
- 入力フォーム（顧客コード、顧客名、住所、電話番号等）

## 完了条件
- [ ] 顧客作成画面が表示される
- [ ] 顧客編集画面が表示される
- [ ] バリデーションが動作する

## 参照
- 画面定義書: SC-007 顧客作成・編集
- TASKS.md #49" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

# #50-54 営業マスタAPI
gh issue create --repo $REPO --title "[Backend] 営業担当一覧取得API実装" \
  --body "## 概要
営業担当一覧を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/sales-staff\` エンドポイント作成
- ページネーション対応
- 組織階層情報も含める

## 完了条件
- [ ] 営業担当一覧APIが動作する
- [ ] ページネーションが動作する

## 参照
- API仕様書: 3.5.1 営業担当一覧取得
- TASKS.md #50" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 営業担当詳細取得API実装" \
  --body "## 概要
指定IDの営業担当詳細を取得するAPIを実装します。

## 実装内容
- \`GET /api/v1/sales-staff/:id\` エンドポイント作成
- 営業担当詳細情報を返す

## 完了条件
- [ ] 営業担当詳細APIが動作する
- [ ] 存在しないIDで404エラー

## 参照
- API仕様書: 3.5.2 営業担当詳細取得
- TASKS.md #51" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 営業担当作成API実装" \
  --body "## 概要
新規営業担当を作成するAPIを実装します。

## 実装内容
- \`POST /api/v1/sales-staff\` エンドポイント作成
- バリデーション（必須項目チェック）
- メールアドレス重複チェック
- パスワードハッシュ化

## 完了条件
- [ ] 営業担当作成APIが動作する
- [ ] バリデーションが動作する
- [ ] パスワードがハッシュ化される

## 参照
- API仕様書: 3.5.3 営業担当作成
- TASKS.md #52" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 営業担当更新API実装" \
  --body "## 概要
既存営業担当を更新するAPIを実装します。

## 実装内容
- \`PUT /api/v1/sales-staff/:id\` エンドポイント作成
- バリデーション
- メールアドレス重複チェック

## 完了条件
- [ ] 営業担当更新APIが動作する
- [ ] バリデーションが動作する

## 参照
- API仕様書: 3.5.4 営業担当更新
- TASKS.md #53" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Backend] 営業担当削除API実装" \
  --body "## 概要
営業担当を削除するAPIを実装します。

## 実装内容
- \`DELETE /api/v1/sales-staff/:id\` エンドポイント作成
- 削除前チェック（日報が紐付いている場合は削除不可）

## 完了条件
- [ ] 営業担当削除APIが動作する
- [ ] 日報がある場合にエラーを返す

## 参照
- API仕様書: 3.5.5 営業担当削除
- TASKS.md #54" \
  --label "backend,api" \
  --milestone "$MILESTONE_3"

# #55-56 営業マスタ画面
gh issue create --repo $REPO --title "[Frontend] 営業担当一覧画面実装" \
  --body "## 概要
営業担当一覧画面を実装します。

## 実装内容
- \`app/(dashboard)/sales-staff/page.tsx\` を作成
- テーブル形式で営業担当一覧表示
- 組織階層表示（上長との関係）
- 新規登録ボタン

## 完了条件
- [ ] 営業担当一覧が表示される
- [ ] 組織階層が表示される

## 参照
- 画面定義書: SC-008 営業担当一覧
- TASKS.md #55" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

gh issue create --repo $REPO --title "[Frontend] 営業担当作成・編集画面実装" \
  --body "## 概要
営業担当作成・編集画面を実装します。

## 実装内容
- \`app/(dashboard)/sales-staff/new/page.tsx\` を作成
- \`app/(dashboard)/sales-staff/edit/[id]/page.tsx\` を作成
- React Hook Form + Zod統合
- 上長選択機能

## 完了条件
- [ ] 営業担当作成画面が表示される
- [ ] 営業担当編集画面が表示される
- [ ] バリデーションが動作する

## 参照
- 画面定義書: SC-009 営業担当作成・編集
- TASKS.md #56" \
  --label "frontend,ui" \
  --milestone "$MILESTONE_3"

echo "✅ Phase 3完了（Issue #35-56）"
echo ""

# ========================================
# Phase 4: テスト・デプロイ（24個）
# ========================================
echo "📍 Phase 4のIssueを作成中..."

# #57-62 テスト実装（Backend）
gh issue create --repo $REPO --title "[Backend] 認証APIのテスト実装" \
  --body "## 概要
認証APIのテストを実装します（Jest + Supertest）。

## 実装内容
- ログインAPIのテスト
- ログアウトAPIのテスト
- 認証状態確認APIのテスト

## 完了条件
- [ ] テストが実装される
- [ ] 全テストがパスする

## 参照
- テスト仕様書: TC-001〜TC-003
- TASKS.md #57" \
  --label "backend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] 日報APIのテスト実装" \
  --body "## 概要
日報APIのテストを実装します。

## 実装内容
- 日報CRUD APIのテスト
- 日報提出APIのテスト

## 完了条件
- [ ] テストが実装される
- [ ] 全テストがパスする

## 参照
- テスト仕様書: TC-004〜TC-011
- TASKS.md #58" \
  --label "backend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] コメントAPIのテスト実装" \
  --body "## 概要
コメントAPIのテストを実装します。

## 実装内容
- コメントCRUD APIのテスト

## 完了条件
- [ ] テストが実装される
- [ ] 全テストがパスする

## 参照
- テスト仕様書: TC-012〜TC-015
- TASKS.md #59" \
  --label "backend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] 顧客マスタAPIのテスト実装" \
  --body "## 概要
顧客マスタAPIのテストを実装します。

## 実装内容
- 顧客CRUD APIのテスト

## 完了条件
- [ ] テストが実装される
- [ ] 全テストがパスする

## 参照
- テスト仕様書: TC-016〜TC-020
- TASKS.md #60" \
  --label "backend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] 営業マスタAPIのテスト実装" \
  --body "## 概要
営業マスタAPIのテストを実装します。

## 実装内容
- 営業担当CRUD APIのテスト

## 完了条件
- [ ] テストが実装される
- [ ] 全テストがパスする

## 参照
- テスト仕様書: TC-021〜TC-025
- TASKS.md #61" \
  --label "backend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] 統合テスト実装" \
  --body "## 概要
統合テストを実装します。

## 実装内容
- 複数APIを跨ぐシナリオテスト

## 完了条件
- [ ] 統合テストが実装される
- [ ] 全テストがパスする

## 参照
- テスト仕様書: TC-026〜TC-030
- TASKS.md #62" \
  --label "backend,test" \
  --milestone "$MILESTONE_4"

# #63-66 E2Eテスト（Frontend）
gh issue create --repo $REPO --title "[Frontend] Playwright or Cypress セットアップ" \
  --body "## 概要
E2Eテストフレームワークをセットアップします。

## 実装内容
- PlaywrightまたはCypressのインストール
- 基本設定
- サンプルテスト作成

## 完了条件
- [ ] E2Eテストフレームワークがセットアップされる
- [ ] サンプルテストが動作する

## 参照
- TASKS.md #63" \
  --label "frontend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Frontend] ログインフローE2Eテスト" \
  --body "## 概要
ログインフローのE2Eテストを実装します。

## 実装内容
- ログイン成功シナリオ
- ログイン失敗シナリオ
- ログアウトシナリオ

## 完了条件
- [ ] E2Eテストが実装される
- [ ] 全テストがパスする

## 参照
- TASKS.md #64" \
  --label "frontend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Frontend] 日報作成フローE2Eテスト" \
  --body "## 概要
日報作成フローのE2Eテストを実装します。

## 実装内容
- 日報作成シナリオ
- 日報編集シナリオ
- 日報削除シナリオ

## 完了条件
- [ ] E2Eテストが実装される
- [ ] 全テストがパスする

## 参照
- TASKS.md #65" \
  --label "frontend,test" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Frontend] コメント機能E2Eテスト" \
  --body "## 概要
コメント機能のE2Eテストを実装します。

## 実装内容
- コメント追加シナリオ
- コメント編集シナリオ
- コメント削除シナリオ

## 完了条件
- [ ] E2Eテストが実装される
- [ ] 全テストがパスする

## 参照
- TASKS.md #66" \
  --label "frontend,test" \
  --milestone "$MILESTONE_4"

# #67-71 パフォーマンス・セキュリティ
gh issue create --repo $REPO --title "[Backend] APIレスポンスタイム計測と最適化" \
  --body "## 概要
APIのレスポンスタイムを計測し、最適化します。

## 実装内容
- レスポンスタイム計測
- スロークエリの特定
- インデックス追加
- N+1問題の解消

## 完了条件
- [ ] 全APIのレスポンスタイムが2秒以内
- [ ] スロークエリが解消される

## 参照
- テスト仕様書: TC-031〜TC-035
- TASKS.md #67" \
  --label "backend,priority: medium" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] SQLインジェクション対策確認" \
  --body "## 概要
SQLインジェクション対策を確認します。

## 実装内容
- Prismaのパラメータ化クエリ使用確認
- 生SQLの使用箇所チェック

## 完了条件
- [ ] SQLインジェクション対策が確認される
- [ ] 脆弱性が検出されない

## 参照
- テスト仕様書: TC-036〜TC-040
- TASKS.md #68" \
  --label "backend,priority: high" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] XSS対策確認" \
  --body "## 概要
XSS（クロスサイトスクリプティング）対策を確認します。

## 実装内容
- 入力値のエスケープ処理確認
- レスポンスのContent-Type設定確認

## 完了条件
- [ ] XSS対策が確認される
- [ ] 脆弱性が検出されない

## 参照
- TASKS.md #69" \
  --label "backend,priority: high" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] CSRF対策実装" \
  --body "## 概要
CSRF（クロスサイトリクエストフォージェリ）対策を実装します。

## 実装内容
- CSRFトークン生成・検証
- SameSite Cookie設定

## 完了条件
- [ ] CSRF対策が実装される
- [ ] 脆弱性が検出されない

## 参照
- TASKS.md #70" \
  --label "backend,priority: high" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Backend] レート制限（Rate Limiting）実装" \
  --body "## 概要
APIのレート制限を実装します。

## 実装内容
- express-rate-limit導入
- IP単位でのリクエスト制限
- エラーメッセージ設定

## 完了条件
- [ ] レート制限が実装される
- [ ] 過度なリクエストがブロックされる

## 参照
- TASKS.md #71" \
  --label "backend,priority: medium" \
  --milestone "$MILESTONE_4"

# #72-76 CI/CD・デプロイ
gh issue create --repo $REPO --title "[DevOps] GitHub Actions CI設定（Lint + Test）" \
  --body "## 概要
GitHub ActionsでCI設定を構築します。

## 実装内容
- .github/workflows/ci.yml作成
- Lint実行（ESLint, Prettier）
- テスト実行（Jest, Playwright）
- PRマージ前の必須チェック化

## 完了条件
- [ ] GitHub Actions CIが動作する
- [ ] Lint + Testが自動実行される
- [ ] PRマージ時に必須チェックされる

## 参照
- TASKS.md #72" \
  --label "documentation,priority: medium" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[DevOps] Vercel フロントエンドデプロイ設定" \
  --body "## 概要
Vercelにフロントエンドをデプロイします。

## 実装内容
- Vercelプロジェクト作成
- 環境変数設定
- デプロイ設定

## 完了条件
- [ ] フロントエンドがVercelにデプロイされる
- [ ] 本番URLでアクセスできる

## 参照
- TASKS.md #73" \
  --label "documentation,priority: high" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[DevOps] Railway バックエンドデプロイ設定" \
  --body "## 概要
Railwayにバックエンドをデプロイします。

## 実装内容
- Railwayプロジェクト作成
- PostgreSQLデータベース作成
- 環境変数設定
- デプロイ設定

## 完了条件
- [ ] バックエンドがRailwayにデプロイされる
- [ ] 本番APIが動作する

## 参照
- TASKS.md #74" \
  --label "documentation,priority: high" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[DevOps] 本番環境用環境変数設定" \
  --body "## 概要
本番環境の環境変数を設定します。

## 実装内容
- DATABASE_URL（本番DB）
- JWT_SECRET（本番用シークレット）
- ALLOWED_ORIGINS（本番フロントエンドURL）

## 完了条件
- [ ] 全環境変数が設定される
- [ ] 本番環境が正常動作する

## 参照
- TASKS.md #75" \
  --label "documentation,priority: high" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[DevOps] Prisma本番マイグレーション戦略" \
  --body "## 概要
本番環境でのPrismaマイグレーション戦略を策定します。

## 実装内容
- マイグレーション実行方法の確立
- ロールバック手順の策定
- バックアップ戦略

## 完了条件
- [ ] マイグレーション手順が確立される
- [ ] ロールバック手順が確立される

## 参照
- TASKS.md #76" \
  --label "documentation,priority: medium" \
  --milestone "$MILESTONE_4"

# #77-80 ドキュメント・運用
gh issue create --repo $REPO --title "[Documentation] API仕様書のSwagger/OpenAPI化" \
  --body "## 概要
API仕様書をSwagger/OpenAPI形式で生成します。

## 実装内容
- Swagger UI導入
- OpenAPI仕様書作成
- /api-docsでアクセス可能にする

## 完了条件
- [ ] Swagger UIが表示される
- [ ] 全APIが文書化される

## 参照
- TASKS.md #77" \
  --label "documentation" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Documentation] README.mdに本番デプロイ手順追加" \
  --body "## 概要
README.mdに本番デプロイ手順を追加します。

## 実装内容
- 本番環境セットアップ手順
- 環境変数一覧
- トラブルシューティング

## 完了条件
- [ ] README.mdが更新される
- [ ] デプロイ手順が明確に記載される

## 参照
- TASKS.md #78" \
  --label "documentation" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[Documentation] 運用マニュアル作成" \
  --body "## 概要
運用マニュアルを作成します。

## 実装内容
- バックアップ手順
- ロールバック手順
- 障害対応手順

## 完了条件
- [ ] 運用マニュアルが作成される

## 参照
- TASKS.md #79" \
  --label "documentation" \
  --milestone "$MILESTONE_4"

gh issue create --repo $REPO --title "[DevOps] エラー監視設定（Sentry等）" \
  --body "## 概要
エラー監視ツールを導入します。

## 実装内容
- Sentryセットアップ
- エラー通知設定
- ダッシュボード設定

## 完了条件
- [ ] エラー監視ツールが導入される
- [ ] エラー発生時に通知される

## 参照
- TASKS.md #80" \
  --label "documentation,priority: medium" \
  --milestone "$MILESTONE_4"

echo "✅ Phase 4完了（Issue #57-80）"
echo ""

# ========================================
# 完了メッセージ
# ========================================
echo "🎉 全Issue作成完了！"
echo ""
echo "作成されたIssue:"
echo "  ✅ Phase 1: Issue #1-19（19個）"
echo "  ✅ Phase 2: Issue #20-34（15個）"
echo "  ✅ Phase 3: Issue #35-56（22個）"
echo "  ✅ Phase 4: Issue #57-80（24個）"
echo ""
echo "合計: 80個のIssue"
echo ""
echo "次のステップ:"
echo "  1. GitHub Projectsで確認: https://github.com/stayfoolish01/sales-report-system/projects"
echo "  2. Milestonesで進捗確認: https://github.com/$REPO/milestones"
echo "  3. Issue #1から開発開始！"
echo ""
echo "開発を始めましょう！ 🚀"