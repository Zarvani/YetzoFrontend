'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, Users, MapPin, Zap, RefreshCw } from 'lucide-react';
import { LiveTrackingMap } from '@/components/tracking/LiveTrackingMap';

export default function OperationsLiveMapPage() {
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Controls */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/operations/ops"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">Live Field Operations GPS Map</h1>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500">Tracking active partners & in-flight customer bookings</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800"
          >
            <option value="Delhi NCR">Delhi NCR Micro-Cluster</option>
            <option value="Bangalore">Bangalore South & Tech Parks</option>
            <option value="Pune">Pune Cluster</option>
          </select>
        </div>
      </header>

      {/* Full-bleed Map */}
      <div className="flex-1 w-full relative">
        <LiveTrackingMap
          customerLocation={{ lat: 28.5355, lng: 77.3910 }}
          professionalLocation={{ lat: 28.5420, lng: 77.3970 }}
        />

        {/* Floating Cluster Legend */}
        <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl space-y-2 text-xs">
          <span className="font-bold text-slate-900 block mb-1">Active Cluster Telemetry</span>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>28 Pros Online & In Transit</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>5 Instant 15m Jobs En Route</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span>12 In-Progress Service Sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
