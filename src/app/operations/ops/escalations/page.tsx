'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ShieldAlert, PhoneCall, CheckCircle2, Eye, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface EscalationTicket {
  id: string;
  ticket_number: string;
  subject: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  customer?: { first_name?: string; last_name?: string; phone?: string };
  created_at: string;
  description: string;
}

export default function OpsEscalationsPage() {
  const router = useRouter();

  const [escalations, setEscalations] = useState<EscalationTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchEscalations = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('support/tickets/');
      const list: EscalationTicket[] = Array.isArray(res) ? res : res?.results || [];
      // Filter high priority / critical tickets
      const urgent = list.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH' || t.status === 'OPEN');
      setEscalations(urgent.length > 0 ? urgent : list);
    } catch (err) {
      console.warn('Failed to load escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      setResolvingId(id);
      await apiClient(`support/tickets/${id}/`, {
        method: 'PATCH',
        body: { status: 'RESOLVED' },
      }).catch(() => null);
      fetchEscalations();
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Safety & Operations Escalation Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Priority resolution queue for customer grievances, damage claims, and live service SOS signals.
          </p>
        </div>

        <button
          onClick={fetchEscalations}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Critical alert banner */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-semibold">
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
        <span>
          Critical SLA Rule: All high priority safety and misconduct tickets must be acknowledged by an Operations Commander within 10 minutes.
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
            Scanning active escalations...
          </div>
        ) : escalations.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No active escalations. All operational SLAs are green.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Subject & Description</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {escalations.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      #{t.ticket_number || t.id.slice(0, 8)}
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                        {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-sm">
                      <span className="font-bold text-slate-900 block truncate">{t.subject}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {t.customer?.first_name || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{t.customer?.phone || 'No phone'}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          t.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {t.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleResolve(t.id)}
                        disabled={resolvingId === t.id || t.status === 'RESOLVED'}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition text-[11px] disabled:opacity-50"
                      >
                        {resolvingId === t.id ? 'Resolving...' : t.status === 'RESOLVED' ? 'Resolved' : 'Mark Resolved'}
                      </button>

                      <Link
                        href={`/customer/support/tickets/${t.id}`}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition text-[11px]"
                      >
                        Open Console
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
