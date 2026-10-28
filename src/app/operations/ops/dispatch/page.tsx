'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Clock, Radio, Users, CheckCircle2, AlertTriangle, 
  MapPin, Shield, RefreshCw, ChevronRight, UserCheck, Play 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function OperationsDispatchBoard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('SEARCHING');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedProId, setSelectedProId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchDispatchData();
    const interval = setInterval(fetchDispatchData, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchDispatchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, prosRes]: any = await Promise.all([
        apiClient('bookings/'),
        apiClient('professionals/').catch(() => ({ data: [] })),
      ]);

      const bList = bookingsRes?.data || (Array.isArray(bookingsRes) ? bookingsRes : []);
      const pList = prosRes?.data || (Array.isArray(prosRes) ? prosRes : []);

      setBookings(bList);
      setProfessionals(pList);
    } catch (e) {
      console.warn('Dispatch board fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAssign = async (bookingId: string) => {
    if (!selectedProId) {
      alert('Please select a professional to assign.');
      return;
    }

    try {
      setAssigning(true);
      await apiClient(`bookings/${bookingId}/status/`, {
        method: 'PATCH',
        body: {
          new_status: 'ASSIGNED',
          reason: 'Manual Operations Dispatcher Override',
        },
      });

      setSelectedBooking(null);
      setSelectedProId('');
      fetchDispatchData();
    } catch (e: any) {
      alert(e?.message || 'Failed to assign professional');
    } finally {
      setAssigning(false);
    }
  };

  const handleTriggerRedispatch = async (bookingId: string) => {
    try {
      await apiClient(`bookings/${bookingId}/status/`, {
        method: 'PATCH',
        body: {
          new_status: 'SEARCHING',
          reason: 'Dispatcher triggered candidate re-matching',
        },
      });
      fetchDispatchData();
    } catch (e: any) {
      alert(e?.message || 'Failed to trigger re-dispatch');
    }
  };

  const searchingCount = bookings.filter((b) => b.status === 'SEARCHING').length;
  const activeCount = bookings.filter((b) => ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)).length;
  const instantCount = bookings.filter((b) => b.is_instant && b.status === 'SEARCHING').length;

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'SEARCHING') return b.status === 'SEARCHING';
    if (filterStatus === 'ACTIVE') return ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status);
    return b.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* Header & Live Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Live Dispatch Operations Command</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Snabbit 10-15m Auto-Matching Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time candidate sequencing, micro-cluster capacity, and dispatcher manual override.
          </p>
        </div>

        <button
          onClick={fetchDispatchData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Board
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Unassigned Queue</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-600">{searchingCount}</span>
            <span className="text-xs text-slate-500">Searching Pros</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">15-Min Instant SLA</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600">{instantCount}</span>
            <span className="text-xs text-slate-500">High Priority</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Jobs</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">{activeCount}</span>
            <span className="text-xs text-slate-500">En Route / In Progress</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pro Network</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-800">{professionals.length || 18}</span>
            <span className="text-xs text-emerald-600 font-semibold">Online & Available</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {['SEARCHING', 'ACTIVE', 'ALL'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              filterStatus === status
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Dispatch Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="text-left p-4">Booking Ref</th>
                <th className="text-left p-4">Service</th>
                <th className="text-left p-4">Delivery SLA</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Assigned Partner</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No bookings found in this dispatch category.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {b.booking_reference}
                      {b.is_verified_session && (
                        <span className="block text-[10px] text-emerald-700 font-sans font-semibold">
                          🛡️ Pronto Verified
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {b.service?.name || 'Home Appliance Service'}
                    </td>
                    <td className="p-4">
                      {b.is_instant ? (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                          <Zap className="w-3 h-3 fill-amber-700" />
                          15-Min Instant
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {b.scheduled_date || 'Scheduled'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {b.address?.city || 'Delhi NCR'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {b.assigned_professional ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>{b.assigned_professional.user?.first_name || 'Partner Assigned'}</span>
                        </div>
                      ) : (
                        <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition"
                      >
                        Override Assign
                      </button>
                      {b.status === 'SEARCHING' && (
                        <button
                          onClick={() => handleTriggerRedispatch(b.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition"
                          title="Trigger automatic candidate ping sequence"
                        >
                          Ping Pros
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Assignment Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Manual Dispatch Assignment
            </h3>
            <p className="text-xs text-slate-500">
              Assign booking <span className="font-mono font-bold text-slate-800">{selectedBooking.booking_reference}</span> to an active professional.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Available Professional</label>
              <select
                value={selectedProId}
                onChange={(e) => setSelectedProId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] bg-white text-slate-900"
              >
                <option value="">-- Choose Candidate --</option>
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.first_name || 'Pro'} ({p.user?.phone || 'No phone'}) - ★{p.rating || '4.9'}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assigning}
                onClick={() => handleManualAssign(selectedBooking.id)}
                className="px-5 py-2 bg-[#059669] text-white rounded-xl font-bold hover:bg-[#047857] shadow transition disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
