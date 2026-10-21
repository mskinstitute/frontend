'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, CheckCircle2, Laptop, Award, PhoneCall, 
  Send, MessageCircle, Clock, ShieldCheck, UserCheck, 
  Globe, MapPin, Calendar, BookOpen, HelpCircle, ChevronDown,
  Copy, ExternalLink, ArrowRight, User, Mail, Compass,
  Search, X, LayoutGrid, AlertTriangle, Flame
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Course, LiveBatch } from '@/types';
import { trackFormStart, trackFormSubmit, trackGenerateLead, trackDemoRequest } from '@/lib/dataLayer';
import { useAuth } from '@/context/AuthContext';
import { affiliateApi, StudentJourney } from '@/services/affiliateApi';

export interface CourseOptionItem {
  id: string;
  title: string;
  duration: string;
  fullLabel: string; // format: course name - duration or batch name - starts
  category?: string;
  level?: string;
  isBatch?: boolean;
  batchId?: string;
  startDate?: string;
  schedule?: string;
  price?: string;
  seatsLeft?: number;
  totalSeats?: number;
  courseTitle?: string;
}

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning Batch', time: '08:00 AM - 10:00 AM', desc: 'Ideal for early learners & college students' },
  { id: 'late_morning', label: 'Mid-Day Batch', time: '10:30 AM - 12:30 PM', desc: 'Classroom lab & live interactive cohort' },
  { id: 'afternoon', label: 'Afternoon Batch', time: '02:00 PM - 04:00 PM', desc: 'Intensive hands-on coding & practice' },
  { id: 'evening', label: 'Evening Batch', time: '05:00 PM - 07:00 PM', desc: 'Popular for school & working students' },
  { id: 'weekend', label: 'Weekend Cohort', time: 'Sat - Sun (04:00 PM - 07:00 PM)', desc: 'Accelerated weekend learning' }
];

const BACKGROUND_OPTIONS = [
  'Complete Beginner (First Time Coding)',
  'School Student (Class 9th - 12th)',
  'College Student (BCA / B.Tech / B.Sc / Diploma)',
  'Working Professional / Career Transition',
  'Job Aspirant (Preparing for UP Govt / Competitive Exams)'
];

interface BookDemoClientProps {
  courses?: Course[];
  batches?: LiveBatch[];
}

