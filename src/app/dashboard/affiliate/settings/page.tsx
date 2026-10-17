'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import AffiliateNavHeader from '@/components/affiliate/AffiliateNavHeader';
import { affiliateApi, AffiliateDashboardData } from '@/services/affiliateApi';
import {
  LayoutGrid,
  Share2,
  Users,
  CreditCard,
  Download,
  Settings,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Save,
  Lock,
  Mail,
  Bell,
  Smartphone,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AffiliateSettingsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AffiliateDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const [form, setForm] = useState({
    payout_upi: '',
    pan_number: '',
  });

  // Notification Preferences (local state)
  const [notifs, setNotifs] = useState({
    onRegistration: true,
    onDemoBooked: true,
    onFeeCollected: true,
    onPayoutProcessed: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await affiliateApi.getSettings();
      setData({
        partner_name: res.name,
        affiliate_code: res.affiliate_code,
        email: res.email,
        commission_rate: res.commission_rate,
        total_earnings_inr: 0,
        available_balance_inr: 0,
        pending_clearance_inr: 0,
        paid_out_inr: 0,
        payout_upi: res.payout_upi || '',
        pan_number: res.pan_number || '',
        upi_verified: res.upi_verified,
        total_referrals: 0,
        conversions_count: 0,
        conversion_rate: 0,
        funnel: { clicks: 0, registrations: 0, demos_booked: 0, demos_completed: 0, enrolled: 0, rates: { click_to_reg_pct: 0, reg_to_demo_pct: 0, demo_to_done_pct: 0, done_to_enroll_pct: 0 } },
      });
      setForm({
        payout_upi: res.payout_upi || '',
        pan_number: res.pan_number || '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to load partner settings');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic UPI validation
    if (form.payout_upi && !form.payout_upi.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. mobile@upi or username@okaxis)');
      return;
    }

    // Basic PAN validation (optional or 10 chars)
    if (form.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan_number.toUpperCase())) {
      toast.error('PAN must be 10 characters (e.g. ABCDE1234F)');
      return;
    }

    setSaving(true);
    try {
      await affiliateApi.updateSettings({
        payout_upi: form.payout_upi.trim(),
        pan_number: form.pan_number.trim().toUpperCase(),
      });
      toast.success('Payment settings updated successfully! Note: 24h security hold applies before next withdrawal.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update payment settings');
    } finally {
      setSaving(false);
    }
  };

  const copyCode = () => {
    if (!data?.affiliate_code) return;
    navigator.clipboard.writeText(data.affiliate_code);
    setCopiedCode(true);
    toast.success('Affiliate code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'AFFILIATE PROGRAM',
      items: [
        { id: 'overview', label: 'Overview & Funnel', icon: LayoutGrid, href: '/dashboard/affiliate' },
        { id: 'links', label: 'Referral Links & QR', icon: Share2, href: '/dashboard/affiliate/referral-links' },
        { id: 'students', label: 'Referred Students', icon: Users, href: '/dashboard/affiliate/students' },
        { id: 'payouts', label: 'Commission Payouts', icon: CreditCard, href: '/dashboard/affiliate/payouts' },
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
      activeTab="settings"
      onTabChange={() => {}}
      customUserName={data?.partner_name}
    >
      <AffiliateNavHeader
        partnerName={data?.partner_name}
        affiliateCode={data?.affiliate_code}
        availableBalanceInr={data?.available_balance_inr || 0}
        commissionRate={data?.commission_rate || 15}
        totalReferrals={data?.total_referrals || 0}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Read-Only Account Identity */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Affiliate Identity & Rate</h2>
              <p className="text-xs text-slate-500">Fixed credentials managed by MSK Administration</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Unique Referral Code
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-[#FF6B00]">
                  {data?.affiliate_code || '...'}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="p-1 rounded hover:bg-slate-200 text-slate-500 transition"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Base Commission Rate
              </span>
              <div className="font-black text-sm text-slate-900">
                {data?.commission_rate || 15}% per enrollment
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Clearance Hold Period
              </span>
              <div className="font-black text-sm text-slate-900">
                7 Days from fee deposit
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Payout Destination Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">UPI & Tax Configuration</h2>
            <p className="text-xs text-slate-500">Configure where you receive direct commission bank transfers</p>
          </div>

          {/* 24-Hour Hold Warning */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Security Protection Notice:</span>
              <p className="text-[11px] text-amber-800">
                To protect partner accounts against unauthorized account changes, updating your UPI ID triggers a mandatory 24-hour withdrawal cooldown before new payout requests can be initiated.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Payout UPI ID (Primary) *
              </label>
              <input
                type="text"
                value={form.payout_upi}
                onChange={(e) => setForm({ ...form, payout_upi: e.target.value })}
                placeholder="e.g. mobile@upi or username@okaxis"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-slate-50/50"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Commissions will be sent directly to this VPA via IMPS / UPI.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Permanent Account Number (PAN)
              </label>
              <input
                type="text"
                maxLength={10}
                value={form.pan_number}
                onChange={(e) => setForm({ ...form, pan_number: e.target.value.toUpperCase() })}
                placeholder="e.g. ABCDE1234F"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-slate-50/50"
              />
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                <Info className="w-3 h-3 text-slate-400" />
                <span>Section 194H of Income Tax Act: 5% TDS applies when annual commission exceeds ₹15,000.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#FF8533]" />
                <span>{saving ? 'Saving...' : 'Save Payment Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Instant Notification Alerts */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Get notified the instant a student progresses in the admission pipeline</p>
            </div>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {[
              { id: 'onRegistration', title: 'New Student Registration', desc: 'When someone signs up using your link or referral code.' },
              { id: 'onDemoBooked', title: 'Free 2-Day Demo Reservation', desc: 'When a referred student books their hands-on demo class.' },
              { id: 'onFeeCollected', title: 'Commission Credited to Clearance', desc: 'When a referred student pays tuition fees at Shikohabad campus.' },
              { id: 'onPayoutProcessed', title: 'Payout Transferred with UTR', desc: 'When MSK accounts team settles funds to your bank UPI.' },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <h4 className="font-semibold text-xs text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs[item.id as keyof typeof notifs]}
                  onChange={(e) => setNotifs({ ...notifs, [item.id]: e.target.checked })}
                  className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00] accent-[#FF6B00]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
