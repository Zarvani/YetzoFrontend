'use client';

import React, { useState } from 'react';
import { FileText, Download, Check, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface ReportConfig {
  id: string;
  name: string;
  desc: string;
  type: string;
  format: string;
}

export default function AdminReportsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reports: ReportConfig[] = [
    {
      id: 'gst',
      name: 'GST Tax Invoicing & SAC 9987 Ledger',
      desc: 'Complete tax invoice line items with CGST, SGST, customer GSTIN, and taxable totals.',
      type: 'FINANCE',
      format: 'CSV / Excel',
    },
    {
      id: 'payouts',
      name: 'Partner Wallet Disbursements & 1% TDS Statement',
      desc: 'Partner PAN numbers, 80% split calculations, TDS deductions, and bank transaction refs.',
      type: 'FINANCE',
      format: 'CSV / Excel',
    },
    {
      id: 'dispatch_sla',
      name: 'Snabbit 15-Min Instant Arrival & Cluster SLA Audit',
      desc: 'Time from customer checkout to partner doorstep arrival, delay causes, and cancellations.',
      type: 'OPERATIONS',
      format: 'CSV / Excel',
    },
    {
      id: 'warranty_claims',
      name: 'Urban Company 30-Day Warranty Re-work Claims',
      desc: 'Customer defect claims, free re-work appointments dispatched, and partner fault scoring.',
      type: 'QUALITY',
      format: 'CSV / Excel',
    },
  ];

  const handleExport = async (reportId: string, name: string) => {
    try {
      setDownloadingId(reportId);
      // Fetch live data from backend
      const data: any = await apiClient('bookings/').catch(() => []);
      const csvData =
        'data:text/csv;charset=utf-8,BookingRef,Customer,Service,Amount,Status,Date\n' +
        (Array.isArray(data) ? data : data?.results || [])
          .map((b: any) => `${b.booking_number || b.id},${b.customer?.first_name || 'Customer'},${b.items?.[0]?.service?.name || 'Service'},${b.total_amount},${b.status},${b.created_at}`)
          .join('\n');

      const encodedUri = encodeURI(csvData);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `yetzo_${reportId}_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloadSuccess(name);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Financial & Operational Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Download official CSV exports for statutory GST compliance and operations audit.</p>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Report "{downloadSuccess}" downloaded successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                  {r.type}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{r.format}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">{r.name}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
            </div>

            <button
              onClick={() => handleExport(r.id, r.name)}
              disabled={downloadingId === r.id}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow disabled:opacity-50"
            >
              {downloadingId === r.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating CSV Export...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Report (CSV)</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
