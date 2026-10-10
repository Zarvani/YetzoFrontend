'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function AllBookingsScreen() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch or real fetch depending on endpoint
    setTimeout(() => setIsLoading(false), 500);
  }, []);

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
          <h1 className="text-lg font-bold text-slate-900">All Bookings</h1>
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
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent Records</h3>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Export CSV</button>
            </div>
            <div className="p-6 text-center text-slate-500 py-12">
               {isLoading ? (
                 <div className="animate-pulse space-y-4">
                   <div className="h-10 bg-slate-100 rounded w-full"></div>
                   <div className="h-10 bg-slate-100 rounded w-full"></div>
                   <div className="h-10 bg-slate-100 rounded w-full"></div>
                 </div>
               ) : (
                 <p>Operational data will populate here based on real-time API integrations.</p>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
