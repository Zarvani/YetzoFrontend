'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Star, Wrench, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function OpsIssuesPage() {
  const router = useRouter();

  const [claims, setClaims] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CLAIMS' | 'REVIEWS'>('CLAIMS');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const [claimsRes, reviewsRes]: any = await Promise.all([
        apiClient('reviews/warranty/claims/').catch(() => []),
        apiClient('reviews/').catch(() => []),
      ]);
      setClaims(Array.isArray(claimsRes) ? claimsRes : claimsRes?.results || []);
      const reviewList = Array.isArray(reviewsRes) ? reviewsRes : reviewsRes?.results || [];
      setReviews(reviewList.filter((r: any) => r.rating <= 3));
    } catch (e) {
      console.warn('Issues fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Service Quality & Defect Tracker</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Urban Company benchmark warranty claims, re-work investigations, and low-CSAT audits.
          </p>
        </div>

        <button
          onClick={fetchIssues}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('CLAIMS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'CLAIMS' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>30-Day Warranty Claims ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'REVIEWS' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500" />
          <span>Low-Rating Jobs &lt;= 3★ ({reviews.length})</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
            Loading quality defect logs...
          </div>
        ) : activeTab === 'CLAIMS' ? (
          claims.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-400">
              No warranty re-work claims currently open.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Claim ID</th>
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Issue Category</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claims.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        #{c.id.slice(0, 8)}
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-600">
                        #{c.booking?.booking_number || c.booking?.id?.slice(0, 8) || c.booking || 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800">
                        {c.issue_category || 'Service Defect'}
                      </td>
                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                        {c.description}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {c.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href="/operations/ops/warranty"
                          className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition text-[11px]"
                        >
                          Review & Re-dispatch
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          reviews.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-400">
              Zero negative ratings recorded. Partner CSAT is healthy.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Customer Review</th>
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Professional</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded font-bold text-rose-700 bg-rose-50 text-[11px] flex items-center gap-1 w-max">
                          <Star className="w-3 h-3 fill-rose-600 text-rose-600" />
                          {r.rating}★
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 max-w-sm">
                        <p className="line-clamp-2">{r.comment || 'No textual feedback provided'}</p>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        #{r.booking?.booking_number || r.booking_id || r.id.slice(0, 8)}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {r.professional?.user?.first_name || 'Assigned Partner'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/operations/ops/bookings/${r.booking?.id || r.booking_id || ''}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-[11px]"
                        >
                          Audit Booking
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
