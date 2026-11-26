'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, RefreshCw, Calendar, Clock, Video, Eye, ArrowUpDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface BookingItem {
  id: string;
  booking_number: string;
  customer?: { first_name?: string; last_name?: string; phone?: string };
  assigned_professional?: { user?: { first_name?: string; last_name?: string; phone?: string } };
  status: string;
  total_amount: number;
  is_instant?: boolean;
  is_verified_session?: boolean;
  created_at: string;
  scheduled_start?: string;
  items?: Array<{ service?: { name: string } }>;
}

export default function OpsBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('bookings/');
      const list = Array.isArray(res) ? res : res?.results || [];
      setBookings(list);
    } catch (err) {
      console.warn('Ops bookings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.booking_number?.toLowerCase().includes(q) ||
      b.customer?.phone?.includes(q) ||
      b.customer?.first_name?.toLowerCase().includes(q) ||
      b.assigned_professional?.user?.first_name?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">COMPLETED</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 animate-pulse">IN PROGRESS</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800">DISPATCHED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">SEARCHING PRO</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Master Bookings Feed</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry and order governance across all operational service clusters.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer phone, or partner name..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${statusFilter === st
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
            Loading live bookings data...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No bookings found matching current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Assigned Partner</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>#{b.booking_number || b.id.slice(0, 8)}</span>
                        {b.is_instant && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800">
                            15m
                          </span>
                        )}
                        {b.is_verified_session && (
                          <span title="Yetzo Bodycam Verified">
                            <Video className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                        {new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800 max-w-[180px] truncate">
                      {b.items?.[0]?.service?.name || 'Home Maintenance'}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {b.customer?.first_name ? `${b.customer.first_name} ${b.customer.last_name || ''}` : 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{b.customer?.phone || 'No Phone'}</span>
                    </td>

                    <td className="py-4 px-4">
                      {b.assigned_professional?.user ? (
                        <div>
                          <span className="font-semibold text-slate-900 block">
                            {b.assigned_professional.user.first_name} {b.assigned_professional.user.last_name || ''}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {b.assigned_professional.user.phone || 'Verified'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg text-[11px]">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">{getStatusBadge(b.status)}</td>

                    <td className="py-4 px-4 font-bold text-slate-900">
                      ₹{b.total_amount}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/operations/ops/bookings/${b.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}