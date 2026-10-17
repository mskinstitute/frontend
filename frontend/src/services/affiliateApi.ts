import { BACKEND_API_URL } from '@/config/api';

const BASE_URL = BACKEND_API_URL;

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('msk_auth_access');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const data = await res.json();
      if (data.detail) errorMsg = data.detail;
      else if (data.error) errorMsg = data.error;
      else {
        const first = Object.keys(data)[0];
        if (first) {
          const val = data[first];
          errorMsg = Array.isArray(val) ? `${first}: ${val[0]}` : `${first}: ${val}`;
        }
      }
    } catch {}
    throw new Error(errorMsg);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return (await res.json()) as T;
}

export interface AffiliatePreview {
  valid: boolean;
  affiliate_code?: string;
  affiliate_name?: string;
  first_name?: string;
  scholarship_percent?: number;
}

export interface SuggestedCourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  slug: string;
  description: string;
  badge: string;
}

export interface StudentJourney {
  current_stage: 'REGISTERED' | 'DEMO_BOOKED' | 'DEMO_COMPLETED' | 'ENROLLED' | 'DEMO_NO_SHOW' | 'LOST';
  is_enrolled?: boolean;
  has_referral: boolean;
  affiliate_first_name: string;
  scholarship_percent: number;
  demo_booking: {
    id: number;
    course_name: string;
    learning_mode: 'OFFLINE' | 'ONLINE';
    preferred_slot: string;
    scheduled_date: string | null;
    day1_attended: boolean;
    day2_attended: boolean;
    day3_attended?: boolean;
    status: string;
    notes?: string;
  } | null;
  enrollment: {
    id: number;
    course_name: string;
    net_fee_inr: number;
    fee_collected_inr: number;
    status: string;
    registration_number?: string;
    batch_timing?: string;
    branch_name?: string;
    fee_status?: string;
    certification_status?: string;
  } | null;
  suggested_courses?: SuggestedCourse[];
}

export interface AffiliateDashboardData {
  partner_name: string;
  affiliate_code: string;
  email: string;
  commission_rate: number;
  total_earnings_inr: number;
  available_balance_inr: number;
  pending_clearance_inr: number;
  paid_out_inr: number;
  payout_upi: string;
  pan_number: string;
  upi_verified: boolean;
  total_referrals: number;
  conversions_count: number;
  conversion_rate: number;
  funnel: {
    clicks: number;
    registrations: number;
    demos_booked: number;
    demos_completed: number;
    enrolled: number;
    rates: {
      click_to_reg_pct: number;
      reg_to_demo_pct: number;
      demo_to_done_pct: number;
      done_to_enroll_pct: number;
    };
  };
}

export interface ReferredStudentRow {
  id: number;
  student_display_name: string;
  course_interest: string;
  current_stage: string;
  scholarship_percent: number;
  created_at: string;
  commission_earned_inr: number;
  commission_status: string;
  expected_commission_inr: number;
  fee_collected_inr: number;
  events: {
    id: number;
    event_type: string;
    from_stage: string | null;
    to_stage: string | null;
    actor_name: string;
    metadata: any;
    created_at: string;
  }[];
}

export interface PayoutHistoryItem {
  id: number;
  amount_inr: number;
  upi_destination: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'PAID';
  utr_reference: string;
  requested_at: string;
  processed_at: string | null;
  admin_notes: string;
}

export interface LedgerEntry {
  id: number;
  amount_inr: number;
  collected_fee_inr: number;
  rate_applied: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REVERSED';
  clearance_due_date: string;
  created_at: string;
}

