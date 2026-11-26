'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, ShieldCheck, Star, CheckCircle2, UserCheck, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function BookingProfessionalContent() {
  const router = useRouter();
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProId, setSelectedProId] = useState<string>('auto'); // 'auto' or pro.id

  useEffect(() => {
    const fetchPros = async () => {
      try {
        setLoading(true);
        const res: any = await apiClient('professionals/');
        const list = res?.data || (Array.isArray(res) ? res : res?.results || []);
        setPros(list);
      } catch (err) {
        console.warn('Failed to load professionals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPros();
  }, []);

  const handleConfirm = () => {
    if (selectedProId === 'auto') {
      sessionStorage.removeItem('preferred_professional_id');
    } else {
      sessionStorage.setItem('preferred_professional_id', selectedProId);
    }
    router.push('/customer/booking/schedule');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service Addons
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Choose Service Expert</h1>
              <p className="text-xs text-slate-500">
                Select automatic 15-min instant dispatch or choose a preferred top-rated specialist.
              </p>
            </div>
          </div>

          {/* Option 1: Auto-Dispatch (Yetzo Instant/Yetzo mode) */}
          <div
            onClick={() => setSelectedProId('auto')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-4 ${
              selectedProId === 'auto'
                ? 'border-[#2563EB] bg-blue-50/50 ring-2 ring-[#2563EB]/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="p-3 bg-[#2563EB] text-white rounded-xl shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Instant Auto-Dispatch (Recommended)
                </span>
                <span className="text-[11px] font-extrabold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                  10-15 Min SLA
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Our smart dispatch algorithm assigns the nearest 5-star verified professional in your cluster for fastest arrival.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedProId === 'auto' ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300'
                }`}
              >
                {selectedProId === 'auto' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Option 2: Pick specific pro */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Or Select A Preferred Certified Specialist
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                Loading nearby verified partners...
              </div>
            ) : pros.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                No specific manual partners currently available in this slot. Auto-dispatch will match the best available pro.
              </div>
            ) : (
              <div className="space-y-3">
                {pros.map((pro) => (
                  <div
                    key={pro.id}
                    onClick={() => setSelectedProId(pro.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-4 ${
                      selectedProId === pro.id
                        ? 'border-[#2563EB] bg-blue-50/50 ring-2 ring-[#2563EB]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center text-sm border border-slate-200">
                        {pro.user?.first_name ? pro.user.first_name[0] : 'P'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <span>{pro.user?.first_name ? `${pro.user.first_name} ${pro.user.last_name || ''}` : 'Specialist'}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-0.5 font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {pro.rating || '4.9'}
                          </span>
                          <span>•</span>
                          <span>{pro.total_jobs_completed || '120'}+ bookings</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedProId === pro.id ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300'
                      }`}
                    >
                      {selectedProId === pro.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingProfessionalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <BookingProfessionalContent />
    </Suspense>
  );
}
