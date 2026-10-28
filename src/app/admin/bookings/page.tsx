'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, RefreshCw, Search, Eye, Filter, Loader2, Video } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [query, setQuery] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('bookings/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || [];
      setBookings(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const q = query.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.booking_number?.toLowerCase().includes(q) ||
      b.customer?.first_name?.toLowerCase().includes(q) ||
      b.customer?.phone?.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#059669]" />
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Master Bookings Repository</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Audit and govern all orders placed across Yetzo web and mobile applications.</p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bookings by number, customer, or phone..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#059669]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
            Loading master bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No bookings found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Assigned Pro</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>#{b.booking_number || b.id.slice(0, 8)}</span>
                        {b.is_instant && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-800">
                            15m
                          </span>
                        )}
                        {b.is_verified_session && (
                          <Video className="w-3.5 h-3.5 text-purple-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {b.items?.[0]?.service?.name || 'Home Maintenance'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {b.customer?.first_name || 'Customer'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {b.assigned_professional?.user?.first_name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{b.total_amount}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/operations/ops/bookings/${b.id}`}
                        className="p-1.5 inline-block text-slate-600 hover:text-slate-900"
                        title="View Telemetry"
                      >
                        <Eye className="w-4 h-4" />
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