function BookDemoFormContent({ courses = [], batches = [] }: BookDemoClientProps) {
  const searchParams = useSearchParams();

  // Extract query params for pre-filling
  const initialCourse = searchParams.get('course') || searchParams.get('c') || '';
  const initialMode = searchParams.get('mode')?.toUpperCase() === 'OFFLINE' ? 'OFFLINE' : 'ONLINE';
  const initialBatch = searchParams.get('batch') || '';

  // Consolidate rich course list with duration
  const courseOptions: CourseOptionItem[] = useMemo(() => {
    const map = new Map<string, CourseOptionItem>();

    const baseList: { title: string; duration: string; category?: string }[] = [
      { title: 'Python Programming Masterclass', duration: '3 Months', category: 'Programming & Data' },
      { title: 'Full-Stack Web Development (MERN Stack)', duration: '6 Months', category: 'Web Architecture' },
      { title: 'NIELIT CCC (Basic Computer Course)', duration: '3 Months', category: 'Govt Certified' },
      { title: 'ADCA (1-Year Advanced Computer Diploma)', duration: '12 Months', category: '1-Year Diploma' },
      { title: 'Data Analysis & Python Mastery', duration: '4 Months', category: 'Data & Analytics' },
      { title: 'Java Programming & OOPs', duration: '3 Months', category: 'Software Development' },
      { title: 'C & C++ with Data Structures & Algorithms', duration: '3 Months', category: 'Core CS & DSA' },
      { title: 'Tally Prime + GST & Financial Accounting', duration: '3 Months', category: 'Commerce & Accounting' },
      { title: 'Basic Computer, MS Office & Internet', duration: '2 Months', category: 'Foundational IT' },
      { title: 'Cyber Security & Ethical Hacking', duration: '18 Months', category: 'Security' },
    ];

    baseList.forEach(item => {
      map.set(item.title.toLowerCase(), {
        id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: item.title,
        duration: item.duration,
        fullLabel: `${item.title} - ${item.duration}`,
        category: item.category,
      });
    });

    courses.forEach(c => {
      if (!c.title) return;
      let cleanTitle = c.title.trim();
      let durationStr = '3 Months';

      if (c.duration && c.duration.value) {
        const val = c.duration.value;
        const unit = (c.duration.unit || 'MONTHS').toUpperCase();
        if (unit === 'DAYS') durationStr = `${val} ${val === 1 ? 'Day' : 'Days'}`;
        else if (unit === 'HOURS') durationStr = `${val} ${val === 1 ? 'Hour' : 'Hours'}`;
        else if (unit === 'YEARS' || (unit === 'MONTHS' && val === 12)) durationStr = '12 Months';
        else durationStr = `${val} ${val === 1 ? 'Month' : 'Months'}`;
      }

      // Strip existing trailing " - X Months" suffix from title if already present
      const suffixRegex = /\s*-\s*\d+\s*(months?|days?|hours?|years?)\s*$/i;
      if (suffixRegex.test(cleanTitle)) {
        cleanTitle = cleanTitle.replace(suffixRegex, '').trim();
      }

      const key = cleanTitle.toLowerCase();
      map.set(key, {
        id: c.id || key.replace(/[^a-z0-9]+/g, '-'),
        title: cleanTitle,
        duration: durationStr,
        fullLabel: `${cleanTitle} - ${durationStr}`,
        category: c.categories && c.categories.length > 0 ? c.categories[0] : undefined,
        level: c.level,
      });
    });

    return Array.from(map.values());
  }, [courses]);

  // Auth Context & Student State
  const { user, isAuthenticated } = useAuth();
  const [studentJourney, setStudentJourney] = useState<StudentJourney | null>(null);
  const [loadingJourney, setLoadingJourney] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  // Derived student information when authenticated
  const studentFullName = useMemo(() => {
    if (!user) return '';
    const full = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return full || user.username || '';
  }, [user]);

  const studentPhone = user?.phone || '';
  const studentEmail = user?.email || '';
  const studentCity = user?.address || (initialMode === 'OFFLINE' ? 'Shikohabad' : 'Online');

  // Load student journey if authenticated to detect active bookings
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingJourney(true);
      affiliateApi.getStudentJourney()
        .then((data) => setStudentJourney(data))
        .catch(() => {})
        .finally(() => setLoadingJourney(false));
    } else {
      setStudentJourney(null);
    }
  }, [isAuthenticated]);

  // Pre-fill state when authenticated user is present
  useEffect(() => {
    if (isAuthenticated && user) {
      if (studentFullName) setName(studentFullName);
      if (studentPhone) setPhone(studentPhone);
      if (studentEmail) setEmail(studentEmail);
      if (studentCity) setCity(studentCity);
    }
  }, [isAuthenticated, user, studentFullName, studentPhone, studentEmail, studentCity]);

  const activeDemo = studentJourney?.demo_booking;
  const hasActiveDemo = Boolean(activeDemo && ['SCHEDULED', 'DAY1_DONE', 'DAY2_DONE'].includes(activeDemo.status));

  // Search course / batch state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Client batches with fallback fetch
  const [clientBatches, setClientBatches] = useState<LiveBatch[]>(batches || []);

  useEffect(() => {
    if (batches && batches.length > 0) {
      setClientBatches(batches);
    } else {
      fetch('/api/live-batches')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setClientBatches(data);
          }
        })
        .catch(() => {});
    }
  }, [batches]);

  // Consolidate rich upcoming batch options
  const batchOptions: CourseOptionItem[] = useMemo(() => {
    const list: CourseOptionItem[] = [];
    const sourceBatches = clientBatches.length > 0 ? clientBatches : (batches || []);

    sourceBatches.forEach((b) => {
      if (b.status === 'COMPLETED' || b.status === 'ARCHIVED') return;

      const formattedStartDate = (() => {
        try {
          const d = new Date(b.startDate);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          }
        } catch {}
        return b.startDate || 'Upcoming';
      })();

      const dur = b.duration || 'Live Batch';

      list.push({
        id: b.id,
        title: b.title,
        duration: dur,
        fullLabel: `${b.title} - Starts ${formattedStartDate}`,
        category: b.schedule ? `Starts ${formattedStartDate} • ${b.schedule}` : `Starts ${formattedStartDate}`,
        isBatch: true,
        batchId: b.id,
        startDate: formattedStartDate,
        schedule: b.schedule,
        price: b.price,
        seatsLeft: b.leftSeats,
        totalSeats: b.totalSeats,
        courseTitle: b.courseTitle || b.title,
      });
    });

    return list;
  }, [clientBatches, batches]);

  const [selectedCourseItem, setSelectedCourseItem] = useState<CourseOptionItem>(() => {
    // 1. If batch parameter is given, prioritize matching in batchOptions
    if (initialBatch && batchOptions.length > 0) {
      const bNorm = initialBatch.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const match = batchOptions.find(
        (b) =>
          b.id.toLowerCase() === initialBatch.toLowerCase() ||
          b.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') === bNorm ||
          b.id.toLowerCase().includes(initialBatch.toLowerCase()) ||
          initialBatch.toLowerCase().includes(b.id.toLowerCase())
      );
      if (match) return match;
    }

    // 2. If course parameter is given, check batchOptions then courseOptions
    if (initialCourse) {
      const cNorm = initialCourse.toLowerCase().trim();
      const batchMatch = batchOptions.find(
        (b) =>
          b.title.toLowerCase().includes(cNorm) ||
          (b.courseTitle && b.courseTitle.toLowerCase().includes(cNorm)) ||
          cNorm.includes(b.title.toLowerCase())
      );
      if (batchMatch) return batchMatch;

      const courseMatch = courseOptions.find(
        (c) =>
          c.title.toLowerCase() === cNorm ||
          c.title.toLowerCase().includes(cNorm) ||
          cNorm.includes(c.title.toLowerCase())
      );
      if (courseMatch) return courseMatch;
    }

    // 3. Prioritize upcoming batch first if available
    if (batchOptions.length > 0) {
      return batchOptions[0];
    }

    return (
      courseOptions[0] || {
        id: 'default',
        title: 'Python Programming Masterclass',
        duration: '3 Months',
        fullLabel: 'Python Programming Masterclass - 3 Months',
      }
    );
  });

  const selectedCourse = selectedCourseItem.fullLabel;

  const [learningMode, setLearningMode] = useState<'ONLINE' | 'OFFLINE'>(initialMode);
  const [preferredSlot, setPreferredSlot] = useState(TIME_SLOTS[0].time);
  const [dateChoice, setDateChoice] = useState<'tomorrow' | 'weekend' | 'monday' | 'custom'>('tomorrow');
  const [customDate, setCustomDate] = useState('');
  const [background, setBackground] = useState(BACKGROUND_OPTIONS[0]);
  const [queryNotes, setQueryNotes] = useState(initialBatch ? `Interested in Live Batch: ${initialBatch}` : '');
  
  // UI & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<{
    leadId: string;
    whatsappUrl: string;
    formattedWhatsAppMessage: string;
    submittedDate: string;
  } | null>(null);

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [hasCopied, setHasCopied] = useState(false);

  // Sync param updates if navigated with new params or when batch options load
  useEffect(() => {
    if (initialBatch && batchOptions.length > 0) {
      const bNorm = initialBatch.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const match = batchOptions.find(
        (b) =>
          b.id.toLowerCase() === initialBatch.toLowerCase() ||
          b.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') === bNorm ||
          b.id.toLowerCase().includes(initialBatch.toLowerCase()) ||
          initialBatch.toLowerCase().includes(b.id.toLowerCase())
      );
      if (match) {
        setSelectedCourseItem(match);
        return;
      }
    }

    if (initialCourse) {
      const cNorm = initialCourse.toLowerCase().trim();
      const batchMatch = batchOptions.find(
        (b) =>
          b.title.toLowerCase().includes(cNorm) ||
          (b.courseTitle && b.courseTitle.toLowerCase().includes(cNorm)) ||
          cNorm.includes(b.title.toLowerCase())
      );
      if (batchMatch) {
        setSelectedCourseItem(batchMatch);
        return;
      }

      if (courseOptions.length > 0) {
        const match = courseOptions.find(
          (c) =>
            c.title.toLowerCase() === cNorm ||
            c.title.toLowerCase().includes(cNorm) ||
            cNorm.includes(c.title.toLowerCase())
        );
        if (match) {
          setSelectedCourseItem(match);
          return;
        }
      }
    }

    // If no initial query param and currently selected is default/placeholder, pick first upcoming batch
    if (!initialBatch && !initialCourse && batchOptions.length > 0 && selectedCourseItem.id === 'default') {
      setSelectedCourseItem(batchOptions[0]);
    }

    if (initialMode) {
      setLearningMode(initialMode);
    }
  }, [initialBatch, initialCourse, initialMode, batchOptions, courseOptions, selectedCourseItem.id]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered upcoming batches based on search query (FIRST)
  const filteredBatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return batchOptions;
    return batchOptions.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.courseTitle && b.courseTitle.toLowerCase().includes(q)) ||
        b.duration.toLowerCase().includes(q) ||
        b.fullLabel.toLowerCase().includes(q) ||
        (b.schedule && b.schedule.toLowerCase().includes(q)) ||
        (b.startDate && b.startDate.toLowerCase().includes(q))
    );
  }, [searchQuery, batchOptions]);

  // Filtered courses based on search query (AFTER UPCOMING BATCHES)
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return courseOptions;
    return courseOptions.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.duration.toLowerCase().includes(q) ||
        c.fullLabel.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q))
    );
  }, [searchQuery, courseOptions]);

  // Compute actual date string
  const resolvedDateString = useMemo(() => {
    const now = new Date();
    if (dateChoice === 'custom' && customDate) {
      return customDate;
    }
    if (dateChoice === 'weekend') {
      // Find next Saturday
      const day = now.getDay();
      const diff = day <= 6 ? (6 - day) : 0;
      const target = new Date(now);
      target.setDate(now.getDate() + (diff === 0 ? 7 : diff));
      return target.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (dateChoice === 'monday') {
      const day = now.getDay();
      const diff = (1 + 7 - day) % 7 || 7;
      const target = new Date(now);
      target.setDate(now.getDate() + diff);
      return target.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    // Default: Tomorrow
    const target = new Date(now);
    target.setDate(now.getDate() + 1);
    return target.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }, [dateChoice, customDate]);

  // Compute ISO date string (YYYY-MM-DD) for backend Django database
  const dateIsoString = useMemo(() => {
    const now = new Date();
    if (dateChoice === 'custom' && customDate) {
      return customDate;
    }
    const target = new Date(now);
    if (dateChoice === 'weekend') {
      const day = now.getDay();
      const diff = day <= 6 ? (6 - day) : 0;
      target.setDate(now.getDate() + (diff === 0 ? 7 : diff));
    } else if (dateChoice === 'monday') {
      const day = now.getDay();
      const diff = (1 + 7 - day) % 7 || 7;
      target.setDate(now.getDate() + diff);
    } else {
      // Default: Tomorrow
      target.setDate(now.getDate() + 1);
    }
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    return `${year}-${month}-${d}`;
  }, [dateChoice, customDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine effective student information
    const effectiveName = (isAuthenticated && user ? studentFullName : name).trim();
    const rawPhone = isAuthenticated && user ? (user.phone || phone) : phone;
    const cleanPhone = (rawPhone || '').replace(/[^\d]/g, '');
    const effectiveEmail = (isAuthenticated && user ? (user.email || email) : email).trim();
    const effectiveCity = (isAuthenticated && user ? (user.address || city) : city).trim() || (learningMode === 'OFFLINE' ? 'Shikohabad' : 'Online');

    if (!effectiveName) {
      toast.error('Please enter your Full Name');
      return;
    }

    if (cleanPhone.length < 10) {
      toast.error('Please provide a valid 10-digit WhatsApp mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. If student is logged in, assign demo class directly to their account in Django backend
      if (isAuthenticated) {
        try {
          await affiliateApi.bookDemo({
            course_name: selectedCourse,
            learning_mode: learningMode,
            preferred_slot: preferredSlot,
            scheduled_date: dateIsoString,
            notes: queryNotes.trim() ? `${queryNotes.trim()} [Background: ${background}]` : `Background: ${background}`,
          });
        } catch (demoErr: any) {
          toast.error(demoErr.message || 'Could not assign demo class to your student account.');
          setIsSubmitting(false);
          return;
        }
      }

      // Capture affiliate referral code if stored in cookie or localStorage
      let referralCode = '';
      if (typeof window !== 'undefined') {
        referralCode = localStorage.getItem('msk_ref_code') || '';
        if (!referralCode) {
          const match = document.cookie.match(/(?:^|; )msk_ref_code=([^;]*)/);
          if (match) referralCode = decodeURIComponent(match[1]);
        }
      }

      const payload = {
        name: effectiveName,
        phone: cleanPhone,
        email: effectiveEmail,
        city: effectiveCity,
        learningMode,
        courseTitle: selectedCourseItem.courseTitle || selectedCourseItem.title,
        batchTitle: selectedCourseItem.isBatch
          ? `Free Demo - ${selectedCourseItem.title}`
          : `Free 2-Day Demo - ${selectedCourseItem.title}`,
        batchId: selectedCourseItem.isBatch ? selectedCourseItem.batchId : undefined,
        preferredDate: resolvedDateString,
        preferredSlot,
        studentBackground: background,
        query: selectedCourseItem.isBatch
          ? `${queryNotes.trim()} [Upcoming Batch Demo: ${selectedCourseItem.title}, Starts: ${selectedCourseItem.startDate}, Schedule: ${selectedCourseItem.schedule || 'N/A'}]`.trim()
          : queryNotes.trim(),
        bookingType: 'FREE_DEMO_CLASS',
        referralCode,
        utm_source: 'book_demo_page',
        utm_medium: isAuthenticated ? 'authenticated_student' : 'direct_booking',
        utm_campaign: selectedCourseItem.isBatch ? 'upcoming_batch_demo' : 'free_demo_trial',
        userId: user?.id,
        isStudentLoggedIn: Boolean(isAuthenticated),
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('msk_has_demo_booking', 'true');
          window.dispatchEvent(new Event('msk_demo_booked'));
        }
        // Analytics
        trackFormSubmit('free_demo_page_booking', { course_name: selectedCourse });
        trackGenerateLead('free_demo_page', {
          course_name: selectedCourse,
          learning_mode: learningMode,
          preferred_date: resolvedDateString,
        });
        trackDemoRequest({
          courseName: selectedCourse,
          preferredDate: resolvedDateString,
        });

        const respData = {
          leadId: data.leadId || `MSK-${Date.now().toString().slice(-6)}`,
          whatsappUrl: data.whatsappUrl,
          formattedWhatsAppMessage: data.formattedWhatsAppMessage,
          submittedDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };

        setBookingResponse(respData);
        setIsSubmitted(true);
        toast.success(
          isAuthenticated
            ? '🎉 Free demo class reserved and assigned to your student account!'
            : 'Demo class reserved! Opening WhatsApp to send your details...'
        );

        // Try automatic WhatsApp dispatch
        if (typeof window !== 'undefined' && data.whatsappUrl) {
          try {
            window.open(data.whatsappUrl, '_blank');
          } catch (e) {
            console.log('Popup blocked, student can use the one-click button.', e);
          }
        }
      } else {
        toast.error(data.error || 'Failed to submit demo booking. Please try again.');
      }
    } catch (err: any) {
      console.error('Demo booking submission error:', err);
      toast.error(err.message || 'Network error. You can still WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    if (bookingResponse?.formattedWhatsAppMessage) {
      navigator.clipboard.writeText(bookingResponse.formattedWhatsAppMessage);
      setHasCopied(true);
      toast.success('WhatsApp booking details copied to clipboard!');
      setTimeout(() => setHasCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Header Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071E3D] via-[#0F172A] to-[#1E293B] text-white p-6 sm:p-10 lg:p-14 border border-white/10 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF8533] text-xs font-black uppercase tracking-wider shadow-inner">
            <Sparkles className="w-4 h-4 text-[#FF8533] animate-pulse" />
            <span>
              {isAuthenticated && user
                ? '100% Free 2-Day Trial • Linked To Student Account • Zero Admission Fee'
                : '100% Free 2-Day Trial • No Login Required • Zero Admission Fee'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Book Your Free <span className="text-[#FF8533]">Live Demo Class</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience our practical, project-first teaching methodology before you pay any fee.
            Attend 2 full sessions <strong>Online Live</strong> via Google Meet or in-person at our 
            <strong> Shikohabad Computer Lab</strong> with <strong>Er. Sumit Kumar</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs text-gray-300 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant WhatsApp Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#FF8533]" />
              <span>Dedicated Workstation / Screen Sharing</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>1-on-1 Doubt Clarification</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>No Prior Experience Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Form vs Demo Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form / Success Card (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200/90 relative overflow-hidden">
            {isSubmitted && bookingResponse ? (
              /* Success / WhatsApp Dispatch State */
              <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Seat Reserved Successfully
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {isAuthenticated ? `Demo Class Assigned, ${studentFullName || name}!` : `Demo Class Reserved, ${name}!`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {isAuthenticated
                      ? 'Your demo seat has been reserved and linked directly to your student account. Send the WhatsApp confirmation to receive your Google Meet link or Lab Entry Pass.'
                      : 'Your demo pass has been generated. Please send the WhatsApp confirmation to Er. Sumit Kumar to receive your Google Meet link or Lab Entry Pass.'}
                  </p>
                </div>

                {/* Actions: Big WhatsApp CTA + Dashboard Link */}
                <div className="pt-2 space-y-3">
                  <a
                    href={bookingResponse.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer animate-pulse"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Send WhatsApp Message to Confirm Now</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                  {isAuthenticated && (
                    <Link
                      href="/dashboard/student"
                      className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer"
                    >
                      <LayoutGrid className="w-4 h-4 text-cyan-400" />
                      <span>View in Student Dashboard & Track Demo Progress</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <p className="text-[11px] text-slate-400">
                    Tapping this will open WhatsApp directly with all your details pre-filled.
                  </p>
                </div>

                {/* Digital Demo Pass Preview Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#FF6B00]" />
                      <span className="text-xs font-black uppercase text-slate-900">
                        MSK Free Demo Class Pass
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      ID: #{bookingResponse.leadId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Name</span>
                      <strong className="text-slate-800">{name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">WhatsApp</span>
                      <strong className="text-slate-800">+91 {phone}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Course</span>
                      <strong className="text-[#FF6B00]">{selectedCourse}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Learning Mode</span>
                      <strong className="text-slate-800">
                        {learningMode === 'ONLINE' ? '🌐 Online Live Class' : '🏢 In-Person Lab (Shikohabad)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Scheduled Date</span>
                      <strong className="text-slate-800">{resolvedDateString}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Preferred Slot</span>
                      <strong className="text-slate-800">{preferredSlot}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions: Copy message & Call Helpline */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>{hasCopied ? 'Copied to Clipboard!' : 'Copy WhatsApp Message'}</span>
                  </button>

                  <a
                    href="tel:+918393042166"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-[#FF6B00]" />
                    <span>Call Helpline: +91 83930 42166</span>
                  </a>
                </div>

                {/* Reset button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setBookingResponse(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                  >
                    ← Book another demo or modify details
                  </button>
                </div>
              </div>
            ) : (
              /* The Booking Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  {hasActiveDemo && activeDemo && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <div className="font-extrabold text-amber-950">
                          Active Demo in Progress: {activeDemo.course_name}
                        </div>
                        <p className="text-amber-800 leading-relaxed">
                          You currently have an active demo booking ({activeDemo.status}) scheduled for {activeDemo.scheduled_date || 'upcoming session'} ({activeDemo.learning_mode}). You can track or attend your sessions directly from your student portal.
                        </p>
                        <div className="pt-1">
                          <Link
                            href="/dashboard/student"
                            className="inline-flex items-center gap-1.5 font-black text-amber-900 hover:text-amber-950 underline"
                          >
                            <span>Open Student Dashboard</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Reserve Your Free Seat
                    </h2>
                    {isAuthenticated && user ? (
                      <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          Logged in as <strong>{studentFullName}</strong>. Your 2-day trial will be assigned directly to your student account.
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-1">
                        No login required. Fill the details below to lock your 2-day practical trial.{' '}
                        <Link href="/login?redirect=/book-demo" className="text-[#FF6B00] font-bold hover:underline ml-1">
                          Already a student? Log in ➔
                        </Link>
                      </p>
                    )}
                  </div>
                </div>

                {/* 1. Mode Selector Pill */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    1. Choose Learning Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setLearningMode('ONLINE')}
                      className={`py-3 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        learningMode === 'ONLINE'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>🌐 Online Live Class</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLearningMode('OFFLINE')}
                      className={`py-3 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        learningMode === 'OFFLINE'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Laptop className="w-4 h-4 text-[#FF8533]" />
                      <span>🏢 In-Person Lab (Shikohabad)</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-1">
                    {learningMode === 'ONLINE'
                      ? 'Live interactive class with screen sharing and voice Q&A. Join from your phone or laptop.'
                      : 'Hands-on practice at MSK Institute Lab, Station Road, Shikohabad. Dedicated PC provided.'}
                  </p>
                </div>

                {/* 2. Search & Select Course For Demo */}
                <div className="space-y-1.5" ref={dropdownRef}>
                  <label htmlFor="course-search-input" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    2. Search & Select Course <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    {/* Search Input Box */}
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        id="course-search-input"
                        type="text"
                        autoComplete="off"
                        value={isDropdownOpen ? searchQuery : selectedCourseItem.fullLabel}
                        onFocus={() => {
                          setIsDropdownOpen(true);
                          setSearchQuery('');
                        }}
                        onClick={() => {
                          if (!isDropdownOpen) {
                            setIsDropdownOpen(true);
                            setSearchQuery('');
                          }
                        }}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (!isDropdownOpen) setIsDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setIsDropdownOpen(false);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            if (filteredBatches.length > 0) {
                              setSelectedCourseItem(filteredBatches[0]);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            } else if (filteredCourses.length > 0) {
                              setSelectedCourseItem(filteredCourses[0]);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }
                          }
                        }}
                        placeholder="Search upcoming batch or course (e.g. Python, MERN, 3 Months)..."
                        className="w-full pl-10 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all cursor-pointer"
                      />

                      <div className="absolute right-2.5 flex items-center gap-1">
                        {isDropdownOpen && searchQuery && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery('');
                            }}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
                            title="Clear search"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isDropdownOpen ? 'rotate-180 text-[#FF6B00]' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Floating Dropdown Results */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Dropdown Header */}
                        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                          <span>
                            {filteredBatches.length > 0 && (
                              <span className="text-[#FF6B00] font-black mr-1">
                                {filteredBatches.length} upcoming {filteredBatches.length === 1 ? 'batch' : 'batches'} •
                              </span>
                            )}
                            {filteredCourses.length}{' '}
                            {filteredCourses.length === 1 ? 'course available' : 'courses available'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Format: Batch / Course - Duration</span>
                        </div>

                        {/* List Container */}
                        <div className="max-h-72 overflow-y-auto p-1.5 space-y-2.5">
                          {/* 1. UPCOMING LIVE BATCHES (DISPLAYED FIRST) */}
                          {filteredBatches.length > 0 && (
                            <div className="space-y-1">
                              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#B83A00] bg-orange-50/90 rounded-lg flex items-center justify-between border border-orange-100">
                                <span className="flex items-center gap-1.5">
                                  <Flame className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                                  Upcoming Live Batches (Fast Filling)
                                </span>
                                <span className="text-[9px] font-extrabold text-white bg-[#FF6B00] px-1.5 py-0.2 rounded shadow-xs">
                                  Priority Demo
                                </span>
                              </div>

                              {filteredBatches.map((b) => {
                                const isSelected = selectedCourseItem.id === b.id;
                                return (
                                  <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCourseItem(b);
                                      setIsDropdownOpen(false);
                                      setSearchQuery('');
                                    }}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                      isSelected
                                        ? 'bg-orange-50 border-2 border-[#FF6B00] text-[#FF6B00] shadow-xs'
                                        : 'bg-white hover:bg-orange-50/50 border border-orange-100/80 text-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className={`p-1.5 rounded-lg shrink-0 ${
                                        isSelected ? 'bg-[#FF6B00] text-white' : 'bg-orange-100 text-[#FF6B00]'
                                      }`}>
                                        <Flame className="w-4 h-4 fill-current" />
                                      </div>
                                      <div className="truncate">
                                        <div className="text-xs sm:text-sm font-black truncate flex items-center gap-1.5">
                                          <span className="text-slate-900">{b.title}</span>
                                          <span className="text-[10px] font-extrabold text-[#B83A00] bg-orange-100 px-1.5 py-0.5 rounded shrink-0">
                                            Starts {b.startDate}
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                          {b.schedule && <span className="truncate">{b.schedule}</span>}
                                          {b.seatsLeft !== undefined && (
                                            <span className="text-red-600 font-bold text-[10px] shrink-0">
                                              • {b.seatsLeft} seats left
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase shadow-xs">
                                        Live Batch
                                      </span>
                                      {isSelected && (
                                        <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* 2. REGULAR COURSES (DISPLAYED AFTER UPCOMING BATCHES) */}
                          {filteredCourses.length > 0 && (
                            <div className="space-y-1">
                              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100/90 rounded-lg flex items-center justify-between border border-slate-200/60">
                                <span className="flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                  All Regular Courses
                                </span>
                                <span className="text-[9px] font-semibold text-slate-500">
                                  Online & Lab
                                </span>
                              </div>

                              {filteredCourses.map((c) => {
                                const isSelected = selectedCourseItem.id === c.id;
                                return (
                                  <button
                                    key={c.id || c.title}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCourseItem(c);
                                      setIsDropdownOpen(false);
                                      setSearchQuery('');
                                    }}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                      isSelected
                                        ? 'bg-orange-50/90 border border-orange-200 text-[#FF6B00]'
                                        : 'hover:bg-slate-50 text-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <BookOpen
                                        className={`w-4 h-4 shrink-0 ${
                                          isSelected ? 'text-[#FF6B00]' : 'text-slate-400'
                                        }`}
                                      />
                                      <div className="truncate">
                                        <div className="text-xs sm:text-sm font-bold truncate">
                                          <span>{c.title}</span>
                                          <span className="mx-1.5 text-slate-300 font-normal">-</span>
                                          <span className="font-extrabold text-[#FF6B00]">{c.duration}</span>
                                        </div>
                                        {c.category && (
                                          <span className="text-[10px] text-slate-400 block truncate">
                                            {c.category}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                                        {c.duration}
                                      </span>
                                      {isSelected && (
                                        <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Empty State */}
                          {filteredBatches.length === 0 && filteredCourses.length === 0 && (
                            <div className="p-4 text-center space-y-2">
                              <p className="text-xs font-bold text-slate-700">
                                No live batches or courses found for &quot;{searchQuery}&quot;
                              </p>
                              <p className="text-[11px] text-slate-400">
                                You can choose this custom topic or pick one from our popular tracks.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCourseItem({
                                    id: 'custom-topic',
                                    title: searchQuery.trim(),
                                    duration: 'Flexible Duration',
                                    fullLabel: `${searchQuery.trim()} - Flexible Duration`,
                                  });
                                  setIsDropdownOpen(false);
                                  setSearchQuery('');
                                }}
                                className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-[#FF6B00] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                Select &quot;{searchQuery.trim()} - Flexible Duration&quot;
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Selected Course / Batch Confirmation Badge */}
                  <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs mt-2 transition-all ${
                    selectedCourseItem.isBatch
                      ? 'bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50 border-orange-300 shadow-xs'
                      : 'bg-orange-50/80 border-orange-200/80'
                  }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                        selectedCourseItem.isBatch
                          ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs flex items-center gap-1'
                          : 'text-[#FF6B00] bg-white border-orange-200'
                      }`}>
                        {selectedCourseItem.isBatch && <Flame className="w-3 h-3 fill-white" />}
                        {selectedCourseItem.isBatch ? 'Selected Live Batch' : 'Selected Course'}
                      </span>
                      <span className="font-extrabold text-slate-900 truncate">
                        {selectedCourseItem.title}{' '}
                        <span className="text-[#FF6B00] font-bold">
                          {selectedCourseItem.isBatch
                            ? `(Starts: ${selectedCourseItem.startDate}${selectedCourseItem.schedule ? ` • ${selectedCourseItem.schedule}` : ''})`
                            : `(${selectedCourseItem.duration})`}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(true);
                        setSearchQuery('');
                      }}
                      className="text-[11px] font-black text-[#FF6B00] hover:underline shrink-0 ml-2 cursor-pointer"
                    >
                      Change ➔
                    </button>
                  </div>
                </div>

                {/* 3. Student Information: Auto-detected if Logged In, otherwise Input Fields */}
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                        3. Student Information
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Auto-detected from Account
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-slate-50 to-teal-50/50 border border-emerald-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-emerald-200/70">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FF8533] text-white flex items-center justify-center font-black text-sm uppercase shadow-xs">
                            {user.first_name ? user.first_name[0] : (user.username ? user.username[0] : 'S')}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">
                              {studentFullName}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Student ID: #{user.id} • Registered Student
                            </div>
                          </div>
                        </div>

                        <Link
                          href="/profile"
                          className="text-[11px] font-extrabold text-[#FF6B00] hover:text-[#e56000] hover:underline"
                        >
                          Edit Profile
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            WhatsApp Mobile Number
                          </span>
                          <strong className="text-slate-800 text-xs sm:text-sm font-extrabold block truncate">
                            {user.phone ? `+91 ${user.phone}` : 'No phone linked'}
                          </strong>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Registered Email
                          </span>
                          <strong className="text-slate-800 text-xs font-semibold block truncate">
                            {user.email || 'No email linked'}
                          </strong>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 sm:col-span-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            City / Location
                          </span>
                          <strong className="text-slate-800 text-xs font-semibold block truncate">
                            {user.address || (learningMode === 'OFFLINE' ? 'Shikohabad (Offline Lab)' : 'Online Live')}
                          </strong>
                        </div>
                      </div>

                      {/* If user profile has no phone number, prompt for WhatsApp number */}
                      {!user.phone && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                          <label htmlFor="auth-phone-input" className="text-[11px] font-bold text-amber-900 block">
                            Enter WhatsApp Number for Class Link <span className="text-red-500">*</span>:
                          </label>
                          <input
                            id="auth-phone-input"
                            type="tel"
                            required
                            placeholder="98765 43210"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-semibold"
                          />
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-[11px] text-emerald-800 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          No information entry required! This demo session will be directly assigned to your student profile & dashboard.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 3. Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="student-name" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                          Student Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            id="student-name"
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={name}
                            onFocus={() => trackFormStart('free_demo_page_booking')}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="whatsapp-phone" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                          WhatsApp Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-xs font-black text-slate-500">
                            +91
                          </span>
                          <input
                            id="whatsapp-phone"
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-12 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Email & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="student-email" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                          Email Address <span className="text-[10px] font-normal text-slate-400">(Optional, for class notes)</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            id="student-email"
                            type="email"
                            placeholder="rahul@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="student-city" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                          City / Location
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            id="student-city"
                            type="text"
                            placeholder={learningMode === 'OFFLINE' ? 'Shikohabad / Firozabad' : 'Any City / State'}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 5. Date Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Preferred Start Date
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setDateChoice('tomorrow')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        dateChoice === 'tomorrow'
                          ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      🚀 Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateChoice('weekend')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        dateChoice === 'weekend'
                          ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      📅 This Weekend
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateChoice('monday')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        dateChoice === 'monday'
                          ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ✨ Next Monday
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateChoice('custom')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        dateChoice === 'custom'
                          ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      🗓️ Choose Date
                    </button>
                  </div>

                  {dateChoice === 'custom' && (
                    <div className="pt-1">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                      />
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Selected Demo Date: <strong>{resolvedDateString}</strong>
                  </p>
                </div>

                {/* 6. Time Slot */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setPreferredSlot(slot.time)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          preferredSlot === slot.time
                            ? 'bg-orange-50/70 border-[#FF6B00] text-[#FF6B00] shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold text-xs text-slate-900">{slot.label}</div>
                        <div className="text-[11px] font-semibold text-slate-600 mt-0.5">{slot.time}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{slot.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Student Background */}
                <div className="space-y-1.5">
                  <label htmlFor="student-bg" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Your Current Background / Level
                  </label>
                  <div className="relative">
                    <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      id="student-bg"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all"
                    >
                      {BACKGROUND_OPTIONS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 8. Questions / Notes for Instructor */}
                <div className="space-y-1.5">
                  <label htmlFor="query-notes" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Any specific questions or goals? <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    id="query-notes"
                    rows={2}
                    placeholder="e.g. I want to learn web development for my BCA final year project, or I need CCC certification for UP Lekhpal exam."
                    value={queryNotes}
                    onChange={(e) => setQueryNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e56000] hover:to-[#FF6B00] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Reserving Free Demo Seat... Please wait</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Free Demo Class</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Zero spam. We only contact you to share your class link and schedule.</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Why MSK Free Demo Class (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Feature Highlights */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-[#FF8533] tracking-wider">
                Why Attend A Demo Class?
              </span>
              <h3 className="text-xl font-black tracking-tight">
                Experience Real Coding Before Making Any Commitment
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 bg-[#FF6B00]/20 text-[#FF8533] rounded-xl shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-sm text-white">Live Code from Day 1</div>
                  <p className="text-gray-300 mt-0.5 leading-relaxed">
                    No boring PowerPoint slides. Build an actual program or web page in your first 60 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-sm text-white">Mentored by Er. Sumit Kumar</div>
                  <p className="text-gray-300 mt-0.5 leading-relaxed">
                    Senior Software Engineer with 8+ years experience guiding over 5,000+ successful students.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-sm text-white">Online Live & Offline Lab</div>
                  <p className="text-gray-300 mt-0.5 leading-relaxed">
                    Join live from any device via Google Meet, or visit our physical lab at Station Road, Shikohabad.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-sm text-white">Free Career Consultation</div>
                  <p className="text-gray-300 mt-0.5 leading-relaxed">
                    Get an individualized tech career roadmap mapped to high-paying software jobs or govt exams.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              3 Simple Steps to Join
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-slate-800">Select Course & Fill Form:</strong>
                  <p className="text-slate-500">Takes less than 30 seconds with no password or login needed.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-slate-800">Send WhatsApp Confirmation:</strong>
                  <p className="text-slate-500">Your details pre-fill into WhatsApp to message Er. Sumit directly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-slate-800">Receive Link & Attend 2 Days:</strong>
                  <p className="text-slate-500">Receive your Google Meet join code or offline lab pass and start learning!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Admissions Helpline Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-800">Need immediate help?</div>
              <div className="text-[11px] text-slate-600">Call admissions counselor directly</div>
            </div>
            <a
              href="tel:+918393042166"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FF6B00] hover:bg-[#e56000] text-white text-xs font-black rounded-xl shadow-xs transition-colors shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+91 83930 42166</span>
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions About Demo Classes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Everything you need to know about our 2-day free trial sessions.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is the 2-day demo class truly 100% free?',
              a: 'Yes, absolutely. There is zero fee, no registration charge, and no credit card or payment info required. You attend 2 full days of live classes completely free to evaluate our learning environment.'
            },
            {
              q: 'Do I need an account or login to book a demo?',
              a: 'No login or account creation is required! Any prospective student, parent, or working professional can book a demo class directly on this page.'
            },
            {
              q: 'How do Online Live demo classes work?',
              a: 'Online live classes are conducted via Google Meet / Live Classroom with real-time screen sharing, interactive live coding, and two-way voice audio for doubt clearing. You will receive the meeting link on WhatsApp.'
            },
            {
              q: 'Where are the Offline Lab sessions held?',
              a: 'Offline lab sessions are held at our main campus: MSK Institute of Technology & Coding, Gali No. 3, Near Gyan Jyoti Public School, Station Road, Shikohabad (Firozabad, UP). Every student gets an individual computer.'
            },
            {
              q: 'I am a complete beginner with zero coding background. Can I join?',
              a: 'Yes! Our demo classes are designed from scratch. Er. Sumit Kumar explains core logic step-by-step using plain language and real-world examples, making it easy for non-technical beginners.'
            },
            {
              q: 'What happens after the 2-day demo class?',
              a: 'After completing your 2 trial days, if you love the teaching and want to proceed, you can enroll in the full course. If you decide not to continue, there is zero obligation and no questions asked.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-[#FF6B00]' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function BookDemoClient(props: BookDemoClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF6B00]" />
        </div>
      }
    >
      <BookDemoFormContent {...props} />
    </Suspense>
  );
}
