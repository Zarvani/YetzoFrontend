'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Clock, ShieldCheck, Users, 
  ChevronRight, RefreshCw, DollarSign, AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface OpsMetrics {
  activeDispatches: number;
  searchingBookings: number;
  slaAdherence: string;
  escrowHeld: string;
  pendingWarranties: number;
  onlinePros: number;
}

export default function OperationsOverviewPage() {
  const [stats, setStats] = useState<OpsMetrics>({
    activeDispatches: 0,
    searchingBookings: 0,
    slaAdherence: '100.0%',
    escrowHeld: '₹0',
    pendingWarranties: 0,
    onlinePros: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchLiveOpsData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, prosRes, claimsRes]: any = await Promise.all([
        apiClient('bookings/').catch(() => ({ data: [] })),
        apiClient('professionals/').catch(() => ({ data: [] })),
        apiClient('reviews/warranty/claims/').catch(() => ({ data: [] })),
      ]);

      const bookings = bookingsRes?.data || (Array.isArray(bookingsRes) ? bookingsRes : []);
      const pros = prosRes?.data || (Array.isArray(prosRes) ? prosRes : []);
      const claims = claimsRes?.data || (Array.isArray(claimsRes) ? claimsRes : []);

      const active = bookings.filter((b: any) => 
        ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)
      ).length;

      const searching = bookings.filter((b: any) => b.status === 'SEARCHING').length;

      const online = pros.filter((p: any) => p.is_available === true).length;

      const pendingWarranties = claims.filter((c: any) => 
        ['REQUESTED', 'IN_REVIEW', 'TECHNICIAN_ASSIGNED'].includes(c.status)
      ).length;

      const totalEscrowPaise = bookings
        .filter((b: any) => ['CONFIRMED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status))
        .reduce((sum: number, b: any) => sum + (Number(b.total_amount) || 0), 0);

      const escrowFormatted = totalEscrowPaise > 0 
        ? `₹${(totalEscrowPaise / 100).toLocaleString('en-IN')}` 
        : '₹0';

      const totalInstant = bookings.filter((b: any) => b.is_instant).length;
      const completedInstant = bookings.filter((b: any) => b.is_instant && b.status === 'COMPLETED').length;
      const slaRate = totalInstant > 0 
        ? `${((completedInstant / totalInstant) * 100).toFixed(1)}%` 
        : '100.0%';

      setStats({
        activeDispatches: active,
        searchingBookings: searching,
        slaAdherence: slaRate,
        escrowHeld: escrowFormatted,
        pendingWarranties,
        onlinePros: online,
      });
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Ops overview fetch warning:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOpsData();
    const interval = setInterval(fetchLiveOpsData, 20000); // 20s live sync
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6 font-['Sarabun',sans-serif]">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-md shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#05AC5F] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#05AC5F]">
              Yetzo Hyper-Local Ops Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-[300] tracking-tight font-['Montserrat',sans-serif]">
            Central Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-[300] leading-relaxed">
            Live telemetry for Snabbit 10-15m dispatch SLAs, Pronto verified bodycam feeds, and Urban Company 30-day warranty rework claims.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchLiveOpsData}
            disabled={loading}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded transition flex items-center gap-2 border border-white/15"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Syncing...' : 'Sync Now'}</span>
          </button>
          <Link
            href="/operations/ops/dispatch"
            className="px-5 py-2.5 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium text-xs rounded shadow-sm transition flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Live Dispatch Board</span>
          </Link>
          <Link
            href="/operations/ops/warranty"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded border border-white/20 transition flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>30-Day Warranty</span>
          </Link>
        </div>
      </div>

      {lastRefreshed && (
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Live telemetry active • Last synced at {lastRefreshed}</span>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-md shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Instant 15m SLA</span>
            <Clock className="w-4 h-4 text-[#05AC5F]" />
          </div>
          <div className="text-2xl font-[400] text-slate-900 font-['Montserrat',sans-serif]">{stats.slaAdherence}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            Snabbit 10-15m Benchmark Standard
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-md shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Dispatches</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-[400] text-slate-900 font-['Montserrat',sans-serif]">{stats.activeDispatches}</div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">
            {stats.searchingBookings} awaiting candidate match
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-md shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Escrow Held</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-[400] text-slate-900 font-mono">{stats.escrowHeld}</div>
          <span className="text-[11px] text-slate-500 font-normal mt-1 inline-block">
            Protected customer funds
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-md shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Warranty Inquiries</span>
            <ShieldCheck className="w-4 h-4 text-[#05AC5F]" />
          </div>
          <div className="text-2xl font-[400] text-slate-900 font-['Montserrat',sans-serif]">{stats.pendingWarranties}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">
            30-Day Urban Company Guarantee
          </span>
        </div>
      </div>

      {/* Cluster Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/operations/ops/dispatch"
          className="bg-white border border-slate-200/90 hover:border-[#05AC5F] p-6 rounded-md shadow-xs transition-all group"
        >
          <div className="p-2.5 bg-emerald-50 text-[#05AC5F] rounded w-max mb-4 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-[400] text-slate-900 text-base mb-1 font-['Montserrat',sans-serif]">Live Dispatch Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-[300]">
            Monitor real-time matching, instant 15-minute dispatch SLAs, and perform manual candidate overrides.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#05AC5F]">
            <span>Open Board</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/operations/ops/warranty"
          className="bg-white border border-slate-200/90 hover:border-[#05AC5F] p-6 rounded-md shadow-xs transition-all group"
        >
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded w-max mb-4 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-[400] text-slate-900 text-base mb-1 font-['Montserrat',sans-serif]">30-Day Service Warranty</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-[300]">
            Process rework claims, review customer photo evidence, and authorize free second-visit technician dispatches.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#05AC5F]">
            <span>Review Claims</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/operations/ops/professionals"
          className="bg-white border border-slate-200/90 hover:border-[#05AC5F] p-6 rounded-md shadow-xs transition-all group"
        >
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded w-max mb-4 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-[400] text-slate-900 text-base mb-1 font-['Montserrat',sans-serif]">Partner Fleet & KYC</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-[300]">
            Verify Aadhaar/PAN, background check clearances, and monitor active partner live locations on map ({stats.onlinePros} online).
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#05AC5F]">
            <span>Manage Fleet</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
