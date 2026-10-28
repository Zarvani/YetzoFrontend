'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, RefreshCw, Crown, Phone, Mail, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface CustomerItem {
  id: string;
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  created_at: string;
  is_member?: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('users/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || [];
      if (list.length > 0) {
        setCustomers(list);
      } else {
        // Fetch from bookings customers
        const bRes: any = await apiClient('bookings/').catch(() => []);
        const bList = Array.isArray(bRes) ? bRes : bRes?.results || [];
        const unique = Array.from(
          new Map(bList.filter((b: any) => b.customer).map((b: any) => [b.customer.phone, b.customer])).values()
        );
        setCustomers(unique as CustomerItem[]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    return !q || c.phone?.includes(q) || c.first_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#059669]" />
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Customer Database & Accounts</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Audit customer profiles, lifetime order history, and membership subscription status.</p>
        </div>

        <button
          onClick={fetchCustomers}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter customers by name, phone number, or email..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#059669]"
        />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
            Loading customer accounts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No customers found matching search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Membership</th>
                  <th className="py-3 px-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.first_name ? `${c.first_name} ${c.last_name || ''}` : 'Customer'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {c.phone || 'No Phone'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.email || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.is_member ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1 w-max">
                          <Crown className="w-3 h-3 text-amber-600" /> Yetzo Club Plus
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
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
    </div>
  );
}
