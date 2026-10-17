'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { affiliateApi } from '@/services/affiliateApi';
import {
  GraduationCap,
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminEnrollmentsSubTab() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);

  // Forms
  const [enrollForm, setEnrollForm] = useState({
    student_id: '',
    course_name: 'Full-Stack Web Development (MERN Stack)',
    gross_fee_inr: 25000,
    discount_percent: 10,
  });

  const [paymentForm, setPaymentForm] = useState({
    amount_inr: 5000,
    payment_method: 'UPI',
    transaction_reference: '',
    notes: 'First installment collected at Shikohabad campus',
  });

  const [submitting, setSubmitting] = useState(false);

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await affiliateApi.getAdminEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.student_id) {
      toast.error('Student ID is required');
      return;
    }
    setSubmitting(true);
    try {
      await affiliateApi.createAdminEnrollment({
        student_id: Number(enrollForm.student_id),
        course_name: enrollForm.course_name,
        gross_fee_inr: Number(enrollForm.gross_fee_inr),
        discount_percent: Number(enrollForm.discount_percent),
      });
      toast.success('🎉 Student enrolled & commission snapshot locked!');
      setIsEnrollModalOpen(false);
      loadEnrollments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create enrollment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollment) return;
    setSubmitting(true);
    try {
      await affiliateApi.recordAdminPayment(selectedEnrollment.id, paymentForm);
      toast.success('💰 Payment recorded! Commission proportional credit generated.');
      setIsPaymentModalOpen(false);
      loadEnrollments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = enrollments.filter((e) => {
    return (
      e.student_name.toLowerCase().includes(search.toLowerCase()) ||
      e.course_name.toLowerCase().includes(search.toLowerCase()) ||
      (e.referral_affiliate && e.referral_affiliate.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enrollment by student, course, affiliate..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#1E3A5F] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF8533]" />
            <span>New Admission Enrollment</span>
          </button>
          <button
            onClick={loadEnrollments}
            className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Enrollments Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading course admissions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No course enrollments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3">Net Fee</th>
                <th className="py-3 px-3">Collected</th>
                <th className="py-3 px-3">Due Balance</th>
                <th className="py-3 px-3">Affiliate & Rate</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{e.student_name}</div>
                    <div className="text-[10px] text-slate-500">{e.student_phone || e.student_email}</div>
                  </td>
                  <td className="py-3 px-3 max-w-[180px]">
                    <div className="font-medium text-slate-800 line-clamp-1">{e.course_name}</div>
                    <div className="text-[10px] text-slate-400">ID #{e.id}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    ₹{e.net_fee_inr.toLocaleString('en-IN')}
                    {e.discount_percent > 0 && (
                      <span className="text-[10px] text-emerald-600 block">(-{e.discount_percent}% Disc)</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    ₹{e.fee_collected_inr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600">
                    ₹{e.balance_due_inr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    {e.referral_affiliate ? (
                      <div>
                        <div className="font-bold text-slate-900">{e.referral_affiliate}</div>
                        <div className="text-[10px] text-[#FF6B00] font-semibold">{e.applied_commission_rate}% Rate</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Direct</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      e.status === 'PAID_IN_FULL'
                        ? 'bg-emerald-100 text-emerald-800'
                        : e.status === 'PARTIALLY_PAID'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {e.balance_due_inr > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedEnrollment(e);
                          setPaymentForm({
                            ...paymentForm,
                            amount_inr: Math.min(5000, e.balance_due_inr),
                          });
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-[#FF6B00] hover:bg-[#e05e00] text-white text-[10px] font-bold transition shadow-xs"
                      >
                        + Collect Fee
                      </button>
                    ) : (
                      <span className="text-emerald-600 text-[11px] font-bold">✓ Paid Full</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Fee Payment Modal */}
      {isPaymentModalOpen && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Record Tuition Fee Installment</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div>Student: <strong>{selectedEnrollment.student_name}</strong></div>
              <div>Course: {selectedEnrollment.course_name}</div>
              <div className="text-amber-700 font-semibold">Remaining Balance: ₹{selectedEnrollment.balance_due_inr}</div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedEnrollment.balance_due_inr}
                  value={paymentForm.amount_inr}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount_inr: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="CASH">Cash at Shikohabad Counter</option>
                  <option value="BANK_TRANSFER">Direct Bank NEFT / IMPS</option>
                  <option value="CHEQUE">Bank Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Receipt / Transaction Ref #
                </label>
                <input
                  type="text"
                  value={paymentForm.transaction_reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transaction_reference: e.target.value })}
                  placeholder="e.g. UPI-9283749283 or MSK-REC-402"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : `Record Payment of ₹${paymentForm.amount_inr}`}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#0A2540]" />
                <h3 className="font-bold text-slate-900 text-base">Create Student Enrollment</h3>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEnrollment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Student User ID *
                </label>
                <input
                  type="number"
                  value={enrollForm.student_id}
                  onChange={(e) => setEnrollForm({ ...enrollForm, student_id: e.target.value })}
                  placeholder="e.g. 5"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">User ID from student directory</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Course
                </label>
                <select
                  value={enrollForm.course_name}
                  onChange={(e) => setEnrollForm({ ...enrollForm, course_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Full-Stack Web Development (MERN Stack)">Full-Stack Web Development (MERN)</option>
                  <option value="Python with Data Science & AI">Python with Data Science & AI</option>
                  <option value="ADCA (Advanced Diploma in Computer Applications)">ADCA (1-Year Diploma)</option>
                  <option value="DCA (Diploma in Computer Applications)">DCA</option>
                  <option value="O-Level Certification (NIELIT)">O-Level (NIELIT)</option>
                  <option value="Tally Prime + GST & Financial Accounting">Tally Prime + GST</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Gross Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={enrollForm.gross_fee_inr}
                    onChange={(e) => setEnrollForm({ ...enrollForm, gross_fee_inr: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Scholarship (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={enrollForm.discount_percent}
                    onChange={(e) => setEnrollForm({ ...enrollForm, discount_percent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-orange-900">
                Net Fee payable: <strong>₹{(enrollForm.gross_fee_inr * (1 - enrollForm.discount_percent / 100)).toLocaleString('en-IN')}</strong>. Referral commission will be snapshotted at this point.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Enroll Student'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
