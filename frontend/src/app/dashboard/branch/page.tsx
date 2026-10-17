'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout, { NavSectionConfig } from '@/components/dashboard/DashboardLayout';
import {
  LayoutGrid,
  Users,
  Calendar,
  Monitor,
  CreditCard,
  ShieldCheck,
  Video,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  BarChart3,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BranchStudent {
  id: string;
  name: string;
  regNo: string;
  course: string;
  batchTiming: string;
  phone: string;
  feeTotal: number;
  feePaid: number;
  feeStatus: 'paid' | 'partial' | 'pending';
}

export default function BranchDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    phone: '',
    course: 'Python Programming & AI Mastery',
    batchTiming: '09:00 AM - 11:00 AM',
    feeTotal: 7500,
  });

  // Branch details
  const branchInfo = {
    name: 'MSK Firozabad Tech Center',
    code: 'MSK-FZB-02',
    manager: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Rajesh Sharma',
    email: user?.email || 'branch@mskinstitute.in',
    phone: '+91 94123 45678',
    city: 'Firozabad',
    address: 'Opposite Railway Station Road, Firozabad (U.P.) - 283203',
    totalStudents: 64,
    activeBatchesCount: 4,
    totalLabSeats: 97,
    occupiedLabSeats: 90,
    monthlyGross: 185000,
    franchiseShare: 46250, // 25% share
    hqRemitted: 138750,
    demoLeadsCount: 12,
  };

  // Sidebar config
  const sidebarSections: NavSectionConfig[] = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'admissions', label: 'Admissions & Students', icon: Users, badge: branchInfo.totalStudents, badgeColor: 'cyan' },
        { id: 'batches', label: 'Batches & Timetable', icon: Calendar, badge: branchInfo.activeBatchesCount, badgeColor: 'cyan' },
        { id: 'infrastructure', label: 'Lab Infrastructure', icon: Monitor, badge: '90/97', badgeColor: 'cyan' },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'financials', label: 'Financials & Revenue', icon: CreditCard, badge: '25% Share', badgeColor: 'emerald' },
        { id: 'compliance', label: 'Compliance & ISO', icon: ShieldCheck },
        { id: 'demos', label: 'Demo Leads', icon: Video, badge: 'NEW', badgeColor: 'cyan' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'settings', label: 'Center Settings', icon: Settings },
      ],
    },
  ];

  // Students list
  const [students, setStudents] = useState<BranchStudent[]>([
    {
      id: 'st-1',
      name: 'Vikas Kushwaha',
      regNo: 'MSK-FZB-001',
      course: 'Python Programming & Data Structures',
      batchTiming: '09:00 AM - 11:00 AM',
      phone: '+91 98765 43210',
      feeTotal: 7500,
      feePaid: 7500,
      feeStatus: 'paid',
    },
    {
      id: 'st-2',
      name: 'Pooja Sharma',
      regNo: 'MSK-FZB-002',
      course: 'Full-Stack Web Development Bootcamp',
      batchTiming: '11:30 AM - 01:30 PM',
      phone: '+91 98765 43211',
      feeTotal: 12000,
      feePaid: 6000,
      feeStatus: 'partial',
    },
    {
      id: 'st-3',
      name: 'Rahul Kumar',
      regNo: 'MSK-FZB-003',
      course: 'NIELIT CCC Certification Preparation',
      batchTiming: '02:00 PM - 04:00 PM',
      phone: '+91 98765 43212',
      feeTotal: 3500,
      feePaid: 3500,
      feeStatus: 'paid',
    },
    {
      id: 'st-4',
      name: 'Anjali Verma',
      regNo: 'MSK-FZB-004',
      course: 'Full-Stack Web Development Bootcamp',
      batchTiming: '11:30 AM - 01:30 PM',
      phone: '+91 98765 43213',
      feeTotal: 12000,
      feePaid: 12000,
      feeStatus: 'paid',
    },
  ]);

  const [studentSearch, setStudentSearch] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.regNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.course.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.phone.trim()) {
      toast.error('Please enter name and phone number');
      return;
    }
    const newEntry: BranchStudent = {
      id: `st-${Date.now()}`,
      name: newStudent.name.trim(),
      regNo: `MSK-FZB-0${students.length + 1}`,
      course: newStudent.course,
      batchTiming: newStudent.batchTiming,
      phone: newStudent.phone.trim(),
      feeTotal: Number(newStudent.feeTotal),
      feePaid: Number(newStudent.feeTotal),
      feeStatus: 'paid',
    };
    setStudents([newEntry, ...students]);
    toast.success(`Student ${newEntry.name} enrolled with Reg #${newEntry.regNo}`);
    setIsAddStudentModalOpen(false);
    setNewStudent({
      name: '',
      phone: '',
      course: 'Python Programming & AI Mastery',
      batchTiming: '09:00 AM - 11:00 AM',
      feeTotal: 7500,
    });
  };

  return (
    <DashboardLayout
      role="branch"
      roleSubtitle="FRANCHISE MANAGEMENT"
      sections={sidebarSections}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customUserName={branchInfo.manager}
    >
      {/* =========================================================================
          PANEL 1: DASHBOARD OVERVIEW
         ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Center Operations Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time admissions, batch capacity, and financial status for {branchInfo.name}.
            </p>
          </div>

          {/* 5 Metric Stats Cards (Website Color Theme) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Card 1: Total Students */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#0A2540] transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                TOTAL STUDENTS
              </span>
              <div className="text-3xl font-extrabold text-[#0A2540] mt-1 mb-1">
                {branchInfo.totalStudents}
              </div>
              <p className="text-xs text-slate-500">
                Active enrolled trainees
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <Users className="w-10 h-10 text-[#0A2540]" />
              </div>
            </div>

            {/* Card 2: Active Batches */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#FF6B00] transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ACTIVE BATCHES
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                {branchInfo.activeBatchesCount}
              </div>
              <p className="text-xs text-slate-500">
                Morning & evening slots
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <Calendar className="w-10 h-10 text-[#FF6B00]" />
              </div>
            </div>

            {/* Card 3: Monthly Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-amber-500 transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                MONTHLY REVENUE
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                ₹1.85L
              </div>
              <p className="text-xs text-slate-500">
                Gross collections (Oct)
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <CreditCard className="w-10 h-10 text-amber-600" />
              </div>
            </div>

            {/* Card 4: Lab Seats */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-emerald-500 transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                LAB OCCUPANCY
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                93%
              </div>
              <p className="text-xs text-slate-500">
                {branchInfo.occupiedLabSeats} of {branchInfo.totalLabSeats} seats filled
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <Monitor className="w-10 h-10 text-emerald-600" />
              </div>
            </div>

            {/* Card 5: Demo Leads */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden border-t-4 border-t-[#1E3A5F] transition-all hover:shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                DEMO LEADS
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                {branchInfo.demoLeadsCount}
              </div>
              <p className="text-xs text-slate-500">
                Pending inquiries
              </p>
              <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                <Video className="w-10 h-10 text-[#1E3A5F]" />
              </div>
            </div>
          </div>

          {/* Reminder / Operational Notice */}
          <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-orange-50/80 border border-orange-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <p className="text-slate-800 font-medium">
                Notice: Monthly HQ financial remittance and franchise share credit is scheduled for <span className="font-semibold text-slate-900">15th October 2026</span>.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('financials')}
              className="text-[#FF6B00] font-bold hover:text-[#FF8533] hover:underline flex items-center gap-1 self-start sm:self-auto whitespace-nowrap"
            >
              <span>View Revenue Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Center Batch Operations Row */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Running Lab Batches
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
              {[
                { title: 'Batch A: Python & AI Bootcamp', time: '09:00 AM - 11:00 AM', lab: 'Lab 1', enrolled: 24, capacity: 25, grad: 'from-[#0A2540] to-[#1E3A5F]' },
                { title: 'Batch B: Full Stack Web Dev', time: '11:30 AM - 01:30 PM', lab: 'Lab 2', enrolled: 32, capacity: 35, grad: 'from-[#064E3B] to-[#047857]' },
                { title: 'Batch C: NIELIT CCC & Office', time: '02:00 PM - 04:00 PM', lab: 'Hall 3', enrolled: 28, capacity: 30, grad: 'from-[#FF6B00] to-[#E05300]' },
              ].map((b, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className={`h-24 bg-gradient-to-tr ${b.grad} p-4 flex items-center justify-between text-white`}>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                        {b.lab}
                      </span>
                      <h4 className="font-bold text-sm mt-1 text-white">{b.title}</h4>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-500 font-medium">Timing: {b.time}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Seat Capacity</span>
                        <span className="font-semibold">{b.enrolled}/{b.capacity} Students</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#FF6B00] h-full rounded-full" style={{ width: `${(b.enrolled / b.capacity) * 100}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('batches')}
                      className="w-full py-2 rounded-xl bg-orange-50 hover:bg-[#FF6B00] hover:text-white text-[#FF6B00] font-semibold text-xs transition"
                    >
                      Manage Roster
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 2: ADMISSIONS & STUDENTS
         ========================================================================= */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Student Admissions Directory</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage registered students, issue batch roll numbers, and view fee clearance.
              </p>
            </div>
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B00] text-white font-semibold text-xs hover:bg-[#FF8533] transition shadow-md shadow-orange-500/25 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or course..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Reg No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Batch Timing</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Fee Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-xs">{s.regNo}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{s.course}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{s.batchTiming}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{s.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          s.feeStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {s.feeStatus === 'paid' ? 'Paid in Full' : 'Partial Due'}
                        </span>
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
          PANEL 3: BATCHES & TIMETABLE
         ========================================================================= */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Center Batches & Timetables</h1>
              <p className="text-sm text-slate-500 mt-1">Schedule lab time slots and assigned mentors.</p>
            </div>
            <button
              onClick={() => {
                toast.success('Batch creation form initialized');
                setIsBatchModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Batch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Python & AI Mastery', room: 'Computer Lab 01', time: '09:00 AM - 11:00 AM', trainer: 'Er. Sumit Kumar', count: 24, max: 25 },
              { name: 'Full-Stack Web Dev', room: 'Computer Lab 02', time: '11:30 AM - 01:30 PM', trainer: 'Rahul Singh', count: 32, max: 35 },
              { name: 'NIELIT CCC Certification', room: 'Computer Hall 03', time: '02:00 PM - 04:00 PM', trainer: 'Priya Sharma', count: 28, max: 30 },
              { name: 'Weekend Advanced AI Lab', room: 'Computer Lab 01', time: 'Saturday & Sunday', trainer: 'Er. Sumit Kumar', count: 18, max: 20 },
            ].map((b, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{b.room} · {b.time}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Active</span>
                </div>
                <div className="text-xs text-slate-600">Lead Trainer: <span className="font-semibold text-slate-800">{b.trainer}</span></div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Enrolled: {b.count} / {b.max}</span>
                    <span>{Math.round((b.count / b.max) * 100)}% Occupied</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(b.count / b.max) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 4: LAB INFRASTRUCTURE
         ========================================================================= */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lab Infrastructure & Workstations</h1>
            <p className="text-sm text-slate-500 mt-1">
              Hardware health, 100 Mbps fiber line status, and seat allocation matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Workstations</span>
              <div className="text-3xl font-extrabold text-slate-900">90 / 97 Active</div>
              <p className="text-xs text-emerald-600 font-semibold">7 Standby Units Available</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Fiber Broadband</span>
              <div className="text-3xl font-extrabold text-blue-600">200 Mbps</div>
              <p className="text-xs text-slate-500">Dual line failover active</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Power Backup</span>
              <div className="text-3xl font-extrabold text-emerald-600">Online UPS</div>
              <p className="text-xs text-slate-500">4 Hours backup generator</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 5: FINANCIALS & REVENUE
         ========================================================================= */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financials & Franchise Revenue</h1>
            <p className="text-sm text-slate-500 mt-1">
              Monthly fee collection, 25% franchise share calculation, and HQ remittance statements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm border-t-4 border-t-blue-500">
              <span className="text-xs font-bold text-slate-400 uppercase">Monthly Gross</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">₹{branchInfo.monthlyGross.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Total student collections</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm border-t-4 border-t-emerald-500">
              <span className="text-xs font-bold text-slate-400 uppercase">Franchise Share (25%)</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">₹{branchInfo.franchiseShare.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Credited to center bank</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm border-t-4 border-t-purple-500">
              <span className="text-xs font-bold text-slate-400 uppercase">HQ Remitted (75%)</span>
              <div className="text-3xl font-extrabold text-purple-600 mt-1">₹{branchInfo.hqRemitted.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Curriculum & central certification</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 6: COMPLIANCE & ISO
         ========================================================================= */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ISO 9001:2015 Center Compliance</h1>
            <p className="text-sm text-slate-500 mt-1">
              Center quality audits, certification compliance, and lab safety records.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Center Accreditation Active</h4>
                <p className="text-xs text-slate-600">ISO 9001:2015 Certification valid until December 2027.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL 7: DEMOS
         ========================================================================= */}
      {activeTab === 'demos' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Demo Inquiries & Walk-in Leads</h1>
            <p className="text-sm text-slate-500 mt-1">
              Prospective students booked for offline demo classes at {branchInfo.name}.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            {[
              { name: 'Mohit Sharma', phone: '+91 94123 00011', course: 'Python & AI Mastery', date: 'Tomorrow 11:00 AM' },
              { name: 'Ritu Yadav', phone: '+91 94123 00022', course: 'Full Stack Web Dev', date: 'Tomorrow 11:00 AM' },
              { name: 'Saurabh Dixit', phone: '+91 94123 00033', course: 'NIELIT CCC Course', date: 'Thursday 02:00 PM' },
            ].map((lead, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-sm">
                <div>
                  <h4 className="font-semibold text-slate-900">{lead.name}</h4>
                  <p className="text-xs text-slate-500">{lead.course} · {lead.phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600">{lead.date}</span>
                  <button
                    onClick={() => toast.success(`Call reminder set for ${lead.name}`)}
                    className="block text-[11px] text-slate-500 hover:text-slate-800 underline mt-0.5"
                  >
                    Call Candidate
                  </button>
                </div>
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
            <h1 className="text-2xl font-bold text-slate-900">Center Information & Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Franchise branch address and manager details.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Center Name</label>
                <input type="text" defaultValue={branchInfo.name} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Branch Code</label>
                <input type="text" defaultValue={branchInfo.code} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Director / Manager</label>
                <input type="text" defaultValue={branchInfo.manager} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Address</label>
                <input type="text" defaultValue={branchInfo.address} className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" readOnly />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Enroll New Student */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Enroll New Student</h3>
              <button onClick={() => setIsAddStudentModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Course</label>
                <select
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 text-sm"
                >
                  <option>Python Programming & AI Mastery</option>
                  <option>Full-Stack Web Development Bootcamp</option>
                  <option>NIELIT CCC Certification Preparation</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Total Fee (₹)</label>
                <input
                  type="number"
                  value={newStudent.feeTotal}
                  onChange={(e) => setNewStudent({ ...newStudent, feeTotal: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
                >
                  Confirm Admission
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
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
