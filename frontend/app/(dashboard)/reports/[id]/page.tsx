'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  AlertTriangle,
  Calendar,
  User,
  Clock,
  CheckCircle,
  FileEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/Loading';
import { PageError } from '@/components/ErrorMessage';
import { CommentSection } from '@/components/CommentSection';
import { useAuthStore } from '@/lib/stores/authStore';
import type { ReportDetail, ReportStatus, Comment } from '@/lib/types/report';

// モックデータ（API実装後に削除）
const mockReportDetail: ReportDetail = {
  report_id: 1,
  sales: {
    sales_id: 1,
    name: '山田太郎',
    department: '営業一部',
  },
  report_date: '2026-01-07',
  status: 'submitted',
  problem: 'ABC社の決裁者へのアプローチ方法について相談したい。',
  plan: 'ABC社：提案資料のブラッシュアップ\nXYZ社：見積書の提出',
  visit_records: [
    {
      visit_id: 1,
      customer: {
        customer_id: 1,
        customer_name: '鈴木一郎',
        company_name: '株式会社ABC',
        department: '営業部',
      },
      visit_content:
        '新商品の提案を実施。好感触だが決裁者との面談が必要。次回は来週の部会で同席いただく予定。',
      visit_order: 1,
      created_at: '2026-01-07T10:00:00Z',
    },
    {
      visit_id: 2,
      customer: {
        customer_id: 2,
        customer_name: '田中花子',
        company_name: '株式会社XYZ',
        department: '総務部',
      },
      visit_content: '契約更新の商談。価格交渉あり。来週までに見積書を提出予定。',
      visit_order: 2,
      created_at: '2026-01-07T14:00:00Z',
    },
  ],
  comments: {
    problem: [
      {
        comment_id: 1,
        comment_type: 'problem',
        comment_content: '来週の部会で同席するので、その際に紹介します。',
        commenter: {
          sales_id: 10,
          name: '佐藤部長',
          position: '部長',
        },
        created_at: '2026-01-07T20:15:00Z',
      },
    ],
    plan: [
      {
        comment_id: 2,
        comment_type: 'plan',
        comment_content: '了解です。頑張ってください。',
        commenter: {
          sales_id: 10,
          name: '佐藤部長',
          position: '部長',
        },
        created_at: '2026-01-07T20:16:00Z',
      },
    ],
  },
  created_at: '2026-01-07T09:00:00Z',
  updated_at: '2026-01-07T18:30:00Z',
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const reportId = params.id as string;

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const currentUserId = user?.sales_id ?? 0;
  const isOwner = user?.sales_id === report?.sales.sales_id;
  const canEdit = isOwner && report?.status === 'draft';
  const canDelete = isOwner;

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: APIからデータを取得
      // const response = await reportsApi.getReport(reportId);
      // setReport(response.data);

      // モックデータを使用
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReport(mockReportDetail);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('日報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleEdit = () => {
    router.push(`/reports/${reportId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('この日報を削除してもよろしいですか？')) {
      return;
    }
    try {
      // TODO: API呼び出し
      // await reportsApi.deleteReport(reportId);
      router.push('/reports');
    } catch (err) {
      console.error('Failed to delete report:', err);
      alert('日報の削除に失敗しました');
    }
  };

  // コメント追加（モック）
  const handleAddComment = async (
    commentType: 'problem' | 'plan',
    content: string
  ) => {
    if (!report) return;
    setIsCommentLoading(true);
    try {
      // TODO: API呼び出し
      // await commentsApi.createComment({ report_id: report.report_id, comment_type, content });

      // モック処理：コメントをローカルで追加
      const newComment: Comment = {
        comment_id: Date.now(),
        comment_type: commentType,
        comment_content: content,
        commenter: {
          sales_id: currentUserId,
          name: user?.name ?? '自分',
          position: user?.role === 'admin' ? '管理者' : undefined,
        },
        created_at: new Date().toISOString(),
      };

      setReport({
        ...report,
        comments: {
          ...report.comments,
          [commentType]: [...report.comments[commentType], newComment],
        },
      });
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    } finally {
      setIsCommentLoading(false);
    }
  };

  // コメント編集（モック）
  const handleEditComment = async (
    commentType: 'problem' | 'plan',
    commentId: number,
    content: string
  ) => {
    if (!report) return;
    setIsCommentLoading(true);
    try {
      // TODO: API呼び出し
      // await commentsApi.updateComment(commentId, { content });

      // モック処理：コメントをローカルで更新
      setReport({
        ...report,
        comments: {
          ...report.comments,
          [commentType]: report.comments[commentType].map((c) =>
            c.comment_id === commentId ? { ...c, comment_content: content } : c
          ),
        },
      });
    } catch (err) {
      console.error('Failed to edit comment:', err);
      throw err;
    } finally {
      setIsCommentLoading(false);
    }
  };

  // コメント削除（モック）
  const handleDeleteComment = async (
    commentType: 'problem' | 'plan',
    commentId: number
  ) => {
    if (!report) return;
    setIsCommentLoading(true);
    try {
      // TODO: API呼び出し
      // await commentsApi.deleteComment(commentId);

      // モック処理：コメントをローカルで削除
      setReport({
        ...report,
        comments: {
          ...report.comments,
          [commentType]: report.comments[commentType].filter(
            (c) => c.comment_id !== commentId
          ),
        },
      });
    } catch (err) {
      console.error('Failed to delete comment:', err);
      throw err;
    } finally {
      setIsCommentLoading(false);
    }
  };

  if (isLoading) {
    return <Loading text="日報を読み込み中..." />;
  }

  if (error || !report) {
    return (
      <PageError
        title="日報が見つかりません"
        message={error || '指定された日報は存在しないか、アクセス権限がありません。'}
        onRetry={fetchReport}
        onBack={() => router.push('/reports')}
      />
    );
  }

  const formattedDate = format(new Date(report.report_date), 'yyyy年M月d日 (E)', {
    locale: ja,
  });
  const formattedUpdatedAt = format(
    new Date(report.updated_at),
    'yyyy-MM-dd HH:mm',
    { locale: ja }
  );

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">日報詳細</h1>
            <p className="text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          )}
        </div>
      </div>

      {/* メタ情報 */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem
            icon={<User className="h-4 w-4" />}
            label="営業担当"
            value={`${report.sales.name} (${report.sales.department})`}
          />
          <MetaItem
            icon={<Calendar className="h-4 w-4" />}
            label="日付"
            value={formattedDate}
          />
          <MetaItem
            icon={<Clock className="h-4 w-4" />}
            label="更新日時"
            value={formattedUpdatedAt}
          />
          <MetaItem
            icon={
              report.status === 'submitted' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <FileEdit className="h-4 w-4 text-yellow-600" />
              )
            }
            label="ステータス"
            value={<StatusBadge status={report.status} />}
          />
        </div>
      </div>

      {/* 訪問記録 */}
      <Section title="訪問記録">
        {report.visit_records.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            訪問記録がありません
          </p>
        ) : (
          <div className="space-y-4">
            {report.visit_records.map((record, index) => (
              <div key={record.visit_id} className="rounded-lg border p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {record.customer.company_name}
                      </span>
                      {record.customer.department && (
                        <span className="text-muted-foreground">
                          {record.customer.department}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      担当: {record.customer.customer_name}
                    </p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap pl-9">
                  {record.visit_content}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 課題・相談（Problem） */}
      <Section title="課題・相談（Problem）" icon={<AlertTriangle className="h-5 w-5" />}>
        {report.problem ? (
          <div className="rounded-lg border p-4 mb-4">
            <p className="whitespace-pre-wrap">{report.problem}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4 mb-4">記載なし</p>
        )}
        {/* コメントセクション */}
        <CommentSection
          comments={report.comments.problem}
          currentUserId={currentUserId}
          onAddComment={(content) => handleAddComment('problem', content)}
          onEditComment={(commentId, content) =>
            handleEditComment('problem', commentId, content)
          }
          onDeleteComment={(commentId) =>
            handleDeleteComment('problem', commentId)
          }
          isLoading={isCommentLoading}
        />
      </Section>

      {/* 明日の予定（Plan） */}
      <Section title="明日の予定（Plan）" icon={<Calendar className="h-5 w-5" />}>
        {report.plan ? (
          <div className="rounded-lg border p-4 mb-4">
            <p className="whitespace-pre-wrap">{report.plan}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4 mb-4">記載なし</p>
        )}
        {/* コメントセクション */}
        <CommentSection
          comments={report.comments.plan}
          currentUserId={currentUserId}
          onAddComment={(content) => handleAddComment('plan', content)}
          onEditComment={(commentId, content) =>
            handleEditComment('plan', commentId, content)
          }
          onDeleteComment={(commentId) => handleDeleteComment('plan', commentId)}
          isLoading={isCommentLoading}
        />
      </Section>
    </div>
  );
}

interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function MetaItem({ icon, label, value }: MetaItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === 'submitted') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
        <CheckCircle className="h-3 w-3" />
        提出済
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
      <FileEdit className="h-3 w-3" />
      下書き
    </span>
  );
}
