import apiClient from './client';

export interface SalesStaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

export interface SalesStaff {
  sales_id: number;
  name: string;
  email: string;
  department?: string;
  position?: string;
  role: 'ADMIN' | 'GENERAL';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSalesStaffData {
  name: string;
  email: string;
  password: string;
  department?: string;
  position?: string;
  role?: 'ADMIN' | 'GENERAL';
}

export interface UpdateSalesStaffData {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
  position?: string;
  role?: 'ADMIN' | 'GENERAL';
  is_active?: boolean;
}

export const salesStaffApi = {
  // 営業担当一覧取得
  list: async (params?: SalesStaffListParams) => {
    const response = await apiClient.get('/sales-staff', { params });
    return response.data;
  },

  // 営業担当詳細取得
  get: async (salesId: number) => {
    const response = await apiClient.get(`/sales-staff/${salesId}`);
    return response.data;
  },

  // 営業担当作成
  create: async (data: CreateSalesStaffData) => {
    const response = await apiClient.post('/sales-staff', data);
    return response.data;
  },

  // 営業担当更新
  update: async (salesId: number, data: UpdateSalesStaffData) => {
    const response = await apiClient.put(`/sales-staff/${salesId}`, data);
    return response.data;
  },

  // 営業担当削除
  delete: async (salesId: number) => {
    const response = await apiClient.delete(`/sales-staff/${salesId}`);
    return response.data;
  },
};

export default salesStaffApi;
