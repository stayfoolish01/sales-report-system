// 日報関連の型定義

export type ReportStatus = 'draft' | 'submitted';

export interface ReportListItem {
  report_id: number;
  sales_id: number;
  sales_name: string;
  report_date: string;
  status: ReportStatus;
  visit_count: number;
  customers: string[];
  comment_count: number;
  has_unread_comments: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  customer_id: number;
  customer_name: string;
  company_name: string;
  department?: string;
}

export interface VisitRecord {
  visit_id: number;
  customer: Customer;
  visit_content: string;
  visit_order: number;
  created_at: string;
}

export interface Commenter {
  sales_id: number;
  name: string;
  position?: string;
}

export interface Comment {
  comment_id: number;
  comment_type: 'problem' | 'plan';
  comment_content: string;
  commenter: Commenter;
  created_at: string;
}

export interface ReportDetail {
  report_id: number;
  sales: {
    sales_id: number;
    name: string;
    department: string;
  };
  report_date: string;
  status: ReportStatus;
  problem?: string;
  plan?: string;
  visit_records: VisitRecord[];
  comments: {
    problem: Comment[];
    plan: Comment[];
  };
  created_at: string;
  updated_at: string;
}
