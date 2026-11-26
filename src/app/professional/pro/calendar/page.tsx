'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, MapPin, ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalCalendarPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-10-27');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res: any = await apiClient('bookings/');
        const list = Array.isArray(res) ? res : res?.results || [];
        setBookings(list);
      } catch (err) {
        console.warn('Calendar bookings error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Partner Job Calendar</h1>
                <p className="text-xs text-slate-500">Scheduled appointments and assigned time slots.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-900">October 2026</span>
              <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day Selector */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['25', '26', '27', '28', '29', '30', '31'].map((d, i) => {
              const isToday = d === '27';
              return (
                <div
                  key={d}
                  onClick={() => setSelectedDate(`2026-10-${d}`)}
                  className={`p-3 rounded-2xl cursor-pointer transition ${
                    isToday
                      ? 'bg-[#2563EB] text-white font-bold shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block opacity-70">
                    {daysOfWeek[i]}
                  </span>
                  <span className="text-sm font-black block mt-0.5">{d}</span>
                </div>
              );
            })}
          </div>

          {/* Scheduled Jobs for the day */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Appointments For Selected Day ({bookings.length} Booked)
            </h2>

            {loading ? (
              <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                Loading appointments...
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                No scheduled jobs on this date. Your calendar is clear.
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {b.items?.[0]?.service?.name || 'Home Maintenance Service'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#2563EB]" />
                        10:00 AM - 11:30 AM
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {b.address?.city || 'Delhi NCR'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Payout</span>
                      <span className="text-xs font-black text-[#2563EB]">₹{Math.round(Number(b.total_amount || 499) * 0.8)}</span>
                    </div>

                    <Link
                      href={`/professional/pro/jobs/${b.id}`}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
