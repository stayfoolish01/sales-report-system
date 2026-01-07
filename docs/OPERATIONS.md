# 運用マニュアル

営業日報システムの運用手順について説明します。

## 目次

1. [日常運用](#日常運用)
2. [バックアップ](#バックアップ)
3. [監視](#監視)
4. [障害対応](#障害対応)
5. [メンテナンス](#メンテナンス)

---

## 日常運用

### ヘルスチェック

バックエンドAPIのヘルスチェックエンドポイント:

```bash
curl https://your-backend.railway.app/api/v1/health
```

期待されるレスポンス:
```json
{
  "status": "ok",
  "timestamp": "2026-01-08T00:00:00.000Z"
}
```

### ログ確認

#### Railway (バックエンド)
```bash
# Railway CLIでログを確認
railway logs

# リアルタイムでログを監視
railway logs --follow
```

#### Vercel (フロントエンド)
1. Vercel Dashboard → プロジェクト → Functions タブ
2. ログをフィルタリングして確認

---

## バックアップ

### データベースバックアップ

#### 自動バックアップ
Railway PostgreSQLは自動でバックアップを取得:
- 頻度: 毎日
- 保持期間: 7日間

#### 手動バックアップ

```bash
# Railway環境でpg_dump実行
railway run pg_dump -Fc > backup_$(date +%Y%m%d_%H%M%S).dump

# 特定のテーブルのみ
railway run pg_dump -t sales_staff -t reports > partial_backup.sql
```

#### リストア

```bash
# 完全リストア
railway run pg_restore -d $DATABASE_URL backup.dump

# SQLファイルからリストア
railway run psql -f backup.sql
```

### バックアップスケジュール

| タイミング | 種類 | 保持期間 |
|-----------|------|----------|
| 毎日 | 自動フルバックアップ | 7日 |
| リリース前 | 手動フルバックアップ | 30日 |
| 月次 | アーカイブバックアップ | 1年 |

---

## 監視

### Sentryによるエラー監視

#### セットアップ

1. [Sentry](https://sentry.io/) でプロジェクト作成
2. DSN（Data Source Name）を取得
3. 環境変数に設定:

```env
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

#### アラート設定

推奨アラート条件:
- 1分間に10件以上のエラー
- 新しいタイプのエラー発生時
- 特定のエラー（認証エラー等）発生時

### メトリクス監視

#### Railway ダッシュボード
- CPU使用率
- メモリ使用量
- リクエスト数
- レスポンスタイム

#### 推奨しきい値

| メトリクス | 警告 | 危険 |
|-----------|------|------|
| CPU使用率 | 70% | 90% |
| メモリ使用量 | 80% | 95% |
| レスポンスタイム | 1秒 | 3秒 |
| エラー率 | 1% | 5% |

---

## 障害対応

### 障害レベル定義

| レベル | 説明 | 対応時間目標 |
|--------|------|-------------|
| 重大 | サービス全体停止 | 即時 |
| 高 | 主要機能の障害 | 1時間以内 |
| 中 | 一部機能の障害 | 4時間以内 |
| 低 | 軽微な問題 | 翌営業日 |

### 障害対応フロー

```
障害検知
    │
    ▼
影響範囲の確認
    │
    ▼
一次対応（再起動等）
    │
    ├── 復旧 → 原因調査 → 恒久対策
    │
    └── 未復旧
           │
           ▼
       ロールバック検討
           │
           ▼
       根本原因調査
```

### よくある障害と対応

#### 1. データベース接続エラー

症状:
```
Error: Unable to connect to database
```

対応:
1. Railway ダッシュボードでDBステータス確認
2. 接続文字列の確認
3. DBの再起動

```bash
# Railway CLIで再起動
railway restart
```

#### 2. メモリ不足

症状:
```
Error: JavaScript heap out of memory
```

対応:
1. Railway ダッシュボードでメモリ使用量確認
2. アプリケーションの再起動
3. メモリリークの調査

```bash
# Node.jsのメモリ上限を増加
NODE_OPTIONS="--max-old-space-size=512"
```

#### 3. APIレスポンス遅延

症状: レスポンスタイムが3秒以上

対応:
1. 遅いAPIエンドポイントの特定
2. データベースクエリの確認
3. N+1問題のチェック

### ロールバック手順

#### Vercel (フロントエンド)

1. Vercel Dashboard → Deployments
2. 戻したいデプロイを選択
3. "Promote to Production" をクリック

#### Railway (バックエンド)

1. Railway Dashboard → Deployments
2. 戻したいデプロイを選択
3. "Rollback" をクリック

#### データベースロールバック

1. サービス停止
2. バックアップからリストア
3. コードをロールバック
4. サービス再開

---

## メンテナンス

### 定期メンテナンス

#### 週次
- [ ] ログの確認
- [ ] エラー率の確認
- [ ] ディスク使用量の確認

#### 月次
- [ ] 依存パッケージのセキュリティ監査
- [ ] パフォーマンス分析
- [ ] バックアップの検証

#### 四半期
- [ ] 依存パッケージのアップデート
- [ ] セキュリティスキャン
- [ ] 負荷テスト

### パッケージ更新

```bash
# 脆弱性チェック
npm audit

# 自動修正
npm audit fix

# 依存関係の更新
npm update

# メジャーバージョン更新（慎重に）
npm install package@latest
```

### データベースメンテナンス

```sql
-- 不要なデータの削除（例：1年以上前のログ）
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';

-- インデックスの再構築
REINDEX TABLE reports;

-- テーブル統計の更新
ANALYZE reports;
```

---

## 連絡先

| 担当 | 連絡先 | 備考 |
|------|--------|------|
| 開発チーム | dev@example.com | 技術的な問題 |
| インフラチーム | infra@example.com | サーバー関連 |
| セキュリティ | security@example.com | セキュリティインシデント |

## 参考資料

- [デプロイガイド](./DEPLOYMENT.md)
- [Prismaマイグレーション](./PRISMA_MIGRATION.md)
- [API仕様書](/api-docs)
