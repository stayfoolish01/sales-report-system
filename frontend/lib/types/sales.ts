// 営業担当関連の型定義

export interface SalesListItem {
  sales_id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  role: 'general' | 'admin';
  manager?: {
    sales_id: number;
    name: string;
  } | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SalesDetail extends SalesListItem {
  subordinates?: {
    sales_id: number;
    name: string;
    position: string;
  }[];
}

export interface SalesFormData {
  name: string;
  email: string;
  password?: string;
  department: string;
  position: string;
  role: 'general' | 'admin';
  manager_id?: number | null;
  is_active: boolean;
}

export interface SalesSearchParams {
  keyword: string;
  department: string;
  role: 'all' | 'admin' | 'general';
  isActive: 'all' | 'active' | 'inactive';
}
