'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { affiliateApi } from '@/services/affiliateApi';
import {
  MessageCircle,
  Phone,
  Clock,
  UserCheck,
  CalendarCheck,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFollowupSubTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await affiliateApi.getAdminFollowupQueue();
      setLeads(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load follow-up queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-orange-950">Counselor Follow-up Queue:</span>{' '}
            <span className="text-orange-900">
              Students stuck in registration (&gt; 3 days without demo) or completed demo (&gt; 3 days without enrollment).
            </span>
          </div>
        </div>
        <button
          onClick={loadLeads}
          className="p-1.5 rounded-lg border border-orange-300 bg-white hover:bg-orange-100 text-orange-800 transition"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Analyzing admission pipeline...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <UserCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-800">Pipeline is moving smoothly!</p>
          <p className="text-[11px] text-slate-400 mt-0.5">No student leads currently overdue for counselor follow-up.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Course Interest</th>
                <th className="py-3 px-3">Current Stage</th>
                <th className="py-3 px-3">Days in Stage</th>
                <th className="py-3 px-3">Referred By</th>
                <th className="py-3 px-3 text-right">Counselor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((item) => {
                const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');
                const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                const waText = encodeURIComponent(
                  `Namaste ${item.student_name}! This is the Admissions Counseling Desk at MSK Institute Shikohabad. We noticed you were interested in ${item.course_interest || 'our IT programs'}. Would you like us to reserve your free 2-day computer lab demo seat for tomorrow?`
                );

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.student_name}</div>
                      <div className="text-[10px] text-slate-500">{item.phone || item.email}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {item.course_interest || 'Computer Applications'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.current_stage === 'DEMO_COMPLETED'
                          ? 'bg-orange-100 text-[#FF6B00]'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.current_stage}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.days_stuck} days stuck
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700">
                        {item.affiliate_name || 'Direct'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {cleanPhone ? (
                          <a
                            href={`https://wa.me/${formattedPhone}?text=${waText}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 transition shadow-2xs"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">No Phone</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
