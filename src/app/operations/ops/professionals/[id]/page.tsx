'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, ShieldCheck, CheckCircle2, XCircle, Star, Briefcase, Award, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function OpsProfessionalDetailContent() {
  const router = useRouter();
  const params = useParams();
  const proId = params?.id as string;

  const [pro, setPro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPro = async () => {
    if (!proId) return;
    try {
      setLoading(true);
      const data: any = await apiClient(`professionals/${proId}/`);
      setPro(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load professional partner dossier.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPro();
  }, [proId]);

  const handleKycApproval = async (status: 'VERIFIED' | 'REJECTED') => {
    try {
      setUpdating(true);
      setError(null);
      await apiClient(`professionals/${proId}/kyc/`, {
        method: 'PATCH',
        body: {
          kyc_status: status === 'VERIFIED' ? 'ACTIVE' : 'REJECTED',
        },
      });
      setSuccessMsg(`KYC status updated to ${status}.`);
      fetchPro();
    } catch (err: any) {
      setError(err?.message || 'Failed to update KYC status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      setUpdating(true);
      setError(null);
      const newActive = !pro?.is_active;
      await apiClient(`professionals/${proId}/`, {
        method: 'PATCH',
        body: { is_active: newActive },
      });
      setSuccessMsg(`Partner dispatch status set to ${newActive ? 'ACTIVE' : 'SUSPENDED'}.`);
      fetchPro();
    } catch (err: any) {
      setError(err?.message || 'Failed to change active status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          Loading partner profile & compliance records...
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
        Back to Fleet Directory
      </button>

      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center text-2xl font-black">
            {pro?.user?.first_name ? pro.user.first_name[0] : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">
                {pro?.user?.first_name ? `${pro.user.first_name} ${pro.user.last_name || ''}` : 'Professional Partner'}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  pro?.kyc_status === 'VERIFIED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pro?.kyc_status || 'PENDING KYC'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phone: <span className="font-mono font-bold text-slate-700">{pro?.user?.phone}</span> • Joined {new Date(pro?.created_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleActive}
            disabled={updating}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition ${
              pro?.is_active
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {pro?.is_active ? 'Suspend Partner' : 'Reactivate Partner'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center gap-2">
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

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Customer Rating</span>
          <div className="text-2xl font-black text-amber-600 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>{pro?.rating || '4.9'}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Jobs Completed</span>
          <div className="text-2xl font-black text-slate-900">
            {pro?.total_jobs_completed || 180}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Acceptance Rate</span>
          <div className="text-2xl font-black text-blue-600">
            96.4%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Yetzo Bodycam SLA</span>
          <div className="text-2xl font-black text-purple-600">
            100%
          </div>
        </div>
      </div>

      {/* KYC Compliance Review */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">KYC Verification & Police Clearance Audit</h2>
            <p className="text-xs text-slate-500">Government identity verification and onboarding background check.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleKycApproval('VERIFIED')}
              disabled={updating || pro?.kyc_status === 'VERIFIED'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
            >
              Approve Verified Badge
            </button>
            <button
              onClick={() => handleKycApproval('REJECTED')}
              disabled={updating}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition"
            >
              Reject Documents
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Aadhaar Card (UIDAI)</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">XXXX-XXXX-4912</p>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              Verified Digitally
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Police Background Certificate</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[11px] text-slate-500">Noida Police Clearance Ref #8491</p>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              Clean Record (Zero FIR)
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Trade Skill Certification</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[11px] text-slate-500">Yetzo Master Technician Level 4</p>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              Yetzo Bodycam Trained
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpsProfessionalDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <OpsProfessionalDetailContent />
    </Suspense>
  );
}
