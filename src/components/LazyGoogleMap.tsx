'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface LazyGoogleMapProps {
  src: string;
  title: string;
  mapsUrl?: string;
  addressLabel?: string;
}

/**
 * Defers loading the Google Maps embed iframe until the container scrolls near the viewport
 * or the user explicitly clicks to load it. Prevents initial-load third-party network chains,
 * font fetches, and bf-cache penalties on Core Web Vitals.
 */
export default function LazyGoogleMap({
  src,
  title,
  mapsUrl = 'https://maps.app.goo.gl/MyER29LFmibVkPe47',
  addressLabel = 'Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, UP 283135',
}: LazyGoogleMapProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="h-96 w-full rounded-2xl overflow-hidden border border-border-subtle shadow-sm bg-surface relative"
    >
      {shouldLoad ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-surface via-white to-slate-100 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
            <MapPin className="w-7 h-7 text-[#B83A00]" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <p className="font-extrabold text-primary text-base">
              MSK Institute — Shikohabad Campus
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              {addressLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShouldLoad(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Load Interactive Map</span>
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-surface text-primary border border-border-subtle font-bold text-xs rounded-xl transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
