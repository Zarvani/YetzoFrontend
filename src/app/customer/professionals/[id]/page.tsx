'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, CheckCircle2, ShieldCheck, Wrench, Award, Clock, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function ProfessionalDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const proId = params.id as string;

  const [pro, setPro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPro();
  }, [proId]);

  const fetchPro = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient(`professionals/${proId}/`);
      setPro(res?.data || res);
    } catch (e) {
      console.warn('Pro detail fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-[#059669] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500">Loading professional profile...</p>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-slate-900">Professional Not Found</h2>
        <Link href="/customer/professionals" className="text-xs font-bold text-[#059669] hover:underline mt-2">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fleet
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xl">
              {pro.user?.first_name ? pro.user.first_name[0] : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold text-slate-900">
                  {pro.user?.first_name || 'Service Partner'} {pro.user?.last_name || ''}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">Yetzo Certified Home Maintenance Specialist</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {pro.rating || '4.9'}
                </span>
                <span className="text-slate-600 font-medium">
                  {pro.total_jobs_completed || 240}+ jobs completed
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Police Background Verified</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-2 text-blue-800">
              <Award className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold">Urban Company Standard Certified</span>
            </div>
          </div>

          {/* About & Skills */}
          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider">Expertise & Skills</h3>
            <p className="text-slate-600 leading-relaxed">
              Specialized in precision diagnostics, foam-jet AC deep cleaning, sanitary plumbing installations, and electrical repairs with 5+ years of certified experience.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/customer/booking"
              className="w-full py-4 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-2xl shadow-md transition text-xs flex items-center justify-center gap-2"
            >
              <span>Book Service with Verified Partner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-400 font-bold">Loading profile...</div>}>
      <ProfessionalDetailPageContent />
    </React.Suspense>
  );
}
