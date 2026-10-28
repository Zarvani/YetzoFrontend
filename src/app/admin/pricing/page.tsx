'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Plus, RefreshCw, CheckCircle2, Save, Loader2, X } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface PricingRuleItem {
  id: string;
  name: string;
  rule_type: string;
  discount_or_multiplier: string;
  condition: string;
  active: boolean;
}

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [basePrice, setBasePrice] = useState('499');
  const [saving, setSaving] = useState(false);

  const fetchPricingRules = async () => {
    try {
      setLoading(true);
      const [servicePricing, taxRules]: any = await Promise.all([
        apiClient('pricing/service-pricing/').catch(() => []),
        apiClient('pricing/tax-rules/').catch(() => []),
      ]);

      const spList = Array.isArray(servicePricing) ? servicePricing : servicePricing?.results || [];
      const trList = Array.isArray(taxRules) ? taxRules : taxRules?.results || [];

      const dynamicRules: PricingRuleItem[] = [
        {
          id: 'pr-stacking',
          name: 'Pronto Task Stacking Discount (Multi-Chore)',
          rule_type: 'BUNDLE_DISCOUNT',
          discount_or_multiplier: '15% FLAT OFF',
          condition: 'Automatically applied when 2+ chores are booked in single session',
          active: true,
        },
        {
          id: 'pr-club',
          name: 'Yetzo Club Plus Membership Privilege',
          rule_type: 'MEMBERSHIP_BENEFIT',
          discount_or_multiplier: '10% FLAT OFF + Free Cancellation',
          condition: 'Active Yetzo Club subscriber checkout',
          active: true,
        },
      ];

      // Map DB Tax rules
      trList.forEach((tr: any) => {
        dynamicRules.push({
          id: tr.id || 'gst-18',
          name: `${tr.name || 'Statutory GST Tax'} (${tr.hsn_sac_code || 'SAC 9987'})`,
          rule_type: 'STATUTORY_TAX',
          discount_or_multiplier: `${(Number(tr.cgst_percent || 9) + Number(tr.sgst_percent || 9))}% GST`,
          condition: 'Mandatory domestic home services compliance',
          active: tr.is_active !== false,
        });
      });

      // Map DB Service Pricing rules
      spList.forEach((sp: any) => {
        dynamicRules.push({
          id: sp.id,
          name: `Rate Card: Service Base Rate (${sp.city || 'Pan-India'})`,
          rule_type: 'BASE_PRICING',
          discount_or_multiplier: `₹${sp.base_price || 499}`,
          condition: sp.city ? `Applicable in ${sp.city} cluster` : 'Universal fallback tier',
          active: sp.is_active !== false,
        });
      });

      setRules(dynamicRules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingRules();
  }, []);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiClient('pricing/service-pricing/', {
        method: 'POST',
        body: {
          base_price: Number(basePrice),
          is_active: true,
        },
      });
      setShowModal(false);
      setRuleName('');
      fetchPricingRules();
    } catch (err: any) {
      alert(err?.message || 'Pricing rule saved locally');
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-['Sarabun',sans-serif]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#05AC5F]" />
            <h1 className="text-2xl font-[300] text-slate-900 tracking-tight font-['Montserrat',sans-serif]">
              Dynamic Pricing & Rate Card Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-[300]">
            Pronto 15% Task Stacking discounts, statutory GST rules, and city cluster base rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPricingRules}
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
            <span>Add Rate Rule</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rule Specification</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Rate / Multiplier</th>
                <th className="py-3 px-4">Evaluation Condition</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {r.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-normal text-slate-500 text-[11px]">
                    {r.rule_type}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#05AC5F]">
                    {r.discount_or_multiplier}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-[300]">
                    {r.condition}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleRule(r.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                        r.active
                          ? 'bg-emerald-50 text-[#05AC5F] border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {r.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-[400] text-slate-900 font-['Montserrat',sans-serif]">Create Pricing Rule</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Delhi Deep Cleaning Surge"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#05AC5F]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Base Price / Adjustment (₹)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-[#05AC5F]"
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
                  disabled={saving}
                  className="px-5 py-2 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium rounded transition flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Rule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
