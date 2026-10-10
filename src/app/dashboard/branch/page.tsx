'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Download,
  Printer,
  ShieldCheck,
  Server,
  Wifi,
  Monitor,
  Check,
  X,
  FileText,
  DollarSign,
  Share2,
  LogOut,
  Sparkles,
  PhoneCall,
  MapPin,
  Send,
  Eye,
  Award,
  ChevronRight
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

interface BatchSlot {
  id: string;
  title: string;
  time: string;
  lab: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
}

export default function BranchDashboardPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'batches' | 'staff' | 'financials' | 'infrastructure' | 'compliance'>('overview');

  // Branch Profile Information
  const branchInfo = {
    name: 'MSK Firozabad Tech Center',
    code: 'MSK-FZB-02',
    manager: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Rajesh Sharma',
    email: user?.email || 'branch@mskinstitute.in',
    phone: '+91 94123 45678',
    city: 'Firozabad',
    address: 'Opposite Railway Station Road, Firozabad (U.P.) - 283203',
    revenueShare: 25, // 25% franchise share
    status: 'Active Franchise Center',
    isoCertified: true,
    totalStudents: 64,
    activeBatchesCount: 4,
    totalLabSeats: 97,
    occupiedLabSeats: 90,
    monthlyGross: 185000,
    franchiseShare: 46250,
    hqRemitted: 138750,
  };

  // Local Branch Students
  const [students, setStudents] = useState<BranchStudent[]>([
    {
      id: 'st-1',
      name: 'Vikas Kushwaha',
      regNo: 'MSK-FZB-001',
      course: 'Python Programming & Data Structures Mastery',
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
      name: 'Neha Gupta',
      regNo: 'MSK-FZB-004',
      course: 'Full-Stack Web Development Bootcamp',
      batchTiming: '11:30 AM - 01:30 PM',
      phone: '+91 98765 43213',
      feeTotal: 12000,
      feePaid: 12000,
      feeStatus: 'paid',
    },
    {
      id: 'st-5',
      name: 'Deepak Dixit',
      regNo: 'MSK-FZB-005',
      course: 'Python Programming & Data Structures Mastery',
      batchTiming: '09:00 AM - 11:00 AM',
      phone: '+91 98765 43214',
      feeTotal: 7500,
      feePaid: 3500,
      feeStatus: 'partial',
    },
    {
      id: 'st-6',
      name: 'Amit Rathore',
      regNo: 'MSK-FZB-006',
      course: 'NIELIT CCC Certification Preparation',
      batchTiming: '02:00 PM - 04:00 PM',
      phone: '+91 98765 43215',
      feeTotal: 3500,
      feePaid: 0,
      feeStatus: 'pending',
    },
  ]);

  const [studentSearch, setStudentSearch] = useState('');

  // Batches Slot List
  const [batches, setBatches] = useState<BatchSlot[]>([
    {
      id: 'b-1',
      title: 'Batch A: Python & Data Structures Mastery',
      time: '09:00 AM - 11:00 AM',
      lab: 'Computer Lab 1',
      instructor: 'Manish Gupta',
      capacity: 25,
      enrolled: 24,
      status: 'Ongoing',
    },
    {
      id: 'b-2',
      title: 'Batch B: Full-Stack Web Development',
      time: '11:30 AM - 01:30 PM',
      lab: 'Computer Lab 2',
      instructor: 'Manish Gupta',
      capacity: 30,
      enrolled: 28,
      status: 'Upcoming',
    },
    {
      id: 'b-3',
      title: 'Batch C: NIELIT CCC Core Computing',
      time: '02:00 PM - 04:00 PM',
      lab: 'Computer Lab 1',
      instructor: 'Sunita Devi',
      capacity: 25,
      enrolled: 22,
      status: 'Upcoming',
    },
    {
      id: 'b-4',
      title: 'Batch D: SQL Relational Databases & Schema',
      time: '04:30 PM - 06:30 PM',
      lab: 'Smart Tech Hall',
      instructor: 'Er. Sumit Kumar (Visiting Lead)',
      capacity: 17,
      enrolled: 16,
      status: 'Upcoming',
    },
  ]);

  // Branch Staff List
  const branchStaff = [
    { name: 'Manish Gupta', role: 'Senior Instructor', dept: 'Full Stack & Python', phone: '+91 97531 24680', status: 'In Lab 1' },
    { name: 'Sunita Devi', role: 'Faculty Mentor', dept: 'NIELIT CCC & Basics', phone: '+91 98760 11223', status: 'On Duty' },
    { name: 'Amit Singh', role: 'Admissions Counselor', dept: 'Front Desk Helpline', phone: '+91 94112 33445', status: 'Front Office' },
    { name: 'Kavita Verma', role: 'Center Accountant', dept: 'Finance & Invoices', phone: '+91 98371 55667', status: 'On Duty' },
  ];

  // Financial Settlement History
  const settlements = [
    { month: 'September 2026', gross: 172000, hqShare: 129000, franchiseNet: 43000, status: 'Settled', refId: 'SET-SEP-2609' },
    { month: 'August 2026', gross: 164000, hqShare: 123000, franchiseNet: 41000, status: 'Settled', refId: 'SET-AUG-2608' },
    { month: 'July 2026', gross: 155000, hqShare: 116250, franchiseNet: 38750, status: 'Settled', refId: 'SET-JUL-2607' },
  ];

  // Walk-in Admission Modal
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Python Programming & Data Structures Mastery');
  const [newStudentBatch, setNewStudentBatch] = useState('09:00 AM - 11:00 AM');
  const [newStudentFeeTotal, setNewStudentFeeTotal] = useState(7500);
  const [newStudentFeePaid, setNewStudentFeePaid] = useState(7500);

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentPhone.trim()) {
      toast.error('Please enter student name and contact number.');
      return;
    }

    const regNumber = `MSK-FZB-00${students.length + 1}`;
    const feeStatusVal: 'paid' | 'partial' | 'pending' =
      newStudentFeePaid >= newStudentFeeTotal
        ? 'paid'
        : newStudentFeePaid > 0
        ? 'partial'
        : 'pending';

    const newRec: BranchStudent = {
      id: `st-${Date.now()}`,
      name: newStudentName.trim(),
      regNo: regNumber,
      course: newStudentCourse,
      batchTiming: newStudentBatch,
      phone: newStudentPhone.trim(),
      feeTotal: newStudentFeeTotal,
      feePaid: newStudentFeePaid,
      feeStatus: feeStatusVal,
    };

    setStudents([newRec, ...students]);
    setIsAdmissionModalOpen(false);
    toast.success(`Student admitted! Reg No: ${regNumber}. Admission slip ready.`);
    setNewStudentName('');
    setNewStudentPhone('');
  };

  // Maintenance Ticket Modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('Workstation Monitor Replacement');
  const [ticketDetails, setTicketDetails] = useState('');

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTicketModalOpen(false);
    toast.success('Hardware maintenance ticket escalated to Central HQ Admin.');
    setTicketDetails('');
  };

  // Record Fee Payment Modal
  const [activePaymentStudent, setActivePaymentStudent] = useState<BranchStudent | null>(null);
  const [payAmountInput, setPayAmountInput] = useState<number>(0);

  const handleRecordPayment = () => {
    if (!activePaymentStudent) return;
    const updatedPaid = activePaymentStudent.feePaid + payAmountInput;
    const newStatus: 'paid' | 'partial' | 'pending' =
      updatedPaid >= activePaymentStudent.feeTotal
        ? 'paid'
        : updatedPaid > 0
        ? 'partial'
        : 'pending';

    setStudents(prev =>
      prev.map(s =>
        s.id === activePaymentStudent.id
          ? { ...s, feePaid: updatedPaid, feeStatus: newStatus }
          : s
      )
    );
    toast.success(`Payment of ₹${payAmountInput} recorded for ${activePaymentStudent.name}!`);
    setActivePaymentStudent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Role Navigation Top Strip */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-slate-300">MSK Branch Management System</span>
            <span className="text-slate-500">|</span>
            <span className="bg-amber-500/20 text-amber-300 font-medium px-2 py-0.5 rounded-full border border-amber-500/30">
              Franchise Portal: {branchInfo.code}
            </span>
            <span className="text-slate-400 hidden sm:inline">{branchInfo.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">Quick Role Switcher:</span>
            <Link href="/dashboard/student" className="hover:text-secondary transition-colors">Student</Link>
            <span className="text-slate-600">·</span>
            <Link href="/dashboard/staff" className="hover:text-secondary transition-colors">Faculty</Link>
            <span className="text-slate-600">·</span>
            <Link href="/dashboard/affiliate" className="hover:text-secondary transition-colors">Affiliate</Link>
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

      {/* Main Franchise Header Banner */}
      <div className="bg-gradient-to-r from-primary via-[#0A2540] to-primary-light text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg ring-4 ring-white/10">
                <Building2 className="w-9 h-9" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {branchInfo.name}
                  </h1>
                  <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-400/30 font-medium">
                    {branchInfo.code}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ISO 9001:2015 Approved
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>👤 Manager: <strong>{branchInfo.manager}</strong></span>
                  <span className="text-slate-400">·</span>
                  <span>📍 {branchInfo.city} (U.P.)</span>
                  <span className="text-slate-400">·</span>
                  <span>🤝 Agreement: <strong>{branchInfo.revenueShare}% Franchise Share</strong></span>
                </p>
              </div>
            </div>

            {/* Quick Center Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="bg-gradient-to-r from-secondary to-orange-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Walk-In Admission</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('financials');
                  toast('Opened center royalty and finance ledger.');
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-3 rounded-xl backdrop-blur border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Monthly Accounts</span>
              </button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Total Enrolled</span>
                <GraduationCap className="w-4 h-4 text-secondary" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{branchInfo.totalStudents}</span>
                <span className="text-xs text-slate-300">Students</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">48 Active, 16 Graduated</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Lab Seat Occupancy</span>
                <Monitor className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">92.7%</span>
                <span className="text-xs text-emerald-300 font-medium">90 / 97 Seats</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">2 Labs & 1 Smart Hall</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Month Collection</span>
                <DollarSign className="w-4 h-4 text-amber-300" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹{branchInfo.monthlyGross.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Gross Fees Collected</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>Franchise Net Accrual</span>
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-300">
                  ₹{branchInfo.franchiseShare.toLocaleString('en-IN')}
                </span>
                <span className="text-xs bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-medium">25%</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Ready for settlement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            {[
              { id: 'overview', label: 'Center Overview', icon: Sparkles },
              { id: 'admissions', label: 'Student Admissions Roster', icon: GraduationCap },
              { id: 'batches', label: 'Batches & Lab Timetable', icon: Clock },
              { id: 'staff', label: 'Center Staff & Faculty', icon: Users },
              { id: 'financials', label: 'Franchise Accounts & Royalty', icon: CreditCard },
              { id: 'infrastructure', label: 'Lab Infrastructure & Diagnostics', icon: Monitor },
              { id: 'compliance', label: 'HQ Accreditation & Docs', icon: ShieldCheck },
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

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions & Live Labs Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lab 1 Status */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-secondary flex items-center justify-center font-bold">
                      L1
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Computer Lab 1 (Main Lab)</h3>
                      <p className="text-xs text-slate-500">25 High-Performance Core-i7 Systems</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> In Session
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Current Session:</span>
                    <span className="font-bold text-slate-900">Batch A: Python & Data Structures</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Faculty Trainer:</span>
                    <span>Manish Gupta</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Occupancy:</span>
                    <span className="text-secondary font-bold">24 / 25 Seats (96%)</span>
                  </div>
                </div>
              </div>

              {/* Lab 2 Status */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      L2
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Computer Lab 2 (Web Studio)</h3>
                      <p className="text-xs text-slate-500">30 Dual-Monitor Development Rigs</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                    Starting 11:30 AM
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Next Session:</span>
                    <span className="font-bold text-slate-900">Batch B: Full-Stack Web Development</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Faculty Trainer:</span>
                    <span>Manish Gupta</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Enrolled:</span>
                    <span className="text-primary font-bold">28 / 30 Seats (93%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Schedule & Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Today&apos;s Center Batch Schedule
                  </h3>
                  <button
                    onClick={() => setActiveTab('batches')}
                    className="text-xs text-secondary hover:underline font-semibold"
                  >
                    Manage Batches
                  </button>
                </div>

                <div className="space-y-3">
                  {batches.map((b) => (
                    <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{b.title}</span>
                          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">{b.lab}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          ⏰ {b.time} · Trainer: <strong className="text-slate-700">{b.instructor}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700">
                          {b.enrolled}/{b.capacity} Seats
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Alerts & Infrastructure Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Center Operations & Health
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Wifi className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-800">Fiber Leased Line</p>
                        <p className="text-slate-500">200 Mbps Dedicated</p>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Server className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-800">Workstation PC Rigs</p>
                        <p className="text-slate-500">44 / 45 Operational</p>
                      </div>
                    </div>
                    <span className="text-amber-600 font-bold">1 In Maint.</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                    <p className="font-bold">Pending Tuition Clearance</p>
                    <p className="text-xs">2 students have payment balances due this week.</p>
                    <button
                      onClick={() => setActiveTab('admissions')}
                      className="text-xs underline font-bold pt-1 block"
                    >
                      Inspect student fee ledger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSIONS ROSTER */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Branch Student Admissions & Roster</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enrolled student directory for {branchInfo.name} ({branchInfo.code}).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="bg-secondary hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> New Admission
                </button>
                <button
                  onClick={() => toast.success('Branch student list exported as CSV.')}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-500" /> Export CSV
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name or roll..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Students Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Course Enrolled</th>
                    <th className="p-3">Batch Time</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Fee Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.regNo.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="font-mono text-[11px] text-slate-400">{s.regNo}</p>
                        </td>
                        <td className="p-3 text-slate-700">{s.course}</td>
                        <td className="p-3 text-slate-500">{s.batchTiming}</td>
                        <td className="p-3 font-mono">{s.phone}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                              s.feeStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-700'
                                : s.feeStatus === 'partial'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {s.feeStatus === 'paid' ? 'Paid (₹' + s.feePaid + ')' : s.feeStatus === 'partial' ? 'Due: ₹' + (s.feeTotal - s.feePaid) : 'Pending: ₹' + s.feeTotal}
                          </span>
                        </td>
                        <td className="p-3">
                          {s.feeStatus !== 'paid' ? (
                            <button
                              onClick={() => {
                                setActivePaymentStudent(s);
                                setPayAmountInput(s.feeTotal - s.feePaid);
                              }}
                              className="text-xs bg-primary hover:bg-primary-light text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              Collect Fee
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                window.print();
                              }}
                              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                            >
                              Print Slip
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BATCHES & TIMETABLE */}
        {activeTab === 'batches' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Batches & Classroom Slot Allocation</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Manage computer lab capacities, seating limits, and assigned instructors.
                </p>
              </div>

              <button
                onClick={() => toast.success('New batch timing slot registered.')}
                className="bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
              >
                + Create Batch Slot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-secondary">{b.time}</span>
                    <span className="text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium">
                      {b.lab}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Assigned Instructor: {b.instructor}</p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Seating Occupancy</span>
                      <span className="text-slate-800">{b.enrolled} / {b.capacity} Students ({Math.round((b.enrolled / b.capacity) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-secondary h-full rounded-full"
                        style={{ width: `${Math.round((b.enrolled / b.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF & FACULTY */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Center Staff & Faculty Duty Roster</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Faculty instructors, admission counselors, and lab mentors deployed at {branchInfo.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branchStaff.map((st, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-secondary font-bold flex items-center justify-center shrink-0">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{st.name}</h4>
                      <p className="text-xs text-secondary font-semibold">{st.role}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{st.dept}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-1">{st.phone}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                    {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIALS & ROYALTY */}
        {activeTab === 'financials' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Franchise Accounts & HQ Royalty Ledger</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Agreement: 25.00% Franchise Net Share / 75.00% Central Headquarters Remittance.
                </p>
              </div>

              <button
                onClick={() => toast.success('Monthly settlement report generated!')}
                className="bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Statement PDF
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500">Current Month Gross Collected</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹{branchInfo.monthlyGross.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-500">From 64 enrolled students</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500">Headquarters Royalty (75%)</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹{branchInfo.hqRemitted.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-500">Remitted via auto-clearing</span>
              </div>

              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50">
                <p className="text-xs text-amber-700 font-semibold">Franchise Net Retained (25%)</p>
                <p className="text-2xl font-black text-amber-900 mt-1">₹{branchInfo.franchiseShare.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-700 font-semibold">Cleared & Accrued</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-700">
                Settlement History
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="p-3">Billing Cycle</th>
                    <th className="p-3">Gross Fees</th>
                    <th className="p-3">HQ Share (75%)</th>
                    <th className="p-3">Franchise Net (25%)</th>
                    <th className="p-3">Reference ID</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settlements.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{s.month}</td>
                      <td className="p-3 font-medium">₹{s.gross.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-slate-500">₹{s.hqShare.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-bold text-emerald-700">₹{s.franchiseNet.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{s.refId}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: INFRASTRUCTURE & DIAGNOSTICS */}
        {activeTab === 'infrastructure' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Lab Infrastructure Diagnostics & Inventory</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Hardware systems, networking equipment, and maintenance support.
                </p>
              </div>

              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="bg-secondary hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4" /> Raise Maintenance Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Workstation Health</h4>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                    44/45 Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Intel Core i7-12700 / 16GB DDR4 / 512GB NVMe SSD workstations with Windows 11 Pro and Linux Dual Boot.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Power & Backup</h4>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                    100% Charged
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  10 kVA Online Double-Conversion UPS with 4 hours battery backup during power outages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: HQ ACCREDITATION & DOCS */}
        {activeTab === 'compliance' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">HQ Accreditations & Center Compliance</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Official franchise authorization documents, curriculum guidelines, and test papers from Headquarters.
              </p>
            </div>

            <div className="border-4 border-double border-amber-300 rounded-2xl p-8 bg-amber-50/30 text-center max-w-2xl mx-auto space-y-3">
              <Award className="w-12 h-12 text-amber-600 mx-auto" />
              <h3 className="text-xl font-extrabold text-primary">MSK Authorized Franchise Center</h3>
              <p className="text-xs text-slate-600">
                This certifies that <strong className="text-slate-900">{branchInfo.name} ({branchInfo.code})</strong> is fully recognized and accredited under the ISO 9001:2015 Quality Management Framework.
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Franchise Agreement Valid Through: <strong className="text-slate-800">31 December 2028</strong>
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Center Certificate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: NEW WALK-IN ADMISSION */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">New Walk-In Student Admission</h3>
              <button
                onClick={() => setIsAdmissionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmission} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ankit Sharma"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 00000"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Selection</label>
                  <select
                    value={newStudentCourse}
                    onChange={(e) => setNewStudentCourse(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Python Programming & Data Structures Mastery">Python & AI Mastery (₹7,500)</option>
                    <option value="Full-Stack Web Development Bootcamp">Full-Stack Web (₹12,000)</option>
                    <option value="NIELIT CCC Certification Preparation">NIELIT CCC (₹3,500)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Timing</label>
                  <select
                    value={newStudentBatch}
                    onChange={(e) => setNewStudentBatch(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Lab 1)</option>
                    <option value="11:30 AM - 01:30 PM">11:30 AM - 01:30 PM (Lab 2)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Lab 1)</option>
                    <option value="04:30 PM - 06:30 PM">04:30 PM - 06:30 PM (Lab 2)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Course Fee (₹)</label>
                  <input
                    type="number"
                    value={newStudentFeeTotal}
                    onChange={(e) => setNewStudentFeeTotal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Paid Amount (₹)</label>
                  <input
                    type="number"
                    value={newStudentFeePaid}
                    onChange={(e) => setNewStudentFeePaid(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdmissionModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition-colors shadow"
                >
                  Complete Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT */}
      {activePaymentStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Collect Student Fee</h3>
              <button
                onClick={() => setActivePaymentStudent(null)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <p className="font-bold text-slate-800">{activePaymentStudent.name}</p>
                <p className="text-slate-500">{activePaymentStudent.course}</p>
                <p className="text-slate-500">Total: ₹{activePaymentStudent.feeTotal} · Paid so far: ₹{activePaymentStudent.feePaid}</p>
                <p className="font-bold text-red-600">Balance Due: ₹{activePaymentStudent.feeTotal - activePaymentStudent.feePaid}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount to Collect (₹)</label>
                <input
                  type="number"
                  value={payAmountInput}
                  onChange={(e) => setPayAmountInput(Number(e.target.value))}
                  className="w-full text-sm font-bold p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActivePaymentStudent(null)}
                  className="px-4 py-2 border rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecordPayment}
                  className="bg-primary hover:bg-primary-light text-white font-semibold px-4 py-2 rounded-xl"
                >
                  Confirm Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MAINTENANCE TICKET */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Raise Hardware Maintenance Request</h3>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Workstation Monitor Replacement">Workstation Monitor Replacement</option>
                  <option value="SMPS / Power Supply Failure">SMPS / Power Supply Failure</option>
                  <option value="RAM Upgrade Request">RAM Upgrade Request</option>
                  <option value="Projector Bulb Replacement">Projector Bulb Replacement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">System Number / Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Lab 1 System #14 power supply tripping during boot."
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-xl"
                >
                  Send to HQ Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
