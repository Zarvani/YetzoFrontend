'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface CouponItem {
  id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_value?: number;
  max_discount_amount?: number;
  description?: string;
  is_active?: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [newValue, setNewValue] = useState('20');
  const [newMinOrder, setNewMinOrder] = useState('499');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('admin-core/coupons/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || [];
      setCoupons(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      setCreating(true);
      await apiClient('admin-core/coupons/', {
        method: 'POST',
        body: {
          code: newCode.trim().toUpperCase(),
          discount_type: newType,
          discount_value: Number(newValue),
          min_order_value: Number(newMinOrder),
          description: newDesc,
          is_active: true,
        },
      });

      setShowModal(false);
      setNewCode('');
      setNewDesc('');
      fetchCoupons();
    } catch (e: any) {
      alert(e?.message || 'Failed to create coupon voucher');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#059669]" />
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Promotional Coupons & Voucher Codes</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Configure customer discounts, marketing codes, and minimum checkout thresholds.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Voucher</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
            Loading voucher rules...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No coupons configured. Click Create Promo Voucher to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Booking Value</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900 tracking-wider">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#059669]">
                      {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT`}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      ₹{c.min_order_value || 0}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.description || 'Promotional Discount'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-900">Create New Promo Voucher</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="YETZO100"
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold uppercase focus:ring-2 focus:ring-[#059669] text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900 font-semibold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-[#059669] text-slate-900 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-[#059669] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Valid on AC deep cleaning service"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newCode.trim()}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Save Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
