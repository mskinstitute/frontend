'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from 'lucide-react';
import { Branch } from '@/types';
import { trackBranchCtaClick, trackPhoneClick, trackEmailClick } from '@/lib/analytics';

interface BranchContactProps {
  branch: Branch;
}

export default function BranchContact({ branch }: BranchContactProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapsUrl =
    branch.googleBusiness?.profileUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(`${branch.name} ${branch.address} ${branch.city}`)}`;

  const handleDirectionsClick = () => {
    trackBranchCtaClick({
      branchSlug: branch.slug,
      branchId: branch.id,
      ctaType: 'direction',
      buttonText: 'Open in Google Maps',
    });
  };

  const handlePhone = () => {
    trackBranchCtaClick({
      branchSlug: branch.slug,
      branchId: branch.id,
      ctaType: 'phone',
      buttonText: 'Branch Phone Click',
    });
    trackPhoneClick({
      buttonText: branch.formattedPhone,
      ctaLocation: 'contact_section',
    });
  };

  const handleEmail = () => {
    trackBranchCtaClick({
      branchSlug: branch.slug,
      branchId: branch.id,
      ctaType: 'email',
      buttonText: 'Branch Email Click',
    });
    trackEmailClick({
      buttonText: branch.email,
      ctaLocation: 'contact_section',
    });
  };

  return (
    <section id="contact" className="py-16 bg-background-alt border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-wider">
            Visit & Connect
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
            Contact {branch.name}
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            Reach out directly for offline batch timings, student counseling, lab tours, or fee installment schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-6 bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/80 pb-3">
              Campus Location & Timings
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Physical Address</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{branch.address}</p>
                <p className="text-xs text-text-secondary">
                  {branch.city}, {branch.state} — PIN {branch.postalCode}
                </p>
                {branch.landmark && (
                  <p className="text-xs text-secondary font-medium mt-1">
                    Landmark: {branch.landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Admissions Telephone</p>
                <a
                  href={`tel:${branch.phone}`}
                  onClick={handlePhone}
                  className="text-sm font-bold text-primary hover:text-secondary transition-colors"
                >
                  {branch.formattedPhone}
                </a>
                <p className="text-xs text-text-muted">Available Mon–Sat during campus hours</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Official Email</p>
                <a
                  href={`mailto:${branch.email}`}
                  onClick={handleEmail}
                  className="text-sm font-bold text-primary hover:text-secondary transition-colors"
                >
                  {branch.email}
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            {branch.openingHours && branch.openingHours.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Lab & Admission Hours
                  </p>
                  <div className="space-y-1 text-xs text-text-secondary">
                    {branch.openingHours.map((h, i) => (
                      <div key={i} className="flex justify-between max-w-xs">
                        <span className="font-medium text-text-primary">{h.dayOfWeek.join(', ')}:</span>
                        <span>{h.opens} - {h.closes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDirectionsClick}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive / Deferred Map Preview */}
          <div className="lg:col-span-6 bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col justify-between h-full min-h-[360px]">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Campus Map & Commute</h3>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                Easily accessible via local public transport, railway stations, and arterial roads in {branch.city}.
              </p>
            </div>

            <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-background-alt border border-border-subtle flex flex-col items-center justify-center p-6 text-center">
              {isMapLoaded ? (
                <iframe
                  title={`Map of ${branch.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${branch.name}, ${branch.address}, ${branch.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="w-full h-full rounded-xl"
                />
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{branch.name}</h4>
                    <p className="text-xs text-text-muted mt-1 max-w-xs">{branch.address}, {branch.city}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapLoaded(true)}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <span>Load Interactive Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
