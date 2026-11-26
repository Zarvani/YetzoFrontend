'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, Calendar, Clock, ShieldCheck, Video, RefreshCw, AlertTriangle, CheckCircle2, DollarSign, UserCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function OpsBookingDetailContent() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [pros, setPros] = useState<any[]>([]);
  const [selectedProId, setSelectedProId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      const [bookingData, prosData]: any = await Promise.all([
        apiClient(`bookings/${bookingId}/`),
        apiClient('professionals/').catch(() => []),
      ]);
      setBooking(bookingData);
      setPros(Array.isArray(prosData) ? prosData : prosData?.results || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load booking telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [bookingId]);

  const handleManualAssign = async () => {
    if (!selectedProId) return;
    try {
      setActionLoading(true);
      setError(null);
      await apiClient(`bookings/${bookingId}/assign_pro/`, {
        method: 'POST',
        body: { professional_id: selectedProId },
      });
      setStatusMessage('Professional assigned successfully.');
      fetchDetails();
    } catch (err: any) {
      setError(err?.message || 'Assignment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!window.confirm(`Force update booking status to ${newStatus}?`)) return;
    try {
      setActionLoading(true);
      setError(null);
      await apiClient(`bookings/${bookingId}/`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      setStatusMessage(`Status updated to ${newStatus}.`);
      fetchDetails();
    } catch (err: any) {
      setError(err?.message || 'Status update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          Loading booking telemetry...
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
        Back to Master Bookings
      </button>

      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">
              Booking #{booking?.booking_number || bookingId?.slice(0, 8)}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white">
              {booking?.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Created on {new Date(booking?.created_at).toLocaleString()} • {booking?.is_instant ? '15-Min Instant Dispatch' : 'Scheduled Arrival'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {booking?.is_verified_session && (
            <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2 text-xs font-bold text-purple-700">
              <Video className="w-4 h-4" />
              <span>Yetzo Bodycam Active</span>
            </div>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Customer & Address */}
        <div className="space-y-6 md:col-span-2">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customer & Service Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 block text-[11px] font-bold">Customer</span>
                <span className="font-bold text-slate-900 block text-sm">
                  {booking?.customer?.first_name ? `${booking.customer.first_name} ${booking.customer.last_name || ''}` : 'Customer'}
                </span>
                <span className="text-slate-600 font-mono block">{booking?.customer?.phone || 'No phone'}</span>
                <span className="text-slate-600 block">{booking?.customer?.email || 'No email'}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 block text-[11px] font-bold">Service Location</span>
                <span className="font-bold text-slate-900 block">
                  {booking?.address?.address_line_1 || 'Primary Service Address'}
                </span>
                <span className="text-slate-600 block">
                  {booking?.address?.city} {booking?.address?.pincode ? `- ${booking.address.pincode}` : ''}
                </span>
              </div>
            </div>

            {/* Service Chore items */}
            <div className="pt-2">
              <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-2">
                Order Items & Rate Card
              </span>
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 text-xs">
                {booking?.items?.length > 0 ? (
                  booking.items.map((item: any, i: number) => (
                    <div key={i} className="p-3.5 flex justify-between items-center">
                      <span className="font-bold text-slate-800">{item.service?.name || item.name || 'Home Chore'}</span>
                      <span className="font-mono font-bold text-slate-900">₹{item.price || item.unit_price}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Standard Service Package</span>
                    <span className="font-mono font-bold text-slate-900">₹{booking?.total_amount}</span>
                  </div>
                )}
                <div className="p-3.5 bg-slate-50 font-bold flex justify-between items-center text-slate-900">
                  <span>Grand Total (Escrow)</span>
                  <span className="text-sm text-[#2563EB]">₹{booking?.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Verification OTPs (Ops Audit) */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[10px] font-black uppercase text-amber-800 block">Start Job OTP</span>
                <span className="text-lg font-black font-mono text-amber-900 tracking-wider">
                  {booking?.start_otp || '••••'}
                </span>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200">
                <span className="text-[10px] font-black uppercase text-blue-800 block">End Job OTP</span>
                <span className="text-lg font-black font-mono text-blue-900 tracking-wider">
                  {booking?.end_otp || '••••'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch Governance & Actions */}
        <div className="space-y-6">
          {/* Assigned Partner */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assigned Fleet Specialist
            </h2>

            {booking?.assigned_professional?.user ? (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>
                    {booking.assigned_professional.user.first_name} {booking.assigned_professional.user.last_name || ''}
                  </span>
                </div>
                <div className="text-slate-600 font-mono text-xs">
                  Phone: {booking.assigned_professional.user.phone}
                </div>
                <div className="text-slate-600 text-[11px]">
                  Rating: ★ {booking.assigned_professional.rating || '4.9'} • Certified Partner
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-semibold">
                No professional currently attached. Ready for candidate matching or dispatcher manual override.
              </div>
            )}

            {/* Manual Re-assign */}
            <div className="pt-2 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">
                Dispatcher Manual Re-assignment
              </label>
              <select
                value={selectedProId}
                onChange={(e) => setSelectedProId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="">Select verified technician...</option>
                {pros.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.first_name} {p.user?.last_name || ''} ({p.user?.phone || 'Verified'})
                  </option>
                ))}
              </select>
              <button
                onClick={handleManualAssign}
                disabled={actionLoading || !selectedProId}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
              >
                Assign Partner
              </button>
            </div>
          </div>

          {/* Quick Status Override */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Operational Overrides
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                disabled={actionLoading || booking?.status === 'IN_PROGRESS'}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition disabled:opacity-50"
              >
                Force Start (In Progress)
              </button>
              <button
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={actionLoading || booking?.status === 'COMPLETED'}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl text-xs transition disabled:opacity-50"
              >
                Force Complete & Release Escrow
              </button>
              <button
                onClick={() => handleStatusUpdate('CANCELLED')}
                disabled={actionLoading || booking?.status === 'CANCELLED'}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition disabled:opacity-50"
              >
                Cancel & Initiate Refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpsBookingDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <OpsBookingDetailContent />
    </Suspense>
  );
}
