'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics';

const WHATSAPP_NUMBER = '918393042166';

export default function FloatingWhatsAppCTA() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Auto-dismiss tooltip after 8 seconds so it doesn't distract
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Don't display in admin dashboard or printable certificate views
  if (pathname.startsWith('/admin') || pathname.startsWith('/verify-certificate')) {
    return null;
  }

  // Generate contextual message based on current page
  let contextualMessage = 'Hi MSK Institute, I want to inquire about coding courses and free demo classes in Shikohabad.';
  let tooltipText = 'Book a Free Demo Class';

  if (pathname.includes('/python')) {
    contextualMessage = 'Hi MSK Institute, I would like to book a free demo class for Python Programming at your Shikohabad center.';
    tooltipText = 'Free Python Demo';
  } else if (pathname.includes('/web') || pathname.includes('/full-stack')) {
    contextualMessage = 'Hi MSK Institute, I want to book a free demo for Full-Stack Web Development at the Shikohabad lab.';
    tooltipText = 'Web Dev Demo';
  } else if (pathname.includes('/ccc') || pathname.includes('/nielit')) {
    contextualMessage = 'Hi MSK Institute, I need details about the NIELIT CCC exam preparation batch and fees.';
    tooltipText = 'CCC Batch Info';
  } else if (pathname.startsWith('/courses/')) {
    contextualMessage = 'Hi MSK Institute, I am viewing this course on your website and want to schedule a free demo session.';
    tooltipText = 'Free Demo Session';
  } else if (pathname.startsWith('/live-batches')) {
    contextualMessage = 'Hi MSK Institute, I want to check seat availability and timing for upcoming live batches.';
    tooltipText = 'Check Batch Seats';
  } else if (pathname.startsWith('/tutorials') || pathname.startsWith('/study-material')) {
    contextualMessage = 'Hi MSK Institute, I am studying your notes/tutorials and want information on hands-on practical lab batches.';
    tooltipText = 'Ask a Question';
  }

  const encodedMessage = encodeURIComponent(contextualMessage);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  const handleClick = () => {
    trackWhatsAppClick({
      ctaLocation: 'floating_button',
      buttonText: tooltipText || 'Floating WhatsApp Bubble',
      linkUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
    });
  };

  return (
    <aside 
      aria-label="Direct Admissions WhatsApp Chat"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 flex items-end gap-2 group no-print select-none"
    >
      {/* Floating Prompt Pill / Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-1.5 bg-white text-gray-800 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg border border-gray-100 animate-in fade-in slide-in-from-right-3 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{tooltipText}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-gray-400 hover:text-gray-600 ml-1 p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat with MSK Institute Admissions on WhatsApp"
      >
        {/* Subtle breathing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        
        {/* Crisp inline WhatsApp SVG */}
        <svg
          className="w-7 h-7 fill-current text-white relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Small Online Indicator Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full z-20" />
      </a>
    </aside>
  );
}
