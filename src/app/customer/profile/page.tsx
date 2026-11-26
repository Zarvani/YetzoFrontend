'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function ProfilePage() {
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
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <h1 className="text-xl font-black text-slate-900">Profile</h1>
      </div>

      <main className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-md shadow-blue-200">
            {loading ? '...' : user?.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900 mb-1">
              {loading ? 'Loading...' : user ? `${user.first_name} ${user.last_name || ''}` : 'Guest User'}
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-0.5">{user?.phone || 'No phone number'}</p>
            <p className="text-sm font-medium text-slate-500">{user?.email || 'No email added'}</p>
          </div>
          <button className="text-blue-600 p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📍', label: 'My Addresses', path: '/customer/addresses' },
            { icon: '💳', label: 'Yetzo Wallet', path: '/customer/wallet' },
            { icon: '🌟', label: 'Memberships', path: '/customer/membership' },
            { icon: '🎁', label: 'Refer & Earn', path: '/customer/referrals' },
            { icon: '📞', label: 'Help Center', path: '/customer/support' },
            { icon: '⚙️', label: 'Settings', path: '/customer/settings' },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.path)} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-blue-300 transition-colors text-left group">
              <span className="text-2xl group-hover:scale-110 transition-transform origin-bottom-left">{item.icon}</span>
              <span className="font-bold text-slate-800 text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Support Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <h3 className="font-black text-lg mb-1">Need help?</h3>
            <p className="text-slate-300 text-sm mb-4 font-medium max-w-[200px]">Our support team is available 24/7 to assist you.</p>
            <button onClick={() => router.push('/customer/support')} className="bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
        
        <p className="text-center text-xs font-bold text-slate-400">Yetzo v1.0.0</p>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-50">
        {[
          { label:'Home', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path:'/customer/home', active:false },
          { label:'Bookings', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', path:'/customer/bookings', active:false },
          { label:'Cart', icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', path:'/customer/cart', active:false },
          { label:'Profile', icon:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path:'/customer/profile', active:true },
        ].map(n => (
          <button key={n.label} onClick={() => router.push(n.path)} className={`flex-1 flex flex-col items-center py-3 gap-1 ${n.active ? 'text-blue-600' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={n.icon}/></svg>
            <span className="text-xs font-bold">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
