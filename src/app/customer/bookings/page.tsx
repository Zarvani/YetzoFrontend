'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, Clock, ShieldCheck, MapPin, Check, 
  ArrowRight, Navigation, Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PAST'>('ALL');

  const fetchBookings = () => {
    setLoading(true);
    apiClient('bookings/')
      .then((res: any) => {
        const list = res?.data || (Array.isArray(res) ? res : []);
        setBookings(list);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusBadgeStyle: Record<string, { bg: string; text: string; border: string }> = {
    COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    ON_THE_WAY: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    ARRIVED: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    ASSIGNED: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    CONFIRMED: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
    CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
    PENDING_PAYMENT: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  };

  const filteredBookings = bookings.filter((b: any) => {
    if (filter === 'ALL') return true;
    const isActive = ['CONFIRMED', 'SEARCHING', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS', 'PENDING_PAYMENT'].includes(b.status);
    if (filter === 'ACTIVE') return isActive;
    if (filter === 'PAST') return !isActive;
    return true;
  });

  return (
    <div className="space-y-6 font-body pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
            Order History & Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            My Chores & Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track live dispatch coordinates, access start OTP codes, and view receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBookings}
            className="p-2 border border-slate-200 rounded-sm hover:bg-slate-50 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/customer/booking"
            className="px-4 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Book 15m Help</span>
          </Link>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200 w-fit text-xs font-heading">
        {(['ALL', 'ACTIVE', 'PAST'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-sm transition uppercase tracking-wider text-[11px] ${
              filter === tab ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'ACTIVE' ? 'Live & En Route' : tab === 'PAST' ? 'Past Visits' : 'All Bookings'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-sm animate-pulse space-y-3">
                <div className="h-4 bg-slate-100 rounded-sm w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded-sm w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-[300] font-heading text-slate-900">
              No {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Need quick house help right now? Our verified professionals arrive at your door in 10-15 minutes.
            </p>
            <div className="pt-2">
              <Link
                href="/customer/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#05AC5F] hover:bg-[#049652] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition"
              >
                <span>Book Instant House Help</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          filteredBookings.map((b: any) => {
            const badge = statusBadgeStyle[b.status] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
            const isActive = ['CONFIRMED', 'SEARCHING', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS'].includes(b.status);
            const price = b.total_amount ? (b.total_amount > 10000 ? b.total_amount / 100 : b.total_amount) : 349;

            return (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-heading font-medium text-sm text-slate-900">
                      {b.service?.name || 'Household Task Bundle'}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm border font-semibold ${badge.bg} ${badge.text} ${badge.border}`}>
                      {b.status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    Ref: {b.booking_reference || `YZ-${b.id?.slice(0, 8)}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-heading">
                      Schedule & SLA
                    </span>
                    <span className="font-medium text-slate-700 mt-0.5 block">
                      {b.is_instant ? '⚡ 15-Minute Instant Arrival' : b.scheduled_date || 'Scheduled Visit'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-heading">
                      Service Destination
                    </span>
                    <span className="font-medium text-slate-700 mt-0.5 block truncate">
                      {b.address?.address_line_1 || 'Primary Address'}, {b.address?.city || 'Bengaluru'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-heading">
                      Escrow Amount
                    </span>
                    <span className="font-semibold text-slate-900 mt-0.5 block font-heading text-sm text-emerald-800">
                      ₹{price}
                    </span>
                  </div>
                </div>

                {/* Footer Controls: Live Tracking or Start OTP */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {b.start_otp && isActive && (
                      <div className="flex items-center gap-1.5 text-xs bg-slate-50 px-2.5 py-1 rounded-sm border border-slate-200">
                        <span className="text-slate-500 font-medium">Start OTP:</span>
                        <span className="font-mono font-bold tracking-widest text-slate-900">{b.start_otp}</span>
                      </div>
                    )}
                    {b.is_verified_session && (
                      <span className="text-[11px] text-emerald-800 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Pronto Bodycam Session
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <Link
                        href={`/customer/bookings/${b.id}/track`}
                        className="px-3.5 py-1.5 bg-[#05AC5F] hover:bg-[#049652] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5"
                      >
                        <Navigation className="w-3 h-3 animate-pulse" />
                        <span>Live Track GPS</span>
                      </Link>
                    )}
                    <Link
                      href={`/customer/bookings/${b.id}`}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-medium font-heading rounded-sm transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
