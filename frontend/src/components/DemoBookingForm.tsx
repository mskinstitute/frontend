'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Send, X, Calendar, User, Phone, Book } from 'lucide-react';
import { trackFormStart, trackFormSubmit, trackGenerateLead, trackCourseEnquiry, trackDemoRequest } from '@/lib/dataLayer';

interface DemoBookingFormProps {
  courseTitle: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export default function DemoBookingForm({ courseTitle, onClose, isEmbedded = false }: DemoBookingFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!date) {
      toast.error('Please choose a preferred start date');
      return;
    }

    setIsSubmitting(true);

    // Simulate API request submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Fire form submission and lead generation ONLY after verified completion (zero PII)
      trackFormSubmit('demo_booking', { course_name: courseTitle });
      trackGenerateLead('demo_booking', {
        course_name: courseTitle,
        preferred_date: date,
      });
      trackDemoRequest({
        courseName: courseTitle,
        preferredDate: date,
      });
      trackCourseEnquiry({ courseName: courseTitle });

      toast.success('Demo session request sent! Our counselor will call you within 24 hours.');
      setName('');
      setPhone('');
      setDate('');
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className={isEmbedded ? "space-y-4 w-full" : "bg-white p-6 rounded-xl border border-border-subtle shadow-lg space-y-6 relative max-w-md w-full"}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="space-y-1">
        <h3 className={isEmbedded ? "text-base font-bold text-primary" : "text-xl font-bold text-primary"}>
          Book a Free Demo Batch
        </h3>
        <p className="text-xs text-text-muted">
          Register to attend a trial session for <strong>{courseTitle}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div className="space-y-1.5">
          <label htmlFor="demo-fullname" className="text-xs font-bold text-text-muted uppercase tracking-wider block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4.5 w-4.5 text-text-muted" />
            <input
              id="demo-fullname"
              type="text"
              required
              placeholder="e.g. Amit Kumar"
              value={name}
              onFocus={() => trackFormStart('demo_booking')}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        {/* Mobile Input */}
        <div className="space-y-1.5">
          <label htmlFor="demo-mobile" className="text-xs font-bold text-text-muted uppercase tracking-wider block">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-text-muted" />
            <input
              id="demo-mobile"
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        {/* Preferred Date */}
        <div className="space-y-1.5">
          <label htmlFor="demo-date" className="text-xs font-bold text-text-muted uppercase tracking-wider block">Preferred Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4.5 w-4.5 text-text-muted" />
            <input
              id="demo-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-1.5 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-lg transition-colors shadow disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
