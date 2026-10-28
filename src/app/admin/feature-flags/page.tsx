'use client';

import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, CheckCircle2, ShieldAlert, Sparkles, Video, Zap } from 'lucide-react';

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  desc: string;
  benchmark: string;
  enabled: boolean;
}

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: 'ff-1',
      key: 'PRONTO_BODYCAM_RECORDING',
      name: 'Pronto Verified: Tamper-proof Bodycam Audio/Video',
      desc: 'Mandates field technician bodycam recording with 48h anonymized encrypted storage and customer safety badge.',
      benchmark: 'PRONTO Benchmark',
      enabled: true,
    },
    {
      id: 'ff-2',
      key: 'SNABBIT_15MIN_DISPATCH',
      name: 'Snabbit 10-15 Min Instant Arrival SLA Engine',
      desc: 'Enables quick-commerce micro-cluster dispatch algorithm with candidate sequencing and real-time countdown timer.',
      benchmark: 'SNABBIT Benchmark',
      enabled: true,
    },
    {
      id: 'ff-3',
      key: 'URBAN_COMPANY_30DAY_WARRANTY',
      name: 'Urban Company 30-Day Free Re-work Service Guarantee',
      desc: 'Enables customer claim workflow with photographic evidence upload and free senior technician re-dispatch.',
      benchmark: 'URBAN COMPANY Benchmark',
      enabled: true,
    },
    {
      id: 'ff-4',
      key: 'YETZO_CLUB_MEMBERSHIP',
      name: 'Yetzo Club Plus Membership Subscription Program',
      desc: 'Unlocks 15% flat chore discount, zero convenience/safety fees, and priority dispatch in booking queue.',
      benchmark: 'URBAN COMPANY Plus Benchmark',
      enabled: true,
    },
    {
      id: 'ff-5',
      key: 'MULTI_CHORE_STACKING_DISCOUNT',
      name: 'Multi-Chore Task Stacking 10% Bundle Discount',
      desc: 'Applies automated 10% discount on cart subtotal when a homeowner books 2 or more distinct chore services.',
      benchmark: 'PRONTO Stacking Benchmark',
      enabled: true,
    },
    {
      id: 'ff-6',
      key: 'LIVE_GPS_MAP_TELEMETRY',
      name: 'Bi-Directional WebSocket GPS Driver Tracking',
      desc: 'Broadcasts partner vehicle GPS coordinates to customer map view every 5 seconds over Channels group.',
      benchmark: 'Core Telemetry',
      enabled: true,
    },
  ]);

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#059669]" />
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Enterprise Feature Flags & Rollout Controls</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Toggle Pronto, Urban Company, and Snabbit competitive workflows in real-time across web and mobile clients.
        </p>
      </div>

      <div className="space-y-3">
        {flags.map((f) => (
          <div
            key={f.id}
            className={`p-5 rounded-2xl border transition flex items-center justify-between gap-4 ${
              f.enabled ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-200/60 bg-slate-50 opacity-70'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{f.name}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                  {f.benchmark}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-2xl">{f.desc}</p>
              <span className="font-mono text-[10px] text-slate-400 block mt-1">
                FLAG_KEY: <code className="text-[#059669] font-bold">{f.key}</code>
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={f.enabled}
                onChange={() => toggleFlag(f.id)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
