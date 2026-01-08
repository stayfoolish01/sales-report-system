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
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/Loading';
import { PageError } from '@/components/ErrorMessage';
import { CommentSection } from '@/components/CommentSection';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';
import { reportsApi } from '@/lib/api/reports';
import type { ReportDetail, ReportStatus, Comment } from '@/lib/types/report';

// APIエラーレスポンスの型
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const reportId = params.id as string;

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 所有者判定と権限（reportが更新されるたびに再計算される）
  const currentUserId = user?.sales_id ?? 0;
  const isOwner = report !== null && user?.sales_id === report.sales.sales_id;
  const canEdit = isOwner && report?.status === 'draft';
  const canDelete = isOwner;
  const canSubmit = isOwner && report?.status === 'draft';

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reportsApi.get(parseInt(reportId, 10));
      if (response.success && response.data) {
        // APIレスポンスをフロントエンドの型に変換
        const apiData = response.data;
        const reportDetail: ReportDetail = {
          report_id: apiData.report_id,
          sales: {
            sales_id: apiData.sales_staff?.sales_id || apiData.sales_id || 0,
            name: apiData.sales_staff?.name || '',
            department: apiData.sales_staff?.department || '',
          },
          report_date: apiData.report_date,
          status: apiData.status?.toLowerCase() as ReportStatus,
          problem: apiData.problem || '',
          plan: apiData.plan || '',
          visit_records: (apiData.visit_records || []).map((record: {
            visit_id: number;
            customer?: {
              customer_id: number;
              customer_name?: string;
              company_name?: string;
              department?: string;
            };
            visit_content?: string;
            content?: string;
            visit_order?: number;
            created_at?: string;
          }) => ({
            visit_id: record.visit_id,
            customer: {
              customer_id: record.customer?.customer_id || 0,
              customer_name: record.customer?.customer_name || '',
              company_name: record.customer?.company_name || '',
              department: record.customer?.department || '',
            },
            visit_content: record.visit_content || record.content || '',
            visit_order: record.visit_order || 0,
            created_at: record.created_at || '',
          })),
          comments: {
            problem: (apiData.comments || [])
              .filter((c: { comment_type: string }) => c.comment_type === 'problem')
              .map((c: {
                comment_id: number;
                comment_type: string;
                comment_content?: string;
                content?: string;
                commenter?: { sales_id: number; name: string; position?: string };
                sales_staff?: { sales_id: number; name: string; position?: string };
                created_at: string;
              }) => ({
                comment_id: c.comment_id,
                comment_type: c.comment_type,
                comment_content: c.comment_content || c.content || '',
                commenter: {
                  sales_id: c.commenter?.sales_id || c.sales_staff?.sales_id || 0,
                  name: c.commenter?.name || c.sales_staff?.name || '',
                  position: c.commenter?.position || c.sales_staff?.position,
                },
                created_at: c.created_at,
              })),
            plan: (apiData.comments || [])
              .filter((c: { comment_type: string }) => c.comment_type === 'plan')
              .map((c: {
                comment_id: number;
                comment_type: string;
                comment_content?: string;
                content?: string;
                commenter?: { sales_id: number; name: string; position?: string };
                sales_staff?: { sales_id: number; name: string; position?: string };
                created_at: string;
              }) => ({
                comment_id: c.comment_id,
                comment_type: c.comment_type,
                comment_content: c.comment_content || c.content || '',
                commenter: {
                  sales_id: c.commenter?.sales_id || c.sales_staff?.sales_id || 0,
                  name: c.commenter?.name || c.sales_staff?.name || '',
                  position: c.commenter?.position || c.sales_staff?.position,
                },
                created_at: c.created_at,
              })),
          },
          created_at: apiData.created_at || '',
          updated_at: apiData.updated_at || '',
        };
        setReport(reportDetail);
      } else {
        setError('日報が見つかりません');
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
      // APIエラーからメッセージを抽出
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data as ApiErrorResponse;
        if (errorData.error?.message) {
          setError(errorData.error.message);
        } else if (err.response.status === 429) {
          setError('リクエスト回数が制限を超えました。しばらくしてから再度お試しください。');
        } else {
          setError('日報の取得に失敗しました');
        }
      } else {
        setError('日報の取得に失敗しました');
      }
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

  // 日報提出
  const handleSubmit = async () => {
    if (!confirm('この日報を提出してもよろしいですか？')) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await reportsApi.updateStatus(parseInt(reportId, 10), 'SUBMITTED');
      if (response.success) {
        // 提出成功後、日報を再取得して画面を更新
        await fetchReport();
        alert('日報を提出しました');
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data as ApiErrorResponse;
        if (errorData.error?.message) {
          alert(errorData.error.message);
        } else {
          alert('日報の提出に失敗しました');
        }
      } else {
        alert('日報の提出に失敗しました');
      }
    } finally {
      setIsSubmitting(false);
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
          {canSubmit && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? '提出中...' : '提出'}
            </Button>
          )}
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
