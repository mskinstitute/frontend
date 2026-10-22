'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { affiliateApi, StudentJourney, SuggestedCourse } from '@/services/affiliateApi';
import { fetchCourses, fetchLiveBatches } from '@/services/api';
import { Course, LiveBatch } from '@/types';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import StudentCourseFeesTable from '@/components/dashboard/StudentCourseFeesTable';
import { getCoursePricing, formatINR } from '@/data/coursePricing';
import {
  LayoutGrid,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  Video,
  Award,
  CreditCard,
  Settings,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Code2,
  Sparkles,
  Building2,
  Check,
  Lock,
  Laptop,
  GraduationCap,
  Compass,
  ArrowUpRight,
  HelpCircle,
  Search,
  Zap,
  Users,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_UPCOMING_BATCHES = [
  {
    id: 'batch-mern-live',
    title: 'Full-Stack MERN Stack - Live Evening Batch',
    courseTitle: 'Full-Stack Web Development (MERN Stack)',
    schedule: 'Mon, Wed, Fri (04:30 PM - 06:30 PM)',
    startDate: 'Starting Monday',
    mode: 'BOTH' as const,
    instructor: 'Er. Sumit Kumar',
    totalSeats: 25,
    leftSeats: 6,
  },
  {
    id: 'batch-python-live',
    title: 'Python & AI Automation - Morning Lab Batch',
    courseTitle: 'Python Programming Masterclass',
    schedule: 'Mon - Sat (09:00 AM - 11:00 AM)',
    startDate: 'Starting Tomorrow',
    mode: 'OFFLINE' as const,
    instructor: 'Er. Sumit Kumar',
    totalSeats: 20,
    leftSeats: 4,
  },
  {
    id: 'batch-adca-live',
    title: 'ADCA 1-Year Diploma - Afternoon Campus Batch',
    courseTitle: 'ADCA (1-Year Advanced Computer Diploma)',
    schedule: 'Mon - Sat (02:30 PM - 04:30 PM)',
    startDate: 'Ongoing - New Intake Open',
    mode: 'OFFLINE' as const,
    instructor: 'Faculty Team',
    totalSeats: 30,
    leftSeats: 8,
  },
  {
    id: 'batch-ccc-live',
    title: 'NIELIT CCC Exam Fast-Track - Weekend Live',
    courseTitle: 'NIELIT CCC (Basic Computer Course)',
    schedule: 'Sat & Sun (11:30 AM - 01:30 PM)',
    startDate: 'Weekend Intake',
    mode: 'BOTH' as const,
    instructor: 'Anita Verma',
    totalSeats: 35,
    leftSeats: 12,
  },
  {
    id: 'batch-data-live',
    title: 'Data Analysis & Python - Midday Practical Batch',
    courseTitle: 'Data Analysis & Python Mastery',
    schedule: 'Mon, Wed, Fri (11:30 AM - 01:30 PM)',
    startDate: 'Next Monday',
    mode: 'BOTH' as const,
    instructor: 'Er. Sumit Kumar',
    totalSeats: 22,
    leftSeats: 5,
  },
  {
    id: 'batch-tally-live',
    title: 'Tally Prime + GST & Accounting - Evening Lab',
    courseTitle: 'Tally Prime + GST & Financial Accounting',
    schedule: 'Mon - Fri (04:30 PM - 06:30 PM)',
    startDate: 'Starting this week',
    mode: 'OFFLINE' as const,
    instructor: 'Accounting Faculty',
    totalSeats: 25,
    leftSeats: 7,
  }
];

function getFallbackSuggestedCourses(demoCourse: string): SuggestedCourse[] {
  const lower = (demoCourse || '').toLowerCase();

  if (lower.includes('python') || lower.includes('data') || lower.includes('ai')) {
    return [
      {
        id: 'c-python-mastery',
        title: 'Python Programming Masterclass',
        category: 'Programming & AI',
        duration: '3 Months',
        level: 'Beginner to Advanced',
        slug: 'python-for-beginners',
        description: 'Master Python syntax, object-oriented architecture, data structures, and production-grade automation scripts.',
        badge: 'Recommended for You'
      },
      {
        id: 'c-data-analysis',
        title: 'Data Analysis & Python Mastery',
        category: 'Data Science',
        duration: '4 Months',
        level: 'Intermediate',
        slug: 'data-analysis--advanced-pandas--ml-basics',
        description: 'Hands-on Pandas, NumPy, SQL data munging, interactive dashboards with Matplotlib, and machine learning basics.',
        badge: 'High Industry Demand'
      },
      {
        id: 'c-full-stack',
        title: 'Full-Stack Web Development Bootcamp',
        category: 'Web Engineering',
        duration: '6 Months',
        level: 'Job-Ready',
        slug: 'full-stack-web-dev-bootcamp',
        description: 'Build end-to-end full stack web applications with Python Django, REST Framework, and React Next.js.',
        badge: '100% Placement Assistance'
      }
    ];
  } else if (lower.includes('web') || lower.includes('mern') || lower.includes('frontend')) {
    return [
      {
        id: 'c-web-bootcamp',
        title: 'Full-Stack Web Development Bootcamp (MERN)',
        category: 'Web Engineering',
        duration: '6 Months',
        level: 'Beginner to Pro',
        slug: 'full-stack-web-dev-bootcamp',
        description: 'Master React, Next.js, Node.js, Express, MongoDB, TailwindCSS, and cloud deployments.',
        badge: 'Flagship Program'
      },
      {
        id: 'c-backend-node',
        title: 'Backend Engineering with Node.js & Databases',
        category: 'Backend Systems',
        duration: '3 Months',
        level: 'Intermediate',
        slug: 'backend-engineering-nodejs-databases',
        description: 'Master RESTful API design, database normalization with PostgreSQL, authentication, and caching.',
        badge: 'Career Accelerator'
      },
      {
        id: 'c-python-django',
        title: 'Python with Django & Microservices',
        category: 'Full Stack',
        duration: '4 Months',
        level: 'All Levels',
        slug: 'python-for-beginners',
        description: 'Learn modern backend APIs, Django ORM, PostgreSQL integration, and containerization.',
        badge: 'Popular Choice'
      }
    ];
  } else if (lower.includes('adca') || lower.includes('dca')) {
    return [
      {
        id: 'c-adca-diploma',
        title: 'ADCA - Advance Diploma in Computer Applications',
        category: '1-Year Government Diploma',
        duration: '12 Months',
        level: 'Complete Foundation',
        slug: 'adca',
        description: 'Complete 1-year ISO certified diploma covering MS Office, DTP, Tally Prime, Web Basics, and Hardware.',
        badge: 'Govt Job Eligible'
      },
      {
        id: 'c-ccc-course',
        title: 'NIELIT CCC (Course on Computer Concepts)',
        category: 'National Certification',
        duration: '3 Months',
        level: 'Essential',
        slug: 'ccc',
        description: 'Official NIELIT syllabus with computer fundamentals, digital payments, and exam mock test simulators.',
        badge: 'Mandatory for UP Govt Jobs'
      },
      {
        id: 'c-tally-accounting',
        title: 'Tally Prime + GST & Financial Accounting',
        category: 'Accounting & Commerce',
        duration: '3 Months',
        level: 'Professional',
        slug: 'tally-prime',
        description: 'Real-world GST invoicing, inventory vouchers, balance sheets, and tax filing workflows.',
        badge: 'Quick Job Readiness'
      }
    ];
  } else if (lower.includes('ccc') || lower.includes('basic') || lower.includes('office')) {
    return [
      {
        id: 'c-ccc-nielit',
        title: 'NIELIT CCC (Basic Computer Course)',
        category: 'National Certification',
        duration: '3 Months',
        level: 'Essential',
        slug: 'ccc',
        description: 'Comprehensive NIELIT examination preparation with 500+ practice questions and typing tests.',
        badge: 'Govt Certified'
      },
      {
        id: 'c-adca-1yr',
        title: 'ADCA (1-Year Advanced Computer Diploma)',
        category: 'Full Diploma',
        duration: '12 Months',
        level: 'Comprehensive',
        slug: 'adca',
        description: 'Upgrade to a complete IT diploma with graphic design, accounting, web concepts, and typing certification.',
        badge: 'Top Value'
      },
      {
        id: 'c-python-intro',
        title: 'Python for Absolute Beginners',
        category: 'Coding Starter',
        duration: '3 Months',
        level: 'No Prior Coding Needed',
        slug: 'python-for-beginners',
        description: 'Step into the software industry with simple, high-paying Python programming fundamentals.',
        badge: 'Next Step in Tech'
      }
    ];
  }

  return [
    {
      id: 'c-web-default',
      title: 'Full-Stack Web Development Bootcamp',
      category: 'Web Engineering',
      duration: '6 Months',
      level: 'Beginner to Pro',
      slug: 'full-stack-web-dev-bootcamp',
      description: 'Hands-on training in React, Next.js, Node.js, and databases with portfolio projects.',
      badge: 'Most Popular'
    },
    {
      id: 'c-python-default',
      title: 'Python Programming Masterclass',
      category: 'Programming & AI',
      duration: '3 Months',
      level: 'Beginner to Advanced',
      slug: 'python-for-beginners',
      description: 'Practical lab training with Er. Sumit Kumar at Shikohabad campus or online live.',
      badge: 'Bestseller'
    },
    {
      id: 'c-adca-default',
      title: 'ADCA (1-Year Advanced Computer Diploma)',
      category: 'Diploma & Govt Jobs',
      duration: '12 Months',
      level: 'Comprehensive',
      slug: 'adca',
      description: '1-year ISO certified computer diploma for competitive exams and office administration.',
      badge: 'Govt Job Verified'
    }
  ];
}

function StudentDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');
  const [activeTab, setActiveTab] = useState<string>(
    tabParam && ['dashboard', 'courses', 'assignments', 'attendance', 'results', 'demos', 'certificates', 'payments', 'settings'].includes(tabParam)
      ? tabParam
      : 'dashboard'
  );

  // Synchronize activeTab when query param ?tab= changes
  useEffect(() => {
    const currentTab = searchParams?.get('tab');
    if (currentTab && ['dashboard', 'courses', 'assignments', 'attendance', 'results', 'demos', 'certificates', 'payments', 'settings'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  // Journey & Demo Booking State
  const [journey, setJourney] = useState<StudentJourney | null>(null);
  const [loadingJourney, setLoadingJourney] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  // Search state for courses & live batches
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [liveBatches, setLiveBatches] = useState<LiveBatch[]>([]);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');

  const [demoForm, setDemoForm] = useState({
    course_name: 'Full-Stack Web Development (MERN Stack)',
    learning_mode: 'OFFLINE' as 'OFFLINE' | 'ONLINE',
    preferred_slot: '09:00 AM - 11:00 AM (Morning Lab)',
    notes: '',
  });

  const loadJourney = useCallback(async () => {
    try {
      setLoadingJourney(true);
      const data = await affiliateApi.getStudentJourney();
      setJourney(data);
      if (typeof window !== 'undefined') {
        if (data?.demo_booking) {
          localStorage.setItem('msk_has_demo_booking', 'true');
          window.dispatchEvent(new Event('msk_demo_booked'));
        } else {
          localStorage.removeItem('msk_has_demo_booking');
          window.dispatchEvent(new Event('msk_demo_cancelled'));
        }
      }
    } catch {
      // Keep null on error
    } finally {
      setLoadingJourney(false);
    }
  }, []);

  useEffect(() => {
    const role = (user?.role || '').toLowerCase().trim();
    const isAllowed = role === 'student' || role === 'admin' || role === 'superadmin' || role === 'super_admin';
    if (user && isAllowed) {
      loadJourney();
    }

    // Fetch catalog courses & live batches for search
    Promise.all([
      fetchCourses().catch(() => [] as Course[]),
      fetchLiveBatches().catch(() => [] as LiveBatch[]),
    ]).then(([coursesData, batchesData]) => {
      if (coursesData && coursesData.length > 0) setAllCourses(coursesData);
      if (batchesData && batchesData.length > 0) setLiveBatches(batchesData);
    });
  }, [loadJourney]);

  // Real student info derived from Auth + Backend Journey (NO dummy data)
  const isEnrolled = !!(journey?.is_enrolled || journey?.enrollment);
  const enrollment = journey?.enrollment;
  const demoBooking = journey?.demo_booking;
  const hasDemo = !!demoBooking;

  // Crucial Rule: Check if current demo is completed or still active
  const isDemoCompleted = demoBooking?.status === 'COMPLETED';
  const hasActiveUncompletedDemo = hasDemo && !isDemoCompleted && demoBooking?.status !== 'CANCELLED';

  const studentName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : (user?.username || 'Student');

  const studentInfo = {
    name: studentName,
    email: user?.email || '',
    phone: user?.phone || '',
    regNo: enrollment?.registration_number || (isEnrolled ? `MSK-${new Date().getFullYear()}-${user?.id || '001'}` : 'Pending Enrollment'),
    branch: enrollment?.branch_name || 'MSK Shikohabad Main Campus',
    branchCode: 'MSK-SHK-01',
    course: enrollment?.course_name || (hasDemo ? `${demoBooking?.course_name}` : 'Not Enrolled Yet'),
    batchTime: enrollment?.batch_timing || demoBooking?.preferred_slot || 'Pending Batch Allotment',
    feeTotal: enrollment?.net_fee_inr || 0,
    feePaid: enrollment?.fee_collected_inr || 0,
    feeDue: Math.max(0, (enrollment?.net_fee_inr || 0) - (enrollment?.fee_collected_inr || 0)),
    feeStatus: enrollment?.fee_status || (isEnrolled ? 'pending' : 'none'),
    certificationStatus: enrollment?.certification_status || 'not_started',
  };

  // Dynamic suggested courses based on demo class booked
  const suggestedCourses: SuggestedCourse[] =
    journey?.suggested_courses && journey.suggested_courses.length > 0
      ? journey.suggested_courses
      : getFallbackSuggestedCourses(demoBooking?.course_name || '');

  // Active batches list (Google Sheet or resilient fallback)
  const activeBatchesList = liveBatches.length > 0 ? liveBatches : DEFAULT_UPCOMING_BATCHES;

  // Filtered live batches for Modal
  const modalFilteredBatches = useMemo(() => {
    const q = modalSearchQuery.trim().toLowerCase();
    if (!q) return activeBatchesList.slice(0, 4);
    return activeBatchesList.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.courseTitle && b.courseTitle.toLowerCase().includes(q)) ||
        (b.schedule && b.schedule.toLowerCase().includes(q)) ||
        (b.instructor && b.instructor.toLowerCase().includes(q))
    );
  }, [modalSearchQuery, activeBatchesList]);

  // Filtered courses for Modal
  const modalFilteredCourses = useMemo(() => {
    const q = modalSearchQuery.trim().toLowerCase();
    if (!q) return allCourses.slice(0, 8);
    return allCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        (c.categories && c.categories.some((cat) => cat.toLowerCase().includes(q)))
    );
  }, [modalSearchQuery, allCourses]);

  // Filtered live batches for Dashboard Search
  const dashboardFilteredBatches = useMemo(() => {
    const q = dashboardSearchQuery.trim().toLowerCase();
    if (!q) return activeBatchesList.slice(0, 3);
    return activeBatchesList.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.courseTitle && b.courseTitle.toLowerCase().includes(q)) ||
        (b.schedule && b.schedule.toLowerCase().includes(q))
    );
  }, [dashboardSearchQuery, activeBatchesList]);

  // Filtered courses for Dashboard Search
  const dashboardFilteredCourses = useMemo(() => {
    const q = dashboardSearchQuery.trim().toLowerCase();
    if (!q) return allCourses.slice(0, 6);
    return allCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        (c.categories && c.categories.some((cat) => cat.toLowerCase().includes(q)))
    );
  }, [dashboardSearchQuery, allCourses]);

  // Handle open demo booking - routes directly to the dedicated /book-demo route
  const handleOpenDemoModal = (courseName?: string, slot?: string, mode?: 'OFFLINE' | 'ONLINE') => {
    let url = '/book-demo';
    const params = new URLSearchParams();
    if (courseName) params.set('course', courseName);
    if (slot) params.set('slot', slot);
    if (mode) params.set('mode', mode);
    const qs = params.toString();
    if (qs) url += `?${qs}`;
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const handleBookDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasActiveUncompletedDemo) {
      toast.error(
        `Active demo in progress! You must complete your current 3-day demo for "${demoBooking?.course_name}" before reserving another demo class.`
      );
      return;
    }

    if (!demoForm.course_name.trim()) {
      toast.error('Please search and select a course or live batch for your demo.');
      return;
    }

    setDemoSubmitting(true);
    try {
      await affiliateApi.bookDemo(demoForm);
      if (typeof window !== 'undefined') {
        localStorage.setItem('msk_has_demo_booking', 'true');
        window.dispatchEvent(new Event('msk_demo_booked'));
      }
      toast.success('🎉 Free 3-Day Demo seat reserved successfully!');
      setIsDemoModalOpen(false);
      await loadJourney();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reserve demo seat.');
    } finally {
      setDemoSubmitting(false);
    }
  };

  // Dynamic Sidebar Navigation Config
  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'courses', label: 'My Courses', icon: BookOpen, badge: isEnrolled ? 1 : 0, badgeColor: 'cyan' },
        { id: 'assignments', label: 'Assignments', icon: ClipboardList, badge: 0, badgeColor: 'cyan' },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
        { id: 'results', label: 'Results / Tests', icon: TrendingUp },
      ],
    },
    {
      title: 'FEATURES',
      items: [
        { id: 'demos', label: '3-Day Demo Classes', icon: Video, badge: hasDemo ? (isDemoCompleted ? 'COMPLETED' : 'ACTIVE') : 'FREE', badgeColor: 'orange' },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'payments', label: 'Payments / Fees', icon: CreditCard },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'settings', label: 'Profile & Settings', icon: Settings },
      ],
    },
  ];

  return (
    <DashboardLayout
      role="student"
      roleSubtitle="STUDENT PORTAL"
      sections={sidebarSections}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customUserName={studentInfo.name}
    >
      {/* =========================================================================
          PANEL 1: DASHBOARD OVERVIEW
         ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>MSK Institute Student Learning Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {studentInfo.name}! 👋
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {isEnrolled
                  ? `You are officially enrolled in ${studentInfo.course}. Track attendance, assignments, and curriculum below.`
                  : hasActiveUncompletedDemo
                  ? `Your 3-day demo class seat is active for ${demoBooking?.course_name}. Attend Day 1, 2, and 3 to unlock admission or book another demo!`
                  : isDemoCompleted
                  ? `You completed your 3-day demo for ${demoBooking?.course_name}! You can now enroll or book a demo for another course.`
                  : `You are not enrolled in any course yet. Search courses & upcoming live batches below to book your 3-day free demo class!`}
              </p>
            </div>

            {!isEnrolled && (
              <div className="self-start sm:self-auto shrink-0">
                {hasActiveUncompletedDemo ? (
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF6B00] animate-pulse" />
                    <span>Demo In Progress: {demoBooking?.course_name}</span>
                  </div>
                ) : (
                  <Link
                    href="/book-demo"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e56000] hover:to-[#FF6B00] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    <span>{isDemoCompleted ? 'Book Another Free Demo' : 'Book Free Demo Class'}</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* =========================================================================
              ACTIVE DEMO PROGRESS NOTICE OR COMPLETED BADGE
             ========================================================================= */}
          {hasActiveUncompletedDemo && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">
                    Active 3-Day Demo in Progress: <span className="text-[#FF6B00]">{demoBooking?.course_name}</span>
                  </p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Mode: {demoBooking?.learning_mode} · Slot: {demoBooking?.preferred_slot}. You can book another demo class after completing all 3 sessions of this demo.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition whitespace-nowrap self-start sm:self-auto"
              >
                View 3-Day Attendance
              </button>
            </div>
          )}

          {isDemoCompleted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-950">
                    🎉 Previous 3-Day Demo Completed for: {demoBooking?.course_name}!
                  </p>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    You have unlocked admission discount for this course, OR you can now search and book a 3-Day Demo for another course!
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenDemoModal()}
                className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-white font-bold text-xs transition whitespace-nowrap self-start sm:self-auto"
              >
                Book Another Free Demo
              </button>
            </div>
          )}

          {/* =========================================================================
              IF DEMO IS BOOKED: SHOW ACTIVE DEMO STATUS CARD WITH 3-DAY TRACKER
             ========================================================================= */}
          {hasDemo && !isEnrolled && (
            <div className="bg-gradient-to-br from-white via-orange-50/30 to-white rounded-3xl border border-orange-200/90 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A2540] text-white text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Video className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Active 3-Day Free Demo Booking</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {demoBooking?.course_name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mode: <strong>{demoBooking?.learning_mode === 'OFFLINE' ? 'Offline Lab (Shikohabad Campus)' : 'Online Interactive Live'}</strong> · Slot: <strong>{demoBooking?.preferred_slot}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    isDemoCompleted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Status: {demoBooking?.status || 'Scheduled'}</span>
                  </span>
                </div>
              </div>

              {/* 3-Day Attendance & Milestone Progress Tracker */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Day 1 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  demoBooking?.day1_attended
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-white border-slate-200 shadow-xs ring-1 ring-orange-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0A2540] text-white">
                      DAY 1
                    </span>
                    {demoBooking?.day1_attended ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-[#FF6B00] animate-pulse" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Fundamentals & Dev Setup</h4>
                  <p className="text-xs text-slate-500 mt-1">Core architectural concepts and hands-on toolchain setup.</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs font-semibold">
                    {demoBooking?.day1_attended ? (
                      <span className="text-emerald-700">Attended ✓</span>
                    ) : (
                      <span className="text-slate-500">Scheduled</span>
                    )}
                  </div>
                </div>

                {/* Day 2 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  demoBooking?.day2_attended
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : demoBooking?.day1_attended
                    ? 'bg-white border-slate-200 shadow-xs ring-1 ring-orange-200'
                    : 'bg-slate-50/70 border-slate-200 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0A2540] text-white">
                      DAY 2
                    </span>
                    {demoBooking?.day2_attended ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Practical Coding Lab</h4>
                  <p className="text-xs text-slate-500 mt-1">Live debugging, syntax exercises, and problem solving.</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs font-semibold">
                    {demoBooking?.day2_attended ? (
                      <span className="text-emerald-700">Attended ✓</span>
                    ) : (
                      <span className="text-slate-500">Next Session</span>
                    )}
                  </div>
                </div>

                {/* Day 3 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  demoBooking?.day3_attended
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : demoBooking?.day2_attended
                    ? 'bg-white border-slate-200 shadow-xs ring-1 ring-orange-200'
                    : 'bg-slate-50/70 border-slate-200 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0A2540] text-white">
                      DAY 3
                    </span>
                    {demoBooking?.day3_attended ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Mini Project & Admission</h4>
                  <p className="text-xs text-slate-500 mt-1">Build a small working project and review certification eligibility.</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs font-semibold">
                    {demoBooking?.day3_attended ? (
                      <span className="text-emerald-700">Completed ✓</span>
                    ) : (
                      <span className="text-slate-500">Final Milestone</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SEARCH COURSES & LIVE BATCHES (USER REQUEST: LIVE BATCHES ON TOP, THEN COURSES)
             ========================================================================= */}
          {!isEnrolled && (
            <div className="bg-gradient-to-br from-slate-900 via-[#0A2540] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800 space-y-6">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-wider">
                  <Search className="w-3.5 h-3.5 text-[#FF8533]" />
                  <span>Search Courses & Upcoming Live Batches</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Find Your Ideal Course for a <span className="text-[#FF8533]">3-Day Free Demo</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Search across all MSK Institute courses. Upcoming live batches are featured on top for immediate booking!
                </p>
              </div>

              {/* Search Bar Input */}
              <div className="relative max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5 text-[#FF8533]" />
                </div>
                <input
                  type="text"
                  value={dashboardSearchQuery}
                  onChange={(e) => setDashboardSearchQuery(e.target.value)}
                  placeholder="Search by topic, e.g. Python, MERN, ADCA, CCC, Tally, Node..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8533] focus:bg-white/15 transition"
                />
                {dashboardSearchQuery && (
                  <button
                    onClick={() => setDashboardSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* 1. UPCOMING LIVE BATCHES (DISPLAYED ON TOP) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#FF8533] uppercase tracking-wider">
                    <Zap className="w-4 h-4 fill-[#FF8533]" />
                    <span>Upcoming Live Batches (Priority Intakes)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {dashboardFilteredBatches.length} Batches Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardFilteredBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 rounded-2xl p-4.5 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FF6B00] text-white">
                            LIVE BATCH
                          </span>
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {batch.startDate}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white leading-snug line-clamp-2">
                          {batch.title}
                        </h4>
                        <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-[#FF8533] shrink-0" />
                          <span className="truncate">{batch.schedule}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Instructor: {batch.instructor} · {batch.mode === 'BOTH' ? 'Offline & Online' : batch.mode}
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenDemoModal(batch.courseTitle || batch.title, batch.schedule, batch.mode === 'ONLINE' ? 'ONLINE' : 'OFFLINE')}
                        disabled={hasActiveUncompletedDemo}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm ${
                          hasActiveUncompletedDemo
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-[#FF6B00] hover:bg-[#FF8533] text-white cursor-pointer'
                        }`}
                      >
                        <span>{hasActiveUncompletedDemo ? 'Active Demo Locked' : 'Book 3-Day Demo'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. MATCHING COURSES CATALOG (DISPLAYED BELOW LIVE BATCHES) */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Matching Courses Catalog</span>
                  </div>
                  <Link
                    href="/courses"
                    className="text-[11px] text-orange-300 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View All 25+ Syllabi</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {dashboardFilteredCourses.slice(0, 6).map((c) => (
                    <div
                      key={c.id}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-2.5"
                    >
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-orange-200">
                          {c.categories?.[0] || 'Certification'}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1.5 line-clamp-1">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {c.shortDescription}
                        </p>
                        {(() => {
                          const cPrice = getCoursePricing(c.id, {
                            title: c.title,
                            durationValue: c.duration?.value,
                            durationUnit: c.duration?.unit,
                            mode: c.mode,
                          });
                          const ourP = c.ourPrice || cPrice.ourPrice;
                          const mktP = c.marketPrice || cPrice.marketPrice;
                          return (
                            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-extrabold text-[#FF8533]">{formatINR(ourP)}</span>
                                <span className="text-[10px] text-slate-400 line-through">{formatINR(mktP)}</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                Save {Math.round(((mktP - ourP) / mktP) * 100)}%
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      <button
                        onClick={() => handleOpenDemoModal(c.title)}
                        disabled={hasActiveUncompletedDemo}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                          hasActiveUncompletedDemo
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer border border-white/15'
                        }`}
                      >
                        <span>{hasActiveUncompletedDemo ? 'Active Demo Locked' : 'Select for 3-Day Demo'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUGGESTED COURSES BASED ON BOOKED DEMO (USER'S EXPLICIT REQUIREMENT)
             ========================================================================= */}
          {hasDemo && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>Personalized Curriculum Recommendations</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    Suggested Courses Based on Your &ldquo;{demoBooking?.course_name}&rdquo; Demo
                  </h2>
                </div>
                <Link
                  href="/courses"
                  className="text-xs font-bold text-[#0A2540] hover:text-[#FF6B00] flex items-center gap-1 self-start sm:self-auto transition"
                >
                  <span>Explore All 25+ Syllabi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 3 Matched Recommended Course Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-6 space-y-4 relative overflow-hidden group hover:border-[#FF6B00]/60"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200">
                          {c.badge}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {c.duration}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#FF6B00] transition-colors leading-snug">
                        {c.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Award className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span>Level: {c.level}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/courses/${c.slug}`}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0A2540] hover:text-white text-slate-800 font-bold text-xs transition text-center"
                      >
                        View Syllabus
                      </Link>
                      <a
                        href={`https://wa.me/918393042166?text=${encodeURIComponent(`Hello Er. Sumit Kumar, I attended/booked the demo for ${demoBooking?.course_name} and I am interested in enrolling in ${c.title}. My name is ${studentInfo.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-white transition shadow-sm"
                        title="Enroll in this course"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Metrics Stats Overview (Zero dummy numbers) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm border-t-4 border-t-[#0A2540]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ENROLLED COURSES
              </span>
              <div className="text-3xl font-extrabold text-[#0A2540] mt-1 mb-1">
                {isEnrolled ? 1 : 0}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {isEnrolled ? studentInfo.course : 'No active enrollment'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm border-t-4 border-t-[#FF6B00]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                3-DAY DEMO STATUS
              </span>
              <div className="text-lg font-extrabold text-slate-900 mt-2 mb-1 truncate">
                {hasDemo ? demoBooking?.status : 'Not Booked Yet'}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {hasDemo ? demoBooking?.course_name : 'Search above to book free'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm border-t-4 border-t-emerald-500">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                FEE STATUS
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 mb-1">
                {isEnrolled ? `₹${studentInfo.feePaid}` : '₹0'}
              </div>
              <p className="text-xs text-emerald-600 font-semibold">
                {isEnrolled ? (studentInfo.feeDue > 0 ? `Due: ₹${studentInfo.feeDue}` : 'No Dues (Paid)') : 'Free Demo Active'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm border-t-4 border-t-purple-500">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                CENTER / CAMPUS
              </span>
              <div className="text-sm font-extrabold text-slate-900 mt-2 mb-1">
                Shikohabad Center
              </div>
              <p className="text-xs text-slate-500">
                Near Gyan Jyoti School (U.P.)
              </p>
            </div>
          </div>

          {/* Quick Support & Lab Launch Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1E3A5F] text-white rounded-2xl p-5 border border-[#1E3A5F] flex items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#FF8533] uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" /> Offline Lab & Browser IDE
                </span>
                <h4 className="text-base font-bold text-white">Interactive Coding Playground</h4>
                <p className="text-xs text-slate-300">Practice Python, JavaScript, and HTML live inside the MSK sandbox.</p>
              </div>
              <Link
                href="/playground"
                className="px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-white font-semibold text-xs whitespace-nowrap shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Launch Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Faculty Mentor Desk
                </span>
                <h4 className="text-base font-bold text-slate-900">Need Help or Admission Advice?</h4>
                <p className="text-xs text-slate-500">Speak directly with Er. Sumit Kumar or campus counselors.</p>
              </div>
              <a
                href="https://wa.me/918393042166?text=Hello%20Er.%20Sumit%20Kumar,%20I%20have%20a%20question%20regarding%20courses%20at%20MSK%20Institute."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white font-semibold text-xs whitespace-nowrap shadow-sm transition-all shrink-0"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 2: MY COURSES
         ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Enrolled Courses</h1>
              <p className="text-sm text-slate-500 mt-1">
                Official syllabus modules, batch schedules, and downloadable study resources.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A2540] text-white text-xs font-semibold hover:bg-[#1E3A5F] transition self-start sm:self-auto"
            >
              <span>Explore Course Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isEnrolled ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Officially Enrolled
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Registration: {studentInfo.regNo}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{studentInfo.course}</h3>
              <p className="text-sm text-slate-600">
                Batch Timing: <strong>{studentInfo.batchTime}</strong> · Center: <strong>{studentInfo.branch}</strong>
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Instructor: Er. Sumit Kumar</span>
                <Link
                  href="/study-material"
                  className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
                >
                  <span>Access Notes & Study Material</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Course Enrollments Found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                You haven&apos;t enrolled in a certified program yet. Book your 3-day free demo class to experience our lab teaching before confirming admission!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => handleOpenDemoModal()}
                  disabled={hasActiveUncompletedDemo}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                    hasActiveUncompletedDemo
                      ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                      : 'bg-[#FF6B00] hover:bg-[#FF8533] text-white shadow-md'
                  }`}
                >
                  {hasActiveUncompletedDemo ? 'Demo In Progress' : 'Book 3-Day Free Demo'}
                </button>
                <Link
                  href="/courses"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
                >
                  Browse Course Catalog
                </Link>
              </div>
            </div>
          )}

          {/* Complete Course Fee Schedule & Installment Calculator (Exclusive after login) */}
          <div className="pt-4">
            <StudentCourseFeesTable
              courses={allCourses}
              onSelectDemoCourse={(courseTitle) => handleOpenDemoModal(courseTitle)}
              hasActiveUncompletedDemo={hasActiveUncompletedDemo}
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 3: ASSIGNMENTS
         ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assignments & Lab Tasks</h1>
            <p className="text-sm text-slate-500 mt-1">
              Submit your lab solutions, review instructor code corrections, and track grades.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Assignments Currently Pending</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {isEnrolled
                ? 'Your instructor has not published any assignments for this week. Enjoy your lab practice!'
                : 'Assignments and coding challenges unlock once you complete admission and join an active batch.'}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 4: ATTENDANCE
         ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Attendance & Timetable</h1>
            <p className="text-sm text-slate-500 mt-1">
              Official campus lab biometric and batch schedules for Shikohabad center.
            </p>
          </div>

          {hasDemo ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">3-Day Demo Attendance Record</h3>
                  <p className="text-xs text-slate-500">Course: <strong>{demoBooking?.course_name}</strong> · Slot: <strong>{demoBooking?.preferred_slot}</strong></p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDemoCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {isDemoCompleted ? 'Demo Completed' : 'Sessions Active'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-400">DEMO SESSION 1</div>
                  <div className={`text-base font-bold mt-1 ${demoBooking?.day1_attended ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {demoBooking?.day1_attended ? 'Attended ✓' : 'Pending Attendance'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-400">DEMO SESSION 2</div>
                  <div className={`text-base font-bold mt-1 ${demoBooking?.day2_attended ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {demoBooking?.day2_attended ? 'Attended ✓' : 'Pending Attendance'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-400">DEMO SESSION 3</div>
                  <div className={`text-base font-bold mt-1 ${demoBooking?.day3_attended ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {demoBooking?.day3_attended ? 'Attended ✓' : 'Pending Attendance'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Attendance Tracker Not Active</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Attendance logs will be recorded on biometric machines once you enroll into an active batch at Shikohabad campus.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PANEL 5: RESULTS / TESTS
         ========================================================================= */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Academic Results & Test Practice</h1>
            <p className="text-sm text-slate-500 mt-1">
              Internal assessment scorecards, CCC practice test results, and speed typing drills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">NIELIT CCC Exam Simulator</h3>
              <p className="text-xs text-slate-500">
                Practice 100-question timed mock exams modeled after the official NIELIT CCC exam format.
              </p>
              <Link
                href="/mock-test"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white text-xs font-semibold transition"
              >
                <span>Take CCC Mock Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Keyboard Shortcuts & Speed Drills</h3>
              <p className="text-xs text-slate-500">
                Master essential Windows, VS Code, and Excel shortcuts to boost your coding and office productivity.
              </p>
              <Link
                href="/shortcuts"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                <span>Practice Shortcuts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 6: 3-DAY DEMO CLASSES
         ========================================================================= */}
      {activeTab === 'demos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">3-Day Free Demo Classes</h1>
              <p className="text-sm text-slate-500 mt-1">
                Zero fee • No commitment • Hands-on lab access at Shikohabad campus or live online.
              </p>
            </div>
            {hasActiveUncompletedDemo ? (
              <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                Active Demo In Progress
              </div>
            ) : (
              <button
                onClick={() => handleOpenDemoModal()}
                className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-white text-xs font-bold uppercase tracking-wider shadow-md transition self-start sm:self-auto cursor-pointer"
              >
                <span>{isDemoCompleted ? 'Book Another 3-Day Demo' : 'Book 3-Day Demo'}</span>
              </button>
            )}
          </div>

          {hasDemo ? (
            <div className="bg-white rounded-3xl border border-orange-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-900">
                  Current Reserved Demo
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Status: <strong className={isDemoCompleted ? 'text-emerald-600' : 'text-amber-600'}>{demoBooking?.status}</strong>
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{demoBooking?.course_name}</h3>
              <p className="text-sm text-slate-600">
                Mode: <strong>{demoBooking?.learning_mode === 'OFFLINE' ? 'Offline Computer Lab 01 (Shikohabad)' : 'Online Live (Zoom)'}</strong>
              </p>
              <p className="text-sm text-slate-600">
                Time Slot: <strong>{demoBooking?.preferred_slot}</strong>
              </p>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Instructor: Er. Sumit Kumar (Shikohabad Center Head)</span>
                </div>
                {hasActiveUncompletedDemo && (
                  <span className="text-amber-700 font-semibold text-[11px]">
                    Complete all 3 sessions to unlock next demo booking
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center mx-auto">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Demo Classes Scheduled</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Reserve your 3-day trial seat today to learn Python, Full-Stack MERN, ADCA, or CCC with zero upfront fees.
              </p>
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-white text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
              >
                <span>Book Free Demo Class</span>
                <span>➔</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PANEL 7: CERTIFICATES
         ========================================================================= */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Digital Verified Certificates</h1>
            <p className="text-sm text-slate-500 mt-1">
              ISO 9001:2015 accredited certificates with permanent QR verification code.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Certificates Issued Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {isEnrolled
                ? `You are currently enrolled in ${studentInfo.course}. Your certificate will be issued upon syllabus completion and passing the final practical evaluation.`
                : 'Certificates are awarded upon successful completion of your enrolled course and lab projects.'}
            </p>
            <div className="pt-2">
              <Link
                href="/verify-certificate"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] hover:underline"
              >
                <span>Check Certificate Verification System</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 8: PAYMENTS / FEES
         ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tuition Payments & Invoices</h1>
            <p className="text-sm text-slate-500 mt-1">
              Official receipts, payment schedules, and verified transaction ledgers.
            </p>
          </div>

          {isEnrolled ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm border-t-4 border-t-emerald-500">
                <span className="text-xs font-bold text-slate-400 uppercase">Fee Paid</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">₹{studentInfo.feePaid}</div>
                <p className="text-xs text-emerald-600 font-semibold mt-1">Status: {studentInfo.feeStatus}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm border-t-4 border-t-blue-500">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Fee</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">₹{studentInfo.feeTotal}</div>
                <p className="text-xs text-slate-500 mt-1">Full course tuition</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm border-t-4 border-t-amber-500">
                <span className="text-xs font-bold text-slate-400 uppercase">Balance Due</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">₹{studentInfo.feeDue}</div>
                <p className="text-xs text-slate-500 mt-1">Payable at campus counter</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Payment Records Found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                All 3-Day Free Demo classes are 100% free with ₹0 admission charges. Invoices and tax receipts are generated upon formal enrollment.
              </p>
            </div>
          )}

          {/* Complete Course Fee Schedule & Payment Modes (Exclusive after login) */}
          <div className="pt-4">
            <StudentCourseFeesTable
              courses={allCourses}
              onSelectDemoCourse={(courseTitle) => handleOpenDemoModal(courseTitle)}
              hasActiveUncompletedDemo={hasActiveUncompletedDemo}
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 9: SETTINGS & PROFILE
         ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Account Profile</h1>
            <p className="text-sm text-slate-500 mt-1">
              Your registered user details and center credentials.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={studentInfo.name}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={studentInfo.email}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Student Registration ID</label>
                <input
                  type="text"
                  value={studentInfo.regNo}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Campus Location</label>
                <input
                  type="text"
                  value={studentInfo.branch}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FREE 3-DAY DEMO BOOKING MODAL (WITH SEARCH & LIVE BATCHES ON TOP)
         ========================================================================= */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Book 3-Day Free Demo Class</h3>
                  <p className="text-xs text-slate-500">Search any course or pick an upcoming live batch</p>
                </div>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Existing Active Booking Warning */}
            {hasActiveUncompletedDemo && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Active Demo in Progress: {demoBooking?.course_name}</span>
                </p>
                <p className="text-amber-800 pl-5">
                  You already have an active demo booking. You can book another demo class after completing all 3 sessions of your current demo.
                </p>
              </div>
            )}

            {journey?.has_referral && (
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 flex items-center gap-2.5 text-xs text-orange-950">
                <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>
                  Referred by <strong>{journey.affiliate_first_name || 'MSK Partner'}</strong>. Your referral fee concession is locked!
                </span>
              </div>
            )}

            <form onSubmit={handleBookDemoSubmit} className="space-y-4">
              {/* CURRENTLY SELECTED COURSE BADGE */}
              {demoForm.course_name && (
                <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase tracking-wider block">
                      Selected Course for Demo:
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {demoForm.course_name}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white flex items-center gap-1 shrink-0">
                    <Check className="w-3.5 h-3.5" /> Selected
                  </span>
                </div>
              )}

              {/* SEARCH ANY COURSE INPUT (REPLACES STATIC SELECT) */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Search Course or Pick Upcoming Live Batch
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <input
                    type="text"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    placeholder="Type to search: Python, MERN, ADCA, CCC, Tally, Node..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-slate-50 focus:bg-white transition"
                  />
                  {modalSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setModalSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* SCROLLABLE RESULTS CONTAINER (LIVE BATCHES ON TOP, THEN COURSES) */}
                <div className="max-h-56 overflow-y-auto space-y-3 p-2 rounded-2xl border border-slate-200 bg-slate-50/60 divide-y divide-slate-100">
                  {/* 1. UPCOMING LIVE BATCHES (ON TOP) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#FF6B00] uppercase tracking-wider px-1">
                      <Zap className="w-3.5 h-3.5 fill-[#FF6B00]" />
                      <span>Upcoming Live Batches (On Top)</span>
                    </div>

                    <div className="space-y-1.5">
                      {modalFilteredBatches.map((batch) => {
                        const isSelected = demoForm.course_name === (batch.courseTitle || batch.title);
                        return (
                          <div
                            key={batch.id}
                            onClick={() => {
                              setDemoForm((prev) => ({
                                ...prev,
                                course_name: batch.courseTitle || batch.title,
                                preferred_slot: batch.schedule || prev.preferred_slot,
                                learning_mode: batch.mode === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
                              }));
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition text-left flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-orange-50 border-[#FF6B00] ring-1 ring-[#FF6B00]'
                                : 'bg-white border-slate-200/80 hover:border-orange-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-[#FF6B00] text-white">
                                  LIVE
                                </span>
                                <h5 className="font-bold text-xs text-slate-900 truncate">
                                  {batch.title}
                                </h5>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {batch.schedule} · {batch.startDate}
                              </p>
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                              isSelected ? 'bg-[#FF6B00] text-white' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isSelected ? 'Selected ✓' : 'Pick Batch'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. MATCHING COURSES (THEN VISIBLE BELOW) */}
                  <div className="space-y-1.5 pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider px-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>All Courses Catalog</span>
                    </div>

                    <div className="space-y-1.5">
                      {modalFilteredCourses.map((c) => {
                        const isSelected = demoForm.course_name === c.title;
                        return (
                          <div
                            key={c.id}
                            onClick={() => {
                              setDemoForm((prev) => ({ ...prev, course_name: c.title }));
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition text-left flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-orange-50 border-[#FF6B00] ring-1 ring-[#FF6B00]'
                                : 'bg-white border-slate-200/80 hover:border-orange-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs text-slate-900 truncate">
                                {c.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {c.categories?.[0] || 'Computer Training'} · {c.level || 'All Levels'}
                              </p>
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                              isSelected ? 'bg-[#FF6B00] text-white' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isSelected ? 'Selected ✓' : 'Select'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* LEARNING MODE TOGGLE */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Learning Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDemoForm({ ...demoForm, learning_mode: 'OFFLINE' })}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition flex items-center gap-2.5 cursor-pointer ${
                      demoForm.learning_mode === 'OFFLINE'
                        ? 'border-[#FF6B00] bg-orange-50/60 text-orange-950 ring-2 ring-orange-400/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#FF6B00]" />
                    <div>
                      <div>Offline Lab</div>
                      <div className="text-[10px] text-slate-500 font-normal">Shikohabad Campus</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoForm({ ...demoForm, learning_mode: 'ONLINE' })}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition flex items-center gap-2.5 cursor-pointer ${
                      demoForm.learning_mode === 'ONLINE'
                        ? 'border-[#0A2540] bg-blue-50/60 text-[#0A2540] ring-2 ring-blue-400/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <div>
                      <div>Online Live</div>
                      <div className="text-[10px] text-slate-500 font-normal">Interactive Zoom</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* TIME SLOT */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={demoForm.preferred_slot}
                  onChange={(e) => setDemoForm({ ...demoForm, preferred_slot: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-white font-medium"
                  required
                >
                  <option value="09:00 AM - 11:00 AM (Morning Lab)">09:00 AM - 11:00 AM (Morning Lab)</option>
                  <option value="11:30 AM - 01:30 PM (Midday Session)">11:30 AM - 01:30 PM (Midday Session)</option>
                  <option value="02:30 PM - 04:30 PM (Afternoon Lab)">02:30 PM - 04:30 PM (Afternoon Lab)</option>
                  <option value="04:30 PM - 06:30 PM (Evening Batch)">04:30 PM - 06:30 PM (Evening Batch)</option>
                </select>
              </div>

              {/* NOTES */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Notes / Prior Experience (Optional)
                </label>
                <textarea
                  value={demoForm.notes}
                  onChange={(e) => setDemoForm({ ...demoForm, notes: e.target.value })}
                  rows={2}
                  placeholder="e.g. beginner looking to switch to IT, college student"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={demoSubmitting || hasActiveUncompletedDemo}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:pointer-events-none disabled:cursor-not-allowed ${
                    hasActiveUncompletedDemo
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#FF6B00] hover:bg-[#FF8533] text-white cursor-pointer'
                  }`}
                >
                  {demoSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Reserving Seat... Please wait</span>
                    </>
                  ) : hasActiveUncompletedDemo ? (
                    <span>Complete Current Demo First</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm 3-Day Demo Seat</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(false)}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
