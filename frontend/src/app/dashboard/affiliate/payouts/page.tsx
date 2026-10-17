'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import AffiliateNavHeader from '@/components/affiliate/AffiliateNavHeader';
import { affiliateApi, PayoutHistoryItem, LedgerEntry, AffiliateDashboardData } from '@/services/affiliateApi';
import {
  LayoutGrid,
  Share2,
  Users,
  CreditCard,
  Download,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommissionPayoutsPage() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState<AffiliateDashboardData | null>(null);
  const [payoutsData, setPayoutsData] = useState<{
    available_balance_inr: number;
    settled_inr: number;
    payout_upi: string;
    payouts_history: PayoutHistoryItem[];
    ledger_entries: LedgerEntry[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, pData] = await Promise.all([
        affiliateApi.getAffiliateMe(),
        affiliateApi.getPayouts(),
      ]);
      setDashData(dash);
      setPayoutsData(pData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load payouts data');
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

  const handleRequestPayout = async () => {
    setSubmitting(true);
    try {
      await affiliateApi.requestPayout();
      toast.success('🎉 Payout request submitted! MSK Finance will verify and process within 24-48 hours.');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit payout request.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableBalance = payoutsData?.available_balance_inr ?? dashData?.available_balance_inr ?? 0;
  const inClearance = dashData?.pending_clearance_inr ?? 0;
  const settledTotal = payoutsData?.settled_inr ?? dashData?.paid_out_inr ?? 0;
  const upiId = payoutsData?.payout_upi || dashData?.payout_upi || '';

  const minPayoutAmount = 500;
  const canWithdraw = availableBalance >= minPayoutAmount && !!upiId;

  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'AFFILIATE PROGRAM',
      items: [
        { id: 'overview', label: 'Overview & Funnel', icon: LayoutGrid, href: '/dashboard/affiliate' },
        { id: 'links', label: 'Referral Links & QR', icon: Share2, href: '/dashboard/affiliate/referral-links' },
        { id: 'students', label: 'Referred Students', icon: Users, href: '/dashboard/affiliate/students', badge: dashData?.total_referrals },
        { id: 'payouts', label: 'Commission Payouts', icon: CreditCard, href: '/dashboard/affiliate/payouts', badge: availableBalance > 0 ? `₹${availableBalance.toLocaleString('en-IN')}` : undefined, badgeColor: 'emerald' },
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

  return (
    <DashboardLayout
      role="affiliate"
      roleSubtitle="PARTNER REVENUE PORTAL"
      sections={sidebarSections}
      activeTab="payouts"
      onTabChange={() => {}}
      customUserName={dashData?.partner_name}
    >
      <AffiliateNavHeader
        partnerName={dashData?.partner_name}
        affiliateCode={dashData?.affiliate_code}
        availableBalanceInr={availableBalance}
        commissionRate={dashData?.commission_rate || 15}
        totalReferrals={dashData?.total_referrals || 0}
      />

      <div className="space-y-6">
        {/* Balances & Request Payout Action Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Available */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Available for Payout
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-3xl font-black text-emerald-700">
                ₹{availableBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Minimum withdrawal threshold: ₹{minPayoutAmount}
              </p>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!canWithdraw}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Request Payout ({availableBalance >= minPayoutAmount ? 'Ready' : `Need ₹${minPayoutAmount - availableBalance} more`})</span>
              </button>
              {!upiId && (
                <p className="text-[11px] text-amber-700 mt-1.5 text-center">
                  ⚠️ <Link href="/dashboard/affiliate/settings" className="underline font-semibold">Add your UPI ID</Link> to withdraw.
                </p>
              )}
            </div>
          </div>

          {/* Card 2: In Clearance */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pending Clearance (7 Days)
                </span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600">
                ₹{inClearance.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Commissions auto-clear to Available Balance exactly 7 days after student fee collection.
              </p>
            </div>
            <div className="mt-5 p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Protects partners against chargebacks and refunds.</span>
            </div>
          </div>

          {/* Card 3: Settled Total */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lifetime Settled
                </span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                ₹{settledTotal.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Transferred to your bank/UPI with official UTR reference.
              </p>
            </div>
            <div className="mt-5 p-2.5 rounded-xl bg-blue-50 border border-blue-200/70 text-[11px] text-blue-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Processed by MSK Shikohabad Accounts Wing.</span>
            </div>
          </div>
        </div>

        {/* Payout Requests History */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Withdrawal Request History</h2>
              <p className="text-xs text-slate-500">Track status and bank UTRs for requested commission payouts</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-6 h-6 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (!payoutsData?.payouts_history || payoutsData.payouts_history.length === 0) ? (
            <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No withdrawal requests yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">When your available balance reaches ₹500, request a direct UPI payout here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Request ID</th>
                    <th className="pb-3">Date Requested</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">UPI ID</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Bank UTR / Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payoutsData.payouts_history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-mono font-bold text-slate-900">
                        #PAY-{item.id}
                      </td>
                      <td className="py-3 text-slate-600">
                        {new Date(item.requested_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 font-black text-slate-900">
                        ₹{item.amount_inr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 font-mono text-slate-600">
                        {item.upi_destination}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-700">
                        {item.utr_reference ? (
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800">
                            {item.utr_reference}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Processing...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Commission Ledger Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Immutable Commission Ledger</h2>
              <p className="text-xs text-slate-500">Complete itemized record of student fee installments and exact commissions</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-6 h-6 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (!payoutsData?.ledger_entries || payoutsData.ledger_entries.length === 0) ? (
            <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No ledger entries yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">As students pay course fees, commission credits will appear here itemized.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Entry #</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Fee Collected</th>
                    <th className="pb-3">Rate</th>
                    <th className="pb-3">Commission Earned</th>
                    <th className="pb-3">Clearance Status</th>
                    <th className="pb-3">Release Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payoutsData.ledger_entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-mono font-bold text-slate-900">
                        #TX-{entry.id}
                      </td>
                      <td className="py-3 text-slate-600">
                        {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 font-semibold text-slate-700">
                        ₹{entry.collected_fee_inr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 font-bold text-[#FF6B00]">
                        {entry.rate_applied}%
                      </td>
                      <td className="py-3 font-black text-emerald-700">
                        ₹{entry.amount_inr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.status === 'APPROVED' || entry.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : entry.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">
                        {entry.clearance_due_date ? new Date(entry.clearance_due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Immediate'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Request Payout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Confirm Commission Withdrawal</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Available to Withdraw:</span>
                  <span className="text-xl font-black text-emerald-700">₹{availableBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-200 text-emerald-900">
                  <span>Destination UPI ID:</span>
                  <span className="font-mono font-bold">{upiId}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Processing Terms:</div>
                <p>• Payouts are verified by MSK Accounts and sent via IMPS/UPI within 24-48 business hours.</p>
                <p>• TDS deduction of 5% applies as per Section 194H if annual commission exceeds ₹15,000.</p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleRequestPayout}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting Request...' : `Confirm & Withdraw ₹${availableBalance.toLocaleString('en-IN')}`}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
