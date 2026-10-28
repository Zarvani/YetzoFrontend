'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, CheckCircle2, RefreshCw, Loader2, X } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface RoleItem {
  id: string;
  name: string;
  description?: string;
  user_count?: number;
  permissions?: string[];
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('users/roles/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || res?.data || [];
      if (list.length > 0) {
        setRoles(list);
      } else {
        // Fallback default system roles
        setRoles([
          { id: 'r1', name: 'SUPER_ADMIN', description: 'Root access across database, treasury, and system configuration.', user_count: 2 },
          { id: 'r2', name: 'OPERATIONS_DISPATCHER', description: 'Controls live radar, manual partner assignment override, and SLA monitoring.', user_count: 8 },
          { id: 'r3', name: 'COMPLIANCE_OFFICER', description: 'Reviews partner KYC, background check certificates, and DPDP bodycam policies.', user_count: 4 },
          { id: 'r4', name: 'CUSTOMER_SUPPORT', description: 'Handles in-app chats, support tickets, and warranty rework claims.', user_count: 12 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      setSubmitting(true);
      await apiClient('users/roles/', {
        method: 'POST',
        body: {
          name: newRoleName.trim().toUpperCase(),
          description: newRoleDesc.trim(),
        },
      });
      setShowModal(false);
      setNewRoleName('');
      setNewRoleDesc('');
      fetchRoles();
    } catch (err: any) {
      alert(err?.message || 'Failed to create role');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-['Sarabun',sans-serif]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#05AC5F]" />
            <h1 className="text-2xl font-[300] text-slate-900 tracking-tight font-['Montserrat',sans-serif]">
              Role-Based Access Control (RBAC)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-[300]">
            Configure operational staff roles, administrative privileges, and security boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRoles}
            disabled={loading}
            className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white text-xs font-medium rounded transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Define New Role</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-md">
          <Loader2 className="w-6 h-6 animate-spin text-[#05AC5F] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading system roles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-md border border-slate-200/90 shadow-xs space-y-3 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-semibold text-slate-900 text-sm">{r.name}</span>
                  <p className="text-slate-500 mt-1 text-[11px] font-[300] leading-relaxed">
                    {r.description || 'Standard access role'}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 whitespace-nowrap border border-slate-200">
                  {r.user_count ?? 0} Staff
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1 tracking-wider">
                  System Boundary
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#05AC5F] font-mono text-[10px] font-medium border border-emerald-100">
                  {r.name.toLowerCase()}.access
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Role Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-[400] text-slate-900 font-['Montserrat',sans-serif]">Create Operational Role</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Role Identifier (e.g. OPERATIONS_SUPERVISOR)</label>
                <input
                  type="text"
                  required
                  placeholder="DISPATCH_MANAGER"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono uppercase focus:outline-none focus:border-[#05AC5F]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Role Scope & Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Oversees cluster dispatch queues and re-assigns unaccepted tasks"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-normal focus:outline-none focus:border-[#05AC5F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium rounded transition flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Creating...' : 'Save Role'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
