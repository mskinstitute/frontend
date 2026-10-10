import Link from 'next/link';
import { Calendar, Clock, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { LiveBatch, Branch } from '@/types';

interface BranchBatchesProps {
  batches: LiveBatch[];
  branch: Branch;
}

export default function BranchBatches({ batches, branch }: BranchBatchesProps) {
  const activeBatches = batches.filter(
    (b) => b.status === 'OPEN' || b.status === 'UPCOMING' || b.status === 'RUNNING'
  );

  return (
    <section id="batches" className="py-16 bg-surface border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Direct Classroom Cohorts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Upcoming Batches at {branch.name}
            </h2>
            <p className="text-sm text-text-secondary mt-1 max-w-xl">
              Strictly limited batch sizes ensuring every learner receives personal instructor guidance and a dedicated computer workstation.
            </p>
          </div>

          <Link
            href="/live-batches"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors self-start md:self-auto"
          >
            <span>All Live Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activeBatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-background-alt rounded-2xl border border-border-subtle p-6 hover:border-secondary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Admissions Open
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-secondary" />
                      <strong className="text-text-primary font-bold">{batch.leftSeats}</strong> seats left
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
                    {batch.title}
                  </h3>

                  <div className="space-y-2 text-xs text-text-secondary mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span>Starts: <strong>{batch.startDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span>Schedule: {batch.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span>Campus: {branch.city} Classroom + Lab</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-muted line-through mr-1.5">{batch.originalPrice}</span>
                    <span className="text-lg font-extrabold text-primary">{batch.price}</span>
                  </div>

                  <Link
                    href={`/live-batches?batch=${batch.id}&branch=${branch.slug}`}
                    className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    <span>Reserve Seat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-background-alt border border-border-subtle rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Next Cohort Announcements for {branch.name}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              New physical batches for {branch.city} are scheduled periodically throughout the academic term. Join the pre-registration priority list or attend our live online cohorts immediately.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/contact?branch=${branch.slug}`}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                <span>Notify Me When Batches Open</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/live-batches"
                className="inline-flex items-center gap-2 bg-surface hover:bg-border-subtle text-text-primary text-xs font-semibold px-4 py-2.5 rounded-xl border border-border-subtle transition-all"
              >
                <span>View Online Interactive Batches</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
