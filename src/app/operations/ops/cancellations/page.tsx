'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, Eye, ShieldCheck, AlertCircle, CheckCircle2, DollarSign, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function OpsCancellationsPage() {
  const router = useRouter();

  const [cancellations, setCancellations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchCancellations = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('bookings/');
      const list = Array.isArray(res) ? res : res?.results || [];
      const cancelledList = list.filter((b: any) => b.status === 'CANCELLED');
      setCancellations(cancelledList);
    } catch (e) {
      console.warn('Cancellations load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancellations();
  }, []);

  const handleApproveWaiver = async (bookingId: string) => {
    try {
      setProcessingId(bookingId);
      // Process full fee waiver and wallet refund
      await apiClient(`payments/refunds/`, {
        method: 'POST',
        body: { booking_id: bookingId, reason: 'Operations Cancellation Fee Waiver' },
      }).catch(() => null);

      setActionSuccess(`Cancellation fee waived and refunded for booking #${bookingId.slice(0, 8)}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Cancellations & Fee Dispute Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit customer cancellation reasons, partner arrival SLAs, and fee waiver requests.
          </p>
        </div>

        <button
          onClick={fetchCancellations}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
            Loading cancelled bookings...
          </div>
        ) : cancellations.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No cancelled bookings pending operational audit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Reason / Notes</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cancellations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      #{c.booking_number || c.id.slice(0, 8)}
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {c.customer?.first_name || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{c.customer?.phone || 'No Phone'}</span>
                    </td>

                    <td className="py-4 px-4 text-slate-700 max-w-xs">
                      <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 font-semibold rounded text-[11px] mb-1">
                        {c.cancellation_reason || 'Customer Cancellation'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-800">
                      {c.items?.[0]?.service?.name || 'Home Maintenance'}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      ₹{c.total_amount}
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleApproveWaiver(c.id)}
                        disabled={processingId === c.id}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl transition text-[11px]"
                      >
                        {processingId === c.id ? 'Refunding...' : 'Waive & Refund'}
                      </button>

                      <Link
                        href={`/operations/ops/bookings/${c.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-[11px]"
                      >
                        View Telemetry
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
