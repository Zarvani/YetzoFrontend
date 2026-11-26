'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Navigation, Phone, CheckCircle2, ShieldCheck, Video, DollarSign, Clock, PlusCircle, AlertTriangle, Key, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function ProJobDetailContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      const data: any = await apiClient(`bookings/${jobId}/`);
      setBooking(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleStartWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length < 4) {
      setError('Please enter the 4-digit start OTP provided by the customer.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await apiClient(`bookings/${jobId}/verify_otp/`, {
        method: 'POST',
        body: { otp: otpInput },
      });
      setStatusMessage('Start OTP verified! Work session in progress with Yetzo Bodycam recording.');
      setOtpInput('');
      fetchJob();
    } catch (err: any) {
      setError(err?.message || 'Invalid start OTP. Please verify with customer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length < 4) {
      setError('Please enter the 4-digit completion release OTP provided by the customer.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await apiClient(`bookings/${jobId}/verify_otp/`, {
        method: 'POST',
        body: { otp: otpInput },
      });
      setStatusMessage('Job completed! ₹' + Math.round(Number(booking?.total_amount || 499) * 0.8) + ' released to your wallet.');
      setOtpInput('');
      fetchJob();
    } catch (err: any) {
      setError(err?.message || 'Invalid completion release OTP.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          Loading active service order...
        </div>
      </div>
    );
  }

  const partnerEarnings = Math.round(Number(booking?.total_amount || 499) * 0.8);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/professional/pro/jobs')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Active Jobs
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Job Reference</span>
              <h1 className="text-xl font-black text-slate-900">
                #{booking?.booking_number || jobId?.slice(0, 8)}
              </h1>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                booking?.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-800 animate-pulse'
                  : booking?.status === 'COMPLETED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-900 text-white'
              }`}
            >
              {booking?.status}
            </span>
          </div>

          {statusMessage && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer & Destination */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {booking?.customer?.first_name ? `${booking.customer.first_name} ${booking.customer.last_name || ''}` : 'Customer'}
                </span>
                <span className="text-slate-500 font-mono text-[11px] block mt-0.5">{booking?.customer?.phone}</span>
              </div>
              <a
                href={`tel:${booking?.customer?.phone || ''}`}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-[#2563EB] hover:bg-blue-50 transition"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">
                  {booking?.address?.address_line_1 || 'Customer Home'}
                </span>
                <span className="text-slate-500 text-[11px] block">
                  {booking?.address?.city} {booking?.address?.pincode ? `- ${booking.address.pincode}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Yetzo Verified Bodycam status */}
          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-900 font-bold">
              <Video className="w-4 h-4 text-purple-700" />
              <span>Yetzo Verified Bodycam Protocol</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-200 text-purple-900">
              ACTIVE
            </span>
          </div>

          {/* Actions by status */}
          {booking?.status !== 'IN_PROGRESS' && booking?.status !== 'COMPLETED' && (
            <div className="space-y-4">
              <Link
                href={`/professional/pro/jobs/${jobId}/navigation`}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Turn-by-Turn GPS Navigation</span>
              </Link>

              {/* Enter start OTP */}
              <form onSubmit={handleStartWork} className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Customer Doorstep Start Verification</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ask customer for their 4-digit start OTP shown on their Yetzo booking screen.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="4-DIGIT OTP"
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-center font-mono text-base font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || otpInput.length < 4}
                    className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition text-xs disabled:opacity-50"
                  >
                    Start Work
                  </button>
                </div>
              </form>
            </div>
          )}

          {booking?.status === 'IN_PROGRESS' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-blue-900 block">Service Execution In Progress</span>
                  <p className="text-[11px] text-blue-700 mt-0.5">Need spare parts or extra repairs?</p>
                </div>
                <Link
                  href={`/professional/pro/jobs/${jobId}/extra-work`}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Extra Work</span>
                </Link>
              </div>

              {/* Enter End OTP */}
              <form onSubmit={handleCompleteWork} className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Complete Job & Release Payment</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ask customer for their 4-digit completion OTP after customer inspects quality.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="END OTP"
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-center font-mono text-base font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || otpInput.length < 4}
                    className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition text-xs disabled:opacity-50"
                  >
                    Release ₹{partnerEarnings}
                  </button>
                </div>
              </form>
            </div>
          )}

          {booking?.status === 'COMPLETED' && (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto" />
              <h2 className="text-sm font-bold text-slate-900">Job Successfully Finished!</h2>
              <p className="text-xs text-slate-600">
                ₹{partnerEarnings} has been credited to your wallet balance.
              </p>
              <div className="pt-2">
                <Link
                  href="/professional/pro/earnings"
                  className="inline-block px-4 py-2 bg-[#2563EB] text-white font-bold rounded-xl text-xs"
                >
                  View Wallet Payout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalJobDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <ProJobDetailContent />
    </Suspense>
  );
}
