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
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  QrCode,
  Palette,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarketingAssetsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AffiliateDashboardData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await affiliateApi.getAffiliateMe();
      setData(res);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load details');
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

  const code = data?.affiliate_code || 'PARTNER';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mskinstitute.in';
  const refLink = `${origin}/r/${code}`;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Text copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const marketingCopies = [
    {
      id: 'general',
      title: 'General IT Career Launch (All Courses)',
      badge: 'Best for WhatsApp Groups',
      text: `🚀 Want to start a high-paying IT career in 2026?

MSK Institute (Shikohabad's top tech academy) is giving a 100% FREE 2-Day Demo Class!
✅ Web Development (MERN Stack)
✅ Python with AI & Data Science
✅ ADCA, O-Level & Tally Prime GST
✅ 100% Placement & Internship Support

👉 Reserve your free demo seat now:
${refLink}
(Use partner code: ${code} for scholarship benefits)`,
    },
    {
      id: 'webdev',
      title: 'Full-Stack Web Development Bootcamp',
      badge: 'High Conversion',
      text: `💻 Master Full-Stack Web Development (React, Node.js, Next.js, MongoDB) in Shikohabad!

Build 5 real-world projects, live portfolio & prepare for high-paying remote/MNC jobs.
🎓 100% FREE 2-Day Live Coding Demo available this week!

Click here to reserve your free lab computer:
${refLink}?course=fullstack-web-development
Referral Code: ${code}`,
    },
    {
      id: 'python_ai',
      title: 'Python Programming & AI Mastery',
      badge: 'Trending AI Topic',
      text: `🤖 Future-proof your career with AI & Python!

Learn from industry experts at MSK Institute Shikohabad. Zero coding background required.
✨ Free 2-Day Demo Workshop on Python & AI tools!

Book your seat before batch fills up:
${refLink}?course=python-data-science-ai
Code: ${code}`,
    },
    {
      id: 'adca',
      title: 'ADCA (1-Year Government Recognized Diploma)',
      badge: 'College Students Favorite',
      text: `📜 Get Government-Certified ADCA Computer Diploma in Shikohabad!

Includes: Office Tools, Graphic Design, Web Basics, Accounting & Hardware.
Valid for all UP Govt & Central Govt jobs!

Reserve 2-Day Free Trial Class:
${refLink}?course=adca
Code: ${code}`,
    },
  ];

  const promotionalAssets = [
    {
      title: 'MSK Institute Official Brand Poster (A4)',
      type: 'Printable Poster (PDF/PNG)',
      size: 'A4 High Resolution',
      description: 'Ideal for printing and placing in colleges, coaching centers, cyber cafes and libraries.',
      actionHref: '/dashboard/affiliate/referral-links',
      actionLabel: 'Print Poster with QR',
    },
    {
      title: 'WhatsApp Status Story Cards (1080x1920)',
      type: 'Story Template',
      size: '9:16 Vertical Format',
      description: 'Pre-formatted visual graphics announcing the 2-Day Free Demo class and student scholarships.',
      actionHref: '#',
      actionLabel: 'Included in Kit',
    },
    {
      title: 'Instagram & Facebook Feed Square (1080x1080)',
      type: 'Social Media Graphic',
      size: '1:1 Square Format',
      description: 'Clean navy & orange branded creatives highlighting modern lab facilities and live projects.',
      actionHref: '#',
      actionLabel: 'Included in Kit',
    },
  ];

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

  return (
    <DashboardLayout
      role="affiliate"
      roleSubtitle="PARTNER REVENUE PORTAL"
      sections={sidebarSections}
      activeTab="assets"
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

      <div className="space-y-6">
        {/* Intro Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <h2 className="font-bold text-slate-900 text-base">Affiliate Promotion Toolkit</h2>
              </div>
              <p className="text-xs text-slate-500 max-w-2xl">
                Tested marketing templates and copywriting crafted specifically for Shikohabad, Firozabad & UP college students. Click 1-button to share directly to WhatsApp with your personalized tracking link!
              </p>
            </div>
            <Link
              href="/dashboard/affiliate/referral-links"
              className="px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap self-start md:self-auto"
            >
              <QrCode className="w-4 h-4 text-[#FF8533]" />
              <span>Get Dynamic QR Code</span>
            </Link>
          </div>
        </div>

        {/* WhatsApp & Social Media Copy Library */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {marketingCopies.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-orange-200 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF6B00]">
                    {item.badge}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line font-sans leading-relaxed max-h-48 overflow-y-auto">
                  {item.text}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(item.text)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyText(item.text, item.id)}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copiedKey === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === item.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Downloadable Promotional Creatives */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Print & Digital Assets</h3>
            <p className="text-xs text-slate-500">Official MSK Institute branded flyers, posters and status graphics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotionalAssets.map((asset, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center mb-2">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{asset.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{asset.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-slate-400">{asset.size}</span>
                  {asset.actionHref.startsWith('/') ? (
                    <Link
                      href={asset.actionHref}
                      className="font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
                    >
                      {asset.actionLabel} <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      {asset.actionLabel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
