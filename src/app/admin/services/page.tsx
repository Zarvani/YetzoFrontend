'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Plus, Search, RefreshCw, CheckCircle2, Clock, Video, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface ServiceItem {
  id: string;
  name: string;
  base_price: number;
  duration_minutes: number;
  category?: { name: string };
  is_active?: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('services/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || [];
      setServices(list);
    } catch (e) {
      console.warn('Services fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleActive = async (id: string, current: boolean = true) => {
    try {
      await apiClient(`services/${id}/`, {
        method: 'PATCH',
        body: { is_active: !current },
      }).catch(() => null);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
      );
    } catch (e) {
      console.warn('Toggle service error:', e);
    }
  };

  const filtered = services.filter((s) => {
    const q = search.toLowerCase().trim();
    return !q || s.name?.toLowerCase().includes(q) || s.category?.name?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#059669]" />
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Master Service Catalog</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage rate cards, standardized chore duration, and active booking availability.</p>
        </div>

        <button
          onClick={fetchServices}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Catalog</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter catalog by service name or discipline category..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#059669]"
        />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
            Loading service database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No services found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Service Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Customer Rate</th>
                  <th className="py-3 px-4">Partner Payout (80%)</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const customerPrice = Number(s.base_price || 499);
                  const partnerPayout = Math.round(customerPrice * 0.8);
                  const isActive = s.is_active !== false;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        {s.category?.name || 'General Home'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {s.duration_minutes || 45} mins
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ₹{customerPrice}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">
                        ₹{partnerPayout}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleActive(s.id, isActive)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? 'Published' : 'Draft'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
