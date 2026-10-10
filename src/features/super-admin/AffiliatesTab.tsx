'use client';

import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Search,
  Copy,
  Check,
  Mail,
  Phone,
  IndianRupee,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { AffiliateItem } from '@/types/admin';
import toast from 'react-hot-toast';

interface AffiliatesTabProps {
  affiliates: AffiliateItem[];
  onAddAffiliate: (payload: Partial<AffiliateItem>) => Promise<boolean>;
  onUpdateAffiliate: (id: number, payload: Partial<AffiliateItem>) => Promise<boolean>;
  onDeleteAffiliate: (id: number) => Promise<boolean>;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
}

export default function AffiliatesTab({
  affiliates,
  onAddAffiliate,
  onUpdateAffiliate,
  onDeleteAffiliate,
  isAddOpen,
  setIsAddOpen,
}: AffiliatesTabProps) {
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [editAffiliate, setEditAffiliate] = useState<AffiliateItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    affiliate_code: '',
    email: '',
    phone: '',
    commission_rate: '15.00',
    total_referrals: 0,
    total_earnings: '0.00',
    pending_payout: '0.00',
    payout_details: '',
    status: 'active' as any,
  });
  const [submitting, setSubmitting] = useState(false);

  const filtered = affiliates.filter((a) => {
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.affiliate_code.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied affiliate code: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openAdd = () => {
    const randCode = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: '',
      affiliate_code: `AFF-PARTNER-${randCode}`,
      email: '',
      phone: '+91 ',
      commission_rate: '15.00',
      total_referrals: 0,
      total_earnings: '0.00',
      pending_payout: '0.00',
      payout_details: 'UPI: partner@okhdfcbank',
      status: 'active',
    });
    setEditAffiliate(null);
    setIsAddOpen(true);
  };

  const openEdit = (a: AffiliateItem) => {
    setEditAffiliate(a);
    setFormData({
      name: a.name,
      affiliate_code: a.affiliate_code,
      email: a.email,
      phone: a.phone,
      commission_rate: String(a.commission_rate),
      total_referrals: a.total_referrals,
      total_earnings: String(a.total_earnings),
      pending_payout: String(a.pending_payout),
      payout_details: a.payout_details || '',
      status: a.status,
    });
    setIsAddOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.affiliate_code.trim()) {
      toast.error('Partner Name and Affiliate Code are required.');
      return;
    }

    setSubmitting(true);
    let success = false;
    if (editAffiliate) {
      success = await onUpdateAffiliate(editAffiliate.id, formData);
    } else {
      success = await onAddAffiliate(formData);
    }
    setSubmitting(false);

    if (success) {
      setIsAddOpen(false);
      setEditAffiliate(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove affiliate partner "${name}"?`)) {
      await onDeleteAffiliate(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search affiliates by name, code, contact..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Affiliate Partner</span>
        </button>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-extrabold tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Affiliate Partner</th>
                <th className="py-3.5 px-4">Referral Code</th>
                <th className="py-3.5 px-4">Commission %</th>
                <th className="py-3.5 px-4">Total Referrals</th>
                <th className="py-3.5 px-4">Total Earnings</th>
                <th className="py-3.5 px-4">Pending Payout</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No affiliate partners found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{a.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{a.phone}</span>
                        <span>•</span>
                        <span>{a.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleCopyCode(a.affiliate_code)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-secondary border border-orange-200 font-mono text-xs font-bold transition-colors cursor-pointer"
                        title="Click to copy code"
                      >
                        <span>{a.affiliate_code}</span>
                        {copiedCode === a.affiliate_code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-secondary" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {a.commission_rate}%
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                      {a.total_referrals}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      ₹{Number(a.total_earnings || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-700">
                      ₹{Number(a.pending_payout || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          a.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit affiliate"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete affiliate"
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

      {/* Add / Edit Affiliate Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-secondary" />
                <span>{editAffiliate ? 'Edit Affiliate Partner' : 'Add New Affiliate Partner'}</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Partner / Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Campus Ambassador"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unique Referral Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.affiliate_code}
                    onChange={(e) => setFormData({ ...formData, affiliate_code: e.target.value })}
                    placeholder="e.g. AFF-SUMIT10"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                    placeholder="15.00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Under Review</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payout Account (UPI or Bank Details)</label>
                <input
                  type="text"
                  value={formData.payout_details}
                  onChange={(e) => setFormData({ ...formData, payout_details: e.target.value })}
                  placeholder="e.g. UPI: name@okhdfcbank or A/C 987654321"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
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
                  {submitting ? 'Saving...' : editAffiliate ? 'Update Partner' : 'Register Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
