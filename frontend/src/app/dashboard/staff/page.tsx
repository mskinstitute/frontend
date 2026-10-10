'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileCheck,
  BookOpen,
  Sparkles,
  Search,
  Check,
  X,
  AlertCircle,
  Share2,
  ShieldCheck,
  LogOut,
  Building2,
  Save,
  MessageSquare,
  Upload,
  Plus,
  Send,
  Eye,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentRosterItem {
  id: string;
  name: string;
  regNo: string;
  course: string;
  status: 'present' | 'absent' | 'late';
}

interface AssignmentSubmission {
  id: string;
  studentName: string;
  regNo: string;
  assignmentTitle: string;
  submissionDate: string;
  githubUrl: string;
  score: number | null;
  status: 'pending' | 'graded';
  feedback: string;
}

export default function StaffDashboardPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'grading' | 'syllabus' | 'leaves'>('overview');

  // Faculty details
  const faculty = {
    name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Er. Sumit Kumar',
    email: user?.email || 'staff@mskinstitute.in',
    designation: 'Senior Technical Instructor & Academic Lead',
    department: 'Computer Science & AI Engineering',
    branch: 'MSK Shikohabad Main Campus',
    branchCode: 'MSK-SHK-01',
    assignedBatches: 3,
    totalStudents: 84,
    rating: '4.9 / 5.0',
    joiningDate: '15 Jan 2023',
  };

  // Batches
  const batches = [
    { id: 'b-py', name: 'Batch A: Python & AI Mastery', time: '09:00 AM - 11:00 AM', room: 'Lab 1', totalStudents: 24, status: 'Active' },
    { id: 'b-fs', name: 'Batch B: Full-Stack Web Development', time: '11:30 AM - 01:30 PM', room: 'Lab 2', totalStudents: 32, status: 'Active' },
    { id: 'b-cc', name: 'Batch C: NIELIT CCC & Core Computing', time: '02:00 PM - 04:00 PM', room: 'Hall 3', totalStudents: 28, status: 'Active' },
  ];
  const [selectedBatchId, setSelectedBatchId] = useState('b-py');

  // Attendance roster state
  const [roster, setRoster] = useState<StudentRosterItem[]>([
    { id: '1', name: 'Aman Yadav', regNo: 'MSK-2026-001', course: 'Python & AI Mastery', status: 'present' },
    { id: '2', name: 'Pooja Sharma', regNo: 'MSK-2026-002', course: 'Python & AI Mastery', status: 'present' },
    { id: '3', name: 'Rahul Kumar', regNo: 'MSK-2026-003', course: 'Python & AI Mastery', status: 'absent' },
    { id: '4', name: 'Vikas Kushwaha', regNo: 'MSK-2026-004', course: 'Python & AI Mastery', status: 'present' },
    { id: '5', name: 'Anjali Verma', regNo: 'MSK-2026-005', course: 'Python & AI Mastery', status: 'late' },
    { id: '6', name: 'Deepak Dixit', regNo: 'MSK-2026-006', course: 'Python & AI Mastery', status: 'present' },
    { id: '7', name: 'Neha Gupta', regNo: 'MSK-2026-007', course: 'Python & AI Mastery', status: 'present' },
    { id: '8', name: 'Shivam Rathore', regNo: 'MSK-2026-008', course: 'Python & AI Mastery', status: 'present' },
  ]);

  const [attendanceSearch, setAttendanceSearch] = useState('');

  // Handle single attendance toggle
  const handleToggleAttendance = (id: string, newStatus: 'present' | 'absent' | 'late') => {
    setRoster(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleMarkAllPresent = () => {
    setRoster(prev => prev.map(s => ({ ...s, status: 'present' })));
    toast.success('Marked all students in batch as Present.');
  };

  const handleSaveAttendance = () => {
    const presentCount = roster.filter(s => s.status === 'present').length;
    const absentCount = roster.filter(s => s.status === 'absent').length;
    const lateCount = roster.filter(s => s.status === 'late').length;
    toast.success(`Attendance submitted: ${presentCount} Present, ${absentCount} Absent, ${lateCount} Late.`);
  };

  // Grading submissions
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([
    {
      id: 'sub-1',
      studentName: 'Aman Yadav',
      regNo: 'MSK-2026-001',
      assignmentTitle: 'Task 4: Build a Django Token Authenticated Student API',
      submissionDate: '10 Oct 2026, 04:30 PM',
      githubUrl: 'https://github.com/aman-yadav/msk-django-api',
      score: null,
      status: 'pending',
      feedback: ''
    },
    {
      id: 'sub-2',
      studentName: 'Pooja Sharma',
      regNo: 'MSK-2026-002',
      assignmentTitle: 'Task 4: Build a Django Token Authenticated Student API',
      submissionDate: '10 Oct 2026, 02:15 PM',
      githubUrl: 'https://github.com/pooja-sh/django-backend-api',
      score: 96,
      status: 'graded',
      feedback: 'Flawless JWT authentication implementation and clean Django serializers.'
    },
    {
      id: 'sub-3',
      studentName: 'Rahul Kumar',
      regNo: 'MSK-2026-003',
      assignmentTitle: 'Task 3: SQL Relational Joins & Schema Design',
      submissionDate: '09 Oct 2026, 11:20 AM',
      githubUrl: 'https://github.com/rahul-k/sql-inventory-assignment',
      score: 88,
      status: 'graded',
      feedback: 'Good query structures. Added foreign key indices for faster join execution.'
    }
  ]);

  const [activeGradingSub, setActiveGradingSub] = useState<AssignmentSubmission | null>(null);
  const [inputScore, setInputScore] = useState<number>(90);
  const [inputFeedback, setInputFeedback] = useState<string>('Excellent code architecture and proper test coverage.');

  const handleSaveGrade = () => {
    if (!activeGradingSub) return;
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === activeGradingSub.id
          ? { ...sub, score: inputScore, feedback: inputFeedback, status: 'graded' }
          : sub
      )
    );
    toast.success(`Grade submitted for ${activeGradingSub.studentName}: ${inputScore}/100.`);
    setActiveGradingSub(null);
  };

  // Live class broadcast simulation
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Leave / requisition desk state
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-1', type: 'Academic Workshop Leave', date: '18 Oct 2026', status: 'Approved', note: 'AI Conference in New Delhi' },
    { id: 'LR-2', type: 'Lab Hardware Requisition', date: '05 Oct 2026', status: 'Fulfilled', note: 'Requested 4 USB Serial Debuggers' }
  ]);
  const [newLeaveType, setNewLeaveType] = useState('Casual Leave');
  const [newLeaveDate, setNewLeaveDate] = useState('');
  const [newLeaveNote, setNewLeaveNote] = useState('');

  const handleCreateLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveNote.trim()) return;
    setLeaveRequests([
      {
        id: `LR-${Math.floor(10 + Math.random() * 90)}`,
        type: newLeaveType,
        date: newLeaveDate || 'Next Week',
        status: 'Under Review',
        note: newLeaveNote.trim()
      },
      ...leaveRequests
    ]);
    setNewLeaveNote('');
    toast.success('Faculty request submitted to Center Manager & Admin.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Role Switcher Strip */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-semibold text-slate-300">MSK Academic Management System</span>
            <span className="text-slate-500">|</span>
            <span className="bg-primary/40 text-blue-300 font-medium px-2 py-0.5 rounded-full border border-blue-500/30">
              Faculty Console: {faculty.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">Quick Role Switcher:</span>
            <Link href="/dashboard/student" className="hover:text-secondary transition-colors">Student Portal</Link>
            <span className="text-slate-600">·</span>
            <Link href="/dashboard/branch" className="hover:text-secondary transition-colors">Branch Portal</Link>
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

      {/* Main Faculty Header Banner */}
      <div className="bg-gradient-to-r from-primary via-[#0A2540] to-primary-light text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg ring-4 ring-white/10">
                {faculty.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {faculty.name}
                  </h1>
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-full border border-blue-400/30 font-medium">
                    Faculty Staff
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>🏛️ {faculty.designation}</span>
                  <span className="text-slate-400">·</span>
                  <span>🔬 {faculty.department}</span>
                  <span className="text-slate-400">·</span>
                  <span>📍 {faculty.branch}</span>
                </p>
              </div>
            </div>

            {/* Start Live Session Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="bg-gradient-to-r from-secondary to-orange-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                <span>Start Live Broadcast</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('attendance');
                  toast('Opened attendance register for today.');
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-3 rounded-xl backdrop-blur border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Take Attendance</span>
              </button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Active Batches</span>
                <BookOpen className="w-4 h-4 text-secondary" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{faculty.assignedBatches}</span>
                <span className="text-xs text-slate-300">Classrooms</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Python, Web, NIELIT CCC</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Total Mentees</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{faculty.totalStudents}</span>
                <span className="text-xs text-emerald-300 font-medium">Enrolled</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">100% verification rate</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Pending Reviews</span>
                <FileCheck className="w-4 h-4 text-amber-300" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">1</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-medium">To Grade</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">2 Assignments graded</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Student Satisfaction</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{faculty.rating}</span>
                <span className="text-xs text-yellow-300">⭐ Top Faculty</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Rank 1 across center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            {[
              { id: 'overview', label: 'Faculty Overview', icon: Sparkles },
              { id: 'attendance', label: 'Student Attendance Marker', icon: CheckCircle2 },
              { id: 'grading', label: 'Assignment & Project Reviews', icon: FileCheck },
              { id: 'syllabus', label: 'Curriculum & Lecture Notes', icon: BookOpen },
              { id: 'leaves', label: 'Leave & Requisition Desk', icon: Calendar },
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

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Today's Timetable Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Today&apos;s Faculty Class Schedule
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  3 Batches Scheduled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {batches.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-secondary">{b.time}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        {b.room}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{b.totalStudents} Enrolled Students</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setSelectedBatchId(b.id);
                          setActiveTab('attendance');
                        }}
                        className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attendance
                      </button>
                      <button
                        onClick={() => setIsBroadcastModalOpen(true)}
                        className="flex-1 bg-primary hover:bg-primary-light text-white text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5 text-secondary" /> Broadcast
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Recent Pending Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-secondary" />
                    Pending Project Evaluations
                  </h3>
                  <button
                    onClick={() => setActiveTab('grading')}
                    className="text-xs text-secondary hover:underline font-semibold"
                  >
                    View All Submissions
                  </button>
                </div>

                <div className="space-y-3">
                  {submissions.filter(s => s.status === 'pending').map((sub) => (
                    <div key={sub.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{sub.studentName}</span>
                          <span className="text-xs font-mono text-slate-500">({sub.regNo})</span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Pending Review
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{sub.assignmentTitle}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Submitted: {sub.submissionDate}</p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveGradingSub(sub);
                          setInputScore(92);
                          setInputFeedback('Great structure and modular serializers.');
                        }}
                        className="bg-secondary hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow shrink-0"
                      >
                        Grade Solution
                      </button>
                    </div>
                  ))}

                  {submissions.filter(s => s.status === 'pending').length === 0 && (
                    <p className="text-xs text-slate-500 py-4 text-center">No pending assignments to review. Great job!</p>
                  )}
                </div>
              </div>

              {/* Announcements Box */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Branch Academic Notices
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-800">Mid-term Project Submissions</p>
                    <p className="text-slate-500">All student projects for Python batch must be evaluated by 15 Oct 2026.</p>
                    <span className="text-[10px] text-slate-400">From Center Manager · Er. Sumit Kumar</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-800">NIELIT CCC Exam Enrollment</p>
                    <p className="text-slate-500">Admit cards for October CCC cycle will be verified on Tuesday.</p>
                    <span className="text-[10px] text-slate-400">From Admissions & Helpline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE MARKER */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student Attendance Register</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Mark daily student presence and synchronize directly with the MSK academic database.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  Mark All Present
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4 text-secondary" />
                  Save & Sync Attendance
                </button>
              </div>
            </div>

            {/* Batch & Search Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Select Batch:</span>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg p-2 font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.time})</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter student name or reg..."
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
            </div>

            {/* Attendance Roster Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Roster ({roster.length} Students)</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-700">Present: {roster.filter(s => s.status === 'present').length}</span>
                  <span className="text-red-700">Absent: {roster.filter(s => s.status === 'absent').length}</span>
                  <span className="text-amber-700">Late: {roster.filter(s => s.status === 'late').length}</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {roster
                  .filter(s => s.name.toLowerCase().includes(attendanceSearch.toLowerCase()) || s.regNo.toLowerCase().includes(attendanceSearch.toLowerCase()))
                  .map((student) => (
                    <div key={student.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">{student.regNo}</p>
                        </div>
                      </div>

                      {/* Attendance Status Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleAttendance(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            student.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> Present
                        </button>

                        <button
                          onClick={() => handleToggleAttendance(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            student.status === 'late'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" /> Late
                        </button>

                        <button
                          onClick={() => handleToggleAttendance(student.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            student.status === 'absent'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" /> Absent
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GRADING & PROJECT REVIEWS */}
        {activeTab === 'grading' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Assignment & Project Reviews</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Inspect submitted student GitHub repositories, assign marks, and write constructive feedback.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-3">Student</th>
                    <th className="p-3">Task Title</th>
                    <th className="p-3">Repository</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{sub.studentName}</p>
                        <p className="font-mono text-[11px] text-slate-400">{sub.regNo}</p>
                      </td>
                      <td className="p-3 text-slate-700">{sub.assignmentTitle}</td>
                      <td className="p-3">
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          GitHub Link
                        </a>
                      </td>
                      <td className="p-3">
                        {sub.score !== null ? (
                          <span className="font-bold text-emerald-600">{sub.score} / 100</span>
                        ) : (
                          <span className="text-slate-400">Not Graded</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            sub.status === 'graded'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {sub.status === 'graded' ? 'Graded' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setActiveGradingSub(sub);
                            setInputScore(sub.score ?? 90);
                            setInputFeedback(sub.feedback || 'Well structured and tested code.');
                          }}
                          className="text-xs bg-slate-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SYLLABUS & NOTES PUBLISHER */}
        {activeTab === 'syllabus' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Curriculum & Notes Publisher</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload lecture slides, code cheat sheets, and mark topics completed for your students.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center space-y-3">
              <Upload className="w-8 h-8 text-secondary mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Publish New Lecture PDF / Cheat Sheet</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribute Python, SQL, or Django tutorial files to all 84 students.
                </p>
              </div>
              <button
                onClick={() => toast.success('Lecture materials published to Student Hub!')}
                className="bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Upload File (.pdf, .zip, .py)
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: LEAVE & REQUISITION DESK */}
        {activeTab === 'leaves' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Faculty Leave & Resource Requisition</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Apply for leave or request lab hardware replacements directly to the Center Admin.
              </p>
            </div>

            <form onSubmit={handleCreateLeaveRequest} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Submit New Request</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Request Category</label>
                  <select
                    value={newLeaveType}
                    onChange={(e) => setNewLeaveType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Casual Leave">Casual Leave (1-2 Days)</option>
                    <option value="Academic Workshop Leave">Academic Workshop / Conference</option>
                    <option value="Lab Hardware Requisition">Lab Hardware / Monitor / Cable Requisition</option>
                    <option value="Curriculum Update Proposal">Curriculum Update Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={newLeaveDate}
                    onChange={(e) => setNewLeaveDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Justification / Details</label>
                <textarea
                  rows={2}
                  value={newLeaveNote}
                  onChange={(e) => setNewLeaveNote(e.target.value)}
                  placeholder="e.g. Attending PyCon Delhi AI Engineering Summit. Guest trainer will take Batch B."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Submit to Center Admin
                </button>
              </div>
            </form>

            {/* List of past requests */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">Past Requests History</h3>
              {leaveRequests.map((lr) => (
                <div key={lr.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{lr.type}</span>
                      <span className="font-mono text-[11px] text-slate-400">({lr.id})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lr.status === 'Approved' || lr.status === 'Fulfilled'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {lr.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{lr.note}</p>
                  </div>
                  <span className="text-xs text-slate-400">{lr.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: BROADCAST SIMULATION */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h3 className="font-bold text-sm sm:text-base">
                  Faculty Studio Broadcast: Batch A Python & AI Mastery
                </h3>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mx-auto">
                <Video className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold">Studio Stream Online</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Streaming from MSK Shikohabad Smart Lab. 24 learners connected. Screen sharing active.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => toast.success('Screen shared to student projectors.')}
                  className="bg-white/10 hover:bg-white/20 text-xs px-4 py-2 rounded-xl border border-white/20"
                >
                  🖥️ Share Screen
                </button>
                <button
                  onClick={() => toast.success('Recording started for student portal archive.')}
                  className="bg-red-600 hover:bg-red-700 text-xs px-4 py-2 rounded-xl font-semibold"
                >
                  🔴 Record Class
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GRADING SUBMISSION */}
      {activeGradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Grade Solution: {activeGradingSub.studentName}
              </h3>
              <button
                onClick={() => setActiveGradingSub(null)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">{activeGradingSub.assignmentTitle}</p>
              <p className="text-slate-500">Student: {activeGradingSub.studentName} ({activeGradingSub.regNo})</p>
              <a
                href={activeGradingSub.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline font-semibold block pt-1"
              >
                Inspect Repository: {activeGradingSub.githubUrl}
              </a>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Marks Awarded (out of 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={inputScore}
                  onChange={(e) => setInputScore(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Constructive Feedback & Notes for Student
                </label>
                <textarea
                  rows={3}
                  value={inputFeedback}
                  onChange={(e) => setInputFeedback(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveGradingSub(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrade}
                className="bg-secondary hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2 rounded-xl transition-colors shadow"
              >
                Save & Publish Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
