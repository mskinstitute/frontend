'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  BookOpen,
  Award,
  Edit2,
  Trash2,
  IndianRupee,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { StudentItem, BranchItem } from '@/types/admin';
import toast from 'react-hot-toast';

interface StudentsTabProps {
  students: StudentItem[];
  branches: BranchItem[];
  onAddStudent: (payload: Partial<StudentItem>) => Promise<boolean>;
  onUpdateStudent: (id: number, payload: Partial<StudentItem>) => Promise<boolean>;
  onDeleteStudent: (id: number) => Promise<boolean>;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
}

export default function StudentsTab({
  students,
  branches,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  isAddOpen,
  setIsAddOpen,
}: StudentsTabProps) {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState('all');

  const [editStudent, setEditStudent] = useState<StudentItem | null>(null);
  const [formData, setFormData] = useState({
    registration_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male' as any,
    branch: '' as string | number,
    course_name: 'Python Programming & Data Structures Mastery',
    batch_timing: '09:00 AM - 11:00 AM',
    fee_total: '7500.00',
    fee_paid: '7500.00',
    certification_status: 'in_progress' as any,
    status: 'active' as any,
  });
  const [submitting, setSubmitting] = useState(false);

  const filtered = students.filter((s) => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      s.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      s.course_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.toLowerCase().includes(search.toLowerCase());
    const matchesBranch =
      branchFilter === 'all' || String(s.branch) === branchFilter;
    const matchesFee = feeFilter === 'all' || s.fee_status === feeFilter;
    return matchesSearch && matchesBranch && matchesFee;
  });

  const openAdd = () => {
    const randNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      registration_number: `MSK-2026-${randNum}`,
      first_name: '',
      last_name: '',
      email: '',
      phone: '+91 ',
      gender: 'male',
      branch: branches[0]?.id || '',
      course_name: 'Python Programming & Data Structures Mastery',
      batch_timing: '09:00 AM - 11:00 AM',
      fee_total: '7500.00',
      fee_paid: '7500.00',
      certification_status: 'in_progress',
      status: 'active',
    });
    setEditStudent(null);
    setIsAddOpen(true);
  };

  const openEdit = (s: StudentItem) => {
    setEditStudent(s);
    setFormData({
      registration_number: s.registration_number,
      first_name: s.first_name,
      last_name: s.last_name,
      email: s.email,
      phone: s.phone,
      gender: s.gender,
      branch: s.branch || '',
      course_name: s.course_name,
      batch_timing: s.batch_timing,
      fee_total: String(s.fee_total),
      fee_paid: String(s.fee_paid),
      certification_status: s.certification_status,
      status: s.status,
    });
    setIsAddOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.email.trim() || !formData.registration_number.trim()) {
      toast.error('Student Name, Email, and Registration Number are required.');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      branch: formData.branch ? Number(formData.branch) : null,
    };

    let success = false;
    if (editStudent) {
      success = await onUpdateStudent(editStudent.id, payload);
    } else {
      success = await onAddStudent(payload);
    }
    setSubmitting(false);

    if (success) {
      setIsAddOpen(false);
      setEditStudent(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove student "${name}"?`)) {
      await onDeleteStudent(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, reg no, course, mobile..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Fee Status</option>
            <option value="paid">Fully Paid</option>
            <option value="partial">Partially Paid</option>
            <option value="pending">Payment Due</option>
          </select>

          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-extrabold tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Student Details</th>
                <th className="py-3.5 px-4">Course Enrolled</th>
                <th className="py-3.5 px-4">Branch & Batch</th>
                <th className="py-3.5 px-4">Tuition Fee Ledger</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-4">Certificate</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No students found matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {s.first_name} {s.last_name}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                        {s.registration_number}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>{s.phone}</span>
                        <span>•</span>
                        <span className="truncate max-w-[130px]">{s.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span className="line-clamp-2 max-w-[220px]">{s.course_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{s.branch_name || 'Main Campus'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.batch_timing}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-bold">
                        ₹{Number(s.fee_paid || 0).toLocaleString('en-IN')}{' '}
                        <span className="text-slate-400 font-normal">/ ₹{Number(s.fee_total || 0).toLocaleString('en-IN')}</span>
                      </div>
                      {Number(s.fee_remaining || 0) > 0 ? (
                        <span className="text-[10px] text-red-600 font-semibold block mt-0.5">
                          Due: ₹{Number(s.fee_remaining || 0).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                          Cleared
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          s.fee_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : s.fee_status === 'partial'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {s.fee_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          s.certification_status === 'certified'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        <span>{s.certification_status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, `${s.first_name} ${s.last_name}`)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-secondary" />
                <span>{editStudent ? 'Edit Student Details' : 'Enroll New Student'}</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Registration No *</label>
                  <input
                    type="text"
                    required
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="e.g. Aman"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="e.g. Yadav"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Branch</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="">Main Campus (Default)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Program</label>
                  <input
                    type="text"
                    required
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    placeholder="e.g. Python Programming"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Schedule</label>
                  <input
                    type="text"
                    value={formData.batch_timing}
                    onChange={(e) => setFormData({ ...formData, batch_timing: e.target.value })}
                    placeholder="e.g. 09:00 AM - 11:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Fee (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.fee_total}
                    onChange={(e) => setFormData({ ...formData, fee_total: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee Paid So Far (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.fee_paid}
                    onChange={(e) => setFormData({ ...formData, fee_paid: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Certification Status</label>
                  <select
                    value={formData.certification_status}
                    onChange={(e) => setFormData({ ...formData, certification_status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="in_progress">Course Ongoing</option>
                    <option value="certified">Certified & Diploma Issued</option>
                    <option value="exam_pending">Exam Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enrollment Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="active">Active Student</option>
                    <option value="completed">Graduated</option>
                    <option value="dropped">Dropped Out</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold shadow-md cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editStudent ? 'Update Student' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
