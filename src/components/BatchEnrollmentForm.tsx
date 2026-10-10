'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Send, CheckCircle2, ShieldCheck, Sparkles, 
  Phone, Mail, User, MapPin, Laptop, MessageSquare, 
  ExternalLink, ArrowRight, Clock, AlertCircle 
} from 'lucide-react';
import { LiveBatch } from '@/types';
import { 
  trackFormStart, 
  trackFormSubmit, 
  trackGenerateLead, 
  trackBatchRegister, 
  trackCourseRegister,
  trackWhatsAppClick,
  trackEnrollmentStart,
  trackEnrollmentSubmit,
} from '@/lib/dataLayer';
import { queueLeadOffline } from '@/lib/offlineSync';

interface BatchEnrollmentFormProps {
  batch: LiveBatch;
  courseTitle: string;
  isSticky?: boolean;
}

export default function BatchEnrollmentForm({
  batch,
  courseTitle,
  isSticky = false,
}: BatchEnrollmentFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [mode, setMode] = useState<'ONLINE' | 'OFFLINE' | 'BOTH'>('ONLINE');
  const [query, setQuery] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    // Track form submission intent
    trackFormSubmit('batch_enrollment', {
      batch_id: batch.id,
      batch_name: batch.title,
      course_name: courseTitle || batch.courseTitle,
    });

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          city: city.trim() || 'Shikohabad',
          learningMode: mode,
          batchId: batch.id,
          batchTitle: batch.title,
          courseTitle: courseTitle || batch.courseTitle || batch.title,
          price: batch.price,
          startDate: batch.startDate,
          schedule: batch.schedule,
          query: query.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.whatsappUrl) {
        setIsSuccess(true);
        setWhatsappRedirectUrl(data.whatsappUrl);

        // Fire verified lead and registration events (zero PII)
        trackGenerateLead('batch_enrollment', {
          batch_id: batch.id,
          batch_name: batch.title,
          course_name: courseTitle || batch.courseTitle,
          course_mode: mode,
          course_price: batch.price,
        });
        trackEnrollmentSubmit({
          batchId: batch.id,
          batchName: batch.title,
          courseName: courseTitle || batch.courseTitle,
          coursePrice: batch.price,
          courseMode: mode,
        });
        trackBatchRegister({
          batchId: batch.id,
          batchName: batch.title,
          courseName: courseTitle || batch.courseTitle,
          batchStartDate: batch.startDate,
          coursePrice: batch.price,
          courseMode: mode,
        });
        trackCourseRegister({
          courseId: batch.courseId || batch.id,
          courseName: courseTitle || batch.courseTitle,
          coursePrice: batch.price,
          courseMode: mode,
        });

        toast.success('Registration saved! Opening WhatsApp...');

        // Automatically open WhatsApp in new tab
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 600);
      } else {
        throw new Error(data.error || 'Failed to submit enquiry');
      }
    } catch (err: any) {
      console.error('Lead submission failed:', err);

      // Queue offline in IndexedDB for automatic background sync when internet connects
      queueLeadOffline({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim(),
        city: city.trim() || 'Shikohabad',
        learningMode: mode,
        batchId: batch.id,
        batchTitle: batch.title,
        courseTitle: courseTitle || batch.courseTitle || batch.title,
        price: batch.price,
        startDate: batch.startDate,
        schedule: batch.schedule,
        query: query.trim(),
      }).catch(() => null);

      // Fallback: build client-side WhatsApp URL directly so student is NEVER blocked!
      const fallbackMsg = `🎓 *NEW ADMISSION ENQUIRY - MSK INSTITUTE*\n━━━━━━━━━━━━━━━━━━━━━━\n📌 *Batch:* ${batch.title}\n📚 *Course:* ${courseTitle}\n📅 *Start Date:* ${batch.startDate}\n⏰ *Schedule:* ${batch.schedule}\n💰 *Fee:* ${batch.price}\n\n👤 *STUDENT DETAILS:*\n• *Name:* ${name}\n• *Phone:* ${cleanPhone}\n• *City:* ${city || 'Shikohabad'}\n• *Mode:* ${mode}\n${query ? `• *Query:* ${query}\n` : ''}\n━━━━━━━━━━━━━━━━━━━━━━\n🚀 Sent from Official Website`;
      const fallbackUrl = `https://wa.me/918393042166?text=${encodeURIComponent(fallbackMsg)}`;
      
      setIsSuccess(true);
      setWhatsappRedirectUrl(fallbackUrl);

      // Fire verified lead and registration events for offline fallback
      trackGenerateLead('batch_enrollment_offline', {
        batch_id: batch.id,
        batch_name: batch.title,
        course_name: courseTitle || batch.courseTitle,
        course_mode: mode,
      });
      trackBatchRegister({
        batchId: batch.id,
        batchName: batch.title,
        courseName: courseTitle || batch.courseTitle,
        batchStartDate: batch.startDate,
        coursePrice: batch.price,
        courseMode: mode,
      });

      window.open(fallbackUrl, '_blank');
      toast.success('Offline enquiry saved! Also opening WhatsApp...');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-2 border-secondary/30 shadow-xl overflow-hidden ${isSticky ? 'sticky top-24' : ''}`}>
      {/* Form Header Banner */}
      <div className="bg-gradient-to-r from-primary to-[#1A3353] p-5 text-white relative">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-secondary px-2.5 py-0.5 rounded text-white shadow-sm">
            <Sparkles className="w-3 h-3" />
            Limited Seat Offer
          </span>
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Only {batch.leftSeats} Seats Left!
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
          Reserve Your Batch Seat & Demo
        </h3>
        <p className="text-xs text-gray-300 mt-1">
          Lock the discounted fee of <strong className="text-white text-sm">{batch.price}</strong> {batch.originalPrice && <span className="line-through text-gray-400 text-xs font-normal">({batch.originalPrice})</span>}. Free counseling & trial class.
        </p>
      </div>

      {/* Form Body or Success State */}
      <div className="p-6 space-y-5">
        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-primary">Registration Initiated!</h4>
              <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                Your admission enquiry has been logged in our admissions database.
              </p>
            </div>

            {whatsappRedirectUrl && (
              <div className="pt-3 space-y-2">
                <a
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>
                <p className="text-[11px] text-text-muted">
                  Official WhatsApp Contact: <strong>+91 83930 42166</strong>
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setName('');
                setPhone('');
                setEmail('');
                setQuery('');
              }}
              className="text-xs text-secondary font-bold hover:underline pt-2 inline-block cursor-pointer"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div className="space-y-1">
              <label htmlFor="lead-name" className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-secondary" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lead-name"
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onFocus={() => {
                  trackFormStart('batch_enrollment');
                  trackEnrollmentStart({
                    batchId: batch.id,
                    batchName: batch.title,
                    courseName: courseTitle || batch.courseTitle,
                  });
                }}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-secondary focus:bg-white transition-colors"
              />
            </div>

            {/* WhatsApp Mobile Number */}
            <div className="space-y-1">
              <label htmlFor="lead-phone" className="text-xs font-bold text-text-main flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-secondary" />
                  WhatsApp Number <span className="text-red-500">*</span>
                </span>
                <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                  Instant WhatsApp Connect
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-text-muted select-none">
                  +91
                </span>
                <input
                  id="lead-phone"
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm font-semibold tracking-wide focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Email Address & City (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="lead-email" className="text-xs font-bold text-text-main flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-secondary" />
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="lead-city" className="text-xs font-bold text-text-main flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  City / Location
                </label>
                <input
                  id="lead-city"
                  type="text"
                  placeholder="e.g. Shikohabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Learning Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-secondary" />
                Preferred Learning Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('OFFLINE')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    mode === 'OFFLINE'
                      ? 'bg-secondary text-white border-secondary shadow-sm'
                      : 'bg-surface text-text-muted border-border-subtle hover:bg-gray-100'
                  }`}
                >
                  Offline Classroom
                </button>
                <button
                  type="button"
                  onClick={() => setMode('ONLINE')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    mode === 'ONLINE'
                      ? 'bg-secondary text-white border-secondary shadow-sm'
                      : 'bg-surface text-text-muted border-border-subtle hover:bg-gray-100'
                  }`}
                >
                  Online Live Class
                </button>
              </div>
            </div>

            {/* Optional query */}
            <div className="space-y-1">
              <label htmlFor="lead-query" className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-secondary" />
                Questions / Timing Preferences (Optional)
              </label>
              <textarea
                id="lead-query"
                rows={2}
                placeholder="Ask about batch timings, laptop requirements, or demo slots..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs focus:outline-none focus:border-secondary focus:bg-white transition-colors resize-none"
              />
            </div>

            {/* Big Action Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-secondary to-amber-600 hover:from-secondary-light hover:to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving & Connecting WhatsApp...
                </span>
              ) : (
                <>
                  <span>Reserve Seat & Chat on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Assurances */}
            <div className="pt-2 border-t border-border-subtle space-y-1.5 text-[11px] text-text-muted text-center">
              <div className="flex items-center justify-center gap-1 text-green-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free Trial Demo • No Obligation</span>
              </div>
              <p className="text-[10px] text-text-muted leading-tight">
                Our coordinator Er. Sumit Kumar / admissions team (+91 8393042166) will confirm your batch seat.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
