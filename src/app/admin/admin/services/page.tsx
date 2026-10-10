'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function ServiceCatalogScreen() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiClient<any>(`services/${search ? `?search=${search}` : ''}`);
        setData(res?.results || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchServices, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setDeletingId(id);
    try {
      await apiClient(`services/${id}/`, { method: 'DELETE' });
      setData(data.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete service");
    } finally {
      setDeletingId(null);
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
          <h1 className="text-lg font-bold text-slate-900">Service Catalog</h1>
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
              <h3 className="font-bold text-slate-900">Service Catalog</h3>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Search services..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">Add Service</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Name</th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Base Price</th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-10 bg-slate-100 rounded w-full"></div>
                          <div className="h-10 bg-slate-100 rounded w-full"></div>
                          <div className="h-10 bg-slate-100 rounded w-full"></div>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                        No services found.
                      </td>
                    </tr>
                  ) : (
                    data.map((service, idx) => (
                      <tr key={service.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900 capitalize">{service.name}</td>
                        <td className="py-4 px-6 text-sm text-slate-700 capitalize">{service.category?.name || service.category || 'Uncategorized'}</td>
                        <td className="py-4 px-6 text-sm font-bold text-slate-900">₹{service.base_price || '0.00'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${service.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                            {service.is_active !== false ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-800 font-bold text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded">Edit</button>
                            <button 
                              onClick={() => handleDelete(service.id)}
                              disabled={deletingId === service.id}
                              className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded disabled:opacity-50"
                            >
                              {deletingId === service.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
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
