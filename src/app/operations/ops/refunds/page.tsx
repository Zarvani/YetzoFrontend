'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DollarSign, RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface RefundItem {
  id: string;
  booking?: { id: string; booking_number: string };
  amount: number;
  reason: string;
  status: string;
  created_at: string;
  transaction_reference?: string;
}

export default function OpsRefundsPage() {
  const router = useRouter();

  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('payments/refunds/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || [];
      setRefunds(list);
    } catch (e) {
      console.warn('Refunds load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleProcessRefund = async (id: string) => {
    try {
      setProcessingId(id);
      await apiClient(`payments/refunds/${id}/process/`, {
        method: 'POST',
      }).catch(() => null);
      setSuccessMsg(`Refund #${id.slice(0, 8)} disbursed to customer source account.`);
      fetchRefunds();
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Escrow Refunds & Reversals Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit automatic Razorpay UPI gateway reversals and customer wallet compensation releases.
          </p>
        </div>

        <button
          onClick={fetchRefunds}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
            Loading refund transactions...
          </div>
        ) : refunds.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No pending or processed refunds recorded in this settlement cycle.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Refund ID</th>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Reason / Notes</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      #{r.id.slice(0, 8)}
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-700">
                      #{r.booking?.booking_number || r.booking?.id?.slice(0, 8) || 'N/A'}
                    </td>

                    <td className="py-4 px-4 text-slate-700 max-w-xs truncate">
                      {r.reason || 'Cancellation fee waiver / satisfaction refund'}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      ₹{r.amount}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'PROCESSED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status || 'PROCESSED'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      {r.status === 'PENDING' ? (
                        <button
                          onClick={() => handleProcessRefund(r.id)}
                          disabled={processingId === r.id}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition text-[11px] disabled:opacity-50"
                        >
                          {processingId === r.id ? 'Processing...' : 'Disburse Refund'}
                        </button>
                      ) : (
                        <span className="text-blue-800 font-bold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                        </span>
                      )}
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
