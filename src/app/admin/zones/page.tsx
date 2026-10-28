'use client';

import React, { useState } from 'react';
import { MapPin, Plus, CheckCircle2, Zap, ShieldCheck, RefreshCw, X, Loader2 } from 'lucide-react';

interface ZoneItem {
  id: string;
  name: string;
  city: string;
  activePros: number;
  instantSla: boolean;
  surgeMultiplier: number;
  status: 'ACTIVE' | 'PAUSED';
}

export default function AdminZonesPage() {
  const [zones, setZones] = useState<ZoneItem[]>([
    { id: 'z1', name: 'Noida Sector 120 - 122 Micro-Cluster', city: 'Delhi NCR', activePros: 14, instantSla: true, surgeMultiplier: 1.0, status: 'ACTIVE' },
    { id: 'z2', name: 'Indirapuram & Vaishali High-Density Cluster', city: 'Delhi NCR', activePros: 18, instantSla: true, surgeMultiplier: 1.0, status: 'ACTIVE' },
    { id: 'z3', name: 'Whitefield & ITPL Tech Corridor', city: 'Bangalore', activePros: 22, instantSla: true, surgeMultiplier: 1.2, status: 'ACTIVE' },
    { id: 'z4', name: 'Koramangala & HSR Layout', city: 'Bangalore', activePros: 16, instantSla: true, surgeMultiplier: 1.0, status: 'ACTIVE' },
    { id: 'z5', name: 'Hinjewadi Phase 1 & 2', city: 'Pune', activePros: 9, instantSla: true, surgeMultiplier: 1.0, status: 'ACTIVE' },
  ]);

  const [filterCity, setFilterCity] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [newZone, setNewZone] = useState({
    name: '',
    city: 'Bangalore',
    activePros: 15,
    instantSla: true,
    surgeMultiplier: 1.0,
  });

  const toggleStatus = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, status: z.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : z))
    );
  };

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZone.name.trim()) return;

    setSaving(true);
    setTimeout(() => {
      const created: ZoneItem = {
        id: `z-${Date.now()}`,
        name: newZone.name,
        city: newZone.city,
        activePros: Number(newZone.activePros),
        instantSla: newZone.instantSla,
        surgeMultiplier: Number(newZone.surgeMultiplier),
        status: 'ACTIVE',
      };

      setZones((prev) => [created, ...prev]);
      setShowModal(false);
      setNewZone({
        name: '',
        city: 'Bangalore',
        activePros: 15,
        instantSla: true,
        surgeMultiplier: 1.0,
      });
      setFeedback(`Geofenced cluster ${created.name} activated for 15m instant dispatch.`);
      setTimeout(() => setFeedback(null), 4000);
      setSaving(false);
    }, 400);
  };

  const filtered = zones.filter((z) => filterCity === 'ALL' || z.city === filterCity);

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
            Dark Dispatch & Fleet Routing
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            Geofenced Micro-Cluster Zones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure Snabbit 10-15m instant arrival clusters, partner capacity quotas, and localized surge multipliers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Geofence Zone</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'Delhi NCR', 'Bangalore', 'Pune'].map((c) => (
          <button
            key={c}
            onClick={() => setFilterCity(c)}
            className={`px-3.5 py-1.5 rounded-sm text-xs uppercase tracking-wider font-heading font-medium transition whitespace-nowrap border ${
              filterCity === c
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Zones Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-heading uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Zone Cluster</th>
                <th className="py-3 px-4 font-semibold">City Hub</th>
                <th className="py-3 px-4 font-semibold">Active Fleet</th>
                <th className="py-3 px-4 font-semibold">15m Arrival SLA</th>
                <th className="py-3 px-4 font-semibold">Surge</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((z) => (
                <tr key={z.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-heading font-medium text-slate-900">
                    {z.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {z.city}
                  </td>
                  <td className="py-3.5 px-4 font-heading font-medium text-slate-900">
                    {z.activePros} Pros Online
                  </td>
                  <td className="py-3.5 px-4">
                    {z.instantSla ? (
                      <span className="px-2 py-0.5 rounded-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] flex items-center gap-1 w-max">
                        <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        15m Guaranteed
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {z.surgeMultiplier}x
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${
                        z.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {z.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(z.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-medium uppercase tracking-wider rounded-sm transition text-[10px]"
                    >
                      {z.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal: Add New Geofence Zone */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
                  Cluster Topology
                </span>
                <h3 className="text-base font-[300] font-heading text-slate-900 mt-0.5">
                  Define Geofence Zone
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Micro-Cluster Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar & Domlur Central"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    City Hub
                  </label>
                  <select
                    value={newZone.city}
                    onChange={(e) => setNewZone({ ...newZone, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Active Pros Quota
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={newZone.activePros}
                    onChange={(e) => setNewZone({ ...newZone, activePros: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Surge Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="3.0"
                    value={newZone.surgeMultiplier}
                    onChange={(e) => setNewZone({ ...newZone, surgeMultiplier: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2 text-[11px] font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={newZone.instantSla}
                      onChange={(e) => setNewZone({ ...newZone, instantSla: e.target.checked })}
                      className="rounded-sm border-slate-300 text-emerald-600 focus:ring-0"
                    />
                    <span>15m Instant SLA</span>
                  </label>
                </div>
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
                  <span>Activate Zone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
