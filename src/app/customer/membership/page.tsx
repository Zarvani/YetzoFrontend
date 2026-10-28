'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Crown, Check, ShieldCheck, Zap, Tag, Clock, 
  Sparkles, ArrowRight, Star, HeartHandshake, AlertCircle 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function CustomerMembershipPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('admin-core/memberships/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setPlans(list);
      if (list.length > 0) {
        setSelectedPlanId(list[0].id);
      }
    } catch (e: any) {
      console.warn('Membership plans fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlanId) return;

    try {
      setSubscribing(true);
      setError(null);
      // Calls payment initiation or checkout for membership
      router.push(`/customer/booking/payment?amount=299&subtotal=299&discount=0&isMembership=true&planId=${selectedPlanId}`);
    } catch (e: any) {
      setError(e?.message || 'Subscription initialization failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Banner - UC Plus Benchmark */}
        <div className="bg-gradient-to-r from-amber-950 via-[#78350F] to-[#B45309] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-400 text-amber-950 rounded-lg">
                <Crown className="w-5 h-5 fill-amber-950" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-200">
                Urban Company Plus Benchmark
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Yetzo Club VIP Membership
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl leading-relaxed">
              Unlock 15% flat discount on every booking, 100% free cancellation, zero surge pricing, and priority dispatch on all 15-minute instant arrivals.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: '15% Flat Discount', desc: 'Save up to ₹1,500 every month on all chores & services', icon: Tag },
            { title: 'Zero Surge Fee', desc: 'No peak-hour multipliers or festival price surges', icon: Zap },
            { title: 'Priority Dispatch', desc: 'Jumps directly to front of queue for 15-min arrival', icon: Clock },
            { title: 'Free Cancellations', desc: 'Zero penalty fee up to 2 hours before scheduled slot', icon: ShieldCheck },
          ].map((b, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl w-max">
                <b.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{b.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Plans Selection */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Choose Your Club Plan</h2>
            <p className="text-xs text-slate-500">Cancel anytime. 100% money-back guarantee within 7 days.</p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading live membership plans...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {plan.duration_months === 12 && (
                      <span className="absolute -top-3 right-4 bg-amber-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                        Best Value
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-base">{plan.name}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected
                              ? 'border-amber-600 bg-amber-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 font-mono">
                          ₹{plan.price}
                        </span>
                        <span className="text-xs text-slate-500">
                          / {plan.duration_months} Months
                        </span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>15% off every home service</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Waived ₹49 platform fee</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>VIP Dedicated Support Line</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="max-w-md mx-auto pt-2">
            <button
              onClick={handleSubscribe}
              disabled={subscribing || plans.length === 0}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold rounded-2xl shadow-lg transition text-sm flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Join Yetzo Club & Start Saving</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Average subscriber saves ₹3,400 per year across AC, cleaning, and appliance visits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
