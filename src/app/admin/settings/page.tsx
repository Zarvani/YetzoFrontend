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

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('yetzo_system_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.commissionRate) setCommissionRate(parsed.commissionRate);
        if (parsed.convenienceFee) setConvenienceFee(parsed.convenienceFee);
        if (parsed.instantTimeoutMins) setInstantTimeoutMins(parsed.instantTimeoutMins);
        if (parsed.bodycamRetentionHours) setBodycamRetentionHours(parsed.bodycamRetentionHours);
        if (parsed.gstRate) setGstRate(parsed.gstRate);
      }
    } catch {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('yetzo_system_settings', JSON.stringify({
        commissionRate,
        convenienceFee,
        instantTimeoutMins,
        bodycamRetentionHours,
        gstRate,
        updatedAt: new Date().toISOString()
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#2563EB]" />
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">System Settings & Global Parameters</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Configure marketplace take rates, dispatch SLA timeouts, and compliance retentions.</p>
        </div>

        {saved && (
          <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
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
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
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
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Waived for Yetzo Club members</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Yetzo Instant Instant Arrival SLA (Minutes)</label>
              <input
                type="number"
                value={instantTimeoutMins}
                onChange={(e) => setInstantTimeoutMins(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default 15m cluster threshold</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Yetzo Bodycam Retention (Hours)</label>
              <input
                type="number"
                value={bodycamRetentionHours}
                onChange={(e) => setBodycamRetentionHours(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
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
              className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
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
