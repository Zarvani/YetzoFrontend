'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, CheckCircle2, AlertTriangle, ShieldCheck, 
  Search, Filter, ExternalLink, Star, Phone, RefreshCw 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function OperationsProfessionalsPage() {
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKyc, setFilterKyc] = useState('ALL');

  useEffect(() => {
    fetchPros();
  }, []);

  const fetchPros = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('professionals/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setPros(list);
    } catch (e) {
      console.warn('Pros fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKyc = async (proId: string) => {
    try {
      await apiClient(`professionals/${proId}/kyc/`, {
        method: 'PATCH',
        body: { kyc_status: 'ACTIVE' },
      });
      fetchPros();
    } catch (e: any) {
      alert(e?.message || 'Failed to approve KYC');
    }
  };

  const filteredPros = pros.filter((p) => {
    const matchesSearch =
      (p.user?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.user?.phone || '').includes(searchTerm);
    if (filterKyc === 'ALL') return matchesSearch;
    return matchesSearch && p.kyc_status === filterKyc;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Partner Fleet & KYC Governance</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Urban Company standard background verification, Aadhaar/PAN validation, and fleet onboarding.
          </p>
        </div>

        <button
          onClick={fetchPros}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Fleet
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by partner name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['ALL', 'ACTIVE', 'VERIFICATION', 'APPLIED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterKyc(status)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                filterKyc === status
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="text-left p-4">Professional</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">KYC Status</th>
                <th className="text-left p-4">Rating</th>
                <th className="text-left p-4">Jobs Done</th>
                <th className="text-left p-4">Field Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No partner records found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredPros.map((pro) => (
                  <tr key={pro.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {pro.user?.first_name ? pro.user.first_name[0] : 'P'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {pro.user?.first_name || 'Service Partner'} {pro.user?.last_name || ''}
                          </span>
                          <span className="text-[11px] text-slate-500">{pro.user?.email || 'No email'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-700">
                      {pro.user?.phone || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          pro.kyc_status === 'ACTIVE' || pro.kyc_status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pro.kyc_status === 'VERIFICATION'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pro.kyc_status || 'APPLIED'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {pro.rating || '4.9'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-semibold">
                      {pro.total_jobs_completed || 120}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        Online
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {pro.kyc_status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleApproveKyc(pro.id)}
                          className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg transition"
                        >
                          Approve KYC
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
