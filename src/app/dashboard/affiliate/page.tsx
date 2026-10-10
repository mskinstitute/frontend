'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Share2,
  Users,
  CreditCard,
  TrendingUp,
  Copy,
  Check,
  QrCode,
  Download,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  LogOut,
  Send,
  DollarSign,
  FileText,
  AlertCircle,
  HelpCircle,
  Search,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferredLead {
  id: string;
  studentName: string;
  course: string;
  date: string;
  feePaid: number;
  commission: number;
  status: 'credited' | 'paid_out' | 'pending';
}

interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Processing';
  referenceId: string;
}

export default function AffiliateDashboardPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'referrals' | 'payouts' | 'assets'>('overview');

  // Affiliate State
  const [partner, setPartner] = useState({
    name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Campus Ambassador',
    email: user?.email || 'affiliate@mskinstitute.in',
    code: 'AFF-COLLEGE-01',
    commissionRate: 15, // 15%
    totalEarnings: 18000,
    availableBalance: 4500,
    totalReferrals: 24,
    conversionRate: 75.0,
    payoutUpi: 'campuspartner@okaxis',
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referralUrl = `https://mskinstitute.in/register?ref=${partner.code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    toast.success('Affiliate link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(partner.code);
    setCopiedCode(true);
    toast.success('Affiliate code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Referral pipeline
  const [referrals, setReferrals] = useState<ReferredLead[]>([
    { id: 'ref-1', studentName: 'Pooja Sharma', course: 'Full-Stack Web Development', date: '08 Oct 2026', feePaid: 12000, commission: 1800, status: 'credited' },
    { id: 'ref-2', studentName: 'Aman Yadav', course: 'Python Programming & AI Mastery', date: '05 Oct 2026', feePaid: 7500, commission: 1125, status: 'credited' },
    { id: 'ref-3', studentName: 'Rahul Kumar', course: 'NIELIT CCC Preparation', date: '03 Oct 2026', feePaid: 3500, commission: 525, status: 'credited' },
    { id: 'ref-4', studentName: 'Vikas Kushwaha', course: 'Python Programming & AI Mastery', date: '28 Sep 2026', feePaid: 7500, commission: 1125, status: 'paid_out' },
    { id: 'ref-5', studentName: 'Neha Gupta', course: 'Full-Stack Web Development', date: '25 Sep 2026', feePaid: 12000, commission: 1800, status: 'paid_out' },
    { id: 'ref-6', studentName: 'Ankit Sharma', course: 'Python Programming & AI Mastery', date: '10 Oct 2026', feePaid: 0, commission: 1125, status: 'pending' },
  ]);

  const [referralSearch, setReferralSearch] = useState('');

  // Payout history
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([
    { id: 'TXN-9081', date: '01 Oct 2026', amount: 9000, method: 'UPI (campuspartner@okaxis)', status: 'Completed', referenceId: 'UPI-260109923' },
    { id: 'TXN-8721', date: '15 Sep 2026', amount: 4500, method: 'UPI (campuspartner@okaxis)', status: 'Completed', referenceId: 'UPI-250918831' },
  ]);

  // Payout request modal
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(4500);
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank'>('upi');
  const [upiIdInput, setUpiIdInput] = useState('campuspartner@okaxis');
  const [bankAccountInput, setBankAccountInput] = useState('');

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      toast.error('Withdrawal amount must be greater than zero.');
      return;
    }
    if (withdrawAmount > partner.availableBalance) {
      toast.error('Requested amount exceeds available balance.');
      return;
    }

    const newTxn: PayoutTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Today',
      amount: withdrawAmount,
      method: payoutMethod === 'upi' ? `UPI (${upiIdInput})` : `Bank Transfer (${bankAccountInput || 'A/C Ending 1234'})`,
      status: 'Processing',
      referenceId: `REF-${Date.now().toString().slice(-8)}`
    };

    setPartner(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - withdrawAmount
    }));
    setPayouts([newTxn, ...payouts]);
    setIsPayoutModalOpen(false);
    toast.success(`Payout of ₹${withdrawAmount.toLocaleString('en-IN')} requested successfully!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Role Switcher Strip */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">MSK Partner Network</span>
            <span className="text-slate-500">|</span>
            <span className="bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
              Affiliate Partner: {partner.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">Quick Role Switcher:</span>
            <Link href="/dashboard/student" className="hover:text-secondary transition-colors">Student Portal</Link>
            <span className="text-slate-600">·</span>
            <Link href="/dashboard/branch" className="hover:text-secondary transition-colors">Branch Portal</Link>
            <span className="text-slate-600">·</span>
            <Link href="/dashboard/staff" className="hover:text-secondary transition-colors">Faculty Portal</Link>
            <span className="text-slate-600">·</span>
            <Link href="/admin" className="hover:text-secondary transition-colors">Super Admin</Link>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 ml-2"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Affiliate Header Banner */}
      <div className="bg-gradient-to-r from-primary via-[#0A2540] to-primary-light text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg ring-4 ring-white/10">
                {partner.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {partner.name}
                  </h1>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                    Verified Partner
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>🏷️ Code: <strong className="font-mono text-emerald-300">{partner.code}</strong></span>
                  <span className="text-slate-400">·</span>
                  <span>💰 Tier: {partner.commissionRate}% Commission</span>
                  <span className="text-slate-400">·</span>
                  <span>⚡ Instant UPI Payouts</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsPayoutModalOpen(true)}
                disabled={partner.availableBalance <= 0}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5" />
                <span>Request Payout (₹{partner.availableBalance.toLocaleString('en-IN')})</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-3 rounded-xl backdrop-blur border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-300" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Promo Link'}</span>
              </button>
            </div>
          </div>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Total Lifetime Earnings</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹{partner.totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">₹13,500 already paid out</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Available Payout</span>
                <CreditCard className="w-4 h-4 text-teal-300" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-300">
                  ₹{partner.availableBalance.toLocaleString('en-IN')}
                </span>
                <span className="text-xs bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-medium">Ready</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Zero withdrawal fees</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Total Referrals</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{partner.totalReferrals}</span>
                <span className="text-xs text-sky-300">Leads</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">18 Converted & Enrolled</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Conversion Rate</span>
                <TrendingUp className="w-4 h-4 text-amber-300" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{partner.conversionRate}%</span>
                <span className="text-xs text-amber-300">High Tier</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Tier bonus: +5% on 25 leads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            {[
              { id: 'overview', label: 'Partner Overview', icon: Sparkles },
              { id: 'links', label: 'Referral Links & QR Kit', icon: Share2 },
              { id: 'referrals', label: 'Referred Students Pipeline', icon: Users },
              { id: 'payouts', label: 'Payout History & Ledger', icon: CreditCard },
              { id: 'assets', label: 'Marketing Banners & Assets', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Share Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                Your Unique Affiliate Referral Link
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Share this link with prospective students, college WhatsApp groups, or social channels.
                Every successful admission awards you a 15% instant commission.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 flex items-center justify-between text-xs font-mono text-slate-800">
                  <span className="truncate">{referralUrl}</span>
                  <span className="text-emerald-600 font-bold ml-2 shrink-0">15% Comm.</span>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Join MSK Institute of Technology courses (Python, Full-Stack, NIELIT CCC)! Enroll through my official partner referral link to claim exclusive discount: ${referralUrl}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  Share on WhatsApp
                </a>
              </div>
            </div>

            {/* Pipeline & Payout Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Recent Referred Students
                  </h3>
                  <button
                    onClick={() => setActiveTab('referrals')}
                    className="text-xs text-secondary hover:underline font-semibold"
                  >
                    View All {referrals.length} Referrals
                  </button>
                </div>

                <div className="space-y-3">
                  {referrals.slice(0, 4).map((ref) => (
                    <div key={ref.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{ref.studentName}</span>
                          <span className="text-xs text-slate-500 font-medium">· {ref.course}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Joined: {ref.date} · Fee Paid: ₹{ref.feePaid.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xs text-emerald-600">+₹{ref.commission.toLocaleString('en-IN')}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ref.status === 'credited'
                            ? 'bg-emerald-100 text-emerald-700'
                            : ref.status === 'paid_out'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {ref.status === 'credited' ? 'Credited' : ref.status === 'paid_out' ? 'Paid Out' : 'Pending Admission'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commission Tier Info */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Commission Tier Structure
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Standard Tier (1 - 10 Enrolled)</span>
                      <span>10%</span>
                    </div>
                    <p className="text-slate-500 mt-1">Starter affiliate commission.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                    <div className="flex justify-between font-bold text-emerald-800">
                      <span>Campus Partner (11 - 25 Enrolled)</span>
                      <span>15% (Current)</span>
                    </div>
                    <p className="text-emerald-700 mt-1">Your current unlocked tier!</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Franchise Growth (25+ Enrolled)</span>
                      <span>20%</span>
                    </div>
                    <p className="text-slate-500 mt-1">Only 1 more enrollment needed to reach 20%!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LINKS & QR KIT */}
        {activeTab === 'links' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Referral Links & Marketing Generator</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Generate custom tracked links and printable QR code posters for offline campus marketing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Promo Poster QR Card */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-primary text-white text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-xl">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-white">Official MSK Admission QR</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Scan to enroll with code: <span className="font-mono text-emerald-300 font-bold">{partner.code}</span>
                  </p>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download QR Poster
                  </button>
                </div>
              </div>

              {/* Code Snippets and Links */}
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <p className="font-bold text-slate-800">Your Referral Code</p>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border">
                    <span className="font-mono font-bold text-primary">{partner.code}</span>
                    <button onClick={handleCopyCode} className="text-slate-500 hover:text-primary">
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <p className="font-bold text-slate-800">Full Direct Link</p>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border">
                    <span className="font-mono truncate">{referralUrl}</span>
                    <button onClick={handleCopyLink} className="text-slate-500 hover:text-primary">
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <p className="font-bold text-slate-800">College WhatsApp Group Pitch</p>
                  <p className="text-slate-600 italic">
                    &ldquo;Master Python, Full-Stack Web, and AI with Er. Sumit Kumar at MSK Institute of Technology! Enroll with my partner link for certified offline/online seats: {referralUrl}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REFERRALS PIPELINE */}
        {activeTab === 'referrals' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Referred Students Pipeline</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Track real-time candidate signups, course selections, fees paid, and commission accruals.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or course..."
                  value={referralSearch}
                  onChange={(e) => setReferralSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Enrollment Date</th>
                    <th className="p-3">Course Fee</th>
                    <th className="p-3">Commission (15%)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referrals
                    .filter(r => r.studentName.toLowerCase().includes(referralSearch.toLowerCase()) || r.course.toLowerCase().includes(referralSearch.toLowerCase()))
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                        <td className="p-3 text-slate-700">{r.course}</td>
                        <td className="p-3 text-slate-500">{r.date}</td>
                        <td className="p-3 font-medium">₹{r.feePaid.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-bold text-emerald-600">₹{r.commission.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                              r.status === 'credited'
                                ? 'bg-emerald-100 text-emerald-700'
                                : r.status === 'paid_out'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {r.status === 'credited' ? 'Credited to Balance' : r.status === 'paid_out' ? 'Paid Out' : 'Pending Admission'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Payout Ledger & Withdrawals</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Available for withdrawal: <strong className="text-emerald-600 font-bold">₹{partner.availableBalance.toLocaleString('en-IN')}</strong>
                </p>
              </div>

              <button
                onClick={() => setIsPayoutModalOpen(true)}
                disabled={partner.availableBalance <= 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow disabled:opacity-50"
              >
                Request Withdrawal Now
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payout Method</th>
                    <th className="p-3">Reference / UTR</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="p-3 text-slate-500">{p.date}</td>
                      <td className="p-3 font-bold text-slate-900">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-slate-700">{p.method}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{p.referenceId}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                          p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MARKETING ASSETS */}
        {activeTab === 'assets' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Marketing Assets & Collateral Kit</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Official graphics, course syllabi, and promotion banners for your social media and college campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <FileText className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-xs text-slate-900">MSK Academic Prospectus 2026</h4>
                <p className="text-[11px] text-slate-500">Comprehensive PDF guide detailing all offline & online courses.</p>
                <button
                  onClick={() => toast.success('Downloaded Academic Prospectus PDF.')}
                  className="text-xs text-secondary hover:underline font-semibold block pt-1"
                >
                  Download PDF
                </button>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <Share2 className="w-6 h-6 text-emerald-600" />
                <h4 className="font-bold text-xs text-slate-900">Instagram & WhatsApp Story Posters</h4>
                <p className="text-[11px] text-slate-500">High-resolution 1080x1920 graphics with admission discount badge.</p>
                <button
                  onClick={() => toast.success('Downloaded Story Banners ZIP package.')}
                  className="text-xs text-secondary hover:underline font-semibold block pt-1"
                >
                  Download Banner Pack
                </button>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <CreditCard className="w-6 h-6 text-amber-600" />
                <h4 className="font-bold text-xs text-slate-900">Discount Promo Coupons</h4>
                <p className="text-[11px] text-slate-500">Digital coupons offering ₹500 - ₹1,000 off tuition fees.</p>
                <button
                  onClick={() => toast.success('Coupon templates copied.')}
                  className="text-xs text-secondary hover:underline font-semibold block pt-1"
                >
                  Get Promo Coupons
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: PAYOUT WITHDRAWAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Request Affiliate Commission Withdrawal</h3>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <span className="text-emerald-700">Available Payout Balance:</span>
                <p className="text-xl font-black text-emerald-800 mt-0.5">
                  ₹{partner.availableBalance.toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  min={500}
                  max={partner.availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full text-sm font-bold p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <span className="text-[11px] text-slate-400">Minimum withdrawal amount is ₹500.</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer Destination</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('upi')}
                    className={`p-2 rounded-lg border font-semibold ${
                      payoutMethod === 'upi' ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Instant UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`p-2 rounded-lg border font-semibold ${
                      payoutMethod === 'bank' ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Bank NEFT / IMPS
                  </button>
                </div>

                {payoutMethod === 'upi' ? (
                  <input
                    type="text"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    placeholder="name@okaxis or name@paytm"
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs"
                  />
                ) : (
                  <input
                    type="text"
                    value={bankAccountInput}
                    onChange={(e) => setBankAccountInput(e.target.value)}
                    placeholder="Account Number & IFSC Code"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors shadow"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
