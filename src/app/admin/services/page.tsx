'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, RefreshCw, CheckCircle2, Clock, Loader2, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface ServiceItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  starting_price?: number;
  base_price?: number;
  estimated_duration_minutes?: number;
  duration_minutes?: number;
  category?: { id: string; name: string };
  is_active?: boolean;
  status?: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [newService, setNewService] = useState({
    name: '',
    category_id: '',
    starting_price: 499,
    estimated_duration_minutes: 60,
    description: '',
    status: 'ACTIVE',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, catsRes]: [any, any] = await Promise.all([
        apiClient('services/').catch(() => []),
        apiClient('services/categories/').catch(() => []),
      ]);

      const sList = Array.isArray(servicesRes) ? servicesRes : servicesRes?.results || [];
      const cList = Array.isArray(catsRes) ? catsRes : catsRes?.results || [];

      setServices(sList);
      setCategories(cList);
      if (cList.length > 0 && !newService.category_id) {
        setNewService((prev) => ({ ...prev, category_id: cList[0].id }));
      }
    } catch (e) {
      console.warn('Services fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name.trim() || !newService.category_id) return;

    try {
      setSaving(true);
      const slugVal = newService.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const payload = {
        name: newService.name.trim(),
        slug: `${slugVal}-${Date.now().toString().slice(-4)}`,
        category_id: newService.category_id,
        starting_price: Number(newService.starting_price),
        estimated_duration_minutes: Number(newService.estimated_duration_minutes),
        description: newService.description.trim() || `${newService.name} service package.`,
        status: 'ACTIVE',
        supports_instant: true,
        supports_scheduled: true,
      };

      const res: any = await apiClient('services/admin/services/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const created: ServiceItem = res?.data || res;
      setServices((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setNewService({
        name: '',
        category_id: categories[0]?.id || '',
        starting_price: 499,
        estimated_duration_minutes: 60,
        description: '',
        status: 'ACTIVE',
      });
      setFeedback(`Service "${created.name}" created and published successfully.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || 'Failed to create service in database');
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name.trim()) return;

    try {
      setSaving(true);
      const payload = {
        name: editingService.name.trim(),
        starting_price: Number(editingService.starting_price || editingService.base_price || 0),
        estimated_duration_minutes: Number(editingService.estimated_duration_minutes || editingService.duration_minutes || 60),
        status: editingService.status || 'ACTIVE',
      };

      const res: any = await apiClient(`services/admin/services/${editingService.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      const updated: ServiceItem = res?.data || res;
      setServices((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
      setEditingService(null);
      setFeedback(`Service "${updated.name}" updated successfully.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || 'Failed to update service in database');
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!deletingService) return;
    try {
      setSaving(true);
      await apiClient(`services/admin/services/${deletingService.id}/`, {
        method: 'DELETE',
      });
      setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
      setFeedback(`Service "${deletingService.name}" permanently deleted.`);
      setDeletingService(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || 'Failed to delete service from database');
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s: ServiceItem) => {
    const isCurrentlyActive = s.status !== 'PAUSED' && s.is_active !== false;
    const newStatus = isCurrentlyActive ? 'PAUSED' : 'ACTIVE';

    try {
      await apiClient(`services/admin/services/${s.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => null);

      setServices((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, status: newStatus } : item))
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
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
            Live Marketplace Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            Master Service Catalog ({services.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, pricing configure, or archive services across all marketplace disciplines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 border border-slate-200 rounded-sm hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter catalog by service name or discipline category..."
          className="w-full bg-white border border-slate-200 rounded-sm pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
            Loading live service catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No services found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-heading uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Service Name</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold">Customer Rate</th>
                  <th className="py-3 px-4 font-semibold">Partner Payout (80%)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const customerPrice = Number(s.starting_price || s.base_price || 499);
                  const partnerPayout = Math.round(customerPrice * 0.8);
                  const duration = s.estimated_duration_minutes || s.duration_minutes || 45;
                  const isActive = s.status !== 'PAUSED' && s.is_active !== false;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-heading font-medium text-slate-900 text-sm">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {s.category?.name || 'General Home'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {duration} mins
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ₹{customerPrice}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                        ₹{partnerPayout}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleActive(s)}
                          className={`px-2.5 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider border transition ${
                            isActive
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isActive ? 'ACTIVE' : 'PAUSED'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingService({ ...s })}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                            title="Edit Service"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingService(s)}
                            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add New Service */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                  Catalog Expansion
                </span>
                <h3 className="text-base font-[300] font-heading text-slate-900 mt-0.5">
                  Add New Service Package
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inverter Battery Health Check"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Primary Category *
                </label>
                <select
                  value={newService.category_id}
                  onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Starting Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newService.starting_price}
                    onChange={(e) => setNewService({ ...newService, starting_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="5"
                    value={newService.estimated_duration_minutes}
                    onChange={(e) => setNewService({ ...newService, estimated_duration_minutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Service Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of what is included in this service..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
                  <span>Publish Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Service */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                  Edit Service
                </span>
                <h3 className="text-base font-[300] font-heading text-slate-900 mt-0.5">
                  Update {editingService.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Customer Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingService.starting_price || editingService.base_price || 0}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        starting_price: Number(e.target.value),
                        base_price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="5"
                    value={editingService.estimated_duration_minutes || editingService.duration_minutes || 60}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        estimated_duration_minutes: Number(e.target.value),
                        duration_minutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
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
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-sm w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Delete &quot;{deletingService.name}&quot;?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This will permanently delete this service and its pricing rules from the live marketplace catalog.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingService(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-sm text-slate-600 hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteService}
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
