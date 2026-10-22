import Link from 'next/link';
import { 
  Sparkles, CheckCircle2, Laptop, Award, PhoneCall, 
  ArrowRight, MessageCircle, Clock, ShieldCheck, UserCheck, Globe
} from 'lucide-react';

export default function HomeDemoBookingSection() {
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
              <span>Free 2-Day Trial • No Admission Fee • No Login Needed</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Experience Practical Coding — <br />
              <span className="text-secondary-light">Book Your Free 2-Day Demo Class</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
              Don’t rely on words — experience our learning environment first. Attend 2 full days of live interactive sessions or offline lab lectures with <strong>Er. Sumit Kumar</strong> before enrolling.
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
                <span>Instant WhatsApp Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary-light" />
                <span>Flexible Morning & Evening Slots</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Gateway Card to /book-demo */}
          <div className="lg:col-span-5">
            <div className="bg-white text-text-main p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Now Open For New Batches</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  Reserve Your Demo Seat
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Join our next live cohort or classroom session. No login or signup required.
                </p>
              </div>

              {/* Supported Modes Preview */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-surface border border-border-subtle flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="font-bold text-primary">🌐 Online Live Interactive</div>
                      <div className="text-[11px] text-text-muted">Google Meet + 2-way live audio Q&A</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Free
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-surface border border-border-subtle flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-secondary" />
                    <div>
                      <div className="font-bold text-primary">🏢 Shikohabad Offline Lab</div>
                      <div className="text-[11px] text-text-muted">Personal workstation & physical mentor desk</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Free
                  </span>
                </div>
              </div>

              {/* Popular tracks tags */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-primary">Available Demo Tracks:</div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg font-medium">Python Masterclass</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg font-medium">Full-Stack MERN</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg font-medium">NIELIT CCC</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg font-medium">ADCA Diploma</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg font-medium">Data Analytics</span>
                </div>
              </div>

              {/* Direct Link to Dedicated Route */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/book-demo"
                  className="w-full py-4 px-6 bg-secondary hover:bg-secondary-light text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Book Free Demo Class Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-between pt-2 text-[11px] text-text-muted">
                  <a
                    href="https://wa.me/918393042166?text=Hi%20Er.%20Sumit%20Kumar,%20I%20want%20to%20inquire%20about%20the%20Free%20Demo%20Class."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Us Directly</span>
                  </a>

                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>100% Free Trial</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
