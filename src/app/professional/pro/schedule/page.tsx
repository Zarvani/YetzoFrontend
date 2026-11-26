'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, Check, Save, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface DaySchedule {
  day: string;
  active: boolean;
  start: string;
  end: string;
}

export default function ProfessionalSchedulePage() {
  const router = useRouter();

  const defaultDays: DaySchedule[] = [
    { day: 'Monday', active: true, start: '09:00', end: '19:00' },
    { day: 'Tuesday', active: true, start: '09:00', end: '19:00' },
    { day: 'Wednesday', active: true, start: '09:00', end: '19:00' },
    { day: 'Thursday', active: true, start: '09:00', end: '19:00' },
    { day: 'Friday', active: true, start: '09:00', end: '19:00' },
    { day: 'Saturday', active: true, start: '08:00', end: '20:00' },
    { day: 'Sunday', active: false, start: '08:00', end: '20:00' },
  ];

  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultDays);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const res: any = await apiClient('professionals/me/availability/').catch(() => null);
        if (res?.schedule && Array.isArray(res.schedule)) {
          setSchedule(res.schedule);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

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
        method: 'PATCH',
        body: { schedule },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/professional/pro/jobs');
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 font-body">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-heading font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Navigation</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-800 rounded-sm border border-blue-200">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                Live Capacity Telemetry
              </span>
              <h1 className="text-xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
                Weekly Service Hours
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Controls automatic dispatch radar matching in your active city hub.
              </p>
            </div>
          </div>

          {success && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Availability hours synced with PostgreSQL dispatch engine!</span>
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Loading current dispatch schedule...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((item, idx) => (
                <div
                  key={item.day}
                  className={`p-3.5 border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    item.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => toggleDay(idx)}
                      className="rounded-sm border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="font-heading font-medium text-xs text-slate-900 w-24">
                      {item.day}
                    </span>
                  </div>

                  {item.active ? (
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="time"
                        value={item.start}
                        onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                        className="border border-slate-200 rounded-sm px-2 py-1 text-slate-800 focus:outline-none focus:border-blue-600 font-mono text-xs"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="time"
                        value={item.end}
                        onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                        className="border border-slate-200 rounded-sm px-2 py-1 text-slate-800 focus:outline-none focus:border-blue-600 font-mono text-xs"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Offline (No automatic dispatch)</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Synced to PostgreSQL fleet radar</span>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wider font-heading font-medium rounded-sm shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
