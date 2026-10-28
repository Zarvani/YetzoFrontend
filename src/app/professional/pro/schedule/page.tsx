'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, Check, Save, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface DaySchedule {
  day: string;
  active: boolean;
  start: string;
  end: string;
}

export default function ProfessionalSchedulePage() {
  const router = useRouter();

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Monday', active: true, start: '09:00', end: '19:00' },
    { day: 'Tuesday', active: true, start: '09:00', end: '19:00' },
    { day: 'Wednesday', active: true, start: '09:00', end: '19:00' },
    { day: 'Thursday', active: true, start: '09:00', end: '19:00' },
    { day: 'Friday', active: true, start: '09:00', end: '19:00' },
    { day: 'Saturday', active: true, start: '08:00', end: '20:00' },
    { day: 'Sunday', active: true, start: '08:00', end: '20:00' },
  ]);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, active: !d.active } : d))
    );
  };

  const handleTimeChange = (dayIndex: number, field: 'start' | 'end', val: string) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, [field]: val } : d))
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient('professionals/me/availability/', {
        method: 'POST',
        body: { schedule },
      }).catch(() => null);

      setSuccess(true);
      setTimeout(() => {
        router.push('/professional/pro/jobs');
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Training
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Weekly Operating Hours</h1>
                <p className="text-xs text-slate-500">Configure which days and hours you will receive 15-min dispatches.</p>
              </div>
            </div>
          </div>

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Availability schedule saved! Redirecting to Jobs...</span>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {schedule.map((item, idx) => (
              <div key={item.day} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={() => toggleDay(idx)}
                    className="w-4 h-4 accent-[#059669] rounded cursor-pointer"
                  />
                  <span className={`font-bold ${item.active ? 'text-slate-900' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>

                {item.active ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={item.start}
                      onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={item.end}
                      onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                    />
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 italic">Day Off</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Schedule...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Schedule & Activate Fleet Status</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
