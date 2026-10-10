import Link from 'next/link';
import { MapPin, Phone, BookOpen, Clock, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { BranchSummary } from '@/types';

interface BranchCardProps {
  branch: BranchSummary;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const isOpen = branch.status === 'OPEN';

  return (
    <article className="group bg-surface rounded-2xl border border-border-subtle p-6 hover:border-secondary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
            <Building2 className="w-4 h-4 text-secondary" />
            <span>{branch.state}, India</span>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              isOpen
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
            }`}
          >
            {isOpen ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Campus
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                Coming Soon
              </>
            )}
          </span>
        </div>

        {/* Branch Title & Designation */}
        <h3 className="text-xl font-bold text-text-primary group-hover:text-secondary transition-colors mb-2">
          <Link href={`/locations/${branch.slug}`} className="focus:outline-hidden">
            {branch.name}
          </Link>
        </h3>

        {branch.isHeadquarters && (
          <span className="inline-block bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded mb-3">
            Corporate Headquarters
          </span>
        )}

        {/* Address */}
        <p className="text-sm text-text-secondary flex items-start gap-2 mb-4 leading-relaxed">
          <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <span>{branch.address}</span>
        </p>

        {/* Quick Stats: Courses & Batches */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-background-alt rounded-xl border border-border-subtle/50 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <BookOpen className="w-3.5 h-3.5 text-secondary" />
            <span>
              <strong className="text-text-primary font-bold">{branch.coursesCount}</strong> Courses
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span>
              <strong className="text-text-primary font-bold">{branch.batchesCount}</strong> Batches
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="pt-4 border-t border-border-subtle/60 flex items-center justify-between">
        <span className="text-xs text-text-muted flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {branch.formattedPhone}
        </span>

        <Link
          href={`/locations/${branch.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary-dark group-hover:translate-x-0.5 transition-all"
        >
          <span>Explore Campus</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
