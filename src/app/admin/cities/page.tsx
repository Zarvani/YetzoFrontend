'use client';

import React, { useState } from 'react';
import { Building2, Plus, CheckCircle2, RefreshCw, X, Loader2, MapPin } from 'lucide-react';

interface CityItem {
  id: string;
  name: string;
  state: string;
  clustersCount: number;
  taxRate: string;
  status: 'LAUNCHED' | 'BETA' | 'PLANNED';
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityItem[]>([
    { id: 'c1', name: 'Delhi NCR', state: 'Delhi / UP / Haryana', clustersCount: 28, taxRate: '18% GST (SAC 9987)', status: 'LAUNCHED' },
    { id: 'c2', name: 'Bangalore', state: 'Karnataka', clustersCount: 22, taxRate: '18% GST (SAC 9987)', status: 'LAUNCHED' },
    { id: 'c3', name: 'Pune', state: 'Maharashtra', clustersCount: 14, taxRate: '18% GST (SAC 9987)', status: 'LAUNCHED' },
    { id: 'c4', name: 'Mumbai', state: 'Maharashtra', clustersCount: 32, taxRate: '18% GST (SAC 9987)', status: 'BETA' },
    { id: 'c5', name: 'Hyderabad', state: 'Telangana', clustersCount: 16, taxRate: '18% GST (SAC 9987)', status: 'BETA' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [newCity, setNewCity] = useState({
    name: '',
    state: '',
    clustersCount: 12,
    taxRate: '18% GST (SAC 9987)',
    status: 'BETA' as const,
  });

  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.name.trim() || !newCity.state.trim()) return;

    setSaving(true);
    setTimeout(() => {
      const created: CityItem = {
        id: `c-${Date.now()}`,
        name: newCity.name,
        state: newCity.state,
        clustersCount: Number(newCity.clustersCount),
        taxRate: newCity.taxRate,
        status: newCity.status,
      };

      setCities((prev) => [...prev, created]);
      setShowModal(false);
      setNewCity({
        name: '',
        state: '',
        clustersCount: 12,
        taxRate: '18% GST (SAC 9987)',
        status: 'BETA',
      });
      setFeedback(`City Hub ${created.name} successfully activated in network.`);
      setTimeout(() => setFeedback(null), 4000);
      setSaving(false);
    }, 400);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
            Network Topology
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            Operating City Hubs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Metropolitan jurisdictions, localized statutory tax compliance rules, and rollout clusters.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Launch New City Hub</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-heading uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">City Hub</th>
                <th className="py-3 px-4 font-semibold">State Jurisdiction</th>
                <th className="py-3 px-4 font-semibold">Active Clusters</th>
                <th className="py-3 px-4 font-semibold">Statutory Tax Rate</th>
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
                  <td className="py-3.5 px-4 font-heading font-medium text-slate-900">
                    {c.clustersCount} Micro-Clusters
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {c.taxRate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider border ${
                        c.status === 'LAUNCHED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Initial Clusters
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCity.clustersCount}
                    onChange={(e) => setNewCity({ ...newCity, clustersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Rollout Phase
                  </label>
                  <select
                    value={newCity.status}
                    onChange={(e: any) => setNewCity({ ...newCity, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="BETA">BETA</option>
                    <option value="LAUNCHED">LAUNCHED</option>
                    <option value="PLANNED">PLANNED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Statutory Tax Rate
                </label>
                <input
                  type="text"
                  value={newCity.taxRate}
                  onChange={(e) => setNewCity({ ...newCity, taxRate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600 font-mono text-[11px]"
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
                  <span>Activate Hub</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
