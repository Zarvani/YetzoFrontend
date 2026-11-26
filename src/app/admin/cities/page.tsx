'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, CheckCircle2, RefreshCw, X, Loader2, MapPin, Pencil, Trash2, AlertTriangle } from 'lucide-react';
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
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);
  const [deletingCity, setDeletingCity] = useState<CityItem | null>(null);
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

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCity || !editingCity.name.trim() || !editingCity.state.trim()) return;

    try {
      setSaving(true);
      const res: any = await apiClient(`locations/cities/${editingCity.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editingCity.name,
          state: editingCity.state,
          country: editingCity.country || 'India',
          is_active: editingCity.is_active,
        }),
      });

      const updated: CityItem = res?.data || res;
      setCities((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCity(null);
      setFeedback(`City Hub ${updated.name} successfully updated.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || 'Failed to update city in database');
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCity = async () => {
    if (!deletingCity) return;
    try {
      setSaving(true);
      await apiClient(`locations/cities/${deletingCity.id}/`, {
        method: 'DELETE',
      });
      setCities((prev) => prev.filter((c) => c.id !== deletingCity.id));
      setFeedback(`City Hub ${deletingCity.name} removed from database.`);
      setDeletingCity(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || 'Failed to delete city from database');
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
          <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
            Live Network Topology
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            Operating City Hubs ({cities.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time metropolitan hubs connected to live PostgreSQL schema. Create, edit, or archive operating hubs.
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
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch New City Hub</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
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
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
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
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {c.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingCity({ ...c })}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                          title="Edit City Hub"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingCity(c)}
                          className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                          title="Delete City Hub"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
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
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-sm uppercase tracking-wider text-[11px] font-heading font-medium flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Save to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Modal: Edit City Hub */}
      {editingCity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                  Edit Operations Hub
                </span>
                <h3 className="text-base font-[300] font-heading text-slate-900 mt-0.5">
                  Update {editingCity.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingCity(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCity} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  City Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCity.name}
                  onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  State Jurisdiction *
                </label>
                <input
                  type="text"
                  required
                  value={editingCity.state}
                  onChange={(e) => setEditingCity({ ...editingCity, state: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="city_active"
                  checked={editingCity.is_active !== false}
                  onChange={(e) => setEditingCity({ ...editingCity, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-emerald-500"
                />
                <label htmlFor="city_active" className="text-slate-700 font-medium">
                  Active in Live Operations Dispatch
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCity(null)}
                  className="px-3.5 py-2 border border-slate-200 rounded-sm text-slate-600 hover:bg-slate-50 uppercase tracking-wider text-[11px] font-heading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-sm uppercase tracking-wider text-[11px] font-heading font-medium flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Update Hub</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-sm w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Delete {deletingCity.name} Hub?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This will remove this city hub and unbind its zone dispatches from the database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingCity(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-sm text-slate-600 hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCity}
                disabled={saving}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-sm text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
