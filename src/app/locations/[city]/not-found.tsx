import Link from 'next/link';
import { MapPin, ArrowRight, Building2, Search } from 'lucide-react';

export default function LocationNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg w-full bg-surface border border-border-subtle rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto">
          <MapPin className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Location Not Found (404)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            No MSK Campus at this URL
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            MSK Institute adheres to a strict <strong>1 City = 1 Exclusive Franchise</strong> policy. We do not have an active campus registered under this city identifier.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/locations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            <Building2 className="w-4 h-4" />
            <span>View All Official Campuses</span>
          </Link>
          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-background-alt hover:bg-border-subtle text-text-primary font-semibold text-sm px-5 py-3 rounded-xl border border-border-subtle transition-all"
          >
            <span>Explore Online Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
