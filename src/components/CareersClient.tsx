'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  Building2,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  User,
  Phone,
  Mail,
  FileText,
  Link2,
  Award,
  Users,
  ShieldCheck,
  Check,
  Share2,
  Copy,
  RotateCcw,
  MessageCircle,
  MessageSquare,
  Globe,
  Layers,
  ArrowUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CareerOpportunity, CareerType, WorkMode } from '@/types';
import { trackFormStart, trackFormSubmit, trackGenerateLead, trackWhatsAppClick } from '@/lib/dataLayer';

interface CareersClientProps {
  initialCareers: CareerOpportunity[];
}

const WHATSAPP_NUMBER = '918393042166';

export default function CareersClient({ initialCareers }: CareersClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'full-time' | 'part-time' | 'internship'>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCareerId, setExpandedCareerId] = useState<string | null>(null);

  // Application Modal state
  const [selectedCareerForApply, setSelectedCareerForApply] = useState<CareerOpportunity | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantCity, setApplicantCity] = useState('');
  const [applicantStatus, setApplicantStatus] = useState('College Student / Final Year');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [applySuccessData, setApplySuccessData] = useState<{
    whatsappUrl: string;
    waMeUrl: string;
    jobTitle: string;
    msg: string;
  } | null>(null);
  const [isCopiedApplicationText, setIsCopiedApplicationText] = useState(false);

  // Share Modal state
  const [selectedCareerForShare, setSelectedCareerForShare] = useState<CareerOpportunity | null>(null);
  const [isCopiedShareText, setIsCopiedShareText] = useState(false);
  const [isCopiedLinkOnly, setIsCopiedLinkOnly] = useState(false);

  // Recruiter Inquiry Modal state
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
  const [recruiterName, setRecruiterName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [recruiterRoleRequired, setRecruiterRoleRequired] = useState('Trainers & Education Counselors');

  // Dynamic header offset & sticky positioning (defaults to 115px to account for marquee ticker + navbar)
  const [headerHeight, setHeaderHeight] = useState(115);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isFilterHidden, setIsFilterHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);

  // Dynamically measure sticky header height to guarantee filter never clips behind announcement marquee
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerEl = document.querySelector('header');
      if (headerEl) {
        setHeaderHeight(Math.max(headerEl.offsetHeight, 112));
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Detect scroll position for sticky header offset and Back-to-Top (no auto-hide on scroll)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const listingsEl = document.getElementById('listings-container');
      const threshold = listingsEl ? listingsEl.offsetTop - (headerHeight + 20) : 260;

      setShowBackToTop(currentScrollY > 500);

      if (currentScrollY > threshold) {
        setIsScrolledPastHero(true);
      } else {
        setIsScrolledPastHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  // Auto-scroll, highlight, and expand job if opened with hash (e.g. /careers#job-counselor)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setHighlightedJobId(targetId);
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setExpandedCareerId(targetId);
        }, 350);

        // Remove pulse ring after 6 seconds
        const timer = setTimeout(() => {
          setHighlightedJobId(null);
        }, 6000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Generate structured job share text with full details and direct URL
  const generateJobShareText = (career: CareerOpportunity) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.mskinstitute.in';
    const jobUrl = `${origin}/careers#${career.id}`;
    const workTypeStr = career.workType || (career.type === 'internship' ? 'Internship' : 'Full-time Job');
    const skillsList = career.skills && career.skills.length > 0 ? career.skills.join(', ') : null;

    return `📢 *JOB OPPORTUNITY AT MSK INSTITUTE* 📢

💼 *Role:* ${career.title}
🏢 *Department:* ${career.department}
📌 *Employment Type:* ${workTypeStr} (On-site)
💰 *Salary / Stipend:* ${career.stipendOrSalary}
📍 *Location:* MSK Institute, Shikohabad (Firozabad, UP)
🎯 *Experience:* ${career.experienceLevel}
👥 *Eligibility:* ${career.gender || 'Any Gender'}
🔢 *Openings:* ${career.openings} ${career.openings === 1 ? 'Position' : 'Positions'}

📝 *Job Overview:*
${career.shortDescription}
${skillsList ? `\n🛠 *Key Skills:* ${skillsList}\n` : ''}
👉 *Apply Online & View Full Details:*
${jobUrl}

📍 *Campus Address:* Gali No. 3, Near Gyan Jyoti Public School, Shikohabad
📞 *Contact / WhatsApp:* +91 83930 42166`;
  };

  const handleOpenShareModal = (career: CareerOpportunity) => {
    setSelectedCareerForShare(career);
    setIsCopiedShareText(false);
    setIsCopiedLinkOnly(false);
  };

  const handleShareViaWhatsApp = () => {
    if (!selectedCareerForShare) return;
    const text = generateJobShareText(selectedCareerForShare);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyShareContent = async () => {
    if (!selectedCareerForShare) return;
    const text = generateJobShareText(selectedCareerForShare);
    try {
      await navigator.clipboard.writeText(text);
      setIsCopiedShareText(true);
      toast.success('Job details and link copied to clipboard!');
      setTimeout(() => setIsCopiedShareText(false), 2500);
    } catch {
      toast.error('Could not copy to clipboard. Please copy manually.');
    }
  };

  const handleCopyLinkOnly = async () => {
    if (!selectedCareerForShare) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.mskinstitute.in';
    const jobUrl = `${origin}/careers#${selectedCareerForShare.id}`;
    try {
      await navigator.clipboard.writeText(jobUrl);
      setIsCopiedLinkOnly(true);
      toast.success('Job link copied to clipboard!');
      setTimeout(() => setIsCopiedLinkOnly(false), 2500);
    } catch {
      toast.error('Could not copy link.');
    }
  };

  const handleNativeShare = async () => {
    if (!selectedCareerForShare) return;
    const text = generateJobShareText(selectedCareerForShare);

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${selectedCareerForShare.title} | MSK Institute Careers`,
          text: text,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyShareContent();
        }
      }
    } else {
      handleCopyShareContent();
    }
  };

  const isAnyFilterActive = activeTab !== 'all' || selectedPriority !== 'all' || selectedGender !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setActiveTab('all');
    setSelectedPriority('all');
    setSelectedGender('all');
    setSearchQuery('');
  };

  // Filtered list
  const filteredCareers = useMemo(() => {
    return initialCareers.filter((item) => {
      // Tab filter
      if (activeTab === 'full-time') {
        if (item.type !== 'job' || item.workType?.toLowerCase().includes('part-time')) {
          return false;
        }
      } else if (activeTab === 'part-time') {
        if (!item.workType?.toLowerCase().includes('part-time')) {
          return false;
        }
      } else if (activeTab === 'internship') {
        if (item.type !== 'internship') {
          return false;
        }
      }

      // Priority filter
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }

      // Gender filter
      if (selectedGender === 'female' && !item.gender?.toLowerCase().includes('female')) {
        return false;
      }
      if (selectedGender === 'any' && item.gender !== 'Any') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDept = item.department.toLowerCase().includes(query);
        const matchesDesc = item.shortDescription.toLowerCase().includes(query);
        const matchesSkills = item.skills?.some((s) => s.toLowerCase().includes(query));
        const matchesLocation = item.location.toLowerCase().includes(query);
        const matchesWorkType = item.workType?.toLowerCase().includes(query);
        const matchesGender = item.gender?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDept && !matchesDesc && !matchesSkills && !matchesLocation && !matchesWorkType && !matchesGender) {
          return false;
        }
      }
      return true;
    });
  }, [initialCareers, activeTab, selectedPriority, selectedGender, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    const total = initialCareers.length;
    const fullTime = initialCareers.filter((c) => c.type === 'job' && !c.workType?.toLowerCase().includes('part-time')).length;
    const partTime = initialCareers.filter((c) => c.workType?.toLowerCase().includes('part-time')).length;
    const internships = initialCareers.filter((c) => c.type === 'internship').length;
    const female = initialCareers.filter((c) => c.gender?.toLowerCase().includes('female')).length;
    const anyGender = initialCareers.filter((c) => c.gender === 'Any').length;
    return { total, fullTime, partTime, internships, female, anyGender };
  }, [initialCareers]);

  // Open Apply Modal helper
  const handleOpenApplyModal = (career: CareerOpportunity) => {
    setApplySuccessData(null);
    setIsCopiedApplicationText(false);
    setSelectedCareerForApply(career);
  };

  // Handle Application Submit
  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCareerForApply) return;

    const trimmedName = applicantName.trim();
    const trimmedPhone = applicantPhone.trim();
    const trimmedEmail = applicantEmail.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail) {
      toast.error('Please enter your full name, phone number, and email.');
      return;
    }

    setIsApplying(true);

    const career = selectedCareerForApply;

    // 1. Format WhatsApp Application text
    const msg = `💼 *NEW ON-SITE CAREER APPLICATION - MSK CAREERS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *Position:* ${career.title}
🏢 *Type:* ${career.workType || (career.type === 'internship' ? 'Internship' : 'Full-time Job')}
📍 *Location:* On-site (Shikohabad Campus)
💰 *Offered Pay:* ${career.stipendOrSalary}
⚡ *Hiring Priority:* ${career.priority ? `${career.priority} Priority` : 'Standard'}
👥 *Gender:* ${career.gender || 'Any'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *APPLICANT DETAILS:*
• *Full Name:* ${trimmedName}
• *WhatsApp Phone:* ${trimmedPhone}
• *Email:* ${trimmedEmail}
• *Current Location / City:* ${applicantCity.trim() || 'Shikohabad'}
• *Profile / Status:* ${applicantStatus}
${applicantPortfolio.trim() ? `• *Portfolio / Resume Link:* ${applicantPortfolio.trim()}\n` : ''}${applicantNote.trim() ? `• *Applicant Statement:* ${applicantNote.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ *Campus:* MSK Institute, Station Road, Shikohabad (Firozabad, UP)
🚀 _Sent via MSK Institute Official Careers Portal_`;

    const encodedText = encodeURIComponent(msg);
    const whatsappApiUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;
    const waMeUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    // 2. Set the Success state in the modal with unblockable direct action button!
    setApplySuccessData({
      whatsappUrl: whatsappApiUrl,
      waMeUrl,
      jobTitle: career.title,
      msg,
    });

    // Fire form submission and lead tracking (zero PII)
    trackFormSubmit('career_application', {
      position: career.title,
      work_type: career.workType || career.type,
    });
    trackGenerateLead('career_application', {
      position: career.title,
      work_type: career.workType || career.type,
    });
    trackWhatsAppClick({
      buttonText: 'Submit Application via WhatsApp',
      courseName: career.title,
      linkUrl: whatsappApiUrl,
    });

    toast.success('Application recorded! Opening WhatsApp...');

    // 3. Fire lead registration to server in background (non-blocking so network latency never stalls WhatsApp)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        city: applicantCity.trim() || 'Shikohabad',
        learningMode: 'OFFLINE',
        batchId: career.id,
        batchTitle: `Career Application: ${career.title}`,
        courseTitle: `${career.type === 'internship' ? 'Internship' : 'Job'} Application (${career.workType || 'On-site'})`,
        price: career.stipendOrSalary,
        query: `Status: ${applicantStatus} | Priority: ${career.priority || 'Standard'} | Portfolio: ${applicantPortfolio.trim() || 'N/A'} | Note: ${applicantNote.trim() || 'N/A'}`,
        utm_source: 'careers_page',
      }),
    }).catch((err) => console.error('Error recording career lead:', err));

    // 4. Trigger WhatsApp redirection synchronously in user gesture
    try {
      const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        // On mobile, window.location.href triggers native WhatsApp app directly
        window.location.href = whatsappApiUrl;
      } else {
        // On desktop, window.open opens WhatsApp Web
        window.open(whatsappApiUrl, '_blank');
      }
    } catch (openErr) {
      console.error('Auto-redirect to WhatsApp prevented:', openErr);
    } finally {
      setIsApplying(false);
    }
  };

  // Handle Recruiter Inquiries
  const handleRecruiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterName.trim() || !companyName.trim() || !recruiterPhone.trim()) {
      toast.error('Please fill in your name, company, and phone number.');
      return;
    }

    const msg = `🤝 *RECRUITER / HIRING PARTNER INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Company:* ${companyName}
👤 *Contact Person:* ${recruiterName}
📞 *Phone:* ${recruiterPhone}
🎯 *Talent Needed:* ${recruiterRoleRequired}
━━━━━━━━━━━━━━━━━━━━━━━━━━
We are looking to hire skilled students and graduates from MSK Institute. Please share candidate portfolios and schedule an interaction.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    toast.success('Thank you! Redirecting to MSK Placement Cell...');
    setIsRecruiterModalOpen(false);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface-alt/50 pb-20">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-primary text-white py-16 sm:py-24 border-b border-primary-light">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              MSK Institute Placement & Internship Portal
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Build Your Career with <span className="text-secondary">On-Site Tech Roles</span> & Live Internships
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Join the academic, technical, and counseling team at MSK Institute Shikohabad Campus. Explore verified on-site trainer roles, student counseling, sales, digital marketing, and industry internship tracks.
            </p>

            {/* Metrics Ribbon */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-white/15">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">{counts.total}+</div>
                <div className="text-xs text-slate-400 font-medium">Active Openings</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-secondary">₹2,000–₹6,000</div>
                <div className="text-xs text-slate-400 font-medium">Internship Stipend</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-purple-300">₹2,000–₹5,000</div>
                <div className="text-xs text-slate-400 font-medium">Part-Time Salary</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">100% On-Site</div>
                <div className="text-xs text-slate-400 font-medium">Shikohabad Campus</div>
              </div>
            </div>

            {/* Recruiter Quick Action */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('listings-container');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-light text-primary font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                Explore Openings
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsRecruiterModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-secondary" />
                Hiring Partner? Recruit From Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div id="listings-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        {/* Floating "Show Filters & Search" Pill (Fixed at Bottom Center - Never hidden by header) */}
        {isFilterHidden && (
          <div className="fixed bottom-11 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                setIsFilterHidden(false);
                const el = document.getElementById('listings-container');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-primary text-white hover:bg-primary-light rounded-full shadow-2xl border-2 border-secondary text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 active:scale-95 group"
            >
              <Search className="w-4 h-4 text-secondary group-hover:rotate-12 transition-transform" />
              <span>Show Filters</span>
              <ChevronUp className="w-4 h-4 text-secondary" />
              {isAnyFilterActive && (
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse ml-0.5" />
              )}
            </button>
          </div>
        )}

        {/* Controls Card: Tabs & Search (Green Area), Hide Button & Expanded Quick Pills */}
        {!isFilterHidden && (
          <div
            style={{
              top: isScrolledPastHero ? `${headerHeight + 14}px` : undefined,
            }}
            className={`z-30 transition-all duration-200 ${
              isScrolledPastHero ? 'sticky top-[120px] sm:top-[128px]' : 'relative'
            }`}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-border-subtle p-2 sm:p-2.5 shadow-sm space-y-1.5 transition-all duration-200 animate-in fade-in duration-150">
          {/* Row 1: Role Type Filter Tabs, Search Bar (Green Area), Counter & Hide Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Tab Pill Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 flex-shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-surface hover:bg-slate-100 text-text-muted hover:text-primary border border-border-subtle/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All ({counts.total})</span>
              </button>
              <button
                onClick={() => setActiveTab('full-time')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'full-time'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-surface hover:bg-blue-50 text-text-muted hover:text-blue-700 border border-border-subtle/60'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Full-Time ({counts.fullTime})</span>
              </button>
              <button
                onClick={() => setActiveTab('part-time')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'part-time'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-surface hover:bg-purple-50 text-text-muted hover:text-purple-700 border border-border-subtle/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Part-Time ({counts.partTime})</span>
              </button>
              <button
                onClick={() => setActiveTab('internship')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'internship'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-surface hover:bg-emerald-50 text-text-muted hover:text-emerald-700 border border-border-subtle/60'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Internships ({counts.internships})</span>
              </button>
            </div>

            {/* Middle & Right: Search Input (Green Area) + Matching Counter + Hide Filter Button */}
            <div className="flex items-center gap-2 flex-1 sm:justify-end min-w-0">
              {/* Search Bar (Moved from Red area to Green area) */}
              <div className="relative flex-1 sm:max-w-xs md:max-w-sm">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search roles, skills (Python, Sales)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-surface border border-border-subtle rounded-lg text-xs text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary p-0.5 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Counter Indicator */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-text-muted flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  <strong className="text-primary font-bold">{filteredCareers.length}</strong> of {counts.total}
                </span>
              </div>

              {/* Hide Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterHidden(true)}
                className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-slate-100 text-text-muted hover:text-primary border border-border-subtle/70 text-xs font-semibold flex items-center gap-1 flex-shrink-0 cursor-pointer transition-colors shadow-2xs"
                title="Hide filter bar"
                aria-label="Hide filter bar"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Hide</span>
              </button>
            </div>
          </div>

          {/* Row 2: Enhanced QUICK Filter Pills (Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[11px]">
            <span className="text-text-muted font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
              Quick:
            </span>

            {/* Urgent / High Priority */}
            <button
              onClick={() => setSelectedPriority(selectedPriority === 'High' ? 'all' : 'High')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                selectedPriority === 'High'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span>🔥 Urgent / High Priority</span>
            </button>

            {/* Medium Priority */}
            <button
              onClick={() => setSelectedPriority(selectedPriority === 'Medium' ? 'all' : 'Medium')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                selectedPriority === 'Medium'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>🟠 Medium Priority</span>
            </button>

            {/* Optional Roles */}
            <button
              onClick={() => setSelectedPriority(selectedPriority === 'Optional' ? 'all' : 'Optional')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                selectedPriority === 'Optional'
                  ? 'bg-slate-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>🟡 Optional Roles</span>
            </button>

            {/* Female Preferred */}
            <button
              onClick={() => setSelectedGender(selectedGender === 'female' ? 'all' : 'female')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                selectedGender === 'female'
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              <span>👩 Female Preferred</span>
            </button>

            {/* Any Gender */}
            <button
              onClick={() => setSelectedGender(selectedGender === 'any' ? 'all' : 'any')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                selectedGender === 'any'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <span>👥 Any Gender</span>
            </button>

            {/* Part-Time Only */}
            <button
              onClick={() => setActiveTab(activeTab === 'part-time' ? 'all' : 'part-time')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                activeTab === 'part-time'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span>⏱️ Part-Time (₹2k-5k)</span>
            </button>

            {/* Internships Only */}
            <button
              onClick={() => setActiveTab(activeTab === 'internship' ? 'all' : 'internship')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                activeTab === 'internship'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span>🎓 Internships (₹2k-6k)</span>
            </button>

            {/* Full-Time Only */}
            <button
              onClick={() => setActiveTab(activeTab === 'full-time' ? 'all' : 'full-time')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                activeTab === 'full-time'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <span>💼 Full-Time</span>
            </button>

            {/* Reset shortcut if any filter active */}
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="px-2 py-0.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ml-auto"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Row 3: Active Filters Tags Ribbon */}
          {isAnyFilterActive && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border-subtle/50 text-[11px] text-text-muted">
              <span className="font-bold text-primary text-[10px] uppercase tracking-wider">Active:</span>
              {activeTab !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                  <span>Type: {activeTab === 'full-time' ? 'Full-time' : activeTab === 'part-time' ? 'Part-time' : 'Internship'}</span>
                  <button onClick={() => setActiveTab('all')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {selectedPriority !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                  <span>{selectedPriority}</span>
                  <button onClick={() => setSelectedPriority('all')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {selectedGender !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 font-bold">
                  <span>{selectedGender === 'female' ? 'Female' : 'Any'}</span>
                  <button onClick={() => setSelectedGender('all')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-secondary hover:text-secondary-light hover:underline font-bold ml-auto cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
            </div>
          </div>
        )}

        {/* Listings Grid / Empty state */}
        <div className="mt-8 space-y-4">
          {filteredCareers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border-subtle p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto text-text-muted">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-primary">No opportunities found</h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                No active openings match your current search or filters. Try resetting the filters or check back soon.
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedPriority('all');
                  setSelectedGender('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredCareers.map((item) => {
              const isExpanded = expandedCareerId === item.id;
              const isIntern = item.type === 'internship';
              const isHighlighted = highlightedJobId === item.id;

              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`bg-white rounded-2xl border scroll-mt-36 transition-all duration-300 overflow-hidden group ${
                    isHighlighted
                      ? 'border-secondary ring-4 ring-secondary/30 shadow-xl scale-[1.005]'
                      : 'border-border-subtle hover:border-slate-300 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header Row: Title, Badges, Pay */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Deep Link Target Indicator */}
                          {isHighlighted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black bg-secondary text-primary animate-pulse shadow-2xs">
                              <Sparkles className="w-3.5 h-3.5" />
                              🎯 Selected Opening
                            </span>
                          )}

                          {/* Priority Pill */}
                          {item.priority === 'High' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              🔴 High Priority
                            </span>
                          )}
                          {item.priority === 'Medium' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              🟠 Medium Priority
                            </span>
                          )}
                          {item.priority === 'Optional' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              🟡 Optional
                            </span>
                          )}

                          {/* Type Pill */}
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wider ${
                              isIntern
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.workType === 'Part-time'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {isIntern ? (
                              <GraduationCap className="w-3.5 h-3.5" />
                            ) : item.workType === 'Part-time' ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              <Briefcase className="w-3.5 h-3.5" />
                            )}
                            {item.workType || (isIntern ? 'Internship' : 'Full-Time')}
                          </span>

                          {/* Mode Pill */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-surface border border-border-subtle text-slate-700">
                            <MapPin className="w-3 h-3 text-secondary" />
                            On-site (Shikohabad)
                          </span>

                          {/* Gender Pill */}
                          {item.gender && item.gender.toLowerCase().includes('female') ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
                              <User className="w-3 h-3 text-pink-600" />
                              👩 Female Preferred
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-surface border border-border-subtle text-slate-600">
                              <Users className="w-3 h-3 text-text-muted" />
                              Gender: Any
                            </span>
                          )}

                          {/* Openings Pill */}
                          <span className="text-xs font-medium text-text-muted">
                            {item.openings} {item.openings === 1 ? 'Opening' : 'Openings'}
                          </span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-black text-primary group-hover:text-secondary transition-colors">
                          {item.title}
                        </h2>

                        <div className="flex items-center gap-3 text-xs text-text-muted font-medium flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-text-muted" />
                            {item.company || 'MSK Institute & Partners'}
                          </span>
                          <span>•</span>
                          <span>{item.department}</span>
                          <span>•</span>
                          <span>Exp: {item.experienceLevel}</span>
                        </div>
                      </div>

                      {/* Compensation Pill & Action */}
                      <div className="sm:text-right flex-shrink-0 space-y-1">
                        <div className="text-sm sm:text-base font-black text-emerald-600">
                          {item.stipendOrSalary}
                        </div>
                        {item.duration && (
                          <div className="text-xs text-text-muted flex sm:justify-end items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {item.shortDescription}
                    </p>

                    {/* Skills Tag Pills */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-lg border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Action Bar */}
                    <div className="pt-4 border-t border-border-subtle/80 flex items-center justify-between gap-3 flex-wrap">
                      <button
                        onClick={() => setExpandedCareerId(isExpanded ? null : item.id)}
                        className="text-xs font-bold text-text-muted hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            Hide Details
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            View Requirements & Perks
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenShareModal(item)}
                          className="px-3.5 py-2 rounded-xl bg-surface hover:bg-slate-100 border border-border-subtle text-primary font-bold text-xs sm:text-sm shadow-2xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Share this job opening with full details and direct link"
                        >
                          <Share2 className="w-3.5 h-3.5 text-secondary" />
                          <span>Share Job</span>
                        </button>

                        <button
                          onClick={() => handleOpenApplyModal(item)}
                          className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-light text-primary font-bold text-xs sm:text-sm shadow-2xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          Apply Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Job Specifications */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-dashed border-border-subtle space-y-4 animate-in fade-in duration-200">
                        {/* Description */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                            Role Overview
                          </h4>
                          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Responsibilities */}
                        {item.responsibilities && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                              Key Responsibilities
                            </h4>
                            <ul className="space-y-1.5 text-xs sm:text-sm text-text-muted">
                              {item.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Requirements */}
                        {item.requirements && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                              Eligibility & Requirements
                            </h4>
                            <ul className="space-y-1.5 text-xs sm:text-sm text-text-muted">
                              {item.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Perks */}
                        {item.perks && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                              Perks & Benefits
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                              {item.perks.map((perk, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 bg-surface rounded-xl border border-border-subtle"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                                  <span className="font-medium">{perk}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bottom Quick Apply inside expander */}
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleOpenApplyModal(item)}
                            className="px-4 py-2 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            Proceed to Apply for {item.title}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Career Assistance & Placement Ecosystem Feature */}
        <section className="mt-16 bg-white rounded-3xl border border-border-subtle p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-black uppercase tracking-wider">
              MSK Placement Cell
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-primary">
              Why Launch Your Tech Career Through MSK Institute?
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              We do not just teach syntax; we prepare you for real technical assessments, commercial repository workflows, and corporate interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-surface rounded-2xl border border-border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-primary">Resume & GitHub Polishing</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Receive personalized feedback on your CV, GitHub portfolio, and deployment links from Er. Sumit Kumar.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-2xl border border-border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-primary">Mock Technical Interviews</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Practice Live coding evaluations, algorithmic problem-solving in Python & JS, and HR interview round simulations.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-2xl border border-border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-primary">Verified Certificate & LOR</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Earn verifiable internship credentials with QR codes recognized by IT firms and university evaluators.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Application Modal */}
      {selectedCareerForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border-subtle max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => {
                setSelectedCareerForApply(null);
                setApplySuccessData(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {applySuccessData ? (
              /* Success & Direct WhatsApp Action Screen */
              <div className="text-center py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                    Application Logged Successfully
                  </span>
                  <h3 className="text-xl font-black text-primary pt-1">
                    Apply for {applySuccessData.jobTitle}
                  </h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                    Your details are registered! Click the button below to send your pre-filled application directly to the MSK Hiring Desk on WhatsApp.
                  </p>
                </div>

                {/* Primary WhatsApp Action Button (Unblockable by Popup Blockers) */}
                <div className="pt-2 space-y-2.5">
                  <a
                    href={applySuccessData.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5 fill-white" />
                    <span>Send Application on WhatsApp Now</span>
                  </a>

                  <div className="flex items-center justify-center gap-3 text-xs text-text-muted">
                    <span>Alternate link:</span>
                    <a
                      href={applySuccessData.waMeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary font-bold hover:underline"
                    >
                      Open via wa.me link
                    </a>
                  </div>
                </div>

                {/* Message preview and copy option */}
                <div className="p-3.5 bg-surface rounded-2xl border border-border-subtle text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-secondary" />
                      Application Message Preview:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(applySuccessData.msg);
                        setIsCopiedApplicationText(true);
                        toast.success('Application message copied!');
                        setTimeout(() => setIsCopiedApplicationText(false), 2500);
                      }}
                      className="text-[11px] font-bold text-secondary hover:text-secondary-dark flex items-center gap-1 cursor-pointer"
                    >
                      {isCopiedApplicationText ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-border-subtle/80 max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {applySuccessData.msg}
                  </pre>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCareerForApply(null);
                      setApplySuccessData(null);
                      setApplicantName('');
                      setApplicantPhone('');
                      setApplicantEmail('');
                      setApplicantCity('');
                      setApplicantPortfolio('');
                      setApplicantNote('');
                    }}
                    className="w-full py-2.5 bg-surface hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-border-subtle transition-colors cursor-pointer"
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            ) : (
              /* Application Form */
              <>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                    Direct Application
                  </span>
                  <h3 className="text-xl font-black text-primary">
                    Apply for {selectedCareerForApply.title}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {selectedCareerForApply.type === 'internship' ? 'Internship' : 'Full-time Position'} • {selectedCareerForApply.stipendOrSalary} • {selectedCareerForApply.location}
                  </p>
                </div>

                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. rahul@gmail.com"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Location / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Shikohabad, Firozabad, Agra"
                        value={applicantCity}
                        onChange={(e) => setApplicantCity(e.target.value)}
                        className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Status
                      </label>
                      <select
                        value={applicantStatus}
                        onChange={(e) => setApplicantStatus(e.target.value)}
                        className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none cursor-pointer"
                      >
                        <option value="College Student / Final Year">College Student / Final Year</option>
                        <option value="Recent Graduate (BCA/B.Tech/B.Sc)">Recent Graduate (BCA/B.Tech/B.Sc)</option>
                        <option value="MSK Institute Certified Student">MSK Institute Student</option>
                        <option value="Working Professional">Working Professional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GitHub / LinkedIn / Portfolio / Resume Link
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="https://github.com/your-profile or Google Drive link"
                        value={applicantPortfolio}
                        onChange={(e) => setApplicantPortfolio(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Why are you interested in this role?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share a brief overview of your projects, skills, and availability..."
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="w-full py-3 bg-secondary hover:bg-secondary-light text-primary font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isApplying ? (
                        'Submitting Application...'
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Application via WhatsApp
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-text-muted text-center mt-2">
                      🔒 Your application is recorded securely and sent to MSK Institute's hiring desk.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recruiter Modal */}
      {isRecruiterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border-subtle max-w-md w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsRecruiterModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                Recruiter Partnership
              </span>
              <h3 className="text-xl font-black text-primary">
                Hire Job-Ready Developers
              </h3>
              <p className="text-xs text-text-muted">
                Connect directly with trained developers in Python, MERN Stack, Frontend, and Cyber Security.
              </p>
            </div>

            <form onSubmit={handleRecruiterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Technologies Ltd."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recruiter / HR Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Singhal"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={recruiterPhone}
                  onChange={(e) => setRecruiterPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Roles You Are Looking to Hire
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python Interns, React Developers, Lab Faculty"
                  value={recruiterRoleRequired}
                  onChange={(e) => setRecruiterRoleRequired(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs sm:text-sm text-primary focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-secondary" />
                  Connect with MSK Placement Cell
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Job Modal */}
      {selectedCareerForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border-subtle max-w-md w-full p-5 sm:p-6 space-y-4 relative shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCareerForShare(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close share dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1 pr-7">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    Share Job Opening
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-primary leading-snug">
                    {selectedCareerForShare.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed pt-0.5">
                Share this opportunity with candidates or groups. The complete role details, salary/stipend, and application link are included.
              </p>
            </div>

            {/* Job Summary Highlight Card */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-subtle/80 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-primary flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-secondary" />
                  On-site (Shikohabad Campus)
                </span>
                <span className="text-text-muted font-medium">
                  {selectedCareerForShare.workType || (selectedCareerForShare.type === 'internship' ? 'Internship' : 'Full-time')} • {selectedCareerForShare.department}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-black text-emerald-600 block text-xs sm:text-sm">
                  {selectedCareerForShare.stipendOrSalary}
                </span>
                <span className="text-[10px] text-text-muted">
                  {selectedCareerForShare.openings} {selectedCareerForShare.openings === 1 ? 'Opening' : 'Openings'}
                </span>
              </div>
            </div>

            {/* Direct Job Application Link Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-600 flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-secondary" />
                  Direct Job Link:
                </span>
                {isCopiedLinkOnly && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Link Copied!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 p-1.5 pl-3 bg-surface rounded-xl border border-border-subtle hover:border-slate-300 focus-within:border-secondary transition-colors">
                <Globe className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : 'https://www.mskinstitute.in'}/careers#${selectedCareerForShare.id}`}
                  className="w-full bg-transparent text-xs text-slate-700 font-mono select-all focus:outline-none truncate"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={handleCopyLinkOnly}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-light text-white font-bold text-xs transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-2xs"
                  title="Copy direct job link"
                >
                  {isCopiedLinkOnly ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleShareViaWhatsApp}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Share via WhatsApp (Details & Link)</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Copy Full Info Button */}
                <button
                  type="button"
                  onClick={handleCopyShareContent}
                  className="py-2.5 px-3 bg-surface hover:bg-slate-100 border border-border-subtle text-primary font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isCopiedShareText ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied Details!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-secondary" />
                      <span>Copy Full Details</span>
                    </>
                  )}
                </button>

                {/* More / System Share Button */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-2.5 px-3 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-secondary" />
                  <span>More Options</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => {
            const el = document.getElementById('listings-container');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-white shadow-xl hover:bg-primary-light hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/20"
          aria-label="Back to top of openings"
          title="Back to top of openings"
        >
          <ArrowUp className="w-5 h-5 text-secondary" />
        </button>
      )}
    </div>
  );
}
