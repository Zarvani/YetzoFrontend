'use client';

import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, CheckCircle2, ShieldAlert, Sparkles, Video, Zap, RefreshCw, Save } from 'lucide-react';

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  desc: string;
  benchmark: string;
  enabled: boolean;
}

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    id: 'ff-1',
    key: 'YETZO_BODYCAM_RECORDING',
    name: 'Yetzo Verified: Tamper-proof Bodycam Audio/Video',
    desc: 'Mandates field technician bodycam recording with 48h anonymized encrypted storage and customer safety badge.',
    benchmark: 'YETZO Benchmark',
    enabled: true,
  },
  {
    id: 'ff-2',
    key: 'YETZO INSTANT_15MIN_DISPATCH',
    name: 'Yetzo Instant 10-15 Min Instant Arrival SLA Engine',
    desc: 'Enables quick-commerce micro-cluster dispatch algorithm with candidate sequencing and real-time countdown timer.',
    benchmark: 'YETZO INSTANT Benchmark',
    enabled: true,
  },
  {
    id: 'ff-3',
    key: 'YETZO_30DAY_WARRANTY',
    name: 'Yetzo Certified 30-Day Free Re-work Service Guarantee',
    desc: 'Enables customer claim workflow with photographic evidence upload and free senior technician re-dispatch.',
    benchmark: 'YETZO CERTIFIED Benchmark',
    enabled: true,
  },
  {
    id: 'ff-4',
    key: 'YETZO_CLUB_MEMBERSHIP',
    name: 'Yetzo Club Plus Membership Subscription Program',
    desc: 'Unlocks 15% flat chore discount, zero convenience/safety fees, and priority dispatch in booking queue.',
    benchmark: 'YETZO CERTIFIED Plus Benchmark',
    enabled: true,
  },
  {
    id: 'ff-5',
    key: 'MULTI_CHORE_STACKING_DISCOUNT',
    name: 'Multi-Chore Task Stacking 15% Bundle Discount',
    desc: 'Applies automated 15% discount on cart subtotal when a homeowner books 2 or more distinct chore services.',
    benchmark: 'YETZO Stacking Benchmark',
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
];

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(DEFAULT_FLAGS);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yetzo_feature_flags');
      if (stored) {
        try {
          setFlags(JSON.parse(stored));
        } catch {
          // ignore error
        }
      }
    }
  }, []);

  const toggleFlag = (id: string) => {
    setFlags((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f));
      if (typeof window !== 'undefined') {
        localStorage.setItem('yetzo_feature_flags', JSON.stringify(updated));
      }
      return updated;
    });

    const target = flags.find((f) => f.id === id);
    const nextState = !target?.enabled;
    setFeedback(`Feature flag ${target?.key} switched to ${nextState ? 'ENABLED' : 'DISABLED'}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
            Rollout Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            Enterprise Feature Flags & Rollout Controls
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Toggle dark-dispatch velocity, bodycam encryption, and warranty guarantee engines in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-sm text-xs font-semibold font-heading">
            {flags.filter((f) => f.enabled).length}/{flags.length} Flags Active
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid of Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className={`p-5 rounded-sm border transition flex flex-col justify-between space-y-4 ${
              flag.enabled
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 opacity-70'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-heading block">
                    {flag.benchmark}
                  </span>
                  <h3 className="font-heading font-medium text-slate-900 text-sm mt-0.5">
                    {flag.name}
                  </h3>
                </div>

                <button
                  onClick={() => toggleFlag(flag.id)}
                  className="transition shrink-0 text-slate-800"
                >
                  {flag.enabled ? (
                    <ToggleRight className="w-8 h-8 text-[#2563EB]" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-body">
                {flag.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 font-bold">{flag.key}</span>
              <span
                className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${
                  flag.enabled
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {flag.enabled ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
