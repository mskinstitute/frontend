'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, SlidersHorizontal, BookOpen, Clock, Globe, Laptop, 
  ArrowRight, CheckCircle2, Award, ShieldCheck, GraduationCap, 
  HelpCircle, ChevronDown, Sparkles, User, MapPin, PhoneCall,
  X, RotateCcw, Check, LayoutGrid, List, Flame
} from 'lucide-react';
import { Course } from '@/types';
import WebShareButton from '@/components/WebShareButton';
import { trackCourseListImpression, trackCourseSelection, trackSearch } from '@/lib/analytics';

// High-Level Career Pathways for effortless 1-tap exploration
const CAREER_TRACKS = [
  {
    id: 'all',
    label: 'All Programs',
    icon: '✨',
    match: () => true,
  },
  {
    id: 'web-fullstack',
    label: 'Web & Full Stack',
    icon: '💻',
    match: (c: Course) =>
      c.categories.some((cat) => /Web|Frontend|Backend|React|Node|MERN|HTML|CSS|Next|JavaScript|UI/i.test(cat)) ||
      /web|full stack|mern|react|node|javascript|frontend|html|css|tailwind/i.test(c.title),
  },
  {
    id: 'python-coding',
    label: 'Python & Programming',
    icon: '🐍',
    match: (c: Course) =>
      c.categories.some((cat) => /Python|Programming|Django|Software|Flask/i.test(cat)) ||
      /python|django|programming|software|flask/i.test(c.title),
  },
  {
    id: 'diplomas-govt',
    label: 'Govt Diplomas & CCC',
    icon: '📜',
    match: (c: Course) =>
      c.categories.some((cat) => /ADCA|CCC|O Level|Combo|Literacy|Digital Skills/i.test(cat)) ||
      /adca|ccc|diploma|o level/i.test(c.title),
  },
  {
    id: 'data-databases',
    label: 'Data & Databases',
    icon: '📊',
    match: (c: Course) =>
      c.categories.some((cat) => /Data|Database|SQL|MySQL|BI|Analytics|Power BI|Pandas/i.test(cat)) ||
      /data|sql|database|analytics|mysql|power bi/i.test(c.title),
  },
  {
    id: 'office-basics',
    label: 'Office & Computer Basics',
    icon: '🏢',
    match: (c: Course) =>
      c.categories.some((cat) => /Office|Basics|Productivity|Word|Excel|Tally/i.test(cat)) ||
      /office|basic|excel|word|tally|typing/i.test(c.title),
  },
];

// Quick Trending Search Chips
const TRENDING_TAGS = [
  'Python',
  'React',
  'MERN',
  'JavaScript',
  'Excel',
  'Tally',
  'CCC',
  'ADCA',
  'SQL',
];

// Course Duration Filters & Helpers
const DURATION_OPTIONS = [
  { id: 'all', label: 'All Durations', shortLabel: 'All', desc: 'All timeframes' },
  { id: 'short', label: 'Fast-Track (< 3 Months)', shortLabel: '< 3 Mo', desc: '1–2 Mo crash skills' },
  { id: 'mid', label: 'Core Programs (3–6 Months)', shortLabel: '3–6 Mo', desc: 'Job-ready foundations' },
  { id: 'long', label: 'Diplomas (6–12+ Months)', shortLabel: '6–12+ Mo', desc: 'Advanced career tracks' },
];

const getDurationMonths = (d: { value: number; unit: 'HOURS' | 'DAYS' | 'MONTHS' }) => {
  if (!d) return 0;
  if (d.unit === 'MONTHS') return d.value;
  if (d.unit === 'DAYS') return d.value / 30;
  return d.value / (24 * 30);
};

const matchesDuration = (course: Course, selDuration: string) => {
  if (selDuration === 'all') return true;
  const months = getDurationMonths(course.duration);
  if (selDuration === 'short') return months < 3;
  if (selDuration === 'mid') return months >= 3 && months <= 6;
  if (selDuration === 'long') return months > 6;
  return true;
};

// Smart Level Matching: captures combined levels (e.g. "Beginner to Advanced")
const matchesLevel = (courseLevel: string, selLevel: string) => {
  if (selLevel === 'All') return true;
  const cl = (courseLevel || '').toLowerCase();
  const sl = selLevel.toLowerCase();
  if (cl === sl) return true;
  return cl.includes(sl);
};

const FLAGSHIP_SLUGS = new Set([
  'ccc',
  'adca',
  'adca-advanced-diploma-computer-applications',
  'python-programming-masterclass',
  'full-stack-web-development-bootcamp',
  'frontend-web-development-engineering',
  'javascript-react-frontend-engineering',
  'backend-engineering-nodejs-databases',
]);

const PAGE_SIZE = 12;

