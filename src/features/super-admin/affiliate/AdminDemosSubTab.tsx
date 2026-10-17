'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { affiliateApi } from '@/services/affiliateApi';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Laptop,
  Check,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDemosSubTab() {
  const [demos, setDemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadDemos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await affiliateApi.getAdminDemos({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        mode: modeFilter !== 'ALL' ? modeFilter : undefined,
      });
      setDemos(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load demo reservations');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, modeFilter]);

  useEffect(() => {
    loadDemos();
  }, [loadDemos]);

  const handleAction = async (id: number, action: string) => {
    setUpdatingId(id);
    try {
      await affiliateApi.updateAdminDemo(id, action);
      toast.success(`Demo status updated: ${action.replace('_', ' ')}`);
      loadDemos();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update demo');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, email, course..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DAY1_DONE">Day 1 Done</option>
            <option value="COMPLETED">Completed</option>
            <option value="NO_SHOW">No Show</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Modes</option>
            <option value="OFFLINE">Offline Shikohabad</option>
            <option value="ONLINE">Online Live</option>
          </select>

          <button
            onClick={loadDemos}
            className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Demos Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading demo reservations...</p>
        </div>
      ) : demos.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No demo reservations found</p>
          <p className="text-[11px] text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Course & Mode</th>
                <th className="py-3 px-3">Preferred Slot</th>
                <th className="py-3 px-3">Referring Partner</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demos.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{d.student_name}</div>
                    <div className="text-[11px] text-slate-500">{d.student_phone || d.student_email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{d.course_name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                      {d.learning_mode === 'OFFLINE' ? (
                        <span className="flex items-center gap-1 text-orange-700 font-semibold">
                          <Building2 className="w-3 h-3" /> Campus
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-700 font-semibold">
                          <Laptop className="w-3 h-3" /> Online
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {d.preferred_slot || 'Morning Session'}
                  </td>
                  <td className="py-3 px-3">
                    {d.referral_affiliate ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF6B00]">
                        {d.referral_affiliate}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Direct / Organic</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${d.day1_attended ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        D1 {d.day1_attended ? '✓' : '—'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${d.day2_attended ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        D2 {d.day2_attended ? '✓' : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.status === 'DAY1_DONE'
                        ? 'bg-amber-100 text-amber-800'
                        : d.status === 'NO_SHOW'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!d.day1_attended && (
                        <button
                          onClick={() => handleAction(d.id, 'mark_day1')}
                          disabled={updatingId === d.id}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold transition"
                        >
                          Mark Day 1
                        </button>
                      )}
                      {d.day1_attended && !d.day2_attended && (
                        <button
                          onClick={() => handleAction(d.id, 'mark_day2')}
                          disabled={updatingId === d.id}
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold transition"
                        >
                          Mark Day 2
                        </button>
                      )}
                      {d.status !== 'COMPLETED' && d.status !== 'NO_SHOW' && (
                        <button
                          onClick={() => handleAction(d.id, 'no_show')}
                          disabled={updatingId === d.id}
                          className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold transition"
                        >
                          No Show
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
