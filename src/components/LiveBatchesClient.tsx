'use client';

import Link from 'next/link';
import { 
  Sparkles, CheckCircle2, ArrowRight, Share2, History 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LiveBatch } from '@/types';

interface LiveBatchesClientProps {
  batches: LiveBatch[];
}

function formatBatchStartDate(dateStr?: string): string {
  if (!dateStr) return 'Upcoming Cohort';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  } catch {}
  return dateStr;
}

export default function LiveBatchesClient({ batches }: LiveBatchesClientProps) {
  const activeBatches = batches.filter((b) => b.status !== 'COMPLETED' && b.status !== 'ARCHIVED');
  const concludedBatches = batches.filter((b) => b.status === 'COMPLETED' || b.status === 'ARCHIVED');

  const handleShare = async (b: LiveBatch) => {
    const url = typeof window !== 'undefined' 
      ? `${window.location.origin}/live-batches/${b.id}` 
      : `https://www.mskinstitute.in/live-batches/${b.id}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: b.title,
          text: `Join the live training cohort: ${b.title} at MSK Institute Shikohabad!`,
          url,
        });
        return;
      } catch {
        // User dismissed or share sheet closed - fallback to clipboard
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success('Batch link copied to clipboard!');
      } else {
        toast.success(`Share link: ${url}`);
      }
    } catch {
      toast.success(`Share link: ${url}`);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#B83A00] shadow-xs flex-shrink-0">
          <Sparkles className="w-5 h-5 text-[#B83A00]" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Upcoming Live Batches
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            New cohort admissions with interactive live lectures, practical labs & mentorship
          </p>
        </div>
      </div>

      {/* Large Devices: Table Format (visible on lg and above) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-slate-50/70 text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <th className="py-4 px-6 text-left">Batch Name & Course</th>
              <th className="py-4 px-4 text-left whitespace-nowrap">Start Date & Duration</th>
              <th className="py-4 px-4 text-left whitespace-nowrap">Weekly Schedule</th>
              <th className="py-4 px-4 text-left whitespace-nowrap">Lead Mentor</th>
              <th className="py-4 px-4 text-left whitespace-nowrap">Fee & Seats</th>
              <th className="py-4 px-6 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {activeBatches.map((b) => {
              const startDateStr = formatBatchStartDate(b.startDate);
              const remainingSeats = b.leftSeats ?? 5;
              const totalSeats = b.totalSeats || 10;
              const courseBadge = b.courseTitle 
                ? (b.duration ? `${b.courseTitle} – ${b.duration}` : b.courseTitle)
                : b.title;

              return (
                <tr 
                  key={b.id} 
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Column 1: Batch Name & Course */}
                  <td className="py-5 px-6 align-top">
                    <div className="space-y-1.5 max-w-md">
                      <Link 
                        href={`/live-batches/${b.id}`}
                        className="font-extrabold text-base text-primary hover:text-secondary transition-colors block"
                      >
                        {b.title}
                      </Link>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                          {courseBadge}
                        </span>
                      </div>
                      {b.description && (
                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                          {b.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Start Date & Duration */}
                  <td className="py-5 px-4 align-top whitespace-nowrap">
                    <div className="space-y-1.5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-orange-50 text-[#B83A00] font-bold text-[10px] uppercase tracking-wider">
                        STARTING {startDateStr.toUpperCase()}
                      </span>
                      <div className="text-xs font-bold text-primary">
                        Duration: {b.duration || '3 MONTHS'}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Weekly Schedule */}
                  <td className="py-5 px-4 align-top whitespace-nowrap">
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-text-main">
                        {b.schedule}
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>100% Practical Labs</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 4: Lead Mentor */}
                  <td className="py-5 px-4 align-top whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {b.instructorPicture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.instructorPicture}
                          alt={b.instructor}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover border border-border-subtle flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-black text-xs flex items-center justify-center flex-shrink-0">
                          {b.instructor?.[0] || 'S'}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-primary">{b.instructor}</div>
                        <div className="text-[11px] text-text-muted">Lead Mentor</div>
                      </div>
                    </div>
                  </td>

                  {/* Column 5: Fee & Seats */}
                  <td className="py-5 px-4 align-top whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-secondary">{b.price}</span>
                        {b.originalPrice && (
                          <span className="text-xs text-gray-400 line-through font-normal">
                            {b.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>Only {remainingSeats} of {totalSeats} Left</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 6: Action */}
                  <td className="py-5 px-6 align-top text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShare(b)}
                        title="Share Live Batch"
                        aria-label="Share batch"
                        className="p-2.5 rounded-xl border border-border-subtle hover:border-gray-300 hover:bg-surface text-text-muted hover:text-primary transition-all cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/live-batches/${b.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Devices: Cards Format (visible on < lg) */}
      <div className="block lg:hidden space-y-4">
        {activeBatches.map((b) => {
          const startDateStr = formatBatchStartDate(b.startDate);
          const remainingSeats = b.leftSeats ?? 5;
          const totalSeats = b.totalSeats || 10;
          const courseSubtitle = b.courseTitle 
            ? (b.duration ? `${b.courseTitle} – ${b.duration}` : b.courseTitle)
            : b.title;

          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-border-subtle p-5 shadow-xs space-y-4"
            >
              {/* Card Top: Start date badge & price badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-orange-50 text-[#B83A00] font-bold text-[10px] uppercase tracking-wider">
                  STARTING {startDateStr.toUpperCase()}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-orange-50/70 text-secondary font-black text-xs">
                  {b.price}
                </span>
              </div>

              {/* Title & Course Subtitle */}
              <div className="space-y-1">
                <Link
                  href={`/live-batches/${b.id}`}
                  className="text-base sm:text-lg font-bold text-primary hover:text-secondary transition-colors block"
                >
                  {b.title}
                </Link>
                <div className="text-xs text-text-muted">
                  {courseSubtitle}
                </div>
              </div>

              {/* Short Description */}
              {b.description && (
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                  {b.description}
                </p>
              )}

              {/* Mentor & Schedule Row */}
              <div className="pt-3 border-t border-border-subtle flex items-center gap-3">
                {b.instructorPicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.instructorPicture}
                    alt={b.instructor}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-border-subtle flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-black text-xs flex items-center justify-center flex-shrink-0">
                    {b.instructor?.[0] || 'S'}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-primary truncate">{b.instructor}</div>
                  <div className="text-[11px] text-text-muted truncate">{b.schedule}</div>
                </div>
              </div>

              {/* Seats Left status */}
              <div className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Only {remainingSeats} of {totalSeats} Left</span>
              </div>

              {/* Action Buttons: Share & View Details */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleShare(b)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-border-subtle hover:bg-surface text-text-main text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-text-muted" />
                  <span>Share</span>
                </button>

                <Link
                  href={`/live-batches/${b.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Concluded Batches Archive Section */}
      {concludedBatches.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border-subtle">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <History className="w-5 h-5 text-text-muted" />
              Concluded Batches Archive
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              The cohorts below have completed their training curriculum. Interested in joining the next cohort? Submit an enquiry or browse upcoming batches above.
            </p>
          </div>

          <div className="space-y-4">
            {concludedBatches.map((b) => (
              <div
                key={b.id}
                className="bg-surface/60 rounded-2xl border border-border-subtle p-5 space-y-4 opacity-90 hover:opacity-100 transition-opacity"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-700 bg-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">
                        Cohort Concluded
                      </span>
                      <span className="text-[10px] font-medium text-text-muted">
                        {b.schedule}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-primary">{b.title}</h4>
                    <p className="text-xs text-text-muted">{b.courseTitle}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-muted">Admissions Closed</span>
                    <Link
                      href={`/courses/${b.courseSlug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface border border-border-subtle hover:border-secondary text-primary hover:text-secondary text-xs font-medium rounded-lg transition-colors"
                    >
                      <span>View Curriculum</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
