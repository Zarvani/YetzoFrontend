'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalManagementScreen() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await apiClient<any>(`admin/users/?role=professional${search ? `&search=${search}` : ''}`);
        setData(res?.results || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchProfessionals, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleApprove = async (id: string, currentStatus: boolean) => {
    setActionId(id);
    try {
      await apiClient(`admin/users/${id}/`, {
        method: 'PATCH',
        body: { is_active: !currentStatus }
      });
      // Optimistic update
      setData(data.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-black tracking-tight text-white">YETZO<span className="text-blue-500">.Admin</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {['Dashboard', 'Dispatch', 'Bookings', 'Customers', 'Professionals', 'Services', 'Pricing', 'Settings'].map((item) => (
            <div key={item} className="px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer transition-colors">
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-slate-900">Professional Management</h1>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <div className="p-8 flex-1">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             {[
               { label: 'Total Volume', value: '₹1.2M', trend: '+14%' },
               { label: 'Active Jobs', value: '342', trend: '+5%' },
               { label: 'Professionals', value: '1,204', trend: '+2%' }
             ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                    <span className="text-sm font-bold text-green-500 mb-1">{stat.trend}</span>
                  </div>
                </div>
             ))}
          </div>

          {/* Data Table Area */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="font-bold text-slate-900">Registered Professionals</h3>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Search professionals..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">Export CSV</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Professional</th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-10 bg-slate-100 rounded w-full"></div>
                          <div className="h-10 bg-slate-100 rounded w-full"></div>
                          <div className="h-10 bg-slate-100 rounded w-full"></div>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                        No professionals found.
                      </td>
                    </tr>
                  ) : (
                    data.map((pro, idx) => (
                      <tr key={pro.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                              {pro.first_name?.[0] || pro.email?.[0] || 'P'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{pro.first_name} {pro.last_name}</p>
                              <p className="text-xs text-slate-500">{pro.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-700">{pro.phone_number || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${pro.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {pro.is_active ? 'Approved' : 'Pending Approval'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button 
                            onClick={() => handleApprove(pro.id, pro.is_active)}
                            disabled={actionId === pro.id}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${pro.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} disabled:opacity-50`}
                          >
                            {actionId === pro.id ? 'Updating...' : pro.is_active ? 'Revoke Access' : 'Approve Pro'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
