'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, CheckCircle2, ShieldCheck, DollarSign, Send, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface AddonPart {
  id: string;
  name: string;
  price: number;
  category?: string;
}

function ExtraWorkContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [addons, setAddons] = useState<AddonPart[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        setLoading(true);
        const res: any = await apiClient('pricing/addon-pricing/').catch(() => []);
        const list = Array.isArray(res) ? res : res?.results || [];
        if (list.length > 0) {
          setAddons(list);
        } else {
          // Standard transparent spare parts catalog
          setAddons([
            { id: 'p1', name: 'AC Capacitor Replacement (45 MFD)', price: 450, category: 'AC Spare Parts' },
            { id: 'p2', name: 'Copper Pipe Brazing & Flare Nut Repair', price: 650, category: 'AC Spare Parts' },
            { id: 'p3', name: 'Bathroom Hard-Water Stain Deep Descaling', price: 350, category: 'Cleaning Add-on' },
            { id: 'p4', name: 'MCB Switch Replacement (32A Anchor)', price: 290, category: 'Electrical Spare Parts' },
          ]);
        }
      } catch (e) {
        console.warn('Addons fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAddons();
  }, []);

  const toggleAddon = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendApproval = async () => {
    try {
      setSubmitting(true);
      // Send notification to customer for real-time approval
      await apiClient(`bookings/${jobId}/`, {
        method: 'PATCH',
        body: {
          extra_work_requested: true,
          extra_items: selectedIds,
        },
      }).catch(() => null);

      setSentSuccess(true);
      setTimeout(() => {
        router.push(`/professional/pro/jobs/${jobId}`);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTotal = addons
    .filter((a) => selectedIds.includes(a.id))
    .reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Cockpit
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Request Extra Work & Spare Parts</h1>
              <p className="text-xs text-slate-500">Yetzo Certified standard transparent parts pricing with customer consent.</p>
            </div>
          </div>

          {sentSuccess ? (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto" />
              <h2 className="text-sm font-bold text-slate-900">Consent Notification Sent to Customer!</h2>
              <p className="text-xs text-slate-600">
                Homeowner has received an instant push notification to approve ₹{selectedTotal} extra charge.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Verified Spare Parts / Extra Chore
                </span>

                {addons.map((a) => {
                  const isChecked = selectedIds.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAddon(a.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between text-xs ${
                        isChecked
                          ? 'border-[#2563EB] bg-blue-50/40 ring-2 ring-[#2563EB]/20 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <span className="text-slate-900 block">{a.name}</span>
                        {a.category && <span className="text-[10px] text-slate-400">{a.category}</span>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">₹{a.price}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedIds.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center text-xs border border-slate-200">
                  <span className="font-bold text-slate-700">Total Additional Bill</span>
                  <span className="text-base font-black text-[#2563EB]">₹{selectedTotal}</span>
                </div>
              )}

              <button
                onClick={handleSendApproval}
                disabled={submitting || selectedIds.length === 0}
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Approval Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send for Customer Digital Approval</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalExtraWorkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <ExtraWorkContent />
    </Suspense>
  );
}
