'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface DemoBookingFormProps {
  courseTitle: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export default function DemoBookingForm({ courseTitle }: DemoBookingFormProps) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-md space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-secondary">
        <Sparkles className="w-3.5 h-3.5 text-secondary" />
        <span>Free 2-Day Trial</span>
      </div>
      <h3 className="font-extrabold text-sm text-primary">
        Book Free Demo for {courseTitle}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed">
        Attend 2 days of free live online or in-person lab classes. No login required.
      </p>
      <Link
        href={`/book-demo?course=${encodeURIComponent(courseTitle)}`}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-secondary hover:bg-secondary-light text-white rounded-xl text-xs font-black shadow-xs transition-all"
      >
        <span>Go to Free Demo Booking Portal</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
