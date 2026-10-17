'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import AffiliateNavHeader from '@/components/affiliate/AffiliateNavHeader';
import { affiliateApi, AffiliateDashboardData, ReferredStudentRow } from '@/services/affiliateApi';
import {
  LayoutGrid,
  Share2,
  Users,
  CreditCard,
  Download,
  Settings,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  UserCheck,
  CalendarCheck,
  Award,
  Clock,
  CheckCircle2,
  QrCode,
  Copy,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AffiliateOverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AffiliateDashboardData | null>(null);
  const [referrals, setReferrals] = useState<ReferredStudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashData, refData] = await Promise.all([
        affiliateApi.getAffiliateMe(),
        affiliateApi.getAffiliateReferrals(),
      ]);
      setData(dashData);
      setReferrals(refData);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load affiliate analytics');
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

  // Sidebar config matching all subroutes
  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'AFFILIATE PROGRAM',
      items: [
        { id: 'overview', label: 'Overview & Funnel', icon: LayoutGrid, href: '/dashboard/affiliate' },
        { id: 'links', label: 'Referral Links & QR', icon: Share2, href: '/dashboard/affiliate/referral-links' },
        { id: 'students', label: 'Referred Students', icon: Users, href: '/dashboard/affiliate/students', badge: data?.total_referrals },
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

  const funnel = data?.funnel || {
    clicks: 0,
    registrations: 0,
    demos_booked: 0,
    demos_completed: 0,
    enrolled: 0,
    rates: {
      click_to_reg_pct: 0,
      reg_to_demo_pct: 0,
      demo_to_done_pct: 0,
      done_to_enroll_pct: 0,
    },
  };

  const code = data?.affiliate_code || 'PARTNER';
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/r/${code}`
    : `https://mskinstitute.in/r/${code}`;

  const whatsappMessage = encodeURIComponent(
    `🎓 Join MSK Institute (Shikohabad's Premier IT Training Center)! Book a 100% Free 2-Day Demo Class in Web Development, Python AI, or ADCA using my referral link: ${referralUrl}`
  );

  return (
    <DashboardLayout
      role="affiliate"
      roleSubtitle="PARTNER REVENUE PORTAL"
      sections={sidebarSections}
      activeTab="overview"
      onTabChange={() => {}}
      customUserName={data?.partner_name}
    >
      <AffiliateNavHeader
        partnerName={data?.partner_name}
        affiliateCode={code}
        availableBalanceInr={data?.available_balance_inr || 0}
        commissionRate={data?.commission_rate || 15}
        totalReferrals={data?.total_referrals || 0}
      />

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Loading your partner analytics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Earned
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ₹
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹{(data?.total_earnings_inr || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lifetime referral commissions</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all bg-gradient-to-br from-white to-emerald-50/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Available Balance
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-700">
                ₹{(data?.available_balance_inr || 0).toLocaleString('en-IN')}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-medium">Cleared & ready</span>
                <Link
                  href="/dashboard/affiliate/payouts"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                >
                  Withdraw <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  In Clearance (7d)
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-700">
                ₹{(data?.pending_clearance_inr || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Subject to 7-day refund hold
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Paid Out To Date
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹{(data?.paid_out_inr || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Settled to your verified UPI
              </p>
            </div>
          </div>

          {/* Dynamic Conversion Funnel */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Live Conversion Funnel
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                    Real-time
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic progression from short-link clicks to fully paid admissions
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span>Overall Conversion Rate:</span>
                <span className="text-[#FF6B00] font-black text-sm">
                  {data?.conversion_rate || 0}%
                </span>
              </div>
            </div>

            {/* 5 Funnel Stages */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {/* Step 1: Clicks */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center relative flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 mx-auto flex items-center justify-center mb-2">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{funnel.clicks}</div>
                  <div className="text-xs font-bold text-slate-600 mt-0.5">Link Clicks</div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  Top of funnel
                </div>
              </div>

              {/* Step 2: Registrations */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-center relative flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-2">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-blue-900">{funnel.registrations}</div>
                  <div className="text-xs font-bold text-blue-800 mt-0.5">Registered</div>
                </div>
                <div className="mt-3 pt-2 border-t border-blue-200/60 text-[11px] font-semibold text-blue-700">
                  {funnel.rates.click_to_reg_pct}% from clicks
                </div>
              </div>

              {/* Step 3: Demos Booked */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-center relative flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-2">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-amber-900">{funnel.demos_booked}</div>
                  <div className="text-xs font-bold text-amber-800 mt-0.5">Demos Booked</div>
                </div>
                <div className="mt-3 pt-2 border-t border-amber-200/60 text-[11px] font-semibold text-amber-700">
                  {funnel.rates.reg_to_demo_pct}% of registered
                </div>
              </div>

              {/* Step 4: Demos Attended */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 text-center relative flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] mx-auto flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-orange-950">{funnel.demos_completed}</div>
                  <div className="text-xs font-bold text-orange-900 mt-0.5">Demos Attended</div>
                </div>
                <div className="mt-3 pt-2 border-t border-orange-200/60 text-[11px] font-semibold text-orange-700">
                  {funnel.rates.demo_to_done_pct}% completion
                </div>
              </div>

              {/* Step 5: Enrolled */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center relative flex flex-col justify-between ring-2 ring-emerald-500/20">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white mx-auto flex items-center justify-center mb-2 shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-emerald-950">{funnel.enrolled}</div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5">Enrolled & Paid</div>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[11px] font-bold text-emerald-700">
                  {funnel.rates.done_to_enroll_pct}% conversion
                </div>
              </div>
            </div>
          </div>

          {/* Quick Share Card & Promotion Action */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A2540] to-[#1E3A5F] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF8533] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Fast Share Toolkit
              </div>
              <h3 className="text-xl font-black text-white">
                Promote MSK Courses Across Shikohabad & Firozabad
              </h3>
              <p className="text-xs text-slate-300">
                Share your short link or download print-ready promotional posters with your verified referral QR code. You earn 15% commission on every enrolled student!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share to WhatsApp</span>
              </a>

              <Link
                href="/dashboard/affiliate/referral-links"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4 text-[#FF8533]" />
                <span>Get Printable QR Poster</span>
              </Link>
            </div>
          </div>

          {/* Recent Referrals Activity Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Referred Students</h3>
                <p className="text-xs text-slate-500">Latest students in your admission journey pipeline</p>
              </div>
              <Link
                href="/dashboard/affiliate/students"
                className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
              >
                View Complete Pipeline ({referrals.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {referrals.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No student referrals yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Share your referral link on WhatsApp or college groups. Once students register, they will appear here in real-time.
                </p>
                <Link
                  href="/dashboard/affiliate/referral-links"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2540] text-white text-xs font-semibold hover:bg-[#1E3A5F] transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Get Referral Link</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Student</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Stage</th>
                      <th className="pb-3">Fee Collected</th>
                      <th className="pb-3">Commission</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {referrals.slice(0, 5).map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-semibold text-slate-900">
                          {row.student_display_name}
                        </td>
                        <td className="py-3 text-slate-600 max-w-[180px] truncate">
                          {row.course_interest || 'General IT'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.current_stage === 'ENROLLED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.current_stage === 'DEMO_COMPLETED'
                              ? 'bg-orange-100 text-orange-800'
                              : row.current_stage === 'DEMO_BOOKED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {row.current_stage.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-slate-700">
                          ₹{row.fee_collected_inr.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 font-bold text-emerald-700">
                          {row.commission_earned_inr > 0 ? `₹${row.commission_earned_inr.toLocaleString('en-IN')}` : `Est. ₹${row.expected_commission_inr.toLocaleString('en-IN')}`}
                        </td>
                        <td className="py-3">
                          <span className={`text-[11px] font-semibold ${
                            row.commission_status === 'CLEARED'
                              ? 'text-emerald-600'
                              : row.commission_status === 'PENDING'
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}>
                            {row.commission_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
