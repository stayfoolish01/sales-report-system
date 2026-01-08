import apiClient from './client';

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Customer {
  customer_id: number;
  customer_name: string;
  company_name: string;
  department?: string;
  position?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCustomerData {
  customer_name: string;
  company_name: string;
  department?: string;
  position?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

export const customersApi = {
  // 顧客一覧取得
  list: async (params?: CustomerListParams) => {
    const response = await apiClient.get('/customers', { params });
    return response.data;
  },

  // 顧客詳細取得
  get: async (customerId: number) => {
    const response = await apiClient.get(`/customers/${customerId}`);
    return response.data;
  },

  // 顧客作成
  create: async (data: CreateCustomerData) => {
    const response = await apiClient.post('/customers', data);
    return response.data;
  },

  // 顧客更新
  update: async (customerId: number, data: UpdateCustomerData) => {
    const response = await apiClient.put(`/customers/${customerId}`, data);
    return response.data;
  },

  // 顧客削除
  delete: async (customerId: number) => {
    const response = await apiClient.delete(`/customers/${customerId}`);
    return response.data;
  },
};

export default customersApi;
