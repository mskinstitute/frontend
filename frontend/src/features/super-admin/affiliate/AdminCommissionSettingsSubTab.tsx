'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { affiliateApi } from '@/services/affiliateApi';
import {
  Settings,
  Percent,
  Clock,
  CreditCard,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCommissionSettingsSubTab() {
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [defaultRate, setDefaultRate] = useState(15);
  const [clearanceDays, setClearanceDays] = useState(7);
  const [minPayout, setMinPayout] = useState(500);

  // Overrides modal / form
  const [courseOverrides, setCourseOverrides] = useState<any[]>([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseRate, setNewCourseRate] = useState(20);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await affiliateApi.getAdminCommissionSettings();
      setSettings(data);
      setDefaultRate(data.default_rate_percent || 15);
      setClearanceDays(data.clearance_days || 7);
      setMinPayout(data.min_payout_amount_inr || 500);
      setCourseOverrides(data.course_overrides || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load commission settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await affiliateApi.updateAdminCommissionSettings({
        default_rate_percent: Number(defaultRate),
        clearance_days: Number(clearanceDays),
        min_payout_amount_inr: Number(minPayout),
      });
      toast.success('Commission rules updated successfully!');
      loadSettings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCourseOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    setSaving(true);
    try {
      const updatedOverrides = [
        ...courseOverrides,
        { course_name: newCourseName.trim(), rate_percent: Number(newCourseRate) },
      ];
      await affiliateApi.updateAdminCommissionSettings({
        course_overrides: updatedOverrides,
      });
      toast.success(`Override saved for ${newCourseName}`);
      setNewCourseName('');
      loadSettings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add override');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourseOverride = async (index: number) => {
    const updated = courseOverrides.filter((_, idx) => idx !== index);
    setSaving(true);
    try {
      await affiliateApi.updateAdminCommissionSettings({
        course_overrides: updated,
      });
      toast.success('Course override removed');
      loadSettings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete override');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Rules Section */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Global Commission Framework</h3>
            <p className="text-xs text-slate-500">Default rules applied to all referring partners across Shikohabad</p>
          </div>
          <button
            onClick={loadSettings}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <form onSubmit={handleSaveGlobalSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Default Commission Rate (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={defaultRate}
                  onChange={(e) => setDefaultRate(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 text-sm font-black text-slate-900"
                  required
                />
                <span className="font-bold text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-400">Baseline rate if no override matches</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Clearance Hold Period (Days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={clearanceDays}
                  onChange={(e) => setClearanceDays(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 text-sm font-black text-slate-900"
                  required
                />
                <span className="font-bold text-slate-400">Days</span>
              </div>
              <p className="text-[10px] text-slate-400">Refund buffer hold before balance release</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Minimum Withdrawal Threshold (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="100"
                  value={minPayout}
                  onChange={(e) => setMinPayout(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 text-sm font-black text-slate-900"
                  required
                />
                <span className="font-bold text-slate-400">₹</span>
              </div>
              <p className="text-[10px] text-slate-400">Minimum balance required to request payout</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A5F] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-[#FF8533]" />
              <span>{saving ? 'Saving...' : 'Update Global Rules'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Course-Specific Overrides Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Course-Specific Commission Overrides</h3>
            <p className="text-xs text-slate-500">Provide higher incentives for flagship or new technical courses</p>
          </div>
        </div>

        {/* Add Course Override Form */}
        <form onSubmit={handleAddCourseOverride} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Course name (e.g. Full-Stack Web Development)"
            className="flex-1 p-2 rounded-lg border border-slate-200 text-xs bg-white"
            required
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max="50"
              value={newCourseRate}
              onChange={(e) => setNewCourseRate(Number(e.target.value))}
              placeholder="Rate %"
              className="w-20 p-2 rounded-lg border border-slate-200 text-xs bg-white font-bold"
              required
            />
            <span className="text-xs font-bold text-slate-500">%</span>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-3.5 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Override</span>
          </button>
        </form>

        {/* Course Overrides List */}
        {courseOverrides.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">No course-specific overrides configured.</p>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {courseOverrides.map((ov, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 transition text-xs">
                <div>
                  <span className="font-bold text-slate-900">{ov.course_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                    {ov.rate_percent}% Commission
                  </span>
                  <button
                    onClick={() => handleDeleteCourseOverride(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
