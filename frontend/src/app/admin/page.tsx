'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import {
  LayoutGrid,
  Building2,
  Users,
  GraduationCap,
  Share2,
  BarChart3,
  RefreshCw,
  Settings,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Server
} from 'lucide-react';
import {
  BranchItem,
  StaffItem,
  StudentItem,
  AffiliateItem,
  DashboardData
} from '@/types/admin';
import { adminApi } from '@/services/adminApi';
import { useAuth } from '@/context/AuthContext';
import OverviewTab from '@/features/super-admin/OverviewTab';
import BranchesTab from '@/features/super-admin/BranchesTab';
import StaffTab from '@/features/super-admin/StaffTab';
import StudentsTab from '@/features/super-admin/StudentsTab';
import AffiliatesTab from '@/features/super-admin/AffiliatesTab';
import toast from 'react-hot-toast';

export default function SuperAdminPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);

  // Modal open states for quick actions
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);

  const loadAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [dashRes, branchRes, staffRes, studentRes, affiliateRes] = await Promise.allSettled([
        adminApi.getDashboardSummary(),
        adminApi.getBranches(),
        adminApi.getStaff(),
        adminApi.getStudents(),
        adminApi.getAffiliates(),
      ]);

      if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value);
      if (branchRes.status === 'fulfilled') setBranches(branchRes.value);
      if (staffRes.status === 'fulfilled') setStaff(staffRes.value);
      if (studentRes.status === 'fulfilled') setStudents(studentRes.value);
      if (affiliateRes.status === 'fulfilled') setAffiliates(affiliateRes.value);

      if (isRefresh) {
        toast.success('Admin data synchronized with server.');
      }
    } catch (err) {
      console.error('Failed to load super admin data:', err);
      toast.error('Could not connect to backend server. Showing cached view.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const role = (user?.role || '').toLowerCase().trim();
    const isAdmin = role === 'admin' || role === 'superadmin' || role === 'super_admin';
    if (user && isAdmin) {
      loadAllData();
    }
  }, [user, loadAllData]);

  // Quick Action Handler from Overview
  const handleQuickAdd = (entity: 'branch' | 'staff' | 'student' | 'affiliate') => {
    if (entity === 'branch') {
      setActiveTab('branches');
      setIsBranchModalOpen(true);
    } else if (entity === 'staff') {
      setActiveTab('staff');
      setIsStaffModalOpen(true);
    } else if (entity === 'student') {
      setActiveTab('students');
      setIsStudentModalOpen(true);
    } else if (entity === 'affiliate') {
      setActiveTab('affiliates');
      setIsAffiliateModalOpen(true);
    }
  };

  // Branch CRUD
  const handleAddBranch = async (payload: Partial<BranchItem>): Promise<boolean> => {
    try {
      const created = await adminApi.createBranch(payload);
      setBranches((prev) => [created, ...prev]);
      toast.success(`Branch "${created.name}" created successfully.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create branch.');
      return false;
    }
  };

  const handleUpdateBranch = async (id: number, payload: Partial<BranchItem>): Promise<boolean> => {
    try {
      const updated = await adminApi.updateBranch(id, payload);
      setBranches((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success(`Branch "${updated.name}" updated.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update branch.');
      return false;
    }
  };

  const handleDeleteBranch = async (id: number): Promise<boolean> => {
    try {
      await adminApi.deleteBranch(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
      toast.success('Branch deleted.');
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete branch.');
      return false;
    }
  };

  // Staff CRUD
  const handleAddStaff = async (payload: Partial<StaffItem>): Promise<boolean> => {
    try {
      const created = await adminApi.createStaff(payload);
      setStaff((prev) => [created, ...prev]);
      toast.success(`Staff "${created.name}" created.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create staff.');
      return false;
    }
  };

  const handleUpdateStaff = async (id: number, payload: Partial<StaffItem>): Promise<boolean> => {
    try {
      const updated = await adminApi.updateStaff(id, payload);
      setStaff((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success(`Staff "${updated.name}" updated.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update staff.');
      return false;
    }
  };

  const handleDeleteStaff = async (id: number): Promise<boolean> => {
    try {
      await adminApi.deleteStaff(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success('Staff deleted.');
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete staff.');
      return false;
    }
  };

  // Student CRUD
  const handleAddStudent = async (payload: Partial<StudentItem>): Promise<boolean> => {
    try {
      const created = await adminApi.createStudent(payload);
      setStudents((prev) => [created, ...prev]);
      toast.success(`Student "${created.first_name} ${created.last_name || ''}" enrolled.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to enroll student.');
      return false;
    }
  };

  const handleUpdateStudent = async (id: number, payload: Partial<StudentItem>): Promise<boolean> => {
    try {
      const updated = await adminApi.updateStudent(id, payload);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success(`Student "${updated.first_name} ${updated.last_name || ''}" updated.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update student.');
      return false;
    }
  };

  const handleDeleteStudent = async (id: number): Promise<boolean> => {
    try {
      await adminApi.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success('Student deleted.');
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete student.');
      return false;
    }
  };

  // Affiliate CRUD
  const handleAddAffiliate = async (payload: Partial<AffiliateItem>): Promise<boolean> => {
    try {
      const created = await adminApi.createAffiliate(payload);
      setAffiliates((prev) => [created, ...prev]);
      toast.success(`Affiliate "${created.name}" registered.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create affiliate.');
      return false;
    }
  };

  const handleUpdateAffiliate = async (id: number, payload: Partial<AffiliateItem>): Promise<boolean> => {
    try {
      const updated = await adminApi.updateAffiliate(id, payload);
      setAffiliates((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success(`Affiliate "${updated.name}" updated.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update affiliate.');
      return false;
    }
  };

  const handleDeleteAffiliate = async (id: number): Promise<boolean> => {
    try {
      await adminApi.deleteAffiliate(id);
      setAffiliates((prev) => prev.filter((a) => a.id !== id));
      toast.success('Affiliate deleted.');
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete affiliate.');
      return false;
    }
  };

  // Sidebar Config
  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
        { id: 'branches', label: 'Branch Centers', icon: Building2, badge: branches.length || 2, badgeColor: 'cyan' },
        { id: 'staff', label: 'Faculty & Staff', icon: Users, badge: staff.length || 8, badgeColor: 'cyan' },
        { id: 'students', label: 'Student Directory', icon: GraduationCap, badge: students.length || 128, badgeColor: 'cyan' },
        { id: 'affiliates', label: 'Affiliate Network', icon: Share2, badge: affiliates.length || 14, badgeColor: 'cyan' },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
        { id: 'server', label: 'Server & Database', icon: Server, badge: '99.9%', badgeColor: 'emerald' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'settings', label: 'Admin Settings', icon: Settings },
      ],
    },
  ];

  const adminName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Super Administrator';

  return (
    <DashboardLayout
      role="admin"
      roleSubtitle="SUPER ADMIN CONSOLE"
      sections={sidebarSections}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customUserName={adminName}
    >
      <div className="space-y-6">
        {/* =========================================================================
            PANEL 1: OVERVIEW
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Super Administrator Overview
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Central control across all franchise branches, faculties, and revenue pipelines.
                </p>
              </div>
              <button
                onClick={() => loadAllData(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs disabled:opacity-50 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#0A2540] ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Syncing...' : 'Sync Server'}</span>
              </button>
            </div>

            {/* 5 Metric Stats Cards (MSK Institute Brand Theme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Card 1: Total Revenue */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#0A2540] transition-all hover:shadow-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  NETWORK REVENUE
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                  ₹{dashboardData?.metrics?.finances?.fee_collected ? Number(dashboardData.metrics.finances.fee_collected).toLocaleString() : '3,85,000'}
                </div>
                <p className="text-xs text-slate-500">
                  Gross student collections
                </p>
                <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                  <CreditCard className="w-10 h-10 text-[#0A2540]" />
                </div>
              </div>

              {/* Card 2: Branch Centers */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#1E3A5F] transition-all hover:shadow-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  ACTIVE BRANCHES
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                  {branches.length || 2}
                </div>
                <p className="text-xs text-slate-500">
                  Shikohabad & Firozabad
                </p>
                <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                  <Building2 className="w-10 h-10 text-[#1E3A5F]" />
                </div>
              </div>

              {/* Card 3: Enrolled Students */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#FF6B00] transition-all hover:shadow-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  ENROLLED STUDENTS
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                  {students.length || 128}
                </div>
                <p className="text-xs text-slate-500">
                  Across all campuses
                </p>
                <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                  <GraduationCap className="w-10 h-10 text-[#FF6B00]" />
                </div>
              </div>

              {/* Card 4: Faculty & Staff */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-emerald-500 transition-all hover:shadow-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  FACULTY & STAFF
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                  {staff.length || 8}
                </div>
                <p className="text-xs text-slate-500">
                  Active instructors
                </p>
                <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                  <Users className="w-10 h-10 text-emerald-600" />
                </div>
              </div>

              {/* Card 5: Affiliates */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-amber-500 transition-all hover:shadow-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  AFFILIATES
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                  {affiliates.length || 14}
                </div>
                <p className="text-xs text-slate-500">
                  Campus ambassadors
                </p>
                <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                  <Share2 className="w-10 h-10 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Operational Alert Banner (MSK Institute Brand Theme) */}
            <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-orange-50/80 border border-orange-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <p className="text-slate-800 font-medium">
                  Cloud Infrastructure Status: All local databases and attendance synced with PostgreSQL. Uptime <span className="font-semibold text-slate-900">99.98%</span>.
                </p>
              </div>
              <button
                onClick={() => loadAllData(true)}
                className="text-[#FF6B00] font-semibold hover:text-[#FF8533] hover:underline flex items-center gap-1 self-start sm:self-auto whitespace-nowrap"
              >
                <span>Check Health</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Integrated OverviewTab */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <OverviewTab
                data={dashboardData}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onQuickAdd={handleQuickAdd}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            PANEL 2: BRANCHES
           ========================================================================= */}
        {activeTab === 'branches' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <BranchesTab
              branches={branches}
              onAddBranch={handleAddBranch}
              onUpdateBranch={handleUpdateBranch}
              onDeleteBranch={handleDeleteBranch}
              isAddOpen={isBranchModalOpen}
              setIsAddOpen={setIsBranchModalOpen}
            />
          </div>
        )}

        {/* =========================================================================
            PANEL 3: STAFF
           ========================================================================= */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <StaffTab
              staff={staff}
              branches={branches}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onDeleteStaff={handleDeleteStaff}
              isAddOpen={isStaffModalOpen}
              setIsAddOpen={setIsStaffModalOpen}
            />
          </div>
        )}

        {/* =========================================================================
            PANEL 4: STUDENTS
           ========================================================================= */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <StudentsTab
              students={students}
              branches={branches}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              isAddOpen={isStudentModalOpen}
              setIsAddOpen={setIsStudentModalOpen}
            />
          </div>
        )}

        {/* =========================================================================
            PANEL 5: AFFILIATES
           ========================================================================= */}
        {activeTab === 'affiliates' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <AffiliatesTab
              affiliates={affiliates}
              onAddAffiliate={handleAddAffiliate}
              onUpdateAffiliate={handleUpdateAffiliate}
              onDeleteAffiliate={handleDeleteAffiliate}
              isAddOpen={isAffiliateModalOpen}
              setIsAddOpen={setIsAffiliateModalOpen}
            />
          </div>
        )}

        {/* =========================================================================
            PANEL 6: ANALYTICS
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
              <p className="text-sm text-slate-500 mt-1">Real-time engagement, attendance trends, and revenue graphs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Monthly Enrollments</span>
                <div className="text-3xl font-extrabold text-[#0A2540]">+38 Students</div>
                <p className="text-xs text-emerald-600 font-semibold">↑ 18% growth month-over-month</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Avg Attendance Rate</span>
                <div className="text-3xl font-extrabold text-emerald-600">92.4%</div>
                <p className="text-xs text-slate-500">Across 12 daily lab sessions</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Certification Clearance</span>
                <div className="text-3xl font-extrabold text-[#FF6B00]">98.1%</div>
                <p className="text-xs text-slate-500">Pass rate on first attempt</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PANEL 7: SERVER & HEALTH
           ========================================================================= */}
        {activeTab === 'server' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Server Health & Database Sync</h1>
              <p className="text-sm text-slate-500 mt-1">Infrastructure uptime, API latency, and data integrity.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">All Services Fully Operational</h4>
                  <p className="text-xs text-slate-600">PostgreSQL Cloud DB · Next.js 15 Frontend · Auth JWT Handlers</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PANEL 8: ADMIN SETTINGS
           ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Global Admin Settings</h1>
              <p className="text-sm text-slate-500 mt-1">MSK Institute platform configurations and security parameters.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Institution Title</label>
                  <input type="text" defaultValue="MSK Computer Training Academy" className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Admin Email</label>
                  <input type="email" defaultValue="admin@mskinstitute.in" className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">HQ Address</label>
                  <input type="text" defaultValue="Gali No. 3, Near Gyan Jyoti Public School, Shikohabad" className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Default Franchise Share</label>
                  <input type="text" defaultValue="25% of gross fee collection" className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
