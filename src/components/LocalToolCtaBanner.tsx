'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Sparkles, ArrowRight, Laptop, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialLinks';
import { BUSINESS_CONFIG } from '@/config/business';

interface LocalToolCtaBannerProps {
  toolName?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export default function LocalToolCtaBanner({
  toolName = 'this interactive tool',
  variant = 'light',
  className = '',
}: LocalToolCtaBannerProps) {
  const isDark = variant === 'dark';
  const whatsappUrl = `${BUSINESS_CONFIG.contact.whatsAppUrl}?text=${encodeURIComponent(
    `Hi MSK Institute, I am using ${toolName} and want to book a Free 2-Day Offline/Hybrid Demo Class in Shikohabad.`
  )}`;

  return (
    <aside
      aria-label="Local Offline & Hybrid Demo Admissions Banner"
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 text-slate-100 shadow-xl'
          : 'bg-gradient-to-br from-[#0B1B2B] via-[#0E253B] to-[#071524] text-white border border-primary-light shadow-xl shadow-slate-900/10'
      } ${className}`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Heading, Local Target Cities, & Benefits */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Shikohabad • Firozabad • Sirsaganj</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            Enjoying {toolName}?{' '}
            <span className="text-secondary">Book a Free 2-Day Demo Class</span> at MSK Institute
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Attend hands-on computer lab training at our verified Shikohabad campus (Near Gyan Jyoti Public School, Adarsh Nagar) or join interactive live online classes with <strong>Er. Sumit Kumar</strong>.
          </p>

          {/* Quick value badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-300 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-secondary" />
              1 Student : 1 PC Practical Labs
            </span>
            <span className="text-gray-600">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Next Cohort: {BUSINESS_CONFIG.stats.nextCohortDate}
            </span>
            <span className="text-gray-600">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Free Demo (No Upfront Fees)
            </span>
          </div>
        </div>

        {/* Right Column: High-Intent Actions */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
          <Link
            href="/live-batches"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-sm shadow-lg shadow-secondary/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            <span>View Live Batches &amp; Seats</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
