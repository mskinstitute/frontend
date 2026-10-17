'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import {
  LayoutGrid,
  Calendar,
  CheckCircle2,
  ClipboardList,
  BookOpen,
  Video,
  MessageSquare,
  Code2,
  Settings,
  Users,
  Search,
  Check,
  X,
  AlertCircle,
  Plus,
  Send,
  Star,
  Award,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Grading Modal
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // Faculty details
  const faculty = {
    name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Er. Sumit Kumar',
    email: user?.email || 'staff@mskinstitute.in',
    designation: 'Senior Technical Instructor & Academic Lead',
    department: 'Computer Science & AI Engineering',
    branch: 'MSK Shikohabad Main Campus',
    assignedBatchesCount: 3,
    totalStudents: 84,
    attendanceRateToday: 92,
    pendingReviewsCount: 6,
    rating: '4.9',
  };

  // Sidebar config
  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'batches', label: 'My Batches', icon: Calendar, badge: 3, badgeColor: 'cyan' },
        { id: 'attendance', label: 'Student Attendance', icon: CheckCircle2, badge: 84, badgeColor: 'cyan' },
        { id: 'grading', label: 'Assignment Grading', icon: ClipboardList, badge: 6, badgeColor: 'amber' },
        { id: 'syllabus', label: 'Syllabus Tracker', icon: BookOpen, badge: '75%', badgeColor: 'emerald' },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { id: 'demos', label: 'Demo Sessions', icon: Video, badge: 2, badgeColor: 'cyan' },
        { id: 'doubts', label: 'Doubt Desk', icon: MessageSquare, badge: 2, badgeColor: 'rose' },
        { id: 'labs', label: 'Coding Lab Sandbox', icon: Code2, href: '/playground' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'settings', label: 'Faculty Profile', icon: Settings },
      ],
    },
  ];

  // Batches
  const batches = [
    { id: 'b-py', name: 'Batch A: Python & AI Mastery', time: '09:00 AM - 11:00 AM', room: 'Lab 1', totalStudents: 24, status: 'Active' },
    { id: 'b-fs', name: 'Batch B: Full-Stack Web Development', time: '11:30 AM - 01:30 PM', room: 'Lab 2', totalStudents: 32, status: 'Active' },
    { id: 'b-cc', name: 'Batch C: NIELIT CCC & Computing', time: '02:00 PM - 04:00 PM', room: 'Hall 3', totalStudents: 28, status: 'Active' },
  ];

  // Attendance Roster
  const [roster, setRoster] = useState<StudentRosterItem[]>([
    { id: '1', name: 'Aman Yadav', regNo: 'MSK-2026-001', course: 'Python & AI Mastery', status: 'present' },
    { id: '2', name: 'Pooja Sharma', regNo: 'MSK-2026-002', course: 'Python & AI Mastery', status: 'present' },
    { id: '3', name: 'Rahul Kumar', regNo: 'MSK-2026-003', course: 'Python & AI Mastery', status: 'absent' },
    { id: '4', name: 'Vikas Kushwaha', regNo: 'MSK-2026-004', course: 'Python & AI Mastery', status: 'present' },
    { id: '5', name: 'Anjali Verma', regNo: 'MSK-2026-005', course: 'Python & AI Mastery', status: 'late' },
    { id: '6', name: 'Deepak Dixit', regNo: 'MSK-2026-006', course: 'Python & AI Mastery', status: 'present' },
    { id: '7', name: 'Neha Gupta', regNo: 'MSK-2026-007', course: 'Python & AI Mastery', status: 'present' },
  ]);

  const [rosterSearch, setRosterSearch] = useState('');

  const filteredRoster = roster.filter(
    (s) =>
      s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.regNo.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  const handleToggleAttendance = (id: string, status: 'present' | 'absent' | 'late') => {
    setRoster(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  };

  const handleMarkAllPresent = () => {
    setRoster(prev => prev.map(s => ({ ...s, status: 'present' })));
    toast.success('All students marked Present for today');
  };

  // Submissions to Grade
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([
    {
      id: 'sub-1',
      studentName: 'Aman Yadav',
      regNo: 'MSK-2026-001',
      assignmentTitle: 'Building RESTful APIs with Django',
      submissionDate: '10 Oct 2026',
      githubUrl: 'https://github.com/aman/msk-django-api',
      score: null,
      status: 'pending',
      feedback: '',
    },
    {
      id: 'sub-2',
      studentName: 'Pooja Sharma',
      regNo: 'MSK-2026-002',
      assignmentTitle: 'Responsive Dashboard Design with CSS Grid',
      submissionDate: '09 Oct 2026',
      githubUrl: 'https://github.com/pooja/css-grid-dashboard',
      score: null,
      status: 'pending',
      feedback: '',
    },
    {
      id: 'sub-3',
      studentName: 'Vikas Kushwaha',
      regNo: 'MSK-2026-004',
      assignmentTitle: 'SQL Joins & Data Normalization',
      submissionDate: '07 Oct 2026',
      githubUrl: 'https://github.com/vikas/sql-queries',
      score: 95,
      status: 'graded',
      feedback: 'Excellent normalized database schema and indexes.',
    },
  ]);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setSubmissions(prev =>
      prev.map(s =>
        s.id === selectedSubmission.id
          ? { ...s, score: gradeScore, feedback: gradeFeedback, status: 'graded' }
          : s
      )
    );
    toast.success(`Marks published for ${selectedSubmission.studentName}: ${gradeScore}/100`);
    setSelectedSubmission(null);
  };

  // Doubts Desk
  const [doubts, setDoubts] = useState([
    {
      id: 'd-1',
      studentName: 'Aman Yadav',
      course: 'Python & AI Mastery',
      query: 'How does Django SimpleJWT token rotation prevent replay attacks?',
      reply: 'Rotated refresh tokens are blacklisted immediately once a new token pair is granted.',
      status: 'resolved',
    },
    {
      id: 'd-2',
      studentName: 'Rahul Kumar',
      course: 'Python & AI Mastery',
      query: 'Can we run SQLite and PostgreSQL in parallel in settings.py?',
      reply: '',
      status: 'pending',
    },
  ]);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (doubtId: string) => {
    if (!replyText.trim()) return;
    setDoubts(prev =>
      prev.map(d =>
        d.id === doubtId ? { ...d, reply: replyText.trim(), status: 'resolved' } : d
      )
    );
    setReplyText('');
    toast.success('Reply submitted to student portal');
  };

  return (
    <DashboardLayout
      role="staff"
      roleSubtitle="FACULTY & STAFF PORTAL"
      sections={sidebarSections}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customUserName={faculty.name}
    >
      {/* =========================================================================
          PANEL 1: DASHBOARD OVERVIEW
         ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Faculty Dashboard Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Teaching schedule, student submissions, and daily attendance metrics.
            </p>
          </div>

          {/* 5 Metric Stats Cards (MSK Institute Brand Theme) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Card 1: Assigned Batches */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#0A2540] transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ASSIGNED BATCHES
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                {faculty.assignedBatchesCount}
              </div>
              <p className="text-xs text-slate-500">
                Running lab classrooms
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <Calendar className="w-10 h-10 text-[#0A2540]" />
              </div>
            </div>

            {/* Card 2: Total Students */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#1E3A5F] transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                TOTAL STUDENTS
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                {faculty.totalStudents}
              </div>
              <p className="text-xs text-slate-500">
                Under active mentorship
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <Users className="w-10 h-10 text-[#1E3A5F]" />
              </div>
            </div>

            {/* Card 3: Attendance Today */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-emerald-500 transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ATTENDANCE TODAY
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                {faculty.attendanceRateToday}%
              </div>
              <p className="text-xs text-slate-500">
                Morning batches marked
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
            </div>

            {/* Card 4: Pending Reviews */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#FF6B00] transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                PENDING REVIEWS
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                {faculty.pendingReviewsCount}
              </div>
              <p className="text-xs text-slate-500">
                Lab tasks to grade
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <ClipboardList className="w-10 h-10 text-[#FF6B00]" />
              </div>
            </div>

            {/* Card 5: Mentor Rating */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-amber-500 transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                MENTOR RATING
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1 flex items-center gap-1">
                <span>{faculty.rating}</span>
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 inline" />
              </div>
              <p className="text-xs text-slate-500">
                Student evaluation score
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <Award className="w-10 h-10 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Operational Alert Banner (MSK Institute Brand Theme) */}
          <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-orange-50/80 border border-orange-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <p className="text-slate-800 font-medium">
                Live Workshop Scheduled: <span className="font-semibold text-slate-900">&ldquo;Full Stack Web Dev&rdquo;</span> demo tomorrow at 11:00 AM on Zoom.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('demos')}
              className="text-[#FF6B00] font-semibold hover:text-[#FF8533] hover:underline flex items-center gap-1 self-start sm:self-auto whitespace-nowrap"
            >
              <span>Manage Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Running Batches Summary */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                My Active Classrooms
              </h2>
              <button
                onClick={() => setActiveTab('batches')}
                className="text-sm font-semibold text-[#FF6B00] hover:text-[#FF8533] hover:underline flex items-center gap-1"
              >
                <span>View all batches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {batches.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200">
                        {b.room}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{b.name}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Time: {b.time}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700">{b.totalStudents} Students</span>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="text-[#FF6B00] font-bold hover:underline"
                    >
                      Take Attendance →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 2: BATCHES
         ========================================================================= */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Assigned Batches</h1>
            <p className="text-sm text-slate-500 mt-1">Teaching timetable, classroom rooms, and student counts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batches.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {b.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{b.room}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Daily: {b.time}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-600">{b.totalStudents} Active Trainees</span>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="font-bold text-[#FF6B00] hover:text-[#FF8533] hover:underline"
                  >
                    Open Roster →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 3: STUDENT ATTENDANCE
         ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Classroom Attendance Roster</h1>
              <p className="text-sm text-slate-500 mt-1">
                Mark daily presence for Batch A: Python & AI Mastery (09:00 AM).
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition"
              >
                Mark All Present
              </button>
              <button
                onClick={() => toast.success('Attendance saved to MSK academic cloud!')}
                className="px-3.5 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition shadow-sm"
              >
                Submit Attendance
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search student by name or roll number..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Reg No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoster.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-xs">{s.regNo}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{s.course}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          s.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.status === 'late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleToggleAttendance(s.id, 'present')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            s.status === 'present' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-emerald-100'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(s.id, 'late')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            s.status === 'late' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                          }`}
                        >
                          L
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(s.id, 'absent')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            s.status === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-rose-100'
                          }`}
                        >
                          A
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 4: ASSIGNMENT GRADING
         ========================================================================= */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assignment Submissions & Grading</h1>
            <p className="text-sm text-slate-500 mt-1">Review student code repositories and assign grades with feedback.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Task Title</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Repository</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{sub.studentName}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-700">{sub.assignmentTitle}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{sub.submissionDate}</td>
                      <td className="py-3.5 px-4 text-xs">
                        <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-[#FF6B00] font-semibold hover:underline">
                          View Code ↗
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {sub.score !== null ? `${sub.score}/100` : <span className="text-[#FF6B00] font-semibold text-xs">Ungraded</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setGradeScore(sub.score || 90);
                            setGradeFeedback(sub.feedback || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition"
                        >
                          {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 5: SYLLABUS TRACKER
         ========================================================================= */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Syllabus Completion Tracker</h1>
            <p className="text-sm text-slate-500 mt-1">Track teaching milestones and semester progress.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            {[
              { module: 'Module 1: Python Core & Data Structures', progress: 100, lessons: '8 / 8' },
              { module: 'Module 2: Object-Oriented Programming & Principles', progress: 100, lessons: '6 / 6' },
              { module: 'Module 3: PostgreSQL Schema & Relational Queries', progress: 100, lessons: '5 / 5' },
              { module: 'Module 4: Django REST API & Token Authentication', progress: 75, lessons: '6 / 8' },
              { module: 'Module 5: Next.js Full Stack Frontend Integration', progress: 0, lessons: '0 / 7' },
              { module: 'Module 6: Production AI Capstone Deployment', progress: 0, lessons: '0 / 6' },
            ].map((m, idx) => (
              <div key={idx} className="space-y-1.5 pb-3 border-b border-slate-100 last:border-0">
                <div className="flex justify-between text-sm font-semibold text-slate-800">
                  <span>{m.module}</span>
                  <span className="text-[#FF6B00] font-bold">{m.progress}% ({m.lessons} Lessons)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0A2540] to-[#FF6B00] h-full rounded-full transition-all" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 6: DEMOS
         ========================================================================= */}
      {activeTab === 'demos' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assigned Demo Classes & Workshops</h1>
            <p className="text-sm text-slate-500 mt-1">Lead instructor schedule for live orientations.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-orange-50/80 border border-orange-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF6B00] text-white uppercase">
                  TOMORROW 11:00 AM
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-1">Full Stack Web Development & AI Architecture</h4>
                <p className="text-xs text-slate-600">Zoom Meeting ID: 849 2039 1192 · Passcode: MSK2026</p>
              </div>
              <button
                onClick={() => toast.success('Starting host session on Zoom...')}
                className="px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition shadow-sm"
              >
                Start Zoom Host
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 7: DOUBTS DESK
         ========================================================================= */}
      {activeTab === 'doubts' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Doubt Desk</h1>
            <p className="text-sm text-slate-500 mt-1">Answer questions and clarify coding queries directly.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            {doubts.map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{d.studentName} ({d.course})</span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full ${
                    d.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-[#FF6B00] border border-orange-200'
                  }`}>
                    {d.status === 'resolved' ? 'Resolved' : 'Pending Response'}
                  </span>
                </div>
                <p className="text-sm text-slate-800 font-medium">{d.query}</p>
                {d.reply ? (
                  <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border-l-2 border-emerald-500">
                    <span className="font-bold text-emerald-700">Answer: </span>
                    {d.reply}
                  </div>
                ) : (
                  <div className="pt-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Type your explanation or hint..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                    />
                    <button
                      onClick={() => handleSendReply(d.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition"
                    >
                      Publish Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 8: SETTINGS
         ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Faculty Profile & Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Instructor credentials and academic lead status.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Instructor Name</label>
                <input type="text" defaultValue={faculty.name} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Designation</label>
                <input type="text" defaultValue={faculty.designation} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Department</label>
                <input type="text" defaultValue={faculty.department} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Primary Campus</label>
                <input type="text" defaultValue={faculty.branch} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Grade Assignment</h3>
              <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-xs text-slate-600">
              Student: <span className="font-semibold text-slate-900">{selectedSubmission.studentName}</span> ({selectedSubmission.regNo})
            </p>
            <form onSubmit={handleSaveGrade} className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-700">Score (Out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Instructor Feedback</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="e.g. Well organized code structure and clean commits."
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-white font-semibold text-xs transition shadow-md"
                >
                  Save & Publish Marks
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
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
