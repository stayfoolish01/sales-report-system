import apiClient from './client';

export interface ReportListParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  sales_id?: number;
}

export interface CreateReportData {
  report_date: string;
  work_content?: string;
  achievements?: string;
  challenges?: string;
  next_actions?: string;
  problem?: string;
  plan?: string;
  visits?: {
    customer_id: number;
    visit_date: string;
    purpose: string;
    content: string;
    result?: string;
    next_action?: string;
  }[];
}

export interface UpdateReportData extends Partial<CreateReportData> {}

export const reportsApi = {
  // 日報一覧取得
  list: async (params?: ReportListParams) => {
    const response = await apiClient.get('/reports', { params });
    return response.data;
  },

  // 日報詳細取得
  get: async (reportId: number) => {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },

  // 日報作成
  create: async (data: CreateReportData) => {
    const response = await apiClient.post('/reports', data);
    return response.data;
  },

  // 日報更新
  update: async (reportId: number, data: UpdateReportData) => {
    const response = await apiClient.put(`/reports/${reportId}`, data);
    return response.data;
  },

  // 日報削除
  delete: async (reportId: number) => {
    const response = await apiClient.delete(`/reports/${reportId}`);
    return response.data;
  },

  // 日報提出
  submit: async (reportId: number) => {
    const response = await apiClient.post(`/reports/${reportId}/submit`);
    return response.data;
  },

  // ステータス更新
  updateStatus: async (reportId: number, status: string) => {
    const response = await apiClient.patch(`/reports/${reportId}/status`, { status });
    return response.data;
  },
};

export default reportsApi;
