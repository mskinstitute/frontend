'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Compass,
  Building,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { trackContactClick, trackFormSubmit, trackGenerateLead } from '@/lib/tracking';
import { SocialIconPills, GoogleRatingTrustBadge, SocialCommunitySection } from '@/components/SocialLinks';

const PHONE_NUMBER = '+91 83930 42166';
const CLEAN_PHONE = '918393042166';
const EMAIL_ADDRESS = 'mskshikohabad@gmail.com';
const ADDRESS_TEXT = 'Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, Firozabad, UP - 283135';
const MAPS_URL = 'https://maps.google.com/?q=MSK+Institute+Shikohabad';

const COURSE_INTERESTS = [
  'General Enquiry & Counseling',
  'Python Programming Masterclass',
  'Full-Stack Web Development (HTML/CSS/JS/React)',
  'NIELIT CCC Certification Course',
  'MS Office & Digital Literacy',
  'Data Analytics with Python & Excel',
  'Live Online Interactive Batches',
  'Free Demo Class Booking',
  'Offline Campus Visit / Tour',
];

const FAQS = [
  {
    q: 'How can I join a Free Demo Class at MSK Institute?',
    a: 'You can register through the contact form above, call us at +91 83930 42166, or drop by our Shikohabad campus. We provide 2 days of free trial classes for any course.',
  },
  {
    q: 'Where is the MSK Institute campus located in Shikohabad?',
    a: 'We are situated in Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, Uttar Pradesh (PIN: 283135). It is just 5 minutes from Shikohabad main market and easily accessible by auto-rickshaw.',
  },
  {
    q: 'Are courses available in both Online and Offline modes?',
    a: 'Yes! We conduct interactive physical classroom labs in Shikohabad equipped with high-speed computers, as well as live online batches for remote learners across India.',
  },
  {
    q: 'What are the institute operational hours?',
    a: 'Our campus and helpline are active Monday to Saturday from 8:00 AM to 7:00 PM. On Sundays, our counseling desk is open from 10:00 AM to 2:00 PM for admissions and batch planning.',
  },
  {
    q: 'Do you issue verified certificates upon course completion?',
    a: 'Yes. Every graduating student receives an official certificate with a verifiable QR code and online verification page that employers and colleges can verify in real-time.',
  },
];

