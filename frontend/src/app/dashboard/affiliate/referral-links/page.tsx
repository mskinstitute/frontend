'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
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
  QrCode,
  Printer,
  Sparkles,
  ExternalLink,
  MessageCircle,
  FileText,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReferralLinksPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AffiliateDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await affiliateApi.getAffiliateMe();
      setData(res);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load partner details');
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
  const primaryShortLink = `${origin}/r/${code}`;
  const registrationLink = `${origin}/register?ref=${code}`;

  const courseDeepLinks = [
    {
      course: 'Full-Stack Web Development (MERN)',
      slug: 'fullstack-web-development',
      link: `${primaryShortLink}?course=fullstack-web-development`,
      commission: '₹1,800 - ₹3,600',
    },
    {
      course: 'Python Programming & AI Mastery',
      slug: 'python-data-science-ai',
      link: `${primaryShortLink}?course=python-data-science-ai`,
      commission: '₹1,500 - ₹2,500',
    },
    {
      course: 'ADCA (Advanced Diploma in Computer Applications)',
      slug: 'adca',
      link: `${primaryShortLink}?course=adca`,
      commission: '₹1,200 - ₹1,800',
    },
    {
      course: 'Tally Prime + GST & Accounting',
      slug: 'tally-prime-gst',
      link: `${primaryShortLink}?course=tally-prime-gst`,
      commission: '₹900 - ₹1,350',
    },
    {
      course: 'O-Level Government Diploma (NIELIT)',
      slug: 'o-level-nielit',
      link: `${primaryShortLink}?course=o-level-nielit`,
      commission: '₹2,000 - ₹3,000',
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `MSK-Affiliate-QR-${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('QR Code downloaded as PNG!');
  };

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

  const whatsappGeneralText = encodeURIComponent(
    `🎓 Join MSK Institute of Computer Technology! Book a 100% Free 2-Day Demo Class in Web Development, Python AI, or ADCA using my partner referral link: ${primaryShortLink}`
  );

  return (
    <DashboardLayout
      role="affiliate"
      roleSubtitle="PARTNER REVENUE PORTAL"
      sections={sidebarSections}
      activeTab="links"
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
        {/* Top Banner: Primary Link & Fast Share */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your Primary Referral Link
              </h2>
              <p className="text-xs text-slate-500">
                Students visiting this link receive a 60-day tracking cookie. Even if they enroll weeks later, you earn commission!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${whatsappGeneralText}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Share</span>
              </a>
              <button
                onClick={() => setIsPosterOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#FF8533]" />
                <span>Print A4 Poster</span>
              </button>
            </div>
          </div>

          {/* Primary Short Link Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <input
              type="text"
              readOnly
              value={primaryShortLink}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 outline-none select-all"
            />
            <button
              onClick={() => handleCopy(primaryShortLink, 'primary')}
              className="px-4 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              {copiedKey === 'primary' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'primary' ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Generator & Visual Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-full text-left pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Dynamic Referral QR Code</h3>
              <p className="text-[11px] text-slate-500">Scan to register directly under your code</p>
            </div>

            {/* Render Canvas for PNG export (hidden or sized) */}
            <div ref={canvasRef} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <QRCodeCanvas
                value={primaryShortLink}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              CODE: <span className="text-[#FF6B00]">{code}</span>
            </div>

            <div className="w-full flex gap-2">
              <button
                onClick={handleDownloadPNG}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                onClick={() => setIsPosterOpen(true)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Poster</span>
              </button>
            </div>
          </div>

          {/* Course-Specific Deep Links Table */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Course-Specific Deep Links</h3>
                <p className="text-[11px] text-slate-500">Direct students straight to their chosen course with pre-filled interest</p>
              </div>
            </div>

            <div className="space-y-3">
              {courseDeepLinks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.course}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        Commission {item.commission}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-md">
                      {item.link}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(item.link, `course-${idx}`)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      {copiedKey === `course-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      <span>{copiedKey === `course-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Check out the ${item.course} program at MSK Institute Shikohabad! Book a free 2-day demo class here: ${item.link}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                      title="Share to WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Printable A4 Poster Modal */}
      {isPosterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Printable A4 Partner Poster</h3>
              </div>
              <button
                onClick={() => setIsPosterOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Poster Preview Area */}
            <div
              id="printable-poster"
              className="p-8 rounded-2xl bg-gradient-to-b from-[#0A2540] via-[#0E2F54] to-[#0A2540] text-white border-4 border-[#FF6B00] shadow-xl text-center space-y-6 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00] text-white text-xs font-black uppercase tracking-widest shadow-md">
                  <GraduationCap className="w-4 h-4" /> MSK INSTITUTE OF COMPUTER TECHNOLOGY
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Book 2-Day Free Demo Class
                </h1>
                <p className="text-sm text-orange-200 font-semibold max-w-lg mx-auto">
                  Scan the QR code below to unlock your exclusive student scholarship & reserve a hands-on lab seat!
                </p>
              </div>

              {/* Poster Center QR Code */}
              <div className="inline-block p-5 bg-white rounded-2xl shadow-2xl border-4 border-[#FF6B00]">
                <QRCodeSVG
                  value={primaryShortLink}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-300">
                  Referral Partner: <span className="text-white font-black">{data?.partner_name || 'Campus Partner'}</span>
                </div>
                <div className="text-xs font-mono font-bold text-orange-400 bg-white/10 inline-block px-4 py-1 rounded-full">
                  Promo Code: {code}
                </div>
              </div>

              {/* Courses Taught */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-200 pt-2 border-t border-white/15">
                <div className="p-2 bg-white/5 rounded-lg">Full-Stack Web Dev</div>
                <div className="p-2 bg-white/5 rounded-lg">Python AI / ML</div>
                <div className="p-2 bg-white/5 rounded-lg">ADCA Diploma</div>
                <div className="p-2 bg-white/5 rounded-lg">Tally Prime + GST</div>
                <div className="p-2 bg-white/5 rounded-lg">NIELIT O-Level</div>
                <div className="p-2 bg-white/5 rounded-lg">CCC Certification</div>
              </div>

              {/* Footer Institute Details */}
              <div className="pt-3 border-t border-white/15 text-[11px] text-slate-300 flex flex-wrap items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" /> Station Road, Shikohabad (Firozabad), UP
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-orange-400" /> Helpline: +91 98765 43210
                </span>
              </div>
            </div>

            {/* Poster Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPosterOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
