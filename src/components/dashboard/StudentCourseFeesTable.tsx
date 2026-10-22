'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  HelpCircle, 
  Layers, 
  ExternalLink,
  Laptop,
  Globe,
  Tag
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialLinks';
import { COURSE_PRICE_CATALOG, formatINR, getCoursePricing } from '@/data/coursePricing';
import { Course } from '@/types';

interface StudentCourseFeesTableProps {
  courses?: Course[];
  onSelectDemoCourse?: (courseTitle: string) => void;
  hasActiveUncompletedDemo?: boolean;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Courses' },
  { id: 'diplomas', label: 'Govt Diplomas & CCC' },
  { id: 'web', label: 'Web & Full Stack' },
  { id: 'python', label: 'Python & AI' },
  { id: 'data', label: 'Data & Excel' },
  { id: 'modules', label: '1-Month Modules' },
];

export default function StudentCourseFeesTable({
  courses = [],
  onSelectDemoCourse,
  hasActiveUncompletedDemo = false,
}: StudentCourseFeesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Build the complete fee dataset from catalog or passed courses
  const feeList = useMemo(() => {
    // If courses are loaded from API, use them; otherwise use COURSE_PRICE_CATALOG entries
    const sourceList = courses.length > 0 ? courses : [];

    const computed = sourceList.map((c) => {
      const pricing = getCoursePricing(c.id, {
        title: c.title,
        durationValue: c.duration?.value,
        durationUnit: c.duration?.unit,
        mode: c.mode,
      });

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        categories: c.categories || [],
        duration: `${c.duration?.value || 1} ${c.duration?.unit || 'MONTHS'}`,
        durationMonths: c.duration?.unit === 'MONTHS' ? c.duration.value : c.duration?.unit === 'DAYS' ? Math.round(c.duration.value / 30) : 1,
        mode: c.mode || 'BOTH',
        marketPrice: pricing.marketPrice,
        ourPrice: pricing.ourPrice,
        savingsAmount: pricing.savingsAmount,
        savingsPercent: pricing.savingsPercent,
        installments: pricing.installments,
        badge: pricing.badge,
        isPopular: pricing.isPopular,
      };
    });

    // If sourceList is empty (e.g. offline fallback), generate directly from COURSE_PRICE_CATALOG
    if (computed.length === 0) {
      return Object.entries(COURSE_PRICE_CATALOG).map(([id, def]) => {
        const title = id
          .replace(/^course-/, '')
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        const savingsAmount = Math.max(0, def.marketPrice - def.ourPrice);
        const savingsPercent = Math.round((savingsAmount / def.marketPrice) * 100);

        return {
          id,
          title,
          slug: id.replace(/^course-/, ''),
          categories: ['Computer Science'],
          duration: 'Certified Program',
          durationMonths: 3,
          mode: 'BOTH' as const,
          marketPrice: def.marketPrice,
          ourPrice: def.ourPrice,
          savingsAmount,
          savingsPercent,
          installments: def.installments,
          badge: def.badge,
          isPopular: def.isPopular,
        };
      });
    }

    return computed;
  }, [courses]);

  // Filter based on search & category tab
  const filteredFees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return feeList.filter((item) => {
      // 1. Search Query filter
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.categories.some((cat) => cat.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 2. Category Tab filter
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'diplomas') {
        return /adca|ccc|o level|diploma/i.test(item.title) || item.categories.some((c) => /adca|ccc|diploma/i.test(c));
      }
      if (selectedCategory === 'web') {
        return /web|full stack|mern|react|node|javascript|frontend|html|css/i.test(item.title);
      }
      if (selectedCategory === 'python') {
        return /python|django|flask|dsa/i.test(item.title);
      }
      if (selectedCategory === 'data') {
        return /data|excel|analytics|power bi|sql|mysql/i.test(item.title);
      }
      if (selectedCategory === 'modules') {
        return item.durationMonths <= 1 || item.ourPrice <= 1699;
      }
      return true;
    });
  }, [feeList, searchQuery, selectedCategory]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Exclusive Student Portal Access</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Official Course Fee Schedule &amp; Installments
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Market rates versus MSK Institute student admission fees. Every course includes a <strong>100% Free 3-Day Demo</strong> and verifiable ISO certificate with zero hidden charges.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="https://wa.me/918393042166?text=Hi%20Er.%20Sumit%20Kumar,%20I%20am%20reviewing%20course%20fees%20on%20my%20MSK%20student%20dashboard%20and%20need%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Ask Counselor</span>
          </a>
        </div>
      </div>

      {/* Search and Category Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, e.g. ADCA, Python, CCC, MERN..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredFees.length}</strong> programs
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0A2540] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Course Program</th>
              <th className="py-3.5 px-3">Duration &amp; Mode</th>
              <th className="py-3.5 px-3 text-right">Market Price</th>
              <th className="py-3.5 px-4 text-right">MSK Student Fee</th>
              <th className="py-3.5 px-3">Monthly EMI / Installment</th>
              <th className="py-3.5 px-4 text-center">Admission Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredFees.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    {item.isPopular && (
                      <span className="p-1 rounded bg-orange-100 text-[#FF6B00]" title="Popular Flagship">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div>
                      <Link
                        href={`/courses/${item.slug}`}
                        className="font-bold text-slate-900 hover:text-[#FF6B00] transition line-clamp-1 flex items-center gap-1"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />
                      </Link>
                      {item.badge && (
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-4 px-3 text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>{item.duration}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    {item.mode === 'BOTH' ? (
                      <>
                        <Laptop className="w-3 h-3" />
                        <span>Offline Lab &amp; Online</span>
                      </>
                    ) : item.mode === 'OFFLINE' ? (
                      <>
                        <Laptop className="w-3 h-3" />
                        <span>Campus Lab</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>Live Online</span>
                      </>
                    )}
                  </div>
                </td>

                <td className="py-4 px-3 text-right text-slate-400 line-through whitespace-nowrap">
                  {formatINR(item.marketPrice)}
                </td>

                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <div className="text-base font-black text-slate-900">
                    {formatINR(item.ourPrice)}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Save {item.savingsPercent}% ({formatINR(item.savingsAmount)} off)
                  </span>
                </td>

                <td className="py-4 px-3 whitespace-nowrap">
                  {item.installments?.monthly ? (
                    <div>
                      <span className="font-extrabold text-slate-800">
                        {formatINR(item.installments.monthly)}
                      </span>
                      <span className="text-[11px] text-slate-500"> / month</span>
                      <div className="text-[10px] text-slate-400">
                        ({item.installments.tenureMonths} Months tenure)
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">One-Time Fee</span>
                  )}
                </td>

                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onSelectDemoCourse?.(item.title)}
                      disabled={hasActiveUncompletedDemo}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                        hasActiveUncompletedDemo
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-[#FF6B00] hover:bg-[#FF8533] text-white shadow-2xs'
                      }`}
                    >
                      {hasActiveUncompletedDemo ? 'Demo Active' : 'Book Free Demo'}
                    </button>
                    <a
                      href={`https://wa.me/918393042166?text=${encodeURIComponent(
                        `Hi Er. Sumit Kumar, I want to confirm admission details for ${item.title} (Fee: ${formatINR(item.ourPrice)}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                      title="Direct Admission WhatsApp Chat"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Card Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {filteredFees.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {item.duration}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">
                {item.title}
              </h3>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-black text-slate-900">
                  {formatINR(item.ourPrice)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(item.marketPrice)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  ({item.savingsPercent}% OFF)
                </span>
              </div>

              {item.installments?.monthly && (
                <p className="text-[11px] text-slate-600">
                  Easy EMI: <strong>{formatINR(item.installments.monthly)}/month</strong> ({item.installments.tenureMonths} Mo)
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
              <button
                onClick={() => onSelectDemoCourse?.(item.title)}
                disabled={hasActiveUncompletedDemo}
                className={`flex-1 py-2 rounded-xl font-bold text-xs text-center transition ${
                  hasActiveUncompletedDemo
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-[#FF6B00] hover:bg-[#FF8533] text-white shadow-2xs'
                }`}
              >
                {hasActiveUncompletedDemo ? 'Demo Active' : 'Book Free Demo'}
              </button>

              <Link
                href={`/courses/${item.slug}`}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#FF6B00] transition"
                title="View Full Syllabus"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Helpful Guarantee Note */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>100% Fee Transparency:</strong> No registration fees for 3-day demo classes. Official receipts generated at campus counter.
          </span>
        </div>
        <Link
          href="/book-demo"
          className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Book Free Demo Online</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
