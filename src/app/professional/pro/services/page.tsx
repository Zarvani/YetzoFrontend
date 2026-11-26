'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, ArrowLeft, Check, Clock, DollarSign, ArrowRight, Loader2, Save } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface ServiceItem {
  id: string;
  name: string;
  base_price: number;
  duration_minutes: number;
  category?: { name: string };
}

export default function ProfessionalServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeServices, setActiveServices] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res: any = await apiClient('services/');
        const list = Array.isArray(res) ? res : res?.results || [];
        setServices(list);

        const initial: Record<string, boolean> = {};
        list.forEach((s: any) => {
          initial[s.id] = true;
        });
        setActiveServices(initial);
      } catch (err) {
        console.warn('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const toggleService = (id: string) => {
    setActiveServices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    router.push('/professional/pro/training');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Skills
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Service Rate Cards & 80% Payouts</h1>
                <p className="text-xs text-slate-500">Toggle individual jobs and review your net earnings per chore.</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
              Loading service rate cards...
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((svc) => {
                const isEnabled = activeServices[svc.id] !== false;
                const customerPrice = Number(svc.base_price || 499);
                const partnerPayout = Math.round(customerPrice * 0.8);

                return (
                  <div
                    key={svc.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                      isEnabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{svc.name}</span>
                        {svc.category?.name && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {svc.category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {svc.duration_minutes || 45} mins
                        </span>
                        <span>•</span>
                        <span>Customer Rate: ₹{customerPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Payout (80%)</span>
                        <span className="text-sm font-black text-[#2563EB]">₹{partnerPayout}</span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => toggleService(svc.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
            >
              <span>Continue to Safety Training</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
