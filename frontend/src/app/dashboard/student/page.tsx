'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Award,
  Video,
  Code2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Play,
  QrCode,
  Send,
  MessageSquare,
  Sparkles,
  Users,
  Building2,
  Share2,
  ShieldCheck,
  LogOut,
  Maximize2,
  Check,
  HelpCircle,
  Upload,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'attendance' | 'fees' | 'certificate' | 'labs' | 'support'>('overview');
  const [isLiveClassModalOpen, setIsLiveClassModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  // Simulated dynamic student state
  const studentInfo = {
    name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Aman Yadav',
    email: user?.email || 'student@mskinstitute.in',
    regNo: 'MSK-2026-001',
    branch: 'MSK Shikohabad Main Campus',
    branchCode: 'MSK-SHK-01',
    course: 'Python Programming & Full-Stack AI Mastery',
    batchTime: '09:00 AM - 11:00 AM (Mon - Sat)',
    mentor: 'Er. Sumit Kumar',
    attendancePercent: 94.2,
    presentDays: 38,
    totalDays: 40,
    feeTotal: 7500,
    feePaid: 7500,
    feeDue: 0,
    certificateId: 'MSK-CERT-2026-8091',
    issueDate: '05 October 2026',
    streak: 14,
    grade: 'A+ (96%)'
  };

  // Syllabus modules
  const modules = [
    { id: 1, title: 'Python Fundamentals & Data Structures', lessons: 8, completed: 8, status: 'completed' },
    { id: 2, title: 'Object Oriented Programming & Design Patterns', lessons: 6, completed: 6, status: 'completed' },
    { id: 3, title: 'Relational Databases & SQL Schema Design', lessons: 5, completed: 5, status: 'completed' },
    { id: 4, title: 'Django Web Framework & RESTful APIs', lessons: 8, completed: 6, status: 'in_progress' },
    { id: 5, title: 'Frontend Next.js & React Integration', lessons: 7, completed: 0, status: 'upcoming' },
    { id: 6, title: 'AI Integration & Capstone Production Deployment', lessons: 6, completed: 0, status: 'upcoming' },
  ];

  // Attendance log
  const attendanceLogs = [
    { date: '10 Oct 2026', topic: 'Django REST Framework Serializers & ViewSets', time: '09:00 AM', status: 'Present', mentor: 'Er. Sumit Kumar' },
    { date: '09 Oct 2026', topic: 'Token Authentication & User Permissions', time: '09:00 AM', status: 'Present', mentor: 'Er. Sumit Kumar' },
    { date: '08 Oct 2026', topic: 'Database Migration & Foreign Key Relations', time: '09:05 AM', status: 'Late', mentor: 'Er. Sumit Kumar' },
    { date: '07 Oct 2026', topic: 'Lab Hands-on: Building Django CRUD API', time: '09:00 AM', status: 'Present', mentor: 'Er. Sumit Kumar' },
    { date: '06 Oct 2026', topic: 'Weekly Code Review & Speed Debugging', time: '09:00 AM', status: 'Present', mentor: 'Er. Sumit Kumar' },
    { date: '04 Oct 2026', topic: 'Python Generator Functions & Memory Profiling', time: '09:00 AM', status: 'Present', mentor: 'Er. Sumit Kumar' },
    { date: '03 Oct 2026', topic: 'SQL Joins, Group By & Subqueries Lab', time: '09:00 AM', status: 'Present', mentor: 'Er. Sumit Kumar' },
  ];

  // Support doubts
  const [doubts, setDoubts] = useState([
    { id: 'D-102', query: 'How does Django SimpleJWT token rotation prevent replay attacks?', status: 'Resolved', reply: 'Rotated refresh tokens are blacklisted immediately once a new token pair is granted.' },
    { id: 'D-103', query: 'Can we connect SQLite and PostgreSQL concurrently in settings.py?', status: 'Resolved', reply: 'Yes, through Django multi-database routing configuration.' }
  ]);
  const [newDoubtText, setNewDoubtText] = useState('');

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubtText.trim()) return;
    setDoubts([
      {
        id: `D-${Math.floor(100 + Math.random() * 900)}`,
        query: newDoubtText.trim(),
        status: 'Under Review',
        reply: 'Faculty Er. Sumit Kumar is reviewing your query. Response will be posted shortly.'
      },
      ...doubts
    ]);
    setNewDoubtText('');
    toast.success('Query submitted to Faculty Mentor Er. Sumit Kumar.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Role Navigation Top Strip */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">MSK Academic Portal</span>
            <span className="text-slate-500">|</span>
            <span className="bg-secondary/20 text-secondary font-medium px-2 py-0.5 rounded-full border border-secondary/30">
              Student Role: {studentInfo.name}
            </span>
            <span className="text-slate-400 hidden sm:inline">Reg: {studentInfo.regNo}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">Quick Role Switcher:</span>
            <Link href="/dashboard/staff" className="hover:text-secondary transition-colors">Faculty Portal</Link>
            <span className="text-slate-600">·</span>
            <Link href="/dashboard/affiliate" className="hover:text-secondary transition-colors">Affiliate Portal</Link>
            <span className="text-slate-600">·</span>
            <Link href="/admin" className="hover:text-secondary transition-colors">Super Admin</Link>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 ml-2"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Header Banner */}
      <div className="bg-gradient-to-r from-primary via-[#0A2540] to-primary-light text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-secondary to-orange-400 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg shadow-orange-500/20 ring-4 ring-white/10">
                {studentInfo.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome back, {studentInfo.name.split(' ')[0]}!
                  </h1>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Learner
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>🎓 {studentInfo.course}</span>
                  <span className="text-slate-400">·</span>
                  <span>📍 {studentInfo.branch}</span>
                  <span className="text-slate-400">·</span>
                  <span>⏰ {studentInfo.batchTime}</span>
                </p>
              </div>
            </div>

            {/* Live Class CTA Header Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsLiveClassModalOpen(true)}
                className="bg-gradient-to-r from-red-600 to-secondary text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-red-400/40"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span>Join Live Classroom</span>
              </button>

              <Link
                href="/playground"
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-3 rounded-xl backdrop-blur border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4 text-orange-300" />
                <span>Open Coding Lab</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Course Progress</span>
                <BookOpen className="w-4 h-4 text-secondary" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">75%</span>
                <span className="text-xs text-slate-300">25 / 33 Lessons</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-secondary h-full rounded-full w-3/4" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Overall Attendance</span>
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{studentInfo.attendancePercent}%</span>
                <span className="text-xs text-emerald-300 font-medium">38/40 Days</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Excellent regular attendance</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Tuition Fees</span>
                <CreditCard className="w-4 h-4 text-sky-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹0 Due</span>
                <span className="text-xs bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-medium">Paid</span>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="text-[11px] text-sky-300 hover:text-sky-200 underline mt-1 block"
              >
                View official receipt #8092
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Certificates & Rank</span>
                <Award className="w-4 h-4 text-amber-300" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{studentInfo.grade}</span>
                <span className="text-xs text-amber-300">Top 5%</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">1 Verified Certificate Issued</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Strip */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Sparkles },
              { id: 'courses', label: 'My Course & Syllabus', icon: BookOpen },
              { id: 'attendance', label: 'Attendance & Timetable', icon: Calendar },
              { id: 'fees', label: 'Fee Payments & Invoices', icon: CreditCard },
              { id: 'certificate', label: 'Digital Certificate', icon: Award },
              { id: 'labs', label: 'Coding Labs & Playgrounds', icon: Code2 },
              { id: 'support', label: 'Mentor Doubt Desk', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Live Class Notification Banner */}
            <div className="bg-gradient-to-r from-orange-500 via-secondary to-amber-500 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  LIVE STREAM ACTIVE
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Module 4 Live: Django REST Framework & Production API Architecture
                </h3>
                <p className="text-orange-100 text-sm max-w-2xl">
                  Conducted by Head Faculty <span className="font-semibold text-white">Er. Sumit Kumar</span>.
                  Today&apos;s topic covers JWT Authentication, Token Refresh Cycle, and Role-Based Permissions.
                </p>
              </div>

              <button
                onClick={() => setIsLiveClassModalOpen(true)}
                className="bg-white text-primary font-bold px-6 py-3.5 rounded-xl shadow hover:bg-slate-50 active:scale-95 transition-transform flex items-center justify-center gap-2 shrink-0"
              >
                <Video className="w-5 h-5 text-secondary" />
                Join Class Room Now
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Syllabus Progression */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Course Modules Progress
                    </h3>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                    >
                      View Full Syllabus <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {modules.map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-xl border transition-all ${
                          m.status === 'completed'
                            ? 'bg-slate-50 border-slate-200 text-slate-700'
                            : m.status === 'in_progress'
                            ? 'bg-orange-50/50 border-orange-200 text-slate-900 shadow-sm'
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                m.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : m.status === 'in_progress'
                                  ? 'bg-secondary text-white'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {m.status === 'completed' ? <Check className="w-4 h-4" /> : m.id}
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-800">{m.title}</h4>
                              <p className="text-xs text-slate-500">
                                {m.completed} of {m.lessons} Lessons Completed
                              </p>
                            </div>
                          </div>

                          {m.status === 'in_progress' ? (
                            <button
                              onClick={() => {
                                setActiveTab('courses');
                                toast('Resuming Django Serializers Lesson...');
                              }}
                              className="text-xs bg-secondary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-current" /> Continue
                            </button>
                          ) : m.status === 'completed' ? (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Locked</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignment & Hands-on Box */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Pending Weekly Assignment
                    </h3>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                      Due: Tomorrow, 11:59 PM
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800">
                        Task 4: Build a Django Token Authenticated Student API
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Implement endpoints for student registration, JWT login, and branch profile viewing with tests.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAssignment('Task 4: Build a Django Token Authenticated Student API');
                        setIsAssignmentModalOpen(true);
                      }}
                      className="bg-primary hover:bg-primary-light text-white text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" /> Submit Solution
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Today's Schedule & Quick Labs */}
              <div className="space-y-6">
                {/* Timetable card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Today&apos;s Lab Schedule
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>09:00 AM - 10:15 AM</span>
                        <span className="text-emerald-600 font-semibold">Completed</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">Theory: DRF Authentication</p>
                      <p className="text-xs text-slate-500">Lab Hall A · Er. Sumit Kumar</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/60">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>10:30 AM - 12:00 PM</span>
                        <span className="text-secondary font-bold">In Progress</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">Practical: Django REST API Coding</p>
                      <p className="text-xs text-slate-500">Terminal Lab 2 · Er. Sumit Kumar</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>03:00 PM - 04:30 PM</span>
                        <span className="text-slate-400">Upcoming</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">Doubt Resolution & Mock Test</p>
                      <p className="text-xs text-slate-500">Mentor Cabin 1 · Anita Verma</p>
                    </div>
                  </div>
                </div>

                {/* Direct Coding Lab Launchers */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-secondary" />
                    Interactive Code Labs
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Zero-setup in-browser cloud execution environments built for MSK learners.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/playground"
                      className="p-3 rounded-xl border border-slate-200 hover:border-secondary hover:bg-orange-50/40 transition-colors text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs mb-2">
                        Py
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-secondary">
                        Python Terminal
                      </h4>
                      <p className="text-[11px] text-slate-500">Wasm Cloud Engine</p>
                    </Link>

                    <Link
                      href="/tools"
                      className="p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mb-2">
                        SQL
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary">
                        SQL Studio
                      </h4>
                      <p className="text-[11px] text-slate-500">Schema & Queries</p>
                    </Link>

                    <Link
                      href="/tools"
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs mb-2">
                        DB
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                        DB Viewer
                      </h4>
                      <p className="text-[11px] text-slate-500">Visual Relations</p>
                    </Link>

                    <Link
                      href="/shortcuts"
                      className="p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition-colors text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs mb-2">
                        ⌨️
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-purple-600">
                        TypeQuest
                      </h4>
                      <p className="text-[11px] text-slate-500">Developer WPM</p>
                    </Link>
                  </div>
                </div>

                {/* Certificate Verification Badge */}
                <div className="bg-gradient-to-br from-slate-900 to-primary text-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Official MSK Certificate</h4>
                      <p className="text-xs text-slate-300">ISO 9001:2015 Accredited</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-3">
                    Certificate ID: <span className="font-mono text-amber-300 font-semibold">{studentInfo.certificateId}</span>
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('certificate')}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg flex-1 text-center transition-colors"
                    >
                      Inspect Certificate
                    </button>
                    <Link
                      href={`/verify-certificate?id=${studentInfo.regNo}`}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Public Verification Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSES & SYLLABUS */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{studentInfo.course}</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Instructor: {studentInfo.mentor} · Branch: {studentInfo.branch}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success('Downloaded Syllabus PDF.')}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Download Curriculum PDF
                </button>
                <button
                  onClick={() => setIsLiveClassModalOpen(true)}
                  className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-semibold hover:bg-orange-600 flex items-center gap-1.5 shadow"
                >
                  <Video className="w-4 h-4" />
                  Live Class
                </button>
              </div>
            </div>

            {/* Modules Detail List */}
            <div className="space-y-4">
              {modules.map((m) => (
                <div key={m.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        m.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : m.status === 'in_progress'
                          ? 'bg-secondary text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {m.status === 'completed' ? <Check className="w-4 h-4" /> : m.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{m.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {m.completed}/{m.lessons} Lectures Completed · Includes hands-on project and quiz
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {m.status === 'in_progress' && (
                        <button
                          onClick={() => toast.success('Opened Django REST API Lesson Viewer')}
                          className="bg-primary hover:bg-primary-light text-white text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" /> Watch Lesson 7
                        </button>
                      )}
                      {m.status === 'completed' && (
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          Completed (100%)
                        </span>
                      )}
                      {m.status === 'upcoming' && (
                        <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
                          Unlocks next week
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE & TIMETABLE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm md:col-span-1">
                <h3 className="font-bold text-slate-900 text-base mb-4">Attendance Overview</h3>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-28 h-28 rounded-full border-8 border-emerald-500 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-black text-slate-900">{studentInfo.attendancePercent}%</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Rate</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-4">
                    Present in <span className="font-bold text-slate-900">{studentInfo.presentDays}</span> out of {studentInfo.totalDays} sessions.
                  </p>
                  <span className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Eligible for Final Exam & Placement
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-base">Recent Class Logs</h3>
                  <button
                    onClick={() => toast('Exported Attendance Sheet CSV.')}
                    className="text-xs text-slate-600 hover:text-primary font-medium flex items-center gap-1 border px-3 py-1.5 rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Log
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Subject / Topic</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Mentor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 font-medium text-slate-900">{log.date}</td>
                          <td className="py-3 text-slate-700">{log.topic}</td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                                log.status === 'Present'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">{log.mentor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEES & RECEIPTS */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Tuition Fee Ledger</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Student: {studentInfo.name} · Reg No: {studentInfo.regNo}
                </p>
              </div>

              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="bg-primary hover:bg-primary-light text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Official Fee Receipt
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Total Program Fee</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹{studentInfo.feeTotal.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                <p className="text-xs text-emerald-700">Amount Paid to Date</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">₹{studentInfo.feePaid.toLocaleString('en-IN')}</p>
                <span className="text-[11px] font-medium text-emerald-600">Paid in full · 100% cleared</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Remaining Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹{studentInfo.feeDue.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-400">No overdue payments</span>
              </div>
            </div>

            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-3 font-semibold text-xs text-slate-700">
                Transaction History
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Payment Date</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-mono font-medium">MSK-REC-2026-8092</td>
                    <td className="p-3">15 Jan 2026</td>
                    <td className="p-3">UPI / Net Banking</td>
                    <td className="p-3 font-semibold text-slate-900">₹7,500.00</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Verified
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="text-secondary hover:underline font-semibold"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DIGITAL CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verified Certificate of Completion</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Issued by MSK Institute of Technology & Management (ISO 9001:2015 Accredited)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/verify-certificate?id=${studentInfo.regNo}`}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  Public Verification Link
                </Link>
                <button
                  onClick={() => toast.success('Certificate PDF download started.')}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-light flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" /> Download Certificate
                </button>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="certificate-container border-8 border-double border-secondary/50 rounded-2xl p-8 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 text-center relative overflow-hidden shadow-xl max-w-3xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-primary text-secondary rounded-xl flex items-center justify-center font-black text-xl">
                    MSK
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-slate-900 text-lg tracking-wide uppercase">
                      MSK Institute of Technology
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                      Govt Recognized · ISO 9001:2015 Certified Center
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold pt-4">
                  This Certificate of Excellence is Proudly Presented To
                </p>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-serif tracking-tight">
                  {studentInfo.name}
                </h1>

                <p className="text-xs text-slate-600 max-w-lg mx-auto">
                  for successfully completing all academic requirements, project evaluations, and final code reviews in the course
                </p>

                <h3 className="text-xl font-bold text-secondary">{studentInfo.course}</h3>

                <p className="text-xs text-slate-500">
                  with distinction grade <span className="font-bold text-slate-800">{studentInfo.grade}</span> at{' '}
                  <span className="font-semibold text-slate-800">{studentInfo.branch}</span>.
                </p>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 mt-6">
                  <div className="text-center sm:text-left text-xs text-slate-500">
                    <p className="font-bold text-slate-800">Er. Sumit Kumar</p>
                    <p className="text-[11px]">Director & Head Instructor</p>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <QrCode className="w-10 h-10 text-slate-800" />
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Scan to Verify</p>
                      <p className="text-xs font-mono font-bold text-slate-900">{studentInfo.certificateId}</p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right text-xs text-slate-500">
                    <p className="font-bold text-slate-800">{studentInfo.issueDate}</p>
                    <p className="text-[11px]">Date of Certification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CODING LABS */}
        {activeTab === 'labs' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Developer Coding Labs & Playgrounds</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero-setup, high-speed coding sandboxes and database tools directly connected with course lessons.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-primary text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center font-bold">
                    Py
                  </div>
                  <span className="text-xs font-semibold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    Pyodide Wasm Ready
                  </span>
                </div>
                <h3 className="text-lg font-bold">Python Interactive Cloud Terminal</h3>
                <p className="text-xs text-slate-300">
                  Run Python scripts, experiment with algorithms, parse JSON structures, and execute Django snippets right inside the browser.
                </p>
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Code2 className="w-4 h-4" /> Open Python Terminal
                </Link>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    SQL
                  </div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    SQLite Engine
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">SQL Query Studio</h3>
                <p className="text-xs text-slate-600">
                  Write complex SELECT queries, JOINs, aggregations, and inspect relational schemas with real-time tabular output.
                </p>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Code2 className="w-4 h-4" /> Launch SQL Studio
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DOUBT DESK */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Direct Mentor Doubt Desk</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ask your instructor Er. Sumit Kumar any question regarding your code, assignments, or career guidance.
              </p>
            </div>

            {/* Post query form */}
            <form onSubmit={handlePostDoubt} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Submit New Question / Technical Query</label>
              <textarea
                rows={3}
                value={newDoubtText}
                onChange={(e) => setNewDoubtText(e.target.value)}
                placeholder="e.g. In Django models, how does on_delete=models.SET_NULL differ from models.CASCADE when deleting related records?"
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-secondary hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Submit to Mentor
                </button>
              </div>
            </form>

            {/* Existing Doubts list */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">Your Recent Queries</h3>
              {doubts.map((d) => (
                <div key={d.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-slate-500">{d.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                      d.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{d.query}</p>
                  <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border-l-4 border-secondary">
                    <span className="font-semibold text-primary block mb-0.5">Mentor Response:</span>
                    {d.reply}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: LIVE CLASSROOM SIMULATOR */}
      {isLiveClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-bold text-sm sm:text-base">
                  Live Classroom: DRF Authentication & Token Refresh Architecture
                </h3>
              </div>
              <button
                onClick={() => setIsLiveClassModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Video Player Area */}
            <div className="aspect-video bg-black flex flex-col items-center justify-center relative p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-3">
                <Video className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-white">Live Stream Active: Er. Sumit Kumar</h4>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Transmitting 1080p stream from MSK Shikohabad Main Campus Smart Studio. 24 students connected.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => toast.success('Mic unmuted. Audio connected.')}
                  className="bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-lg border border-white/20"
                >
                  🎙️ Unmute Mic
                </button>
                <button
                  onClick={() => toast.success('Hand raised! Mentor notified.')}
                  className="bg-secondary hover:bg-orange-600 text-xs px-3 py-1.5 rounded-lg font-medium"
                >
                  ✋ Raise Hand
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Connected as: {studentInfo.name} ({studentInfo.regNo})</span>
              <button
                onClick={() => setIsLiveClassModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-semibold"
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: OFFICIAL FEE RECEIPT */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary text-secondary rounded-lg flex items-center justify-center font-bold text-xs">
                  MSK
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Official Fee Receipt</h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Number:</span>
                <span className="font-mono font-bold">MSK-REC-2026-8092</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold">{studentInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll / Reg Number:</span>
                <span className="font-mono">{studentInfo.regNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course Name:</span>
                <span>{studentInfo.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Branch Center:</span>
                <span>{studentInfo.branch}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-slate-900 text-sm">
                <span>Amount Paid:</span>
                <span>₹7,500.00</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Payment Status:</span>
                <span>SUCCESS (Cleared)</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-primary hover:bg-primary-light text-white font-medium text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2.5 border rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGNMENT SUBMISSION */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Submit Assignment Solution</h3>
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">{selectedAssignment}</p>
              <p className="text-xs text-slate-500 mt-1">
                Attach your GitHub repository link or zipped project source code below.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repo URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/your-username/msk-django-api"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Explanation for Mentor</label>
                <textarea
                  rows={2}
                  placeholder="Implemented JWT token auth, custom permissions, and passing test suite."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAssignmentModalOpen(false);
                  toast.success('Assignment submitted successfully! Feedback will be given in 24 hours.');
                }}
                className="bg-secondary hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2 rounded-xl transition-colors shadow"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
