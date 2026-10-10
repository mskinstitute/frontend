'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Sparkles, Building2, ArrowRight } from 'lucide-react';
import { BranchSummary } from '@/types';
import BranchCard from './BranchCard';

interface LocationsDirectoryClientProps {
  branches: BranchSummary[];
}

export default function LocationsDirectoryClient({ branches }: LocationsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'COMING_SOON'>('ALL');

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // 1. Status Filter
      if (statusFilter !== 'ALL' && branch.status !== statusFilter) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesCity = branch.city.toLowerCase().includes(query);
        const matchesState = branch.state.toLowerCase().includes(query);
        const matchesName = branch.name.toLowerCase().includes(query);
        const matchesAddress = branch.address.toLowerCase().includes(query);
        return matchesCity || matchesState || matchesName || matchesAddress;
      }

      return true;
    });
  }, [branches, searchQuery, statusFilter]);

  const openCount = branches.filter((b) => b.status === 'OPEN').length;
  const comingSoonCount = branches.filter((b) => b.status === 'COMING_SOON').length;

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-surface p-4 sm:p-6 rounded-2xl border border-border-subtle shadow-2xs space-y-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, town, or state (e.g. Shikohabad, Agra, Uttar Pradesh)..."
            className="w-full pl-12 pr-4 py-3 bg-background-alt border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-hidden focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background-alt text-text-secondary hover:text-text-primary border border-border-subtle'
            }`}
          >
            All Locations ({branches.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('OPEN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'OPEN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-background-alt text-text-secondary hover:text-text-primary border border-border-subtle'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active Campuses ({openCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('COMING_SOON')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'COMING_SOON'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-background-alt text-text-secondary hover:text-text-primary border border-border-subtle'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coming Soon ({comingSoonCount})</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-text-muted px-2">
        <span>
          Showing <strong>{filteredBranches.length}</strong> of {branches.length} locations
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-secondary hover:underline font-semibold"
          >
            Clear Search Filter
          </button>
        )}
      </div>

      {/* Locations Grid */}
      {filteredBranches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border-subtle p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No MSK Campus Found for &ldquo;{searchQuery}&rdquo;</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            We operate only ONE verified active franchise per city to preserve education quality. If we don&apos;t have a campus in your city yet, you can attend live interactive batches online nationwide.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-light text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              <span>Explore Online Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="inline-flex items-center gap-1.5 bg-background-alt hover:bg-border-subtle text-text-primary text-xs font-semibold px-4 py-2.5 rounded-xl border border-border-subtle transition-all"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Franchise Opportunity Callout Card (Rule 115) */}
      <div className="mt-16 bg-gradient-to-r from-primary to-primary-light text-white p-8 rounded-3xl border border-primary-light shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Territory Exclusivity Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Launch an MSK Institute Campus in Your City
          </h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            MSK Institute guarantees <strong>1 City = 1 Exclusive Franchise</strong>. Partner with us to bring practical software engineering, Python bootcamps, and certified computer education to aspiring students in your district.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/contact?subject=franchise"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <span>Inquire for City Franchise</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-gray-300">
              Strict quality audits & centralized curriculum support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
