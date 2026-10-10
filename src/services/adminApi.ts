import {
  BranchItem,
  StaffItem,
  StudentItem,
  AffiliateItem,
  DashboardData
} from '@/types/admin';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
      else {
        const first = Object.keys(data)[0];
        if (first) errorMsg = `${first}: ${data[first]}`;
      }
    } catch {}
    throw new Error(errorMsg);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return (await res.json()) as T;
}

export const adminApi = {
  // 1. Dashboard Overview
  async getDashboardSummary(): Promise<DashboardData> {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard/`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<DashboardData>(res);
  },

  // 2. Branches & Franchises
  async getBranches(search?: string): Promise<BranchItem[]> {
    const url = new URL(`${BASE_URL}/api/admin/branches/`);
    if (search) url.searchParams.set('search', search);
    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<BranchItem[]>(res);
  },

  async createBranch(payload: Partial<BranchItem>): Promise<BranchItem> {
    const res = await fetch(`${BASE_URL}/api/admin/branches/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<BranchItem>(res);
  },

  async updateBranch(id: number, payload: Partial<BranchItem>): Promise<BranchItem> {
    const res = await fetch(`${BASE_URL}/api/admin/branches/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<BranchItem>(res);
  },

  async deleteBranch(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/branches/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  // 3. Staff & Faculty
  async getStaff(params?: { search?: string; branch?: number; role?: string }): Promise<StaffItem[]> {
    const url = new URL(`${BASE_URL}/api/admin/staff/`);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.branch) url.searchParams.set('branch', params.branch.toString());
    if (params?.role) url.searchParams.set('role', params.role);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<StaffItem[]>(res);
  },

  async createStaff(payload: Partial<StaffItem>): Promise<StaffItem> {
    const res = await fetch(`${BASE_URL}/api/admin/staff/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<StaffItem>(res);
  },

  async updateStaff(id: number, payload: Partial<StaffItem>): Promise<StaffItem> {
    const res = await fetch(`${BASE_URL}/api/admin/staff/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<StaffItem>(res);
  },

  async deleteStaff(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/staff/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  // 4. Students & Enrollments
  async getStudents(params?: { search?: string; branch?: number; fee_status?: string }): Promise<StudentItem[]> {
    const url = new URL(`${BASE_URL}/api/admin/students/`);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.branch) url.searchParams.set('branch', params.branch.toString());
    if (params?.fee_status) url.searchParams.set('fee_status', params.fee_status);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<StudentItem[]>(res);
  },

  async createStudent(payload: Partial<StudentItem>): Promise<StudentItem> {
    const res = await fetch(`${BASE_URL}/api/admin/students/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<StudentItem>(res);
  },

  async updateStudent(id: number, payload: Partial<StudentItem>): Promise<StudentItem> {
    const res = await fetch(`${BASE_URL}/api/admin/students/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<StudentItem>(res);
  },

  async deleteStudent(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/students/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  // 5. Affiliates & Partners
  async getAffiliates(search?: string): Promise<AffiliateItem[]> {
    const url = new URL(`${BASE_URL}/api/admin/affiliates/`);
    if (search) url.searchParams.set('search', search);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<AffiliateItem[]>(res);
  },

  async createAffiliate(payload: Partial<AffiliateItem>): Promise<AffiliateItem> {
    const res = await fetch(`${BASE_URL}/api/admin/affiliates/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<AffiliateItem>(res);
  },

  async updateAffiliate(id: number, payload: Partial<AffiliateItem>): Promise<AffiliateItem> {
    const res = await fetch(`${BASE_URL}/api/admin/affiliates/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<AffiliateItem>(res);
  },

  async deleteAffiliate(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/affiliates/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },
};
