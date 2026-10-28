'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Star, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function CustomerProfessionalsDirectoryPage() {
  const router = useRouter();
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPros();
  }, []);

  const fetchPros = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('professionals/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setPros(list);
    } catch (e) {
      console.warn('Pros fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#059669]" />
              <h1 className="text-xl font-bold text-slate-900">Verified Professional Fleet</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Every partner is 100% background checked, police verified, and trained to Urban Company standards.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading verified professionals...</div>
          ) : pros.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
              No professional profiles currently published in this zone.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pros.map((pro) => (
                <Link
                  key={pro.id}
                  href={`/customer/professionals/${pro.id}`}
                  className="bg-white border border-slate-200 hover:border-[#059669] p-5 rounded-2xl shadow-sm transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-base">
                        {pro.user?.first_name ? pro.user.first_name[0] : 'P'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                          <span>{pro.user?.first_name || 'Service Specialist'}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Certified Home Technician
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs pt-2 border-t border-slate-100">
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {pro.rating || '4.9'}
                      </span>
                      <span className="text-slate-500">
                        {pro.total_jobs_completed || 180}+ jobs
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#059669] font-bold">
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
