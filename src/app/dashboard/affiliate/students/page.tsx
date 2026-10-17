'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import AffiliateNavHeader from '@/components/affiliate/AffiliateNavHeader';
import { affiliateApi, ReferredStudentRow, AffiliateDashboardData } from '@/services/affiliateApi';
import {
  LayoutGrid,
  Share2,
  Users,
  CreditCard,
  Download,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  AlertCircle,
  CalendarCheck,
  UserCheck,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReferredStudentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AffiliateDashboardData | null>(null);
  const [students, setStudents] = useState<ReferredStudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // Selected Student for Lifecycle Timeline Drawer
  const [selectedStudent, setSelectedStudent] = useState<ReferredStudentRow | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashData, studentList] = await Promise.all([
        affiliateApi.getAffiliateMe(),
        affiliateApi.getAffiliateReferrals(),
      ]);
      setData(dashData);
      setStudents(studentList);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load referred students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const role = (user?.role || '').toLowerCase().trim();
    const isAllowed = ['affiliate', 'partner', 'admin', 'superadmin', 'super_admin'].includes(role);
    if (user && isAllowed) {
      loadData();
    }
  }, [user, loadData]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.student_display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course_interest.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage =
        stageFilter === 'ALL' ||
        (stageFilter === 'DEMO' && (s.current_stage === 'DEMO_BOOKED' || s.current_stage === 'DEMO_COMPLETED')) ||
        s.current_stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [students, searchQuery, stageFilter]);

  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'AFFILIATE PROGRAM',
      items: [
        { id: 'overview', label: 'Overview & Funnel', icon: LayoutGrid, href: '/dashboard/affiliate' },
        { id: 'links', label: 'Referral Links & QR', icon: Share2, href: '/dashboard/affiliate/referral-links' },
        { id: 'students', label: 'Referred Students', icon: Users, href: '/dashboard/affiliate/students', badge: students.length },
        { id: 'payouts', label: 'Commission Payouts', icon: CreditCard, href: '/dashboard/affiliate/payouts', badge: data ? `₹${data.available_balance_inr.toLocaleString('en-IN')}` : undefined, badgeColor: 'emerald' },
        { id: 'assets', label: 'Marketing Assets', icon: Download, href: '/dashboard/affiliate/assets' },
      ],
    },
    {
      title: 'PARTNER ACCOUNT',
      items: [
        { id: 'settings', label: 'Payment & Profile', icon: Settings, href: '/dashboard/affiliate/settings' },
      ],
    },
  ];

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'ENROLLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">ENROLLED</span>;
      case 'DEMO_COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF6B00]">DEMO ATTENDED</span>;
      case 'DEMO_BOOKED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">DEMO BOOKED</span>;
      case 'REGISTERED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">REGISTERED</span>;
      case 'DEMO_NO_SHOW':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">NO SHOW</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{stage}</span>;
    }
  };

  const getStepProgressPercent = (stage: string) => {
    switch (stage) {
      case 'REGISTERED':
        return 33;
      case 'DEMO_BOOKED':
        return 50;
      case 'DEMO_COMPLETED':
        return 66;
      case 'ENROLLED':
        return 100;
      default:
        return 20;
    }
  };

  return (
    <DashboardLayout
      role="affiliate"
      roleSubtitle="PARTNER REVENUE PORTAL"
      sections={sidebarSections}
      activeTab="students"
      onTabChange={() => {}}
      customUserName={data?.partner_name}
    >
      <AffiliateNavHeader
        partnerName={data?.partner_name}
        affiliateCode={data?.affiliate_code}
        availableBalanceInr={data?.available_balance_inr || 0}
        commissionRate={data?.commission_rate || 15}
        totalReferrals={students.length}
      />

      <div className="space-y-6">
        {/* Controls Bar: Search & Filter Tabs */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or course..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-slate-50/50"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {[
              { id: 'ALL', label: `All (${students.length})` },
              { id: 'REGISTERED', label: 'Registered' },
              { id: 'DEMO', label: 'Demo Stage' },
              { id: 'ENROLLED', label: 'Enrolled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStageFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  stageFilter === tab.id
                    ? 'bg-[#0A2540] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Student Pipeline Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Admission Pipeline</h2>
              <p className="text-xs text-slate-500">
                Click any row to view complete lifecycle events & timeline verification
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredStudents.length} of {students.length} students
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-slate-500">Loading student pipeline...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-16 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No students match your filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Share your referral link on WhatsApp or college campus to bring students into the admission journey.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Course Interest</th>
                    <th className="pb-3">Admission Progress</th>
                    <th className="pb-3">Stage</th>
                    <th className="pb-3">Fee Collected</th>
                    <th className="pb-3">Your Commission</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((row) => {
                    const percent = getStepProgressPercent(row.current_stage);

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedStudent(row)}
                        className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                              {row.student_display_name.charAt(0)}
                            </div>
                            <div>
                              <div>{row.student_display_name}</div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                Reg: {new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 text-slate-700 max-w-[200px]">
                          <span className="font-medium line-clamp-1">{row.course_interest || 'Computer Applications'}</span>
                        </td>

                        {/* Visual Progress Bar */}
                        <td className="py-3.5 w-48">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                              <span>Step {percent === 100 ? '3/3' : percent >= 50 ? '2/3' : '1/3'}</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  percent === 100
                                    ? 'bg-emerald-500'
                                    : percent >= 50
                                    ? 'bg-[#FF6B00]'
                                    : 'bg-blue-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5">
                          {getStageBadge(row.current_stage)}
                        </td>

                        <td className="py-3.5 font-semibold text-slate-800">
                          ₹{row.fee_collected_inr.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 font-bold">
                          {row.commission_earned_inr > 0 ? (
                            <span className="text-emerald-700 font-black">
                              ₹{row.commission_earned_inr.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Est. ₹{row.expected_commission_inr.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 text-right">
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-slate-400 group-hover:text-[#FF6B00] group-hover:bg-orange-50 transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Lifecycle Timeline Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Student Journey Details</h3>
                <p className="text-xs text-slate-500">{selectedStudent.student_display_name}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Course:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.course_interest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Status:</span>
                  <span className="font-bold text-[#FF6B00]">{selectedStudent.current_stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fee Collected:</span>
                  <span className="font-bold text-slate-900">₹{selectedStudent.fee_collected_inr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-orange-200 pt-2">
                  <span className="text-slate-600">Commission Status:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedStudent.commission_status} (₹{selectedStudent.commission_earned_inr > 0 ? selectedStudent.commission_earned_inr : selectedStudent.expected_commission_inr})
                  </span>
                </div>
              </div>

              {/* Complete Event Ledger Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Lifecycle Event Audit Trail
                </h4>

                {(!selectedStudent.events || selectedStudent.events.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No detailed events logged yet.</p>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedStudent.events.map((ev, idx) => (
                      <div key={ev.id || idx} className="relative text-xs space-y-0.5">
                        <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-[#FF6B00] ring-4 ring-orange-100" />
                        <div className="font-bold text-slate-900">
                          {ev.event_type.replace(/_/g, ' ')}
                        </div>
                        {ev.to_stage && (
                          <div className="text-[11px] text-slate-600">
                            Transitioned to: <span className="font-semibold">{ev.to_stage}</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          {new Date(ev.created_at).toLocaleString('en-IN')} • Actor: {ev.actor_name || 'System'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
