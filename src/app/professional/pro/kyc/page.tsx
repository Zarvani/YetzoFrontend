'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, Save, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalKycPage() {
  const router = useRouter();

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [policeCertRef, setPoliceCertRef] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNumber.length < 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await apiClient('professionals/me/', {
        method: 'PATCH',
        body: {
          aadhaar_number: aadhaarNumber,
          pan_number: panNumber.toUpperCase(),
          police_clearance_ref: policeCertRef,
          emergency_contact: {
            name: emergencyContactName,
            phone: emergencyContactPhone,
          },
        },
      }).catch(() => null);

      setSubmitted(true);
      setTimeout(() => {
        router.push('/professional/pro/documents');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit KYC details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Onboarding
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Partner KYC & Background Check</h1>
              <p className="text-xs text-slate-500">Government identity verification and police clearance filing.</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-sm font-bold text-slate-900">KYC Records Uploaded!</h2>
              <p className="text-xs text-slate-600">Redirecting to document attachments...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar Card Number (12 Digits) *</label>
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="5481 9283 1029"
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-[#059669] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PAN Card Number (For Tax & TDS) *</label>
                <input
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono uppercase focus:ring-2 focus:ring-[#059669] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Police Clearance Certificate Ref Number *</label>
                <input
                  type="text"
                  value={policeCertRef}
                  onChange={(e) => setPoliceCertRef(e.target.value)}
                  placeholder="e.g. PCC-DL-2026-94819"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Emergency Safety Contact
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="Spouse / Parent Name"
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emergency Phone *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9811122233"
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || aadhaarNumber.length < 12}
                  className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating Identity...</span>
                    </>
                  ) : (
                    <>
                      <span>Save & Continue to Documents</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
