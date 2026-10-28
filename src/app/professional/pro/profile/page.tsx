'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('auth/me/')
      .then((res: any) => setUser(res.data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-5 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-black text-white">Professional Profile</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-md shadow-blue-200">
            {loading ? '...' : user?.first_name?.[0]?.toUpperCase() || 'P'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900 mb-1">
              {loading ? 'Loading...' : user ? `${user.first_name} ${user.last_name || ''}` : 'Professional'}
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-0.5">{user?.phone || 'No phone number'}</p>
            <p className="text-sm font-medium text-slate-500">{user?.email || 'No email added'}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="bg-yellow-100 text-yellow-700 text-xs font-black px-2 py-1 rounded">★ {user?.professional_profile?.rating || 'New'}</span>
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">{user?.professional_profile?.status || 'ACTIVE'}</span>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📄', label: 'My Documents', path: '/professional/pro/documents' },
            { icon: '⚙️', label: 'Skills & Services', path: '/professional/pro/skills' },
            { icon: '📊', label: 'Performance', path: '/professional/pro/performance' },
            { icon: '🏦', label: 'Bank Details', path: '/professional/pro/payouts' },
            { icon: '📞', label: 'Partner Support', path: '/professional/pro/support' },
            { icon: '🗓️', label: 'Availability', path: '/professional/pro/availability' },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.path)} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-blue-300 transition-colors text-left group">
              <span className="text-2xl group-hover:scale-110 transition-transform origin-bottom-left">{item.icon}</span>
              <span className="font-bold text-slate-800 text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </main>

      {/* Bottom Pro Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 h-16 flex justify-around items-center z-50 pb-safe">
        {[
          { label: 'Home', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z', path: '/professional/pro', active: false },
          { label: 'Calendar', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', path: '/professional/pro/calendar', active: false },
          { label: 'Earnings', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', path: '/professional/pro/earnings', active: false },
          { label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path: '/professional/pro/profile', active: true },
        ].map((item, idx) => (
          <div key={idx} onClick={() => router.push(item.path)} className={`flex flex-col items-center cursor-pointer ${item.active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <svg className="w-6 h-6 mb-1" fill={item.active ? "currentColor" : "none"} stroke={!item.active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}></path>
            </svg>
            <span className="text-[10px] font-bold">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
