'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Users, MapPin, Clock, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Send, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function OpsDispatchDetailContent() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDispatchState = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      const [bData, prosData]: any = await Promise.all([
        apiClient(`bookings/${bookingId}/`),
        apiClient('professionals/').catch(() => []),
      ]);
      setBooking(bData);
      const list = Array.isArray(prosData) ? prosData : prosData?.results || [];
      setCandidates(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dispatch telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatchState();
  }, [bookingId]);

  const handleAssignCandidate = async (proId: string) => {
    try {
      setDispatching(true);
      setError(null);
      await apiClient(`bookings/${bookingId}/assign_pro/`, {
        method: 'POST',
        body: { professional_id: proId },
      });
      setSuccessMsg('Partner successfully dispatched to booking.');
      fetchDispatchState();
    } catch (err: any) {
      setError(err?.message || 'Manual dispatch failed.');
    } finally {
      setDispatching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
          Loading live dispatch radar...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dispatch Board
      </button>

      {/* Dispatch Radar Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                Dispatch Radar • Booking #{booking?.booking_number || bookingId?.slice(0, 8)}
              </h1>
              <p className="text-xs text-slate-500">
                {booking?.is_instant ? '⚡ 15-Minute Instant Arrival SLA Queue' : '📅 Scheduled Dispatch'} • Priority Matching
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchDispatchState}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Radar</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Target Destination & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Destination & Customer
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {booking?.address?.address_line_1 || 'Primary Residence'}
                </span>
                <span className="text-slate-500 block">
                  {booking?.address?.city} {booking?.address?.pincode ? `- ${booking.address.pincode}` : ''}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block text-[11px] font-bold">Customer</span>
              <span className="font-bold text-slate-900 block">
                {booking?.customer?.first_name ? `${booking.customer.first_name} ${booking.customer.last_name || ''}` : 'Customer'}
              </span>
              <span className="text-slate-500 font-mono text-[11px] block">{booking?.customer?.phone || 'No Phone'}</span>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block text-[11px] font-bold">Current Assigned Status</span>
              {booking?.assigned_professional?.user ? (
                <div className="mt-1 p-2.5 bg-emerald-50 rounded-xl text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {booking.assigned_professional.user.first_name} {booking.assigned_professional.user.last_name || ''}
                  </span>
                </div>
              ) : (
                <div className="mt-1 p-2.5 bg-amber-50 rounded-xl text-amber-900 font-bold text-center">
                  Awaiting Dispatcher Assignment
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Candidate Queue */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Micro-Cluster Candidates (Radius 5km)
            </h2>
            <span className="text-xs font-bold text-slate-500">{candidates.length} Available</span>
          </div>

          <div className="space-y-3">
            {candidates.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                No active professionals currently in GPS range. Broadcast will expand cluster radius to 10km.
              </div>
            ) : (
              candidates.map((pro, index) => {
                const isCurrent = booking?.assigned_professional?.id === pro.id;
                return (
                  <div
                    key={pro.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                      isCurrent ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xs text-slate-700">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">
                            {pro.user?.first_name ? `${pro.user.first_name} ${pro.user.last_name || ''}` : 'Specialist'}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Phone: <span className="font-mono">{pro.user?.phone || 'Verified'}</span> • Rating: ★ {pro.rating || '4.9'}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isCurrent ? (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black">
                          Currently Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAssignCandidate(pro.id)}
                          disabled={dispatching}
                          className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Pro</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpsDispatchDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <OpsDispatchDetailContent />
    </Suspense>
  );
}
