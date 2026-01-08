import apiClient from './client';

// 未提出日報の詳細
export interface UnsubmittedReport {
  report_id: number;
  report_date: string;
}

// コメントの詳細
export interface RecentComment {
  comment_id: number;
  comment_content: string;
  created_at: string;
  commenter_name: string;
  report_id: number;
  report_date: string;
}

// ダッシュボード概要データの型
export interface DashboardSummary {
  unsubmitted_reports: number;
  unsubmitted_reports_list: UnsubmittedReport[];
  unread_comments: number;
  recent_comments_list: RecentComment[];
  subordinates_unsubmitted: number;
  today_visits: number;
  this_month_reports: number;
}

// APIレスポンスの型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ダッシュボードAPI
export const dashboardApi = {
  /**
   * ダッシュボード概要データ取得
   */
  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>(
      '/dashboard/summary'
    );
    return response.data;
  },
};