export const affiliateApi = {
  // Public
  async getAffiliatePreview(refCode: string): Promise<AffiliatePreview> {
    const res = await fetch(`${BASE_URL}/api/affiliates/preview/?ref=${encodeURIComponent(refCode)}`);
    return handleResponse<AffiliatePreview>(res);
  },

  async trackClick(refCode: string): Promise<void> {
    await fetch(`${BASE_URL}/api/affiliates/track-click/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref_code: refCode }),
    }).catch(() => {});
  },

  // Student Endpoints
  async getStudentJourney(): Promise<StudentJourney> {
    const res = await fetch(`${BASE_URL}/api/affiliates/student-journey/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<StudentJourney>(res);
  },

  async bookDemo(payload: {
    course_name: string;
    learning_mode: 'OFFLINE' | 'ONLINE';
    preferred_slot: string;
    scheduled_date?: string;
    notes?: string;
  }): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/book-demo/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  // Affiliate Portal Endpoints
  async getAffiliateMe(): Promise<AffiliateDashboardData> {
    const res = await fetch(`${BASE_URL}/api/affiliates/me/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<AffiliateDashboardData>(res);
  },

  async getAffiliateReferrals(): Promise<ReferredStudentRow[]> {
    const res = await fetch(`${BASE_URL}/api/affiliates/referrals/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<ReferredStudentRow[]>(res);
  },

  async getPayouts(): Promise<{
    available_balance_inr: number;
    settled_inr: number;
    payout_upi: string;
    payouts_history: PayoutHistoryItem[];
    ledger_entries: LedgerEntry[];
  }> {
    const res = await fetch(`${BASE_URL}/api/affiliates/payouts/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any>(res);
  },

  async requestPayout(): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/payouts/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async getSettings(): Promise<{
    name: string;
    email: string;
    affiliate_code: string;
    commission_rate: number;
    payout_upi: string;
    pan_number: string;
    upi_verified: boolean;
  }> {
    const res = await fetch(`${BASE_URL}/api/affiliates/settings/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any>(res);
  },

  async updateSettings(payload: { payout_upi?: string; pan_number?: string }): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/settings/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async getNotifications(): Promise<{
    unread_count: number;
    notifications: { id: number; title: string; message: string; channel: string; is_read: boolean; created_at: string }[];
  }> {
    const res = await fetch(`${BASE_URL}/api/affiliates/notifications/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any>(res);
  },

  async markNotificationsRead(): Promise<void> {
    await fetch(`${BASE_URL}/api/affiliates/notifications/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).catch(() => {});
  },

  // Admin Endpoints
  async getAdminDemos(params?: { status?: string; mode?: string; search?: string }): Promise<any[]> {
    const url = new URL(`${BASE_URL}/api/affiliates/admin/demos/`);
    if (params?.status) url.searchParams.set('status', params.status);
    if (params?.mode) url.searchParams.set('mode', params.mode);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any[]>(res);
  },

  async updateAdminDemo(id: number, action: string, data?: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/demos/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, ...(data || {}) }),
    });
    return handleResponse<any>(res);
  },

  async getAdminEnrollments(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/enrollments/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any[]>(res);
  },

  async createAdminEnrollment(payload: {
    student_id: number;
    course_name: string;
    gross_fee_inr: number;
    discount_percent?: number;
  }): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/enrollments/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async recordAdminPayment(enrollmentId: number, payload: {
    amount_inr: number;
    payment_method: string;
    transaction_reference?: string;
    notes?: string;
  }): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/enrollments/${enrollmentId}/record-payment/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async refundAdminPayment(paymentId: number, reason: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/enrollments/payments/${paymentId}/refund/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse<any>(res);
  },

  async getAdminCommissionSettings(): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/settings/commission/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any>(res);
  },

  async updateAdminCommissionSettings(payload: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/settings/commission/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async setAffiliateRateOverride(affiliateId: number, payload: { commission_rate: number; course_name?: string }): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/affiliates/${affiliateId}/rate/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async getAdminPayoutQueue(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/payouts/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any[]>(res);
  },

  async processAdminPayout(id: number, action: string, utr_reference?: string, admin_notes?: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/payouts/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, utr_reference, admin_notes }),
    });
    return handleResponse<any>(res);
  },

  async getAdminFollowupQueue(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/pipeline/follow-up/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any[]>(res);
  },

  async getAdminAuditLogs(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/api/affiliates/admin/audit-logs/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<any[]>(res);
  },
};
