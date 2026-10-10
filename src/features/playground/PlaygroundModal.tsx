'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { SupportedLanguage } from './types';

const PlaygroundClient = dynamic(() => import('./PlaygroundClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-900 text-white">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  ),
});

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: SupportedLanguage;
  initialCode?: string;
  initialCss?: string;
  initialHtml?: string;
  initialJs?: string;
  title?: string;
}

export default function PlaygroundModal({
  isOpen,
  onClose,
  initialLanguage = 'python',
  initialCode,
  initialCss,
  initialHtml,
  initialJs,
}: PlaygroundModalProps) {
  const [mounted, setMounted] = useState(false);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Preserve background scroll position and lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Capture the exact vertical scroll position of the tutorial page
    scrollPositionRef.current = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Return exactly to where the student was reading the tutorial
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: 'instant' as ScrollBehavior,
      });
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        // Close modal when clicking on backdrop outside the editor card
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-7xl h-[94vh] max-h-[960px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700/80 animate-in zoom-in-95 duration-200">
        <PlaygroundClient
          initialLanguage={initialLanguage}
          initialCode={initialCode}
          initialCss={initialCss}
          initialHtml={initialHtml}
          initialJs={initialJs}
          isModal={true}
          onCloseModal={onClose}
        />
      </div>
    </div>,
    document.body
  );
}
