# 営業日報システム API仕様書

## 1. 概要

### 基本情報
- **ベースURL**: `https://api.example.com/v1`
- **プロトコル**: HTTPS
- **認証方式**: JWT (JSON Web Token)
- **データ形式**: JSON
- **文字エンコーディング**: UTF-8

### 共通仕様

#### リクエストヘッダー
```
Content-Type: application/json
Authorization: Bearer {access_token}
```

#### レスポンス形式

**成功時**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

**エラー時**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": []
  }
}
```

#### HTTPステータスコード
| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 204 | 削除成功（レスポンスボディなし） |
| 400 | リクエストエラー（バリデーションエラー等） |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | リソースが見つからない |
| 409 | 競合エラー（重複等） |
| 500 | サーバーエラー |

#### ページネーション
リスト取得APIは以下のクエリパラメータをサポート

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| page | integer | 1 | ページ番号 |
| per_page | integer | 10 | 1ページあたりの件数 |

**レスポンス例**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_pages": 5,
      "total_items": 48
    }
  }
}
```

---

## 2. 認証API

### 2.1 ログイン

営業担当者の認証を行い、アクセストークンを発行する

**エンドポイント**
```
POST /auth/login
```

**リクエストボディ**
```json
{
  "email": "yamada@example.com",
  "password": "password123"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| email | string | ○ | メールアドレス |
| password | string | ○ | パスワード |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "sales_id": 1,
      "name": "山田太郎",
      "email": "yamada@example.com",
      "department": "営業一部",
      "position": "主任",
      "role": "general",
      "manager": {
        "sales_id": 2,
        "name": "佐藤次郎"
      }
    }
  }
}
```

**エラーレスポンス (401)**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが正しくありません"
  }
}
```

---

### 2.2 ログアウト

現在のアクセストークンを無効化する

**エンドポイント**
```
POST /auth/logout
```

**リクエストボディ**
なし

**レスポンス (200)**
```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

---

### 2.3 トークンリフレッシュ

アクセストークンを更新する

**エンドポイント**
```
POST /auth/refresh
```

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

---

## 3. 日報API

### 3.1 日報一覧取得

日報の一覧を取得する

**エンドポイント**
```
GET /reports
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| start_date | date | - | 開始日 (YYYY-MM-DD) |
| end_date | date | - | 終了日 (YYYY-MM-DD) |
| sales_id | integer | - | 営業担当者ID（上長のみ指定可） |
| customer_name | string | - | 顧客名（部分一致） |
| status | string | - | ステータス (draft/submitted) |
| page | integer | - | ページ番号 (デフォルト: 1) |
| per_page | integer | - | 1ページあたりの件数 (デフォルト: 10) |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "report_id": 1,
        "sales_id": 1,
        "sales_name": "山田太郎",
        "report_date": "2024-01-15",
        "status": "submitted",
        "visit_count": 2,
        "customers": ["株式会社ABC", "株式会社XYZ"],
        "comment_count": 2,
        "has_unread_comments": true,
        "created_at": "2024-01-15T18:30:00Z",
        "updated_at": "2024-01-15T18:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_pages": 3,
      "total_items": 25
    }
  }
}
```

---

### 3.2 日報詳細取得

指定された日報の詳細を取得する

**エンドポイント**
```
GET /reports/{report_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| report_id | integer | 日報ID |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "report_id": 1,
    "sales": {
      "sales_id": 1,
      "name": "山田太郎",
      "department": "営業一部"
    },
    "report_date": "2024-01-15",
    "status": "submitted",
    "problem": "ABC社の決裁者へのアプローチ方法について相談したい。",
    "plan": "ABC社：提案資料のブラッシュアップ\nXYZ社：見積書の提出",
    "visit_records": [
      {
        "visit_id": 1,
        "customer": {
          "customer_id": 10,
          "customer_name": "鈴木一郎",
          "company_name": "株式会社ABC",
          "department": "営業部"
        },
        "visit_content": "新商品の提案を実施。好感触だが決裁者との面談が必要。",
        "visit_order": 1,
        "created_at": "2024-01-15T18:25:00Z"
      },
      {
        "visit_id": 2,
        "customer": {
          "customer_id": 11,
          "customer_name": "田中花子",
          "company_name": "株式会社XYZ",
          "department": "総務部"
        },
        "visit_content": "契約更新の商談。価格交渉あり。",
        "visit_order": 2,
        "created_at": "2024-01-15T18:26:00Z"
      }
    ],
    "comments": {
      "problem": [
        {
          "comment_id": 1,
          "comment_type": "problem",
          "comment_content": "来週の部会で同席するので、その際に紹介します。",
          "commenter": {
            "sales_id": 2,
            "name": "佐藤次郎",
            "position": "部長"
          },
          "created_at": "2024-01-15T20:15:00Z"
        }
      ],
      "plan": [
        {
          "comment_id": 2,
          "comment_type": "plan",
          "comment_content": "了解です。頑張ってください。",
          "commenter": {
            "sales_id": 2,
            "name": "佐藤次郎",
            "position": "部長"
          },
          "created_at": "2024-01-15T20:16:00Z"
        }
      ]
    },
    "created_at": "2024-01-15T18:30:00Z",
    "updated_at": "2024-01-15T18:30:00Z"
  }
}
```

