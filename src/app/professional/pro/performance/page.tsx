'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, ArrowLeft, Star, TrendingUp, CheckCircle2, ShieldCheck, Zap, Video, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalPerformancePage() {
  const router = useRouter();

  const [pro, setPro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const data: any = await apiClient('professionals/me/').catch(() => null);
        setPro(data);
      } catch (e) {
        console.warn('Performance fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Partner Scorecard & Ranking</h1>
                <p className="text-xs text-slate-500">Tier status, dispatch priority weight, and quality metrics.</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-full border border-amber-200">
              Diamond Elite Tier
            </span>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Rating</span>
              <div className="text-2xl font-black text-amber-600 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{pro?.rating || '4.92'}</span>
              </div>
              <p className="text-[11px] text-slate-500">Top 3% of technicians in cluster</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">15m Arrival SLA</span>
              <div className="text-2xl font-black text-emerald-600">
                98.4%
              </div>
              <p className="text-[11px] text-slate-500">Average ETA: 12.2 mins</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Job Acceptance</span>
              <div className="text-2xl font-black text-slate-900">
                97.1%
              </div>
              <p className="text-[11px] text-slate-500">Accepted within 30 seconds</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pronto Cam Compliance</span>
              <div className="text-2xl font-black text-purple-600">
                100%
              </div>
              <p className="text-[11px] text-slate-500">Zero protocol infractions</p>
            </div>
          </div>

          {/* Weekly Incentive Eligibility */}
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wider">Weekly Excellence Bonus</span>
              <span className="text-sm font-black bg-white/20 px-2.5 py-0.5 rounded-full">₹3,000 Extra</span>
            </div>
            <p className="text-xs text-white/90">
              Complete 25 5-star jobs this week to claim your direct bank bonus. You are currently at 19/25.
            </p>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="w-[76%] h-full bg-white rounded-full" />
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
            <span>Next Tier Evaluation: Monday 06:00 AM</span>
            <Link href="/professional/pro/reviews" className="text-[#059669] font-bold hover:underline">
              View Customer Reviews →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
