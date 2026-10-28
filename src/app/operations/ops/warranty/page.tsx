'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, 
  ExternalLink, User, Wrench, RefreshCw, XCircle 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function OperationsWarrantyClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('reviews/warranty/claims/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setClaims(list);
    } catch (e) {
      console.warn('Warranty claims fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (claimId: string, newStatus: string) => {
    try {
      await apiClient(`reviews/warranty/claims/${claimId}/`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      fetchClaims();
      setSelectedClaim(null);
    } catch (e: any) {
      alert(e?.message || 'Status update failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Urban Company 30-Day Warranty Claims</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review customer rework requests, inspect evidence photos, and authorize senior technician dispatch.
          </p>
        </div>

        <button
          onClick={fetchClaims}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Claims
        </button>
      </div>

      {/* Claims List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="text-left p-4">Claim ID</th>
                <th className="text-left p-4">Booking Ref</th>
                <th className="text-left p-4">Issue Category</th>
                <th className="text-left p-4">Customer Notes</th>
                <th className="text-left p-4">Preferred Slot</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No active 30-day warranty claims currently registered.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id || claim.claim_id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      #{claim.claim_id || (claim.id ? claim.id.slice(0, 8) : 'WC-001')}
                    </td>
                    <td className="p-4 font-mono text-emerald-700 font-bold">
                      {claim.booking_reference || claim.booking_id?.slice(0, 8)}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {claim.issue_type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {claim.description}
                    </td>
                    <td className="p-4 text-slate-600">
                      {claim.preferred_date || 'ASAP'} ({claim.preferred_time_slot || 'Morning'})
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          claim.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'REWORK_SCHEDULED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {claim.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detail & Approval Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Warranty Claim #{selectedClaim.claim_id || selectedClaim.id?.slice(0, 8)}
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Urban Company 30-Day Guarantee
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Issue Classification:</span>
                <span className="font-bold text-slate-900">{selectedClaim.issue_type}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Customer Description:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedClaim.description}
                </p>
              </div>

              {selectedClaim.evidence_photo_url && (
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">Photographic Evidence:</span>
                  <a
                    href={selectedClaim.evidence_photo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View High-Resolution Evidence Photo
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedClaim.id, 'APPROVED')}
                className="px-5 py-2 bg-[#059669] text-white rounded-xl font-bold hover:bg-[#047857] shadow transition"
              >
                Approve Free Re-work & Dispatch Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
