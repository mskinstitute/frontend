'use client';

import Link from 'next/link';
import { 
  Sparkles, Clock, Calendar, CheckCircle2, 
  ArrowRight, MessageSquare, ShieldCheck, Laptop, 
  UserCheck, BookOpen 
} from 'lucide-react';
import { LiveBatch } from '@/types';

interface BatchDemoCardProps {
  batch: LiveBatch;
  courseTitle: string;
  isSticky?: boolean;
}

export default function BatchDemoCard({
  batch,
  courseTitle,
  isSticky = false,
}: BatchDemoCardProps) {
  const formattedStartDate = (() => {
    try {
      const d = new Date(batch.startDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch {}
    return batch.startDate;
  })();

  const targetCourseTitle = courseTitle || batch.courseTitle || batch.title;
  const demoBookingUrl = `/book-demo?batch=${encodeURIComponent(batch.id)}&course=${encodeURIComponent(targetCourseTitle)}`;
  const whatsappDemoUrl = `https://wa.me/918393042166?text=${encodeURIComponent(
    `Namaste Er. Sumit Kumar! I want to book a Free Trial Demo Class for the live batch: ${batch.title} (${targetCourseTitle}). Please share the demo schedule and joining details.`
  )}`;

  return (
    <div className={`bg-white rounded-2xl border-2 border-secondary/30 shadow-xl overflow-hidden ${isSticky ? 'sticky top-24' : ''}`}>
      {/* Card Header Banner */}
      <div className="bg-gradient-to-r from-primary to-[#1A3353] p-5 text-white relative">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-secondary px-2.5 py-0.5 rounded text-white shadow-sm">
            <Sparkles className="w-3 h-3" />
            100% Free Demo Class
          </span>
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Only {batch.leftSeats} Seats Left!
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
          Book Your Free Demo Class
        </h3>
        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
          Attend 2 full days of live interactive sessions before taking admission. 100% free with zero obligation.
        </p>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5">
        {/* Batch Quick Overview Pill */}
        <div className="p-3.5 bg-surface rounded-xl border border-border-subtle space-y-2">
          <div className="text-xs font-extrabold text-primary flex items-center justify-between">
            <span className="truncate max-w-[200px]">{batch.title}</span>
            <span className="text-[11px] text-secondary font-black bg-secondary/10 px-2 py-0.5 rounded">
              Cohort Fee: {batch.price}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-text-muted pt-1 border-t border-border-subtle">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-secondary shrink-0" />
              <span className="truncate">{formattedStartDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-secondary shrink-0" />
              <span className="truncate">{batch.schedule || 'Regular Batch'}</span>
            </div>
          </div>
        </div>

        {/* Demo Perks List */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-primary uppercase tracking-wider">
            What You Get in 2-Day Free Trial:
          </div>
          <div className="space-y-2 text-xs text-text-muted">
            <div className="flex items-start gap-2.5">
              <Laptop className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>
                <strong className="text-primary font-bold">Individual Lab PC:</strong> Dedicated computer workstation in Shikohabad lab with high-speed internet (or online Google Meet).
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-primary font-bold">Mentorship by Er. Sumit Kumar:</strong> Hands-on live debugging, concept drills, and interactive Q&A.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-primary font-bold">Full Study Materials:</strong> Practice code files, cheat-sheets, and class exercise access.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href={demoBookingUrl}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-secondary to-amber-600 hover:from-secondary-light hover:to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Book Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href={whatsappDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Book Demo on WhatsApp</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 border-t border-border-subtle space-y-1.5 text-[11px] text-text-muted text-center">
          <div className="flex items-center justify-center gap-1 text-green-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free Trial • No Admission Fee • No Login Needed</span>
          </div>
          <p className="text-[10px] text-text-muted leading-tight">
            Our coordinator (+91 8393042166) will allocate your demo lab station or send the live meeting pass.
          </p>
        </div>
      </div>
    </div>
  );
}
