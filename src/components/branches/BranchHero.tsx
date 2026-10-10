'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare, Navigation, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { Branch } from '@/types';
import { trackWhatsAppClick, trackPhoneClick, trackBranchCtaClick, trackBranchView } from '@/lib/analytics';

interface BranchHeroProps {
  branch: Branch;
}

export default function BranchHero({ branch }: BranchHeroProps) {
  const isOpen = branch.status === 'OPEN';

  useEffect(() => {
    trackBranchView({
      branchId: branch.id,
      branchSlug: branch.slug,
      branchName: branch.name,
      city: branch.city,
      state: branch.state,
      status: branch.status,
    });
  }, [branch]);

  const handleDirectionsClick = () => {
    trackBranchCtaClick({
      branchSlug: branch.slug,
      branchId: branch.id,
      ctaType: 'direction',
      buttonText: 'Get Directions',
    });
  };

  const handleWhatsApp = () => {
    trackBranchCtaClick({
      branchSlug: branch.slug,
      branchId: branch.id,
      ctaType: 'whatsapp',
      buttonText: 'WhatsApp Campus Desk',
    });
    trackWhatsAppClick({
      buttonText: `WhatsApp ${branch.city}`,
      ctaLocation: 'hero',
    });
  };

  const handlePhone = () => {
    trackBranchCtaClick({
      branchSlug: branch.slug,
      branchId: branch.id,
      ctaType: 'phone',
      buttonText: 'Call Campus Desk',
    });
    trackPhoneClick({
      buttonText: `Call ${branch.city}`,
      ctaLocation: 'hero',
    });
  };

  const mapsUrl =
    branch.googleBusiness?.profileUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(`${branch.name} ${branch.address} ${branch.city}`)}`;

  const whatsappMessage = encodeURIComponent(
    `Hello MSK Institute, I am inquiring about courses and batch admissions at the ${branch.name} campus.`
  );

  return (
    <section className="relative overflow-hidden bg-primary text-white py-12 md:py-16">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-white transition-colors">
            Locations
          </Link>
          <span>/</span>
          <span className="text-secondary font-semibold">{branch.city}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            {/* Status & Category Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  isOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {isOpen ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Operational Campus
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Coming Soon • Admissions Opening
                  </>
                )}
              </span>

              {branch.isHeadquarters && (
                <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  Flagship Headquarters
                </span>
              )}

              <span className="bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Building2 className="w-3 h-3 text-secondary" />
                {branch.city}, {branch.state}
              </span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {branch.name}
            </h1>

            {/* Localized Description */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-3xl">
              {branch.localDescription}
            </p>

            {/* Verified Address Block */}
            <div className="flex items-start gap-2.5 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/10 max-w-2xl">
              <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{branch.address}</p>
                <p className="text-xs text-gray-400">
                  {branch.city}, {branch.state} — PIN {branch.postalCode}, {branch.country}
                  {branch.landmark ? ` (${branch.landmark})` : ''}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDirectionsClick}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-secondary/20 transition-all text-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Campus</span>
              </a>

              <a
                href={`tel:${branch.phone}`}
                onClick={handlePhone}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all text-sm"
              >
                <Phone className="w-4 h-4 text-secondary" />
                <span>{branch.formattedPhone}</span>
              </a>
            </div>
          </div>

          {/* Right Highlights & Fast Facts */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              Campus Fast Facts
            </h2>

            <ul className="space-y-3 text-sm text-gray-200">
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-300">Available Courses:</span>
                <strong className="text-white font-bold">{branch.availableCourseIds?.length || 0} Programs</strong>
              </li>
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-300">Live Batches:</span>
                <strong className="text-white font-bold">{branch.activeBatchIds?.length || 0} Scheduled</strong>
              </li>
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-300">Campus Status:</span>
                <span className="font-bold text-secondary">{isOpen ? 'Open for Admissions' : 'Pre-Booking Active'}</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-300">Lab Practice:</span>
                <strong className="text-white font-bold">Included Free</strong>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300">Certificate Verification:</span>
                <strong className="text-white font-bold">Global 100% Online</strong>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="#courses"
                className="block text-center text-xs font-bold text-secondary hover:text-white underline underline-offset-4 transition-colors"
              >
                Jump to Courses Available at {branch.city} &darr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
