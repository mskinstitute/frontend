export interface BranchItem {
  id: number;
  name: string;
  code: string;
  city: string;
  address: string;
  manager_name: string;
  phone: string;
  email: string;
  revenue_share_percentage: string | number;
  status: 'active' | 'pending' | 'suspended';
  staff_count?: number;
  students_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StaffItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'center_manager' | 'instructor' | 'lab_assistant' | 'counselor' | 'accountant' | string;
  role_display?: string;
  department: string;
  branch: number | null;
  branch_name?: string;
  joining_date: string;
  salary: string | number;
  status: 'active' | 'on_leave' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface StudentItem {
  id: number;
  registration_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | string;
  branch: number | null;
  branch_name?: string;
  course_name: string;
  batch_timing: string;
  fee_total: string | number;
  fee_paid: string | number;
  fee_remaining?: string | number;
  fee_status: 'paid' | 'partial' | 'pending';
  certification_status: 'certified' | 'in_progress' | 'exam_pending';
  status: 'active' | 'completed' | 'dropped';
  created_at?: string;
  updated_at?: string;
}

export interface AffiliateItem {
  id: number;
  name: string;
  affiliate_code: string;
  email: string;
  phone: string;
  commission_rate: string | number;
  total_referrals: number;
  total_earnings: string | number;
  pending_payout: string | number;
  payout_details: string;
  status: 'active' | 'pending' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface DashboardMetrics {
  branches: {
    total: number;
    active: number;
  };
  staff: {
    total: number;
    active: number;
  };
  students: {
    total: number;
    active: number;
    certified: number;
  };
  finances: {
    fee_expected: string;
    fee_collected: string;
    fee_pending: string;
  };
  affiliates: {
    total: number;
    active: number;
    total_referrals: number;
    total_commissions: string;
    pending_payouts: string;
  };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recent_students: StudentItem[];
  recent_branches: BranchItem[];
}
