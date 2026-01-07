// 顧客関連の型定義

export interface CustomerListItem {
  customer_id: number;
  customer_code: string;
  customer_name: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerDetail extends CustomerListItem {
  contact_person?: string;
  notes?: string;
}

export interface CustomerFormData {
  customer_code: string;
  customer_name: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  notes?: string;
  is_active: boolean;
}

export interface CustomerSearchParams {
  keyword: string;
  isActive: 'all' | 'active' | 'inactive';
}
