'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Shield, Clock, Video, DollarSign } from 'lucide-react';

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState('20');
  const [convenienceFee, setConvenienceFee] = useState('29');
  const [instantTimeoutMins, setInstantTimeoutMins] = useState('15');
  const [bodycamRetentionHours, setBodycamRetentionHours] = useState('48');
  const [gstRate, setGstRate] = useState('18');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#059669]" />
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">System Settings & Global Parameters</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Configure marketplace take rates, dispatch SLA timeouts, and compliance retentions.</p>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Platform Commission Rate (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#059669]"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Partner gets 80% net split</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Safety & Convenience Fee (₹)</label>
              <input
                type="number"
                value={convenienceFee}
                onChange={(e) => setConvenienceFee(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#059669]"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Waived for Yetzo Club members</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Snabbit Instant Arrival SLA (Minutes)</label>
              <input
                type="number"
                value={instantTimeoutMins}
                onChange={(e) => setInstantTimeoutMins(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#059669]"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default 15m cluster threshold</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pronto Bodycam Retention (Hours)</label>
              <input
                type="number"
                value={bodycamRetentionHours}
                onChange={(e) => setBodycamRetentionHours(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#059669]"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">DPDP Act compliant auto-purge</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">GST Tax Rate (%)</label>
            <input
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#059669]"
              required
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">SAC Code 9987 (18% Statutory Rate)</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Parameters</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
