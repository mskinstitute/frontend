'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { affiliateApi } from '@/services/affiliateApi';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPayoutQueueSubTab() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('REQUESTED');

  // Modal State for Mark as Paid
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [utrReference, setUtrReference] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPayouts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await affiliateApi.getAdminPayoutQueue();
      setPayouts(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load payout queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;
    if (actionType === 'approve' && !utrReference.trim()) {
      toast.error('Bank UTR / Transaction Reference is required to settle payout.');
      return;
    }

    setSubmitting(true);
    try {
      await affiliateApi.processAdminPayout(
        selectedPayout.id,
        actionType,
        utrReference.trim(),
        adminNotes.trim()
      );
      toast.success(actionType === 'approve' ? '🎉 Payout processed and ledger entries marked PAID!' : 'Payout rejected and balance restored.');
      setSelectedPayout(null);
      setUtrReference('');
      setAdminNotes('');
      loadPayouts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to process payout.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = payouts.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {['REQUESTED', 'APPROVED', 'PAID', 'ALL'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === s
                  ? 'bg-[#0A2540] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s === 'REQUESTED' ? 'Pending Requests' : s}
            </button>
          ))}
        </div>

        <button
          onClick={loadPayouts}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Payout Queue Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading payout queue...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No {statusFilter.toLowerCase()} payouts</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Req ID</th>
                <th className="py-3 px-3">Affiliate Partner</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Destination UPI</th>
                <th className="py-3 px-3">Requested At</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    #PAY-{p.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{p.affiliate_name}</div>
                    <div className="text-[10px] font-mono text-[#FF6B00]">{p.affiliate_code}</div>
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900 text-sm">
                    ₹{p.amount_inr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 font-semibold">
                    {p.upi_destination}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(p.requested_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {p.status === 'REQUESTED' || p.status === 'APPROVED' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPayout(p);
                            setActionType('approve');
                            setUtrReference('');
                            setAdminNotes('');
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition shadow-2xs"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayout(p);
                            setActionType('reject');
                            setUtrReference('');
                            setAdminNotes('');
                          }}
                          className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {p.utr_reference || 'Settled'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mark Paid / Reject Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {actionType === 'approve' ? 'Process Commission Payout' : 'Reject Payout Request'}
              </h3>
              <button
                onClick={() => setSelectedPayout(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div>Partner: <strong>{selectedPayout.affiliate_name}</strong> ({selectedPayout.affiliate_code})</div>
              <div>Amount: <strong className="text-emerald-700 text-sm">₹{selectedPayout.amount_inr}</strong></div>
              <div>UPI Destination: <strong className="font-mono">{selectedPayout.upi_destination}</strong></div>
            </div>

            <form onSubmit={handleProcessSubmit} className="space-y-3 text-xs">
              {actionType === 'approve' ? (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Bank UTR / IMPS Reference *
                  </label>
                  <input
                    type="text"
                    value={utrReference}
                    onChange={(e) => setUtrReference(e.target.value)}
                    placeholder="e.g. UTR-20261013-094829 or 409182749102"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Mandatory banking reference proof provided to the affiliate.
                  </span>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Rejection Reason *
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Invalid UPI handle / KYC update needed"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 rounded-xl text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 ${
                    actionType === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting
                    ? 'Processing...'
                    : actionType === 'approve'
                    ? `Confirm Settle ₹${selectedPayout.amount_inr}`
                    : 'Confirm Rejection'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
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