**エラーレスポンス (404)**
```json
{
  "success": false,
  "error": {
    "code": "REPORT_NOT_FOUND",
    "message": "日報が見つかりません"
  }
}
```

---

### 3.3 日報作成

新規日報を作成する

**エンドポイント**
```
POST /reports
```

**リクエストボディ**
```json
{
  "report_date": "2024-01-15",
  "status": "submitted",
  "problem": "ABC社の決裁者へのアプローチ方法について相談したい。",
  "plan": "ABC社：提案資料のブラッシュアップ\nXYZ社：見積書の提出",
  "visit_records": [
    {
      "customer_id": 10,
      "visit_content": "新商品の提案を実施。好感触だが決裁者との面談が必要。",
      "visit_order": 1
    },
    {
      "customer_id": 11,
      "visit_content": "契約更新の商談。価格交渉あり。",
      "visit_order": 2
    }
  ]
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| report_date | date | ○ | 日報日付 (YYYY-MM-DD) |
| status | string | ○ | ステータス (draft/submitted) |
| problem | string | - | 課題・相談（1000文字以内） |
| plan | string | - | 明日の予定（1000文字以内） |
| visit_records | array | ○ | 訪問記録（最低1件） |
| visit_records[].customer_id | integer | ○ | 顧客ID |
| visit_records[].visit_content | string | ○ | 訪問内容（500文字以内） |
| visit_records[].visit_order | integer | ○ | 訪問順序 |

**レスポンス (201)**
```json
{
  "success": true,
  "data": {
    "report_id": 1,
    "report_date": "2024-01-15",
    "status": "submitted",
    "created_at": "2024-01-15T18:30:00Z"
  },
  "message": "日報を作成しました"
}
```

**エラーレスポンス (400)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力内容に誤りがあります",
    "details": [
      {
        "field": "visit_records",
        "message": "訪問記録は最低1件必要です"
      }
    ]
  }
}
```

**エラーレスポンス (409)**
```json
{
  "success": false,
  "error": {
    "code": "REPORT_ALREADY_EXISTS",
    "message": "この日付の日報は既に存在します"
  }
}
```

---

### 3.4 日報更新

既存の日報を更新する

**エンドポイント**
```
PUT /reports/{report_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| report_id | integer | 日報ID |

**リクエストボディ**
日報作成と同じ形式

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "report_id": 1,
    "report_date": "2024-01-15",
    "status": "submitted",
    "updated_at": "2024-01-15T19:00:00Z"
  },
  "message": "日報を更新しました"
}
```

**エラーレスポンス (403)**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "この日報を編集する権限がありません"
  }
}
```

---

### 3.5 日報削除

日報を削除する

**エンドポイント**
```
DELETE /reports/{report_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| report_id | integer | 日報ID |

**レスポンス (204)**
レスポンスボディなし

**エラーレスポンス (403)**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "この日報を削除する権限がありません"
  }
}
```

---

## 4. コメントAPI

### 4.1 コメント追加

日報にコメントを追加する（上長のみ）

**エンドポイント**
```
POST /reports/{report_id}/comments
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| report_id | integer | 日報ID |

**リクエストボディ**
```json
{
  "comment_type": "problem",
  "comment_content": "来週の部会で同席するので、その際に紹介します。"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| comment_type | string | ○ | コメント種別 (problem/plan) |
| comment_content | string | ○ | コメント内容（500文字以内） |

**レスポンス (201)**
```json
{
  "success": true,
  "data": {
    "comment_id": 1,
    "comment_type": "problem",
    "comment_content": "来週の部会で同席するので、その際に紹介します。",
    "commenter": {
      "sales_id": 2,
      "name": "佐藤次郎",
      "position": "部長"
    },
    "created_at": "2024-01-15T20:15:00Z"
  },
  "message": "コメントを追加しました"
}
```

**エラーレスポンス (403)**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "コメントする権限がありません"
  }
}
```

---

### 4.2 コメント削除

コメントを削除する（自分のコメントのみ）