export default function ContactClient() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState(COURSE_INTERESTS[0]);
  const [learningMode, setLearningMode] = useState<'OFFLINE' | 'ONLINE' | 'BOTH'>('OFFLINE');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    const cleanNumber = phone.trim().replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      trackFormSubmit('contact_us_form', {
        course_name: interest,
        learning_mode: learningMode,
      });

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanNumber,
          email: email.trim(),
          city: 'Shikohabad',
          learningMode: learningMode,
          courseTitle: interest,
          batchTitle: `Enquiry: ${interest}`,
          query: message.trim() || `Contact Us Enquiry for ${interest} (${learningMode})`,
          utm_source: 'contact_page',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setWhatsappUrl(data.whatsappUrl || `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(`Hi MSK Institute, I am ${name.trim()} and I submitted an enquiry for ${interest}.`)}`);
        trackGenerateLead('contact_us_form', {
          course_name: interest,
          learning_mode: learningMode,
        });
        toast.success('Your message has been received! Our team will contact you shortly.');
      } else {
        toast.error(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      toast.error('Connection issue. You can reach us directly on WhatsApp or Call.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <section className="bg-primary text-white pt-14 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-secondary-light text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Direct Admission & Student Support
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Contact <span className="text-secondary">MSK Institute</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Have questions about coding courses, live batches, fees, or offline lab timings in Shikohabad?
            Reach out directly or book a free 1-on-1 counseling session.
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-xs text-slate-400">Response Time</p>
              <p className="text-sm font-bold text-white">&lt; 15 Minutes</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-xs text-slate-400">Campus Location</p>
              <p className="text-sm font-bold text-white">Shikohabad, UP</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-xs text-slate-400">Support Availability</p>
              <p className="text-sm font-bold text-white">Mon – Sat, 8AM–7PM</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-xs text-slate-400">Trial Class</p>
              <p className="text-sm font-bold text-secondary">Free 2-Day Demo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* 4 Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Card 1: Call Directly */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-subtle hover:shadow-md hover:border-secondary/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-primary">Call Admissions</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Direct phone helpline for courses, doubts, and trial schedules.
              </p>
              <p className="text-sm font-bold text-primary mt-2 font-mono">{PHONE_NUMBER}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-2">
              <a
                href={`tel:${CLEAN_PHONE}`}
                onClick={() => trackContactClick('call')}
                className="flex-1 text-center py-2 px-3 bg-secondary hover:bg-secondary-light text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Call Now
              </a>
              <button
                type="button"
                onClick={() => handleCopy(PHONE_NUMBER, 'Phone number')}
                className="p-2 text-text-muted hover:text-primary hover:bg-slate-100 rounded-lg border border-border-subtle transition-colors cursor-pointer"
                title="Copy phone number"
                aria-label="Copy phone number"
              >
                {copiedField === 'Phone number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-subtle hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-primary">WhatsApp Chat</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Get syllabus PDFs, batch timings, and fee structures on WhatsApp.
              </p>
              <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online & Active Now
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle">
              <a
                href={`https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hello MSK Institute, I would like to inquire about courses and demo batches.')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('whatsapp')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Chat on WhatsApp
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Email Support */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-subtle hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-primary">Official Email</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Send formal queries, corporate training requests, or feedback.
              </p>
              <p className="text-xs font-semibold text-primary mt-2 truncate font-mono">{EMAIL_ADDRESS}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-2">
              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=Enquiry%20regarding%20MSK%20Institute%20Courses`}
                onClick={() => trackContactClick('email')}
                className="flex-1 text-center py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Send Email
              </a>
              <button
                type="button"
                onClick={() => handleCopy(EMAIL_ADDRESS, 'Email address')}
                className="p-2 text-text-muted hover:text-primary hover:bg-slate-100 rounded-lg border border-border-subtle transition-colors cursor-pointer"
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedField === 'Email address' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 4: Campus Visit */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-subtle hover:shadow-md hover:border-purple-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-primary">Visit Campus</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Experience physical computer lab facilities and meet instructors.
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-2 truncate">Shikohabad, UP-283135</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('maps')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Get Directions
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Form (Left) & Campus Info / Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Interactive Contact & Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Quick Enquiry
              </div>
              <h2 className="text-2xl font-bold text-primary tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Fill out the quick form below. Our academic counselors will connect with you via WhatsApp or Call within 15 minutes.
              </p>
            </div>

            {isSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-4 animate-in fade-in-50 duration-300">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">Thank You, {name}!</h3>
                  <p className="text-sm text-emerald-800 mt-1 max-w-md mx-auto">
                    Your inquiry has been successfully registered. A counselor from MSK Institute will reach out to you shortly.
                  </p>
                </div>
                {whatsappUrl && (
                  <div className="pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Continue on WhatsApp Instantly
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="text-xs text-text-muted underline hover:text-primary cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-main placeholder-text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-main placeholder-text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-text-muted/60 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-main placeholder-text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                  />
                </div>

                {/* Course Interest Dropdown */}
                <div>
                  <label htmlFor="contact-interest" className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                    Course / Topic of Interest
                  </label>
                  <select
                    id="contact-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-main focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                  >
                    {COURSE_INTERESTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Mode Selector */}
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                    Preferred Learning Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'OFFLINE', label: 'Offline (Shikohabad)' },
                      { id: 'ONLINE', label: 'Online Live' },
                      { id: 'BOTH', label: 'Flexible / Both' },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setLearningMode(m.id as any)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                          learningMode === m.id
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-surface text-text-muted border-border-subtle hover:bg-slate-100 hover:text-primary'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message / Query */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                    Your Message / Specific Doubt <span className="text-text-muted/60 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    placeholder="Tell us what you want to learn, your batch time preferences, or specific career goals..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-main placeholder-text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-secondary hover:bg-secondary-light active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Enquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Enquiry & Connect
                    </>
                  )}
                </button>

                <p className="text-[11px] text-text-muted text-center pt-1">
                  🔒 We respect your privacy. No spam. You will only receive official course counseling.
                </p>
              </form>
            )}
          </div>

          {/* Right Column: Campus Info, Hours, and Google Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Campus Address & Hours Card */}
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm">
              <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-4">
                <Building className="w-4 h-4 text-secondary" />
                Shikohabad Main Campus
              </h3>

              <div className="space-y-4 text-sm text-text-muted">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-primary text-xs uppercase tracking-wider mb-0.5">Physical Campus Address</strong>
                    <span>{ADDRESS_TEXT}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ADDRESS_TEXT, 'Full address')}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs text-secondary hover:text-secondary-light font-semibold cursor-pointer"
                    >
                      {copiedField === 'Full address' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      Copy Address
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-border-subtle">
                  <Clock className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-primary text-xs uppercase tracking-wider mb-0.5">Operating Hours</strong>
                    <div className="space-y-1 text-xs">
                      <p><span className="font-semibold text-text-main">Monday – Saturday:</span> 8:00 AM – 7:00 PM</p>
                      <p><span className="font-semibold text-text-main">Sunday:</span> 10:00 AM – 2:00 PM (Counseling)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-border-subtle">
                  <Compass className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-primary text-xs uppercase tracking-wider mb-0.5">Landmark & Commute</strong>
                    <p className="text-xs">
                      Located adjacent to Gyan Jyoti Public School. 5 minutes from Shikohabad Roadways Bus Stand and Railway Station. E-Rickshaw available from all key city points.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Embedded Google Map */}
            <div className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between bg-surface">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  Google Maps Location
                </span>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick('maps')}
                  className="text-xs text-secondary hover:text-secondary-light font-bold inline-flex items-center gap-1"
                >
                  Open in App
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative w-full h-64 bg-slate-100 flex items-center justify-center overflow-hidden">
                {isMapLoaded ? (
                  <iframe
                    title="MSK Institute Shikohabad Location Map"
                    src="https://maps.google.com/maps?q=MSK%20Institute%2C%20Gali%20No.%203%2C%20Near%20Gyan%20Jyoti%20Public%20School%2C%20Shikohabad%2C%20Uttar%20Pradesh%20283135&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-2.5 border-dashed border-2 border-border-subtle">
                    <div className="p-2.5 bg-secondary/10 rounded-full text-secondary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">MSK Institute Campus • Shikohabad</p>
                      <p className="text-[11px] text-text-muted">Gali No. 3, Near Gyan Jyoti Public School (PIN: 283135)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMapLoaded(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-secondary" />
                      <span>Explore Interactive Map</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trust & Verification Badges */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-5">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Why Students Trust MSK Institute
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified ISO Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>100% Practical Labs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>Free Placement Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Small Batch Sizes (12)</span>
                </div>
              </div>
            </div>

            {/* Google Rating Trust Badge & Direct Social Links */}
            <div className="bg-white rounded-2xl border border-border-subtle p-5 space-y-3">
              <GoogleRatingTrustBadge className="w-full" />
              <div className="pt-2 border-t border-border-subtle">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  Official Channels:
                </span>
                <SocialIconPills variant="dark" />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Community Trust Section */}
        <div className="mb-14">
          <SocialCommunitySection 
            title="Connect with MSK Student Community on Social Media"
            subtitle="Follow our YouTube tutorials, Instagram campus lab moments, LinkedIn career updates, and chat directly on WhatsApp."
          />
        </div>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl border border-border-subtle p-6 sm:p-10 shadow-sm mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              Have Questions Before You Visit?
            </h2>
            <p className="text-sm text-text-muted mt-2">
              Find quick answers regarding our admission process, lab equipment, course validity, and counseling.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="border border-border-subtle rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-primary">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-secondary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 text-sm text-text-muted border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Direct CTA */}
        <div className="bg-primary rounded-2xl text-white p-8 text-center relative overflow-hidden shadow-md">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2 relative z-10">
            Ready to Accelerate Your Career in Coding & Tech?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6 relative z-10">
            Join hundreds of successful alumni from Shikohabad who started their programming journeys at MSK Institute.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link
              href="/courses"
              className="px-6 py-2.5 bg-secondary hover:bg-secondary-light text-white text-sm font-bold rounded-xl shadow transition-all"
            >
              Explore All Courses
            </Link>
            <a
              href={`https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hi MSK Institute, I would like to book a free demo class.')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('whatsapp')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
