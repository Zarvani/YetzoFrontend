'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, CheckCircle2, RefreshCw, X, Loader2, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface CityItem {
  id: string;
  name: string;
  state: string;
  country?: string;
  is_active?: boolean;
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [newCity, setNewCity] = useState({
    name: '',
    state: '',
    country: 'India',
    is_active: true,
  });

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('locations/cities/');
      const list = res?.data || (Array.isArray(res) ? res : res?.results || []);
      setCities(list);
    } catch {
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.name.trim() || !newCity.state.trim()) return;

    try {
      setSaving(true);
      const res: any = await apiClient('locations/cities/', {
        method: 'POST',
        body: JSON.stringify(newCity),
      });

      const created: CityItem = res?.data || res;
      setCities((prev) => [created, ...prev]);
      setShowModal(false);
      setNewCity({
        name: '',
        state: '',
        country: 'India',
        is_active: true,
      });
      setFeedback(`City Hub ${created.name} successfully activated in database.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || 'Failed to create city in database');
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
            Live Network Topology
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            Operating City Hubs ({cities.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time metropolitan hubs connected to live PostgreSQL schema.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCities}
            className="p-2 border border-slate-200 rounded-sm hover:bg-slate-50 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch New City Hub</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Loading live operating city hubs from database...</span>
          </div>
        ) : cities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No operating city hubs configured in database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-heading uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">City Hub</th>
                  <th className="py-3 px-4 font-semibold">State Jurisdiction</th>
                  <th className="py-3 px-4 font-semibold">Country</th>
                  <th className="py-3 px-4 font-semibold">Database Reference</th>
                  <th className="py-3 px-4 font-semibold">Operating Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cities.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-heading font-medium text-slate-900 text-sm">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {c.state}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {c.country || 'India'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {c.id.slice(0, 8)}...
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider border ${
                          c.is_active !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {c.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Modal: Launch New City Hub */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
                  Expansion Ops
                </span>
                <h3 className="text-base font-[300] font-heading text-slate-900 mt-0.5">
                  Launch New City Hub
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCity} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  City Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  State Jurisdiction *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamil Nadu"
                  value={newCity.state}
                  onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-sm text-slate-600 hover:bg-slate-50 uppercase tracking-wider text-[11px] font-heading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white rounded-sm uppercase tracking-wider text-[11px] font-heading font-medium flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Save to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
