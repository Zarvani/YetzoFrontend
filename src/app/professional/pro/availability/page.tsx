'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Radio, ArrowLeft, Zap, MapPin, Clock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalAvailabilityPage() {
  const router = useRouter();

  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('Noida Sector 120 Cluster');
  const [todayCompleted, setTodayCompleted] = useState(3);
  const [hoursOnline, setHoursOnline] = useState('5h 20m');

  const handleToggle = async () => {
    try {
      setLoading(true);
      const nextState = !isAvailable;
      setIsAvailable(nextState);
      await apiClient('professionals/me/', {
        method: 'PATCH',
        body: { is_available: nextState },
      }).catch(() => null);
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
          Back to Jobs
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition ${
                isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Radio className={`w-10 h-10 ${isAvailable ? 'animate-pulse' : ''}`} />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900">
              {isAvailable ? 'You Are On-Duty & Broadcasting' : 'You Are Currently Off-Duty'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isAvailable
                ? 'Our dispatch engine is matching you to 15-minute instant arrival customer requests in your cluster.'
                : 'Turn on duty when you are ready to receive new service orders and dispatch pings.'}
            </p>
          </div>

          {/* Big Toggle Switch Button */}
          <div className="pt-2">
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition active:scale-[0.98] ${
                isAvailable
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
                  : 'bg-[#059669] hover:bg-[#047857] text-white shadow-emerald-900/20'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Status...</span>
                </div>
              ) : isAvailable ? (
                'Go Off-Duty (Stop Dispatches)'
              ) : (
                'Go On-Duty (Receive Jobs)'
              )}
            </button>
          </div>

          {/* Telemetry info */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-left text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Cluster</span>
              <span className="font-bold text-slate-900 block truncate">{locationName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Jobs Today</span>
              <span className="font-bold text-slate-900 block">{todayCompleted} Finished</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Hours Active</span>
              <span className="font-bold text-slate-900 block">{hoursOnline}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
