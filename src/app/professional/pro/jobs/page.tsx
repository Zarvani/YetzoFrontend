'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Clock, MapPin, Phone, ShieldCheck, CheckCircle2, 
  AlertCircle, Play, Check, ChevronRight, Navigation 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpMode, setOtpMode] = useState<'START' | 'END'>('START');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('bookings/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setJobs(list);
    } catch (e) {
      console.warn('Jobs fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (bookingId: string) => {
    if (!inputOtp || inputOtp.length !== 4) {
      alert('Please enter a valid 4-digit OTP.');
      return;
    }

    try {
      setVerifying(true);
      setError(null);

      const newStatus = otpMode === 'START' ? 'IN_PROGRESS' : 'COMPLETED';
      const payload: any = {
        new_status: newStatus,
      };

      if (otpMode === 'START') {
        payload.start_otp = inputOtp;
      } else {
        payload.end_otp = inputOtp;
      }

      await apiClient(`bookings/${bookingId}/status/`, {
        method: 'PATCH',
        body: payload,
      });

      setSelectedJob(null);
      setInputOtp('');
      fetchJobs();
    } catch (err: any) {
      setError(err?.message || 'Invalid OTP code. Please verify with customer.');
    } finally {
      setVerifying(false);
    }
  };

  const activeJobs = jobs.filter((j) =>
    ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(j.status)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 space-y-6">
      {/* Top Status & Online Toggle */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Partner Job Queue</h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                isOnline
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-blue-600 animate-pulse' : 'bg-slate-500'
                }`}
              />
              {isOnline ? 'ONLINE & DISPATCHABLE' : 'OFFLINE'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Micro-cluster priority dispatching active. 15-min instant SLA.
          </p>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            isOnline
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Jobs Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Active In-Flight Jobs ({activeJobs.length})
        </h2>

        {activeJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No active assigned jobs</h3>
            <p className="text-xs text-slate-400">
              Keep your status online. New 15-min instant requests will ring your screen.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border-2 border-blue-500/30 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500 block">
                      Ref: {job.booking_reference}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                      {job.service?.name || 'Home Appliance Service'}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {job.status}
                  </span>
                </div>

                {/* Location & Customer */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">{job.address?.address_line_1}, {job.address?.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Customer: {job.customer?.first_name || 'Customer'} ({job.customer?.phone || 'Protected'})</span>
                  </div>
                </div>

                {/* Yetzo Verified Bodycam Status */}
                {job.is_verified_session && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Yetzo Verified: Encrypted Bodycam Active</span>
                  </div>
                )}

                {/* OTP Action Trigger */}
                <div className="pt-2 flex gap-2">
                  {job.status !== 'IN_PROGRESS' ? (
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setOtpMode('START');
                        setInputOtp('');
                      }}
                      className="flex-1 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Verify Start OTP
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setOtpMode('END');
                        setInputOtp('');
                      }}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Verify End OTP & Release Escrow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {otpMode === 'START' ? 'Enter Service Start OTP' : 'Enter Job End OTP'}
            </h3>
            <p className="text-xs text-slate-500">
              Ask the customer for the 4-digit code shown on their Yetzo app screen.
            </p>

            <div>
              <input
                type="text"
                maxLength={4}
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center text-3xl font-mono font-black tracking-widest p-3 rounded-xl border-2 border-slate-300 focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={verifying || inputOtp.length !== 4}
                onClick={() => handleVerifyOtp(selectedJob.id)}
                className="px-5 py-2 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] shadow transition disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Authorize'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
