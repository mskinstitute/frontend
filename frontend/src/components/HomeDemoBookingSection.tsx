'use client';

import { useState } from 'react';
import { 
  Sparkles, CheckCircle2, Laptop, Award, PhoneCall, 
  Send, MessageCircle, Clock, ShieldCheck, UserCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AVAILABLE_COURSES = [
  'Python Programming Masterclass',
  'Full-Stack Web Development (MERN Stack)',
  'NIELIT CCC (Basic Computer Course)',
  'ADCA (1-Year Advanced Computer Diploma)',
  'Data Analysis & Python Mastery',
  'Basic Computer, MS Office & Internet'
];

export default function HomeDemoBookingSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(AVAILABLE_COURSES[0]);
  const [learningMode, setLearningMode] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast.error('Please enter your Name and WhatsApp number');
      return;
    }

    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          learningMode: learningMode,
          courseTitle: course,
          batchTitle: `Free 2-Day Demo Class - ${course}`,
          query: `Booked via Homepage Demo Booking Section. Mode: ${learningMode}`,
          city: learningMode === 'OFFLINE' ? 'Shikohabad' : 'Online',
          utm_source: 'homepage_demo_section',
          utm_medium: 'cta_form',
          utm_campaign: 'free_demo_booking'
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        toast.success('Demo class seat reserved successfully!');
      } else {
        toast.error(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Demo booking error:', err);
      toast.error('Network error. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-[#0C2D4E] to-primary text-white shadow-xl border border-primary-light">
        {/* Ambient background decorative blur */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 sm:p-10 lg:p-12 items-center">
          {/* Left Column: Value Proposition & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-light text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-secondary-light animate-pulse" />
              <span>Free 2-Day Trial • No Admission Fee</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Experience Practical Coding — <br />
              <span className="text-secondary-light">Book Your Free 2-Day Demo Class</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
              Don’t rely on words — experience our learning environment first. Attend 2 days of real classroom or online lectures with <strong>Er. Sumit Kumar</strong> before enrolling.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Laptop className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white text-sm">Individual PC in Lab</div>
                  <div className="text-gray-300">Dedicated computer for every student with zero sharing.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <UserCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white text-sm">1-on-1 Doubt Clearing</div>
                  <div className="text-gray-300">Direct instructor attention and personal coding mentorship.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white text-sm">Free Career Roadmap</div>
                  <div className="text-gray-300">Custom guidance based on your academic & career aspirations.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white text-sm">Zero Obligation</div>
                  <div className="text-gray-300">Join full batch only if you are 100% satisfied with demo.</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Immediate Seat Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary-light" />
                <span>Flexible Morning & Evening Slots</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-text-main p-6 sm:p-7 rounded-2xl shadow-2xl border border-white/20">
              {isSubmitted ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-primary">Demo Class Reserved!</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Thank you, <strong>{name}</strong>! We have received your request for <strong>{course}</strong> ({learningMode === 'OFFLINE' ? 'Offline in Shikohabad' : 'Online'}).
                  </p>
                  <p className="text-xs text-text-muted">
                    Our coordinator will connect with you on WhatsApp / Phone within 2 business hours with your classroom entry pass and batch schedule.
                  </p>
                  
                  <div className="pt-3">
                    <a
                      href={`https://wa.me/918393042166?text=${encodeURIComponent(`Hello MSK Institute, I just booked a Free 2-Day Demo Class for ${course} (${learningMode}) on the website. My name is ${name}. Please share the demo class details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm Faster via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-primary tracking-tight">
                      Reserve Your Demo Class
                    </h3>
                    <p className="text-xs text-text-muted">
                      Fill the form below to lock your 2-day trial seat.
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-surface rounded-xl border border-border-subtle">
                    <button
                      type="button"
                      onClick={() => setLearningMode('OFFLINE')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        learningMode === 'OFFLINE'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-text-muted hover:text-primary'
                      }`}
                    >
                      🏢 Offline Lab (Shikohabad)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLearningMode('ONLINE')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        learningMode === 'ONLINE'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-text-muted hover:text-primary'
                      }`}
                    >
                      🌐 Online Live
                    </button>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-primary block">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border-subtle rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-primary block">
                      WhatsApp / Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-text-muted">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-surface border border-border-subtle rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                      />
                    </div>
                  </div>

                  {/* Course Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-primary block">
                      Select Course for Demo
                    </label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-surface border border-border-subtle rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                    >
                      {AVAILABLE_COURSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 px-4 bg-secondary hover:bg-secondary-light text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Reserving Your Seat...</span>
                    ) : (
                      <>
                        <span>Confirm Free Demo Seat</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-text-muted text-center pt-1">
                    🔒 No spam. We only contact you to schedule your demo class.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
