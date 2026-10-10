'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronDown, Check, Building2, Sparkles, ExternalLink } from 'lucide-react';
import { BranchSummary } from '@/types';

interface BranchSelectorProps {
  branches: BranchSummary[];
  activeSlug?: string;
  variant?: 'header' | 'footer' | 'inline' | 'card';
  className?: string;
}

export default function BranchSelector({
  branches,
  activeSlug,
  variant = 'header',
  className = '',
}: BranchSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const activeBranch = branches.find((b) => b.slug === activeSlug);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/locations/${slug}`);
  };

  if (variant === 'card') {
    return (
      <div className={`p-5 bg-surface rounded-2xl border border-border-subtle ${className}`}>
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-secondary uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Find An MSK Campus</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {branches.map((b) => {
            const isCurrent = b.slug === activeSlug;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelect(b.slug)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-secondary bg-secondary/10 text-primary font-bold shadow-xs'
                    : 'border-border-subtle bg-background-alt hover:border-secondary/40 text-text-primary'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{b.city}</p>
                  <p className="text-[11px] text-text-muted">{b.state}</p>
                </div>
                {b.status === 'OPEN' ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header / Navigation dropdown variant
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-primary hover:text-secondary bg-surface hover:bg-background-alt border border-border-subtle rounded-xl shadow-2xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-secondary/40"
      >
        <MapPin className="w-3.5 h-3.5 text-secondary" />
        <span>{activeBranch ? activeBranch.city : 'All Locations'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-surface border border-border-subtle shadow-xl ring-1 ring-black/5 focus:outline-hidden z-50 p-2 space-y-1 animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <div className="px-3 py-2 border-b border-border-subtle/80 text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
            <span>Select Your City</span>
            <Link
              href="/locations"
              onClick={() => setIsOpen(false)}
              className="text-secondary hover:underline flex items-center gap-0.5"
            >
              <span>Directory</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="py-1">
            {branches.map((branch) => {
              const isSelected = branch.slug === activeSlug;
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => handleSelect(branch.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-secondary/10 text-primary font-bold'
                      : 'hover:bg-background-alt text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{branch.city}</p>
                      <p className="text-[10px] text-text-muted">{branch.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {branch.status === 'OPEN' ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        Soon
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-secondary ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border-subtle/80 px-2 py-1">
            <Link
              href="/locations"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-xs font-semibold text-secondary hover:text-secondary-dark py-1"
            >
              Explore All Campuses &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
