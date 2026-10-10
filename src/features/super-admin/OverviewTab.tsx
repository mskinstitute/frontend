'use client';

import React from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Share2,
  IndianRupee,
  Award,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { DashboardData } from '@/types/admin';

interface OverviewTabProps {
  data: DashboardData | null;
  onNavigateTab: (tab: 'branches' | 'staff' | 'students' | 'affiliates') => void;
  onQuickAdd: (entity: 'branch' | 'staff' | 'student' | 'affiliate') => void;
}

export default function OverviewTab({ data, onNavigateTab, onQuickAdd }: OverviewTabProps) {
  if (!data) return null;

  const { metrics, recent_students, recent_branches } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-primary via-[#0f345c] to-primary-light text-white shadow-xl shadow-primary/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
            <TrendingUp className="w-4 h-4" />
            <span>Institute Operations Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Super Admin Control Center
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Monitor multi-branch franchises, staff payroll, student enrollments, and affiliate networks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onQuickAdd('branch')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/15 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-secondary" />
            <span>Add Branch</span>
          </button>
          <button
            onClick={() => onQuickAdd('staff')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/15 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-secondary" />
            <span>Add Staff</span>
          </button>
          <button
            onClick={() => onQuickAdd('student')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Branches Card */}
        <div
          onClick={() => onNavigateTab('branches')}
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Branches & Franchises
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">
              {metrics.branches.total}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics.branches.active} Active Centers</span>
            </div>
          </div>
        </div>

        {/* Staff & Faculty Card */}
        <div
          onClick={() => onNavigateTab('staff')}
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Staff & Instructors
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">
              {metrics.staff.total}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-600 font-semibold">
              <span>{metrics.staff.active} On Active Duty</span>
            </div>
          </div>
        </div>

        {/* Students Enrolled Card */}
        <div
          onClick={() => onNavigateTab('students')}
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">
              {metrics.students.total}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
              <Award className="w-3.5 h-3.5 text-secondary" />
              <span>{metrics.students.certified} Certified Graduates</span>
            </div>
          </div>
        </div>

        {/* Affiliates & Referrals Card */}
        <div
          onClick={() => onNavigateTab('affiliates')}
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Affiliates & Partners
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">
              {metrics.affiliates.total}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
              <span>{metrics.affiliates.total_referrals} Student Referrals</span>
            </div>
          </div>
        </div>

      </div>

      {/* Financial Health Snapshot */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-secondary flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Tuition Fee Revenue Overview
              </h3>
              <p className="text-xs text-slate-500">Consolidated financial stats across all branch centers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Fee Expected</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              ₹{Number(metrics.finances.fee_expected || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-xs text-emerald-700 font-semibold uppercase">Total Fee Collected</span>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">
              ₹{Number(metrics.finances.fee_collected || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-amber-700 font-semibold uppercase">Fee Balance Due</span>
            <p className="text-xl font-extrabold text-amber-700 mt-1">
              ₹{Number(metrics.finances.fee_pending || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Students & Recent Branches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Students Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-secondary" />
                <span>Recent Enrolled Students</span>
              </h3>
              <button
                onClick={() => onNavigateTab('students')}
                className="text-xs font-bold text-secondary hover:text-secondary-light flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {recent_students.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No recent students found.</p>
              ) : (
                recent_students.map((student) => (
                  <div key={student.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {student.course_name} • {student.registration_number}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.fee_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : student.fee_status === 'partial'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {student.fee_status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Branches Overview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span>Branch Network</span>
              </h3>
              <button
                onClick={() => onNavigateTab('branches')}
                className="text-xs font-bold text-secondary hover:text-secondary-light flex items-center gap-1 cursor-pointer"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recent_branches.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No branches registered.</p>
              ) : (
                recent_branches.map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{b.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{b.city} • Mgr: {b.manager_name}</span>
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
