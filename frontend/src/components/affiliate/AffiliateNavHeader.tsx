'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Share2,
  Users,
  CreditCard,
  Download,
  Settings,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AffiliateNavHeaderProps {
  partnerName?: string;
  affiliateCode?: string;
  availableBalanceInr?: number;
  commissionRate?: number;
  totalReferrals?: number;
}

export default function AffiliateNavHeader({
  partnerName = 'Affiliate Partner',
  affiliateCode = 'PARTNER',
  availableBalanceInr = 0,
  commissionRate = 15,
  totalReferrals = 0,
}: AffiliateNavHeaderProps) {
  const pathname = usePathname();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fullRefUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/r/${affiliateCode}`
    : `https://mskinstitute.in/r/${affiliateCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(affiliateCode);
    setCopiedCode(true);
    toast.success('Affiliate code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(fullRefUrl);
    setCopiedLink(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard/affiliate', icon: LayoutGrid, exact: true },
    { label: 'Referral Links & QR', href: '/dashboard/affiliate/referral-links', icon: Share2 },
    { label: 'Referred Students', href: '/dashboard/affiliate/students', icon: Users, badge: totalReferrals > 0 ? totalReferrals : undefined },
    { label: 'Commission Payouts', href: '/dashboard/affiliate/payouts', icon: CreditCard, badge: availableBalanceInr > 0 ? `₹${availableBalanceInr.toLocaleString('en-IN')}` : undefined, badgeColor: 'emerald' },
    { label: 'Marketing Assets', href: '/dashboard/affiliate/assets', icon: Download },
    { label: 'Payment Settings', href: '/dashboard/affiliate/settings', icon: Settings },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A2540] via-[#123962] to-[#1E3A5F] text-white p-5 sm:p-6 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00] text-white tracking-wide uppercase">
                Official MSK Partner
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Rate: {commissionRate}%
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {partnerName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              MSK Institute Referral Partner Portal • Shikohabad Campus
            </p>
          </div>

          {/* Quick Actions & Balance Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Available to Payout
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-400">
                ₹{availableBalanceInr.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors"
                title="Copy Affiliate Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#FF8533]" />}
                <span>Code: <span className="font-mono text-[#FF8533]">{affiliateCode}</span></span>
              </button>

              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-xs font-semibold text-white shadow-lg shadow-orange-500/25 transition-all"
                title="Copy Short Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Subroutes Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0A2540] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8533]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor === 'emerald'
                      ? isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                      : isActive ? 'bg-[#FF6B00] text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