**エンドポイント**
```
DELETE /comments/{comment_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| comment_id | integer | コメントID |

**レスポンス (204)**
レスポンスボディなし

---

## 5. 顧客マスタAPI

### 5.1 顧客一覧取得

顧客マスタの一覧を取得する

**エンドポイント**
```
GET /customers
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| keyword | string | - | 顧客名・会社名（部分一致） |
| page | integer | - | ページ番号 |
| per_page | integer | - | 1ページあたりの件数 |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "customer_id": 10,
        "customer_name": "鈴木一郎",
        "company_name": "株式会社ABC",
        "department": "営業部",
        "phone": "03-1234-5678",
        "email": "suzuki@abc.co.jp",
        "address": "東京都千代田区...",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_pages": 5,
      "total_items": 48
    }
  }
}
```

---

### 5.2 顧客詳細取得

指定された顧客の詳細を取得する

**エンドポイント**
```
GET /customers/{customer_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| customer_id | integer | 顧客ID |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "customer_id": 10,
    "customer_name": "鈴木一郎",
    "company_name": "株式会社ABC",
    "department": "営業部",
    "phone": "03-1234-5678",
    "email": "suzuki@abc.co.jp",
    "address": "東京都千代田区...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 5.3 顧客作成

新規顧客を登録する（上長のみ）

**エンドポイント**
```
POST /customers
```

**リクエストボディ**
```json
{
  "customer_name": "鈴木一郎",
  "company_name": "株式会社ABC",
  "department": "営業部",
  "phone": "03-1234-5678",
  "email": "suzuki@abc.co.jp",
  "address": "東京都千代田区..."
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| customer_name | string | ○ | 顧客名（50文字以内） |
| company_name | string | ○ | 会社名（100文字以内） |
| department | string | - | 部署（50文字以内） |
| phone | string | - | 電話番号 |
| email | string | - | メールアドレス |
| address | string | - | 住所（200文字以内） |

**レスポンス (201)**
```json
{
  "success": true,
  "data": {
    "customer_id": 10,
    "customer_name": "鈴木一郎",
    "company_name": "株式会社ABC",
    "created_at": "2024-01-15T10:00:00Z"
  },
  "message": "顧客を登録しました"
}
```

---

### 5.4 顧客更新

既存の顧客情報を更新する（上長のみ）

**エンドポイント**
```
PUT /customers/{customer_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| customer_id | integer | 顧客ID |

**リクエストボディ**
顧客作成と同じ形式

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "customer_id": 10,
    "customer_name": "鈴木一郎",
    "company_name": "株式会社ABC",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "顧客情報を更新しました"
}
```

---

### 5.5 顧客削除

顧客を削除する（上長のみ）

**エンドポイント**
```
DELETE /customers/{customer_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| customer_id | integer | 顧客ID |

**レスポンス (204)**
レスポンスボディなし

**エラーレスポンス (409)**
```json
{
  "success": false,
  "error": {
    "code": "CUSTOMER_IN_USE",
    "message": "この顧客は日報で使用されているため削除できません"
  }
}
```

---

## 6. 営業マスタAPI

### 6.1 営業担当者一覧取得

営業担当者マスタの一覧を取得する（上長のみ）

**エンドポイント**
```
GET /sales-staff
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| name | string | - | 氏名（部分一致） |
| department | string | - | 部署 |
| page | integer | - | ページ番号 |
| per_page | integer | - | 1ページあたりの件数 |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "sales_id": 1,
        "name": "山田太郎",
        "email": "yamada@example.com",
        "department": "営業一部",
        "position": "主任",
        "manager": {
          "sales_id": 2,
          "name": "佐藤次郎"
        },
        "role": "general",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_pages": 2,
      "total_items": 15
    }
  }
}
```

---

### 6.2 営業担当者詳細取得

指定された営業担当者の詳細を取得する

**エンドポイント**
```
GET /sales-staff/{sales_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| sales_id | integer | 営業ID |

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "sales_id": 1,
    "name": "山田太郎",
    "email": "yamada@example.com",
    "department": "営業一部",
    "position": "主任",
    "manager": {
      "sales_id": 2,
      "name": "佐藤次郎"
    },
    "role": "general",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 6.3 営業担当者作成

新規営業担当者を登録する（上長のみ）

**エンドポイント**
```
POST /sales-staff
```

**リクエストボディ**
```json
{
  "name": "山田太郎",
  "email": "yamada@example.com",
  "password": "password123",
  "department": "営業一部",
  "position": "主任",
  "manager_id": 2,
  "role": "general"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| name | string | ○ | 氏名（50文字以内） |
| email | string | ○ | メールアドレス（重複不可） |
| password | string | ○ | パスワード（8文字以上） |
| department | string | ○ | 部署 |
| position | string | - | 役職（50文字以内） |
| manager_id | integer | ○ | 上長ID |
| role | string | ○ | 権限レベル (general/admin) |

**レスポンス (201)**
```json
{
  "success": true,
  "data": {
    "sales_id": 1,
    "name": "山田太郎",
    "email": "yamada@example.com",
    "created_at": "2024-01-15T10:00:00Z"
  },
  "message": "営業担当者を登録しました"
}
```

**エラーレスポンス (409)**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "このメールアドレスは既に登録されています"
  }
}
```

---

### 6.4 営業担当者更新

既存の営業担当者情報を更新する（上長のみ）

**エンドポイント**
```
PUT /sales-staff/{sales_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| sales_id | integer | 営業ID |

**リクエストボディ**
```json
{
  "name": "山田太郎",
  "email": "yamada@example.com",
  "department": "営業一部",
  "position": "主任",
  "manager_id": 2,
  "role": "general"
}
```

passwordフィールドは更新時は不要（パスワード変更は別APIで実施）

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "sales_id": 1,
    "name": "山田太郎",
    "email": "yamada@example.com",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "営業担当者情報を更新しました"
}
```

---

### 6.5 営業担当者削除

営業担当者を削除する（上長のみ）

**エンドポイント**
```
DELETE /sales-staff/{sales_id}
```

**パスパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| sales_id | integer | 営業ID |

**レスポンス (204)**
レスポンスボディなし

**エラーレスポンス (409)**
```json
{
  "success": false,
  "error": {
    "code": "SALES_STAFF_IN_USE",
    "message": "この営業担当者は日報が存在するため削除できません"
  }
}
```

---

## 7. ダッシュボードAPI

### 7.1 ダッシュボード情報取得

ダッシュボードに表示する概要情報を取得する

**エンドポイント**
```
GET /dashboard
```

**レスポンス (200)**
```json
{
  "success": true,
  "data": {
    "user": {
      "sales_id": 1,
      "name": "山田太郎",
      "department": "営業一部"
    },
    "today": "2024-01-15",
    "my_stats": {
      "unsubmitted_reports": 1,
      "unread_comments": 3
    },
    "team_stats": {
      "subordinates_unsubmitted_reports": 2,
      "subordinates_count": 5
    }
  }
}
```

| フィールド | 説明 |
|-----------|------|
| my_stats.unsubmitted_reports | 自分の未提出日報数 |
| my_stats.unread_comments | 自分の未読コメント数 |
| team_stats.subordinates_unsubmitted_reports | 部下の未提出日報数（上長のみ） |
| team_stats.subordinates_count | 部下の人数（上長のみ） |

---

## 8. エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| VALIDATION_ERROR | 400 | バリデーションエラー |
| INVALID_CREDENTIALS | 401 | 認証エラー（ログイン失敗） |
| UNAUTHORIZED | 401 | 認証トークンが無効 |
| FORBIDDEN | 403 | アクセス権限なし |
| REPORT_NOT_FOUND | 404 | 日報が見つからない |
| CUSTOMER_NOT_FOUND | 404 | 顧客が見つからない |
| SALES_STAFF_NOT_FOUND | 404 | 営業担当者が見つからない |
| REPORT_ALREADY_EXISTS | 409 | 日報が既に存在 |
| EMAIL_ALREADY_EXISTS | 409 | メールアドレスが既に登録済み |
| CUSTOMER_IN_USE | 409 | 顧客が使用中のため削除不可 |
| SALES_STAFF_IN_USE | 409 | 営業担当者が使用中のため削除不可 |
| INTERNAL_SERVER_ERROR | 500 | サーバー内部エラー |

---

## 9. 認可ルール

### 営業担当者（role: general）
- 自分の日報のみCRUD可能
- 自分と部下の日報を閲覧可能（部下がいる場合）
- 顧客マスタは閲覧のみ可能
- 営業マスタは閲覧不可
- コメント追加は不可

### 上長（role: admin）
- すべての日報を閲覧可能
- 部下の日報にコメント追加可能
- 顧客マスタのCRUD可能
- 営業マスタのCRUD可能

---

## 10. セキュリティ

### トークン管理
- アクセストークンの有効期限: 1時間
- リフレッシュトークンの有効期限: 7日間
- トークンはHTTP-onlyクッキーまたはAuthorizationヘッダーで送信

### パスワード要件
- 最低8文字
- 英数字を含む（推奨）
- ハッシュ化してDB保存（bcrypt等）

### レート制限
- ログインAPI: 5回/分
- その他のAPI: 100回/分

### CORS
- 許可オリジン: 管理画面のドメインのみ
- クレデンシャル送信: 許可

---

## 11. 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0.0 | 2024-01-15 | 初版作成 |