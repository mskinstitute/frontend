'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Users,
  GraduationCap,
  Share2,
  BarChart3,
  RefreshCw,
  LogOut,
  User,
  ArrowLeft
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
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'staff' | 'students' | 'affiliates'>('overview');
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
    loadAllData();
  }, [loadAllData]);

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
      toast.success(`Staff member "${created.name}" added.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to add staff member.');
      return false;
    }
  };

  const handleUpdateStaff = async (id: number, payload: Partial<StaffItem>): Promise<boolean> => {
    try {
      const updated = await adminApi.updateStaff(id, payload);
      setStaff((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success(`Staff member "${updated.name}" updated.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update staff member.');
      return false;
    }
  };

  const handleDeleteStaff = async (id: number): Promise<boolean> => {
    try {
      await adminApi.deleteStaff(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success('Staff member removed.');
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove staff.');
      return false;
    }
  };

  // Student CRUD
  const handleAddStudent = async (payload: Partial<StudentItem>): Promise<boolean> => {
    try {
      const created = await adminApi.createStudent(payload);
      setStudents((prev) => [created, ...prev]);
      toast.success(`Student "${created.first_name}" enrolled successfully.`);
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
      toast.success(`Student "${updated.first_name}" updated.`);
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
      toast.success('Student removed.');
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove student.');
      return false;
    }
  };

  // Affiliate CRUD
  const handleAddAffiliate = async (payload: Partial<AffiliateItem>): Promise<boolean> => {
    try {
      const created = await adminApi.createAffiliate(payload);
      setAffiliates((prev) => [created, ...prev]);
      toast.success(`Affiliate partner "${created.name}" registered.`);
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to register affiliate partner.');
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
      toast.success('Affiliate partner removed.');
      loadAllData();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove affiliate.');
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Top Super Admin Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Back to Main Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-bold text-sm shadow-xs">
                M
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    MSK Super Admin
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 uppercase">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden sm:block">
                  Franchise & Institutional Operations
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => loadAllData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-secondary' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center uppercase">
                    {user.first_name?.[0] || 'A'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden md:inline">
                    {user.first_name} ({user.role || 'Admin'})
                  </span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login?redirect=/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl w-fit mb-6 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Branches & Franchises</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {branches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff & Faculty</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {staff.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'students'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students & Fees</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {students.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('affiliates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'affiliates'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Affiliates & Partners</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {affiliates.length}
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        {loading && !dashboardData ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold">Loading operations data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                data={dashboardData}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onQuickAdd={handleQuickAdd}
              />
            )}

            {activeTab === 'branches' && (
              <BranchesTab
                branches={branches}
                onAddBranch={handleAddBranch}
                onUpdateBranch={handleUpdateBranch}
                onDeleteBranch={handleDeleteBranch}
                isAddOpen={isBranchModalOpen}
                setIsAddOpen={setIsBranchModalOpen}
              />
            )}

            {activeTab === 'staff' && (
              <StaffTab
                staff={staff}
                branches={branches}
                onAddStaff={handleAddStaff}
                onUpdateStaff={handleUpdateStaff}
                onDeleteStaff={handleDeleteStaff}
                isAddOpen={isStaffModalOpen}
                setIsAddOpen={setIsStaffModalOpen}
              />
            )}

            {activeTab === 'students' && (
              <StudentsTab
                students={students}
                branches={branches}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                isAddOpen={isStudentModalOpen}
                setIsAddOpen={setIsStudentModalOpen}
              />
            )}

            {activeTab === 'affiliates' && (
              <AffiliatesTab
                affiliates={affiliates}
                onAddAffiliate={handleAddAffiliate}
                onUpdateAffiliate={handleUpdateAffiliate}
                onDeleteAffiliate={handleDeleteAffiliate}
                isAddOpen={isAffiliateModalOpen}
                setIsAddOpen={setIsAffiliateModalOpen}
              />
            )}
          </>
        )}

      </main>
    </div>
  );
}