export default function CourseCatalogClient({ initialCourses }: { initialCourses: Course[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'duration-asc' | 'duration-desc' | 'alphabetical'>('featured');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Compute track counts dynamically
  const trackCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CAREER_TRACKS.forEach((track) => {
      counts[track.id] = initialCourses.filter(track.match).length;
    });
    return counts;
  }, [initialCourses]);

  // Compute duration counts dynamically
  const durationCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: initialCourses.length,
      short: 0,
      mid: 0,
      long: 0,
    };
    initialCourses.forEach((c) => {
      const m = getDurationMonths(c.duration);
      if (m < 3) counts.short++;
      else if (m >= 3 && m <= 6) counts.mid++;
      else if (m > 6) counts.long++;
    });
    return counts;
  }, [initialCourses]);

  // Extract all levels dynamically
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Compute level counts using smart matching
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialCourses.length };
    levels.forEach((lvl) => {
      if (lvl === 'All') return;
      counts[lvl] = initialCourses.filter((c) => matchesLevel(c.level, lvl)).length;
    });
    return counts;
  }, [initialCourses, levels]);

  // Extract all modes dynamically
  const modes = [
    { key: 'All', label: 'All Modes' },
    { key: 'BOTH', label: 'Online & Offline' },
    { key: 'OFFLINE', label: 'Classroom Lab' },
    { key: 'ONLINE', label: 'Online Only' },
  ];

  // Compute mode counts
  const modeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: initialCourses.length,
      BOTH: initialCourses.filter((c) => c.mode === 'BOTH').length,
      OFFLINE: initialCourses.filter((c) => c.mode === 'OFFLINE' || c.mode === 'BOTH').length,
      ONLINE: initialCourses.filter((c) => c.mode === 'ONLINE' || c.mode === 'BOTH').length,
    };
    return counts;
  }, [initialCourses]);

  // Filter and sort courses based on selections
  const filteredCourses = useMemo(() => {
    const activeTrack = CAREER_TRACKS.find((t) => t.id === selectedTrack);

    const result = initialCourses.filter((course) => {
      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTrack = selectedTrack === 'all' || (activeTrack ? activeTrack.match(course) : true);

      const levelMatch = matchesLevel(course.level, selectedLevel);

      const durMatch = matchesDuration(course, selectedDuration);

      const matchesMode =
        selectedMode === 'All' ||
        course.mode === selectedMode ||
        (selectedMode === 'ONLINE' && course.mode === 'BOTH') ||
        (selectedMode === 'OFFLINE' && course.mode === 'BOTH');

      return matchesSearch && matchesTrack && levelMatch && durMatch && matchesMode;
    });

    const toDays = (d: { value: number; unit: 'HOURS' | 'DAYS' | 'MONTHS' }) => {
      if (d.unit === 'MONTHS') return d.value * 30;
      if (d.unit === 'DAYS') return d.value;
      return d.value / 24;
    };

    // Apply sorting
    if (sortBy === 'duration-asc') {
      result.sort((a, b) => toDays(a.duration) - toDays(b.duration));
    } else if (sortBy === 'duration-desc') {
      result.sort((a, b) => toDays(b.duration) - toDays(a.duration));
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialCourses, searchQuery, selectedTrack, selectedDuration, selectedLevel, selectedMode, sortBy]);

  // Reset pagination when any filter or sort option changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedTrack, selectedDuration, selectedLevel, selectedMode, sortBy]);

  // Sliced courses for progressive display
  const visibleCourses = useMemo(() => {
    return filteredCourses.slice(0, visibleCount);
  }, [filteredCourses, visibleCount]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedTrack !== 'all' ||
    selectedDuration !== 'all' ||
    selectedLevel !== 'All' ||
    selectedMode !== 'All'
  );

  const activeFilterCount = [
    Boolean(searchQuery),
    selectedTrack !== 'all',
    selectedDuration !== 'all',
    selectedLevel !== 'All',
    selectedMode !== 'All',
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTrack('all');
    setSelectedDuration('all');
    setSelectedLevel('All');
    setSelectedMode('All');
    setSortBy('featured');
    setVisibleCount(PAGE_SIZE);
  };

  const handleTagClick = (tag: string) => {
    if (searchQuery.trim().toLowerCase() === tag.toLowerCase()) {
      setSearchQuery('');
    } else {
      setSearchQuery(tag);
    }
  };

  // Track course list impression on mount
  const initialTracked = useRef(false);
  useEffect(() => {
    if (!initialTracked.current && initialCourses.length > 0) {
      initialTracked.current = true;
      trackCourseListImpression(
        initialCourses.slice(0, 30).map((c, idx) => ({
          item_id: c.id || c.slug,
          item_name: c.title,
          item_category: c.categories?.[0] || 'Computer Course',
          index: idx + 1,
        })),
        'Course Catalog'
      );
    }
  }, [initialCourses]);

  // Track search queries with 600ms debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return;
    const timer = setTimeout(() => {
      trackSearch(
        searchQuery.trim(),
        filteredCourses.length,
        selectedLevel !== 'All' ? selectedLevel : 'all'
      );
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredCourses.length, selectedLevel]);

  const courseFaqs = [
    {
      q: "What computer and programming courses are available at MSK Institute Shikohabad?",
      a: "MSK Institute offers industry-aligned programs including Python Programming Masterclass, Full-Stack Web Development Bootcamp (MERN Stack: React, Node.js, Express, MongoDB), HTML5 & Tailwind CSS UI Design, JavaScript & React Frontend Engineering, NIELIT CCC (Course on Computer Concepts), and 1-Year ADCA (Advanced Diploma in Computer Applications)."
    },
    {
      q: "Which course is best for beginners with zero coding background?",
      a: "Beginners can start with either the Python Programming Masterclass (for logic, scripting, and backend programming) or HTML5 & CSS3 Modern UI Design (for website creation). For fundamental computer literacy, typing, office tools, and government job qualification, NIELIT CCC or ADCA is the top recommendation."
    },
    {
      q: "Are certificates from MSK Institute verifiable online?",
      a: "Yes! Every student who successfully completes their course and project practicals receives a certificate with a unique Verification ID that can be authenticated 24/7 on our online Certificate Verification Portal (https://www.mskinstitute.in/verify-certificate)."
    },
    {
      q: "What is the learning mode (online vs. offline) for courses?",
      a: "Courses are offered in a flexible Hybrid mode. Students can attend hands-on practical lab sessions at our Shikohabad computer centre (Near Station Road, Firozabad district, UP) or join interactive online live sessions with screen sharing, live doubt clearance, and digital notes."
    },
    {
      q: "What practical projects are included in the Full-Stack Web Development curriculum?",
      a: "Students build production-grade web applications including e-commerce platforms, task management dashboards, secure user authentication systems, RESTful API servers, and responsive portfolio websites using modern React, Tailwind CSS, Node.js, and MongoDB."
    },
    {
      q: "How can I book a free demo class or enroll in a course?",
      a: "You can click 'View Syllabus & Enroll' on any course card to submit a free demo booking form, visit MSK Institute near Station Road in Shikohabad, or contact our admissions coordinator directly at +91 83930 42166."
    }
  ];

  const comparisonData = [
    {
      title: "Python Masterclass",
      slug: "python-mastery-beginner-to-advanced--3-months",
      duration: "3 Months",
      mode: "Online & Offline",
      level: "Beginner",
      certificate: "Verifiable Certificate",
      bestFor: "Software Development, Automation, Scripting & Backend Logic"
    },
    {
      title: "Full-Stack Web Dev (MERN)",
      slug: "full-stack-web-dev-bootcamp",
      duration: "6 Months",
      mode: "Online & Offline",
      level: "Comprehensive",
      certificate: "Full-Stack Engineer Diploma",
      bestFor: "React Frontend, Node.js APIs, MongoDB, Real-World Web Apps"
    },
    {
      title: "Web Designing Pathway",
      slug: "web-designing-complete-pathway--4-months",
      duration: "4 Months",
      mode: "Online & Offline",
      level: "Beginner",
      certificate: "UI Developer Certificate",
      bestFor: "Responsive Layouts, Tailwind CSS, Flexbox/Grid, Web Design"
    },
    {
      title: "Frontend Engineering",
      slug: "frontend-development--8-months",
      duration: "8 Months",
      mode: "Online & Offline",
      level: "Intermediate",
      certificate: "Frontend React Certificate",
      bestFor: "Interactive SPAs, React Hooks, State Management, API Fetching"
    },
    {
      title: "NIELIT CCC Certification",
      slug: "ccc",
      duration: "3 Months",
      mode: "Online & Offline",
      level: "Beginner",
      certificate: "Govt Recognized Certificate",
      bestFor: "Office Tools, Digital Banking, Cyber Safety, Govt Job Prep"
    },
    {
      title: "ADCA (1-Yr Diploma)",
      slug: "adca",
      duration: "12 Months",
      mode: "Offline & Online",
      level: "Complete Diploma",
      certificate: "1-Year Diploma Certificate",
      bestFor: "Advanced Office Suite, Accounting Tally Prime, DTP Photoshop & Web"
    },
    {
      title: "Data Analysis Mastery",
      slug: "data-analysis-mastery-combo-course--12-months",
      duration: "12 Months",
      mode: "Online & Offline",
      level: "Comprehensive",
      certificate: "Data Analyst Specialization Certificate",
      bestFor: "Advanced Excel, SQL, Python, Pandas, Power BI & Business Intelligence Dashboards"
    },
    {
      title: "Power BI Mastery",
      slug: "power-bi-mastery-beginner-to-advanced--3-months",
      duration: "3 Months",
      mode: "Online & Offline",
      level: "Comprehensive",
      certificate: "Power BI BI Specialist Certificate",
      bestFor: "Power Query ETL, DAX Modeling, Interactive KPI Dashboards & Executive Reports"
    }
  ];

  return (
    <div className="space-y-16">
      {/* 1. Main Course Catalog Section (Left Sidebar on Desktop, Responsive Drawer on Mobile) */}
      <section className="space-y-6">
        {/* Career Track Fast-Tabs (Clean horizontal 1-tap navigation without sidebar clutter) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Explore by Career Pathway</span>
            </span>
            {selectedTrack !== 'all' && (
              <button
                onClick={() => setSelectedTrack('all')}
                className="text-xs font-bold text-secondary hover:underline cursor-pointer"
              >
                Reset to All ({initialCourses.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {CAREER_TRACKS.map((track) => {
              const isSel = selectedTrack === track.id;
              const count = trackCounts[track.id] || 0;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer shadow-2xs ${
                    isSel
                      ? 'bg-secondary text-white shadow-xs scale-[1.02]'
                      : 'bg-white border border-border-subtle text-text-main hover:text-primary hover:bg-surface'
                  }`}
                >
                  <span className="text-sm">{track.icon}</span>
                  <span>{track.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSel ? 'bg-white/25 text-white' : 'bg-surface text-text-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile-Only Top Search & Filter Bar (< lg) */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-grow">
              <label htmlFor="mobile-catalog-search" className="sr-only">Search courses</label>
              <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <input
                id="mobile-catalog-search"
                type="text"
                placeholder="Search courses (e.g. Python, MERN, React)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-secondary transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 p-0.5 text-text-muted hover:text-primary transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile View Mode Switcher */}
            <div className="flex items-center bg-white border border-border-subtle rounded-xl p-1 shadow-2xs shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white shadow-2xs font-bold'
                    : 'text-text-muted hover:text-primary'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-primary text-white shadow-2xs font-bold'
                    : 'text-text-muted hover:text-primary'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Drawer Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
              aria-label="Open filter options"
            >
              <SlidersHorizontal className="w-4 h-4 text-secondary" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Trending Tags horizontally scrollable on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Flame className="w-3.5 h-3.5 text-secondary" />
              <span>Hot:</span>
            </span>
            {TRENDING_TAGS.map((tag) => {
              const isTagActive = searchQuery.trim().toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isTagActive
                      ? 'bg-secondary text-white font-bold shadow-2xs'
                      : 'bg-white border border-border-subtle text-text-muted hover:text-primary hover:bg-surface'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Quick-Scroll Difficulty Level Pills on Phone */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {levels.map((lvl) => {
              const isSel = selectedLevel === lvl;
              const count = lvl === 'All' ? initialCourses.length : levelCounts[lvl] || 0;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isSel
                      ? 'bg-primary text-white font-bold shadow-2xs'
                      : 'bg-white border border-border-subtle text-text-muted hover:text-primary hover:bg-surface'
                  }`}
                >
                  {lvl} <span className="opacity-75 text-[10px] ml-0.5">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop & Tablet Main Content: Left Sidebar + Right Catalog Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ===================== LEFT SIDEBAR (Desktop: lg:block) ===================== */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 space-y-6 sticky top-24 select-none max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
            {/* Main Filters Box */}
            <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-xs space-y-5">
              {/* Header with Title & Reset Button */}
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2 font-bold text-sm text-primary">
                  <SlidersHorizontal className="w-4 h-4 text-secondary" />
                  <span>Filter Courses</span>
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-secondary/15 text-secondary text-[10px] font-black rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary-light transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* Search Field & Trending Quick Chips */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="desktop-catalog-search" className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                    <input
                      id="desktop-catalog-search"
                      type="text"
                      placeholder="Python, MERN, React..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-surface border border-border-subtle rounded-xl text-xs text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-text-muted hover:text-primary transition-colors cursor-pointer"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Trending Topics Tags */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    <Flame className="w-3 h-3 text-secondary" />
                    <span>Trending Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_TAGS.map((tag) => {
                      const isTagActive = searchQuery.trim().toLowerCase() === tag.toLowerCase();
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagClick(tag)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                            isTagActive
                              ? 'bg-secondary text-white font-bold shadow-2xs'
                              : 'bg-surface hover:bg-slate-100 text-text-muted hover:text-primary font-medium border border-border-subtle/80 hover:border-secondary/40'
                          }`}
                        >
                          <span>{tag}</span>
                          {isTagActive && <X className="w-2.5 h-2.5 text-white/90" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Course Duration Filter (NEW) */}
              <div className="space-y-2 pt-3 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span>Course Duration</span>
                  </span>
                  {selectedDuration !== 'all' && (
                    <button
                      onClick={() => setSelectedDuration('all')}
                      className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSel = selectedDuration === opt.id;
                    const count = durationCounts[opt.id] || 0;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedDuration(opt.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSel
                            ? 'bg-secondary/10 text-secondary font-bold border-l-4 border-l-secondary pl-2 shadow-2xs'
                            : 'text-text-muted hover:text-primary hover:bg-surface font-medium'
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span>{opt.label}</span>
                          {opt.desc && (
                            <span className="text-[10px] text-text-muted/70 font-normal">
                              {opt.desc}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                            isSel ? 'bg-secondary text-white font-bold' : 'bg-surface text-text-muted'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Level Filter */}
              <div className="space-y-2 pt-3 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                    <span>Difficulty Level</span>
                  </span>
                  {selectedLevel !== 'All' && (
                    <button
                      onClick={() => setSelectedLevel('All')}
                      className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {levels.map((lvl) => {
                    const isSel = selectedLevel === lvl;
                    const count = levelCounts[lvl] || 0;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-2 py-2 rounded-xl text-xs transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                          isSel
                            ? 'bg-primary text-white font-bold shadow-2xs'
                            : 'bg-surface hover:bg-slate-100 text-text-muted hover:text-primary font-medium border border-border-subtle/60'
                        }`}
                      >
                        <span>{lvl}</span>
                        <span className={`text-[10px] ${isSel ? 'text-white/80' : 'text-text-muted/70'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Learning Mode Filter */}
              <div className="space-y-2 pt-3 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-secondary" />
                    <span>Learning Mode</span>
                  </span>
                  {selectedMode !== 'All' && (
                    <button
                      onClick={() => setSelectedMode('All')}
                      className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {modes.map((md) => {
                    const isSel = selectedMode === md.key;
                    const count = modeCounts[md.key] || 0;
                    return (
                      <button
                        key={md.key}
                        onClick={() => setSelectedMode(md.key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSel
                            ? 'bg-secondary/10 text-secondary font-bold border-l-4 border-l-secondary pl-2 shadow-2xs'
                            : 'text-text-muted hover:text-primary hover:bg-surface font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {md.key === 'ONLINE' ? (
                            <Globe className="w-3.5 h-3.5" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5" />
                          )}
                          <span>{md.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isSel ? 'bg-secondary text-white font-bold' : 'bg-surface text-text-muted'
                            }`}
                          >
                            {count}
                          </span>
                          {isSel && <Check className="w-3.5 h-3.5 text-secondary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Career Advisory Card in Left Sidebar */}
            <div className="bg-gradient-to-br from-primary to-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-secondary">
                <PhoneCall className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Need Guidance?</span>
              </div>
              <h4 className="font-bold text-sm">Talk to Er. Sumit Kumar</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Confused between Python, Web Development, or CCC? Get free 1-on-1 course counseling.
              </p>
              <a
                href="tel:+918393042166"
                className="inline-flex items-center justify-center w-full py-2 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Call +91 83930 42166
              </a>
            </div>
          </aside>

          {/* ===================== RIGHT MAIN CATALOG AREA ===================== */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Top Status & Controls Bar: Count, View Mode Switcher & Sort By */}
            <div className="bg-white rounded-2xl border border-border-subtle p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-primary">
                  Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
                </span>
                {hasActiveFilters && (
                  <span className="text-xs text-text-muted">
                    (filtered from {initialCourses.length})
                  </span>
                )}
              </div>

              {/* View Mode Switcher & Sort By Dropdown */}
              <div className="flex items-center gap-3">
                {/* View Switcher (Desktop & Tablet) */}
                <div className="hidden sm:flex items-center bg-surface border border-border-subtle rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-secondary shadow-xs font-bold'
                        : 'text-text-muted hover:text-primary'
                    }`}
                    title="Grid View"
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-secondary shadow-xs font-bold'
                        : 'text-text-muted hover:text-primary'
                    }`}
                    title="List View"
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5">
                  <label htmlFor="catalog-sort" className="text-xs font-semibold text-text-muted shrink-0 hidden sm:inline">
                    Sort:
                  </label>
                  <select
                    id="catalog-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="p-1.5 px-2 bg-surface border border-border-subtle rounded-xl text-xs font-medium text-primary focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="duration-asc">Duration: Shortest First</option>
                    <option value="duration-desc">Duration: Longest First</option>
                    <option value="alphabetical">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Tags Bar (Removable Pills) */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-text-muted">Active:</span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface border border-border-subtle rounded-lg text-xs text-primary font-medium">
                    <span>Keyword: &quot;{searchQuery}&quot;</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-secondary cursor-pointer"
                      aria-label="Remove search filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedTrack !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface border border-border-subtle rounded-lg text-xs text-primary font-medium">
                    <span>Track: {CAREER_TRACKS.find((t) => t.id === selectedTrack)?.label}</span>
                    <button
                      onClick={() => setSelectedTrack('all')}
                      className="hover:text-secondary cursor-pointer"
                      aria-label="Remove track filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedDuration !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface border border-border-subtle rounded-lg text-xs text-primary font-medium">
                    <span>Duration: {DURATION_OPTIONS.find((d) => d.id === selectedDuration)?.shortLabel}</span>
                    <button
                      onClick={() => setSelectedDuration('all')}
                      className="hover:text-secondary cursor-pointer"
                      aria-label="Remove duration filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedLevel !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface border border-border-subtle rounded-lg text-xs text-primary font-medium">
                    <span>Level: {selectedLevel}</span>
                    <button
                      onClick={() => setSelectedLevel('All')}
                      className="hover:text-secondary cursor-pointer"
                      aria-label="Remove level filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedMode !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface border border-border-subtle rounded-lg text-xs text-primary font-medium">
                    <span>Mode: {selectedMode === 'BOTH' ? 'Online & Offline' : selectedMode}</span>
                    <button
                      onClick={() => setSelectedMode('All')}
                      className="hover:text-secondary cursor-pointer"
                      aria-label="Remove mode filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-secondary hover:underline cursor-pointer ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Course Grid / List Results (Progressive Display) */}
            {filteredCourses.length > 0 ? (
              <div className="space-y-8">
                {viewMode === 'grid' ? (
                  /* ================= GRID VIEW ================= */
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6">
                    {visibleCourses.map((course, idx) => {
                      const isFlagship = FLAGSHIP_SLUGS.has(course.slug);
                      const whatsappMsg = encodeURIComponent(
                        `Hi MSK Institute, I am interested in the "${course.title}" course. Please share demo timings, fee structure, and syllabus details.`
                      );
                      const whatsappUrl = `https://wa.me/918393042166?text=${whatsappMsg}`;

                      const handleCourseSelect = () => {
                        trackCourseSelection(
                          {
                            item_id: course.id || course.slug,
                            item_name: course.title,
                            item_category: course.categories?.[0] || 'Computer Course',
                            index: idx + 1,
                          },
                          'Course Catalog'
                        );
                      };

                      return (
                        <div
                          key={course.id}
                          className="group bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
                        >
                          <Link
                            href={`/courses/${course.slug}`}
                            onClick={handleCourseSelect}
                            className="relative h-44 sm:h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden block"
                            aria-label={course.title}
                          >
                            {course.featuredImageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={course.featuredImageUrl}
                                alt={`${course.title} at MSK Institute Shikohabad`}
                                width={600}
                                height={340}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/10 text-primary">
                                <BookOpen className="w-10 h-10 text-secondary mb-1 opacity-70" />
                                <span className="text-xs font-black uppercase tracking-wider text-center">{course.title}</span>
                              </div>
                            )}

                            {/* Popular / Flagship Ribbon */}
                            {isFlagship && (
                              <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm backdrop-blur-xs flex items-center gap-1 z-10">
                                <Sparkles className="w-3 h-3" />
                                Popular
                              </span>
                            )}

                            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary/95 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs z-10">
                              {course.level}
                            </span>
                          </Link>

                          <div className="p-4 sm:p-5 flex-grow flex flex-col gap-3.5 sm:gap-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1.5">
                                {course.categories.slice(0, 2).map((cat, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] uppercase font-black text-[#B83A00] tracking-wider px-2 py-0.5 bg-[#B83A00]/10 rounded"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                              <h2 className="text-base sm:text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                                <Link href={`/courses/${course.slug}`} onClick={handleCourseSelect} className="hover:underline">
                                  {course.title}
                                </Link>
                              </h2>
                              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                {course.shortDescription}
                              </p>
                            </div>

                            <div className="space-y-3 mt-auto pt-3 sm:pt-4 border-t border-border-subtle">
                              <div className="flex items-center justify-between text-xs text-text-muted">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <Clock className="w-4 h-4 text-secondary shrink-0" />
                                  <span>{course.duration.value} {course.duration.unit}</span>
                                </span>
                                <span className="flex items-center gap-1 font-semibold">
                                  {course.mode === 'BOTH' ? (
                                    <>
                                      <Laptop className="w-3.5 h-3.5 text-secondary shrink-0" />
                                      <span>Online &amp; Offline</span>
                                    </>
                                  ) : course.mode === 'OFFLINE' ? (
                                    <>
                                      <Laptop className="w-3.5 h-3.5 text-secondary shrink-0" />
                                      <span>Offline Lab</span>
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="w-3.5 h-3.5 text-secondary shrink-0" />
                                      <span>Online Only</span>
                                    </>
                                  )}
                                </span>
                              </div>

                              {/* Micro Trust Row: Verifiable Certificate & Free Demo */}
                              <div className="flex items-center justify-between text-[11px] px-2.5 py-1 bg-surface rounded-lg border border-border-subtle/80 text-text-muted">
                                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Verified Certificate</span>
                                </span>
                                <span className="font-bold text-secondary text-[10px] uppercase tracking-wider">Free Demo</span>
                              </div>

                              {/* Card Action Row: Enroll CTA + WhatsApp Quick Enquiry + Share */}
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Link
                                  href={`/courses/${course.slug}`}
                                  onClick={handleCourseSelect}
                                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer text-center"
                                >
                                  <span className="truncate">View Syllabus &amp; Enroll</span>
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                </Link>

                                {/* 1-Tap Direct WhatsApp Admission Enquiry */}
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-[38px] w-[38px] p-0 flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all shrink-0 cursor-pointer shadow-2xs hover:border-emerald-300 active:scale-95"
                                  aria-label={`Enquire about ${course.title} on WhatsApp`}
                                  title="Enquire on WhatsApp"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                  </svg>
                                </a>

                                {/* Share Button */}
                                <WebShareButton
                                  variant="icon"
                                  title={`${course.title} | MSK Institute Shikohabad`}
                                  text={`Explore ${course.title} course at MSK Institute Shikohabad: ${course.shortDescription}`}
                                  url={`/courses/${course.slug}`}
                                  label={`Share ${course.title}`}
                                  className="h-[38px] w-[38px] p-0 flex items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-white text-text-muted hover:text-secondary shadow-2xs hover:border-secondary/40 transition-all shrink-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ================= LIST VIEW ================= */
                  <div className="flex flex-col gap-4">
                    {visibleCourses.map((course, idx) => {
                      const isFlagship = FLAGSHIP_SLUGS.has(course.slug);
                      const whatsappMsg = encodeURIComponent(
                        `Hi MSK Institute, I am interested in the "${course.title}" course. Please share demo timings, fee structure, and syllabus details.`
                      );
                      const whatsappUrl = `https://wa.me/918393042166?text=${whatsappMsg}`;

                      const handleCourseSelect = () => {
                        trackCourseSelection(
                          {
                            item_id: course.id || course.slug,
                            item_name: course.title,
                            item_category: course.categories?.[0] || 'Computer Course',
                            index: idx + 1,
                          },
                          'Course Catalog'
                        );
                      };

                      return (
                        <div
                          key={course.id}
                          className="group bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row"
                        >
                          {/* Left Thumbnail (Fixed aspect ratio / width on sm+) */}
                          <Link
                            href={`/courses/${course.slug}`}
                            onClick={handleCourseSelect}
                            className="relative sm:w-56 md:w-64 lg:w-60 xl:w-68 shrink-0 h-44 sm:h-auto bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden block"
                            aria-label={course.title}
                          >
                            {course.featuredImageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={course.featuredImageUrl}
                                alt={`${course.title} at MSK Institute Shikohabad`}
                                width={400}
                                height={240}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/10 text-primary min-h-[140px]">
                                <BookOpen className="w-9 h-9 text-secondary mb-1 opacity-70" />
                                <span className="text-xs font-black uppercase tracking-wider text-center">{course.title}</span>
                              </div>
                            )}

                            {/* Popular Ribbon */}
                            {isFlagship && (
                              <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
                                <Sparkles className="w-3 h-3" />
                                Popular
                              </span>
                            )}

                            <span className="absolute top-3 right-3 bg-primary/95 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm z-10">
                              {course.level}
                            </span>
                          </Link>

                          {/* Content Details */}
                          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {course.categories.slice(0, 3).map((cat, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] uppercase font-black text-[#B83A00] tracking-wider px-2 py-0.5 bg-[#B83A00]/10 rounded"
                                  >
                                    {cat}
                                  </span>
                                ))}
                                {course.courseType === 'COMBO' && (
                                  <span className="text-[10px] uppercase font-black text-indigo-700 tracking-wider px-2 py-0.5 bg-indigo-50 border border-indigo-200/60 rounded">
                                    Career Track Diploma
                                  </span>
                                )}
                              </div>

                              <h2 className="text-base sm:text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
                                <Link href={`/courses/${course.slug}`} onClick={handleCourseSelect} className="hover:underline">
                                  {course.title}
                                </Link>
                              </h2>

                              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                {course.shortDescription}
                              </p>
                            </div>

                            {/* Metadata & Trust Info */}
                            <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
                              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <Clock className="w-4 h-4 text-secondary shrink-0" />
                                  <span>{course.duration.value} {course.duration.unit}</span>
                                </span>

                                <span className="flex items-center gap-1 font-semibold">
                                  {course.mode === 'BOTH' ? (
                                    <>
                                      <Laptop className="w-3.5 h-3.5 text-secondary shrink-0" />
                                      <span>Online &amp; Offline</span>
                                    </>
                                  ) : course.mode === 'OFFLINE' ? (
                                    <>
                                      <Laptop className="w-3.5 h-3.5 text-secondary shrink-0" />
                                      <span>Offline Lab</span>
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="w-3.5 h-3.5 text-secondary shrink-0" />
                                      <span>Online Only</span>
                                    </>
                                  )}
                                </span>

                                <span className="hidden md:inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px] px-2 py-0.5 bg-emerald-50 border border-emerald-200/60 rounded-md">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Verified Certificate</span>
                                </span>
                              </div>

                              {/* Action CTA Buttons */}
                              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <Link
                                  href={`/courses/${course.slug}`}
                                  onClick={handleCourseSelect}
                                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                                >
                                  <span>View Syllabus &amp; Enroll</span>
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                </Link>

                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-[34px] w-[34px] p-0 flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all shrink-0 cursor-pointer shadow-2xs hover:border-emerald-300 active:scale-95"
                                  aria-label={`Enquire about ${course.title} on WhatsApp`}
                                  title="Enquire on WhatsApp"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                  </svg>
                                </a>

                                <WebShareButton
                                  variant="icon"
                                  title={`${course.title} | MSK Institute Shikohabad`}
                                  text={`Explore ${course.title} course at MSK Institute Shikohabad: ${course.shortDescription}`}
                                  url={`/courses/${course.slug}`}
                                  label={`Share ${course.title}`}
                                  className="h-[34px] w-[34px] p-0 flex items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-white text-text-muted hover:text-secondary shadow-2xs hover:border-secondary/40 transition-all shrink-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Progressive "Load More" Engine */}
                {filteredCourses.length > visibleCount && (
                  <div className="pt-6 pb-2 text-center space-y-3 bg-white rounded-2xl border border-border-subtle p-6 shadow-2xs">
                    <div className="text-xs text-text-muted font-medium">
                      Showing <span className="font-bold text-primary">{visibleCourses.length}</span> of{' '}
                      <span className="font-bold text-primary">{filteredCourses.length}</span> courses
                    </div>
                    {/* Animated percentage progress bar */}
                    <div className="w-56 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-300"
                        style={{ width: `${Math.round((visibleCourses.length / filteredCourses.length) * 100)}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredCourses.length))}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <span>Load More Courses (+{Math.min(PAGE_SIZE, filteredCourses.length - visibleCount)})</span>
                        <ChevronDown className="w-4 h-4 text-secondary" />
                      </button>
                      <button
                        onClick={() => setVisibleCount(filteredCourses.length)}
                        className="px-4 py-3 bg-surface hover:bg-slate-100 border border-border-subtle text-text-muted hover:text-primary font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Show All ({filteredCourses.length})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-border-subtle rounded-2xl shadow-sm space-y-4">
                <SlidersHorizontal className="w-12 h-12 text-text-muted mx-auto opacity-60" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-primary">No Courses Matching Filters</h3>
                  <p className="text-text-muted text-xs max-w-sm mx-auto leading-relaxed">
                    We couldn&apos;t find any courses matching your current search or filter combination.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================== MOBILE SLIDE-OUT FILTER DRAWER MODAL (< lg) ===================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-primary">
                <SlidersHorizontal className="w-4 h-4 text-secondary" />
                <span>Filters &amp; Sort</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-secondary text-white text-[10px] font-black rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Sort selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2.5 bg-surface border border-border-subtle rounded-xl text-xs font-medium focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="duration-asc">Duration: Shortest First</option>
                  <option value="duration-desc">Duration: Longest First</option>
                  <option value="alphabetical">Name: A to Z</option>
                </select>
              </div>

              {/* Trending Topics in mobile drawer */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-secondary" />
                  <span>Trending Topics</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_TAGS.map((tag) => {
                    const isTagActive = searchQuery.trim().toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                          isTagActive
                            ? 'bg-secondary text-white font-bold shadow-2xs'
                            : 'bg-surface hover:bg-slate-100 text-text-muted hover:text-primary font-medium border border-border-subtle/80'
                        }`}
                      >
                        <span>{tag}</span>
                        {isTagActive && <X className="w-3 h-3 text-white/90" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Career Pathway Track */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Career Pathway
                  </span>
                  {selectedTrack !== 'all' && (
                    <button
                      onClick={() => setSelectedTrack('all')}
                      className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {CAREER_TRACKS.map((track) => {
                    const isSel = selectedTrack === track.id;
                    const count = trackCounts[track.id] || 0;
                    return (
                      <button
                        key={track.id}
                        onClick={() => setSelectedTrack(track.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSel
                            ? 'bg-secondary/10 text-secondary font-bold border-l-4 border-l-secondary pl-2'
                            : 'text-text-muted hover:text-primary hover:bg-surface font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span>{track.icon}</span>
                          <span>{track.label}</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-muted">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Course Duration Filter (NEW) */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span>Course Duration</span>
                  </span>
                  {selectedDuration !== 'all' && (
                    <button
                      onClick={() => setSelectedDuration('all')}
                      className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSel = selectedDuration === opt.id;
                    const count = durationCounts[opt.id] || 0;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedDuration(opt.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSel
                            ? 'bg-secondary/10 text-secondary font-bold border-l-4 border-l-secondary pl-2'
                            : 'text-text-muted hover:text-primary hover:bg-surface font-medium'
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span>{opt.label}</span>
                          {opt.desc && (
                            <span className="text-[10px] text-text-muted/70 font-normal">
                              {opt.desc}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isSel ? 'bg-secondary text-white font-bold' : 'bg-surface text-text-muted'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Difficulty Level
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {levels.map((lvl) => {
                    const isSel = selectedLevel === lvl;
                    const count = levelCounts[lvl] || 0;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-3 py-2 rounded-xl text-xs transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                          isSel
                            ? 'bg-primary text-white font-bold'
                            : 'bg-surface hover:bg-slate-100 text-text-muted font-medium border border-border-subtle/60'
                        }`}
                      >
                        <span>{lvl}</span>
                        <span className={`text-[10px] ${isSel ? 'text-white/80' : 'text-text-muted/70'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Learning Mode */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Learning Mode
                </span>
                <div className="space-y-1">
                  {modes.map((md) => {
                    const isSel = selectedMode === md.key;
                    const count = modeCounts[md.key] || 0;
                    return (
                      <button
                        key={md.key}
                        onClick={() => setSelectedMode(md.key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSel
                            ? 'bg-secondary/10 text-secondary font-bold border-l-4 border-l-secondary pl-2'
                            : 'text-text-muted hover:text-primary hover:bg-surface font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {md.key === 'ONLINE' ? (
                            <Globe className="w-3.5 h-3.5" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5" />
                          )}
                          <span>{md.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isSel ? 'bg-secondary text-white font-bold' : 'bg-surface text-text-muted'
                            }`}
                          >
                            {count}
                          </span>
                          {isSel && <Check className="w-3.5 h-3.5 text-secondary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border-subtle bg-surface flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 px-3 bg-white border border-border-subtle hover:bg-slate-50 text-text-muted font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-2 py-2.5 px-3 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Show {filteredCourses.length} Courses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Educational Highlights & Learning Ecosystem */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Why Learn at MSK Institute Shikohabad?</h2>
            <p className="text-xs text-text-muted">Structured pedagogy combining real-world development with verified government credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Expert Mentorship</span>
            </div>
            <h3 className="font-bold text-sm text-primary">Er. Sumit Kumar</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Guided by a seasoned Software Engineer with 8+ years experience in production web platforms and programming logic.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">100% Practical Labs</span>
            </div>
            <h3 className="font-bold text-sm text-primary">Project-Driven Learning</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Every theoretical lecture is paired with hands-on lab code assignments, debugging sessions, and portfolio builds.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Verifiable Credentials</span>
            </div>
            <h3 className="font-bold text-sm text-primary">Online Verification</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Students receive ISO &amp; MSK verified certificates with 24/7 online ID authentication portal support.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Modern Campus</span>
            </div>
            <h3 className="font-bold text-sm text-primary">Shikohabad Facility</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Fully air-conditioned computer labs with high-speed internet located near Station Road, Shikohabad (Firozabad, UP).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Course Comparison Matrix (GEO / AI Comparison Data & Decision Table) */}
      <section id="career-matrix" className="space-y-6 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Course Comparison &amp; Career Matrix</h2>
            <p className="text-xs text-text-muted">Compare learning paths, durations, and career outcomes across our computer programs</p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-surface/80 border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="py-3.5 px-6">Course Program</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Mode</th>
                  <th className="py-3.5 px-6">Level</th>
                  <th className="py-3.5 px-6">Key Focus &amp; Outcome</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {comparisonData.map((item, idx) => {
                  const handleSelect = () => {
                    trackCourseSelection(
                      {
                        item_id: item.slug,
                        item_name: item.title,
                        item_category: 'Comparison Matrix',
                        index: idx + 1,
                      },
                      'Course Comparison Matrix'
                    );
                  };

                  return (
                    <tr key={idx} className="hover:bg-surface/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-primary">
                        <Link href={`/courses/${item.slug}`} onClick={handleSelect} className="hover:text-secondary transition-colors">
                          {item.title}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-xs text-text-muted font-semibold">
                        {item.duration}
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-text-muted font-medium">
                          {item.mode}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-primary">
                        {item.level}
                      </td>
                      <td className="py-4 px-6 text-xs text-text-muted max-w-xs">
                        {item.bestFor}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/courses/${item.slug}`}
                          onClick={handleSelect}
                          className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary-light transition-colors"
                        >
                          <span>Syllabus</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-3">
          {comparisonData.map((item, idx) => {
            const handleSelect = () => {
              trackCourseSelection(
                {
                  item_id: item.slug,
                  item_name: item.title,
                  item_category: 'Comparison Matrix',
                  index: idx + 1,
                },
                'Course Comparison Matrix'
              );
            };

            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <Link href={`/courses/${item.slug}`} onClick={handleSelect} className="font-bold text-primary text-sm hover:text-secondary">
                    {item.title}
                  </Link>
                  <span className="text-[10px] font-bold text-[#B83A00] bg-[#B83A00]/10 px-2 py-0.5 rounded uppercase">
                    {item.duration}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {item.bestFor}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs">
                  <span className="text-text-muted">{item.mode}</span>
                  <Link href={`/courses/${item.slug}`} onClick={handleSelect} className="font-bold text-secondary flex items-center gap-1">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Frequently Asked Questions (AI Answer Engine & Student Guide) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Frequently Asked Questions</h2>
            <p className="text-xs text-text-muted">Common queries regarding curriculum, certificates, demo batches, and admissions</p>
          </div>
        </div>

        <div className="space-y-3">
          {courseFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-primary hover:text-secondary transition-colors cursor-pointer gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-black flex-shrink-0">
                      Q
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-secondary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-text-muted leading-relaxed border-t border-border-subtle/50 course-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Counseling & Demo Booking Callout */}
      <section className="bg-primary text-white rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-md">
        <div className="max-w-2xl space-y-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Need help choosing the right course?</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            Get 1-on-1 career counseling from Er. Sumit Kumar or visit our Shikohabad centre for a free demo session in our smart computer laboratory.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="tel:+918393042166" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Admissions: +91 83930 42166</span>
            </a>
            <Link 
              href="/live" 
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-colors"
            >
              View Today&apos;s Live Schedule
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <BookOpen className="w-full h-full object-contain" />
        </div>
      </section>
    </div>
  );
}
