'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion } from 'framer-motion';

export default function MyAccountScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient<any>('me/');
        setUser(res?.user || res);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-50">
        <button onClick={() => router.back()} className="mr-4 text-slate-600 hover:text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">My Account</h1>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        {isLoading ? (
           <div className="animate-pulse space-y-4">
             <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
             <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>
           </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* User Info Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black">
                {user?.first_name?.charAt(0) || 'Y'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">{user?.first_name || 'Customer'} {user?.last_name || ''}</h2>
                <p className="text-slate-500 font-medium">{user?.phone_number || user?.email || '+91 99999 99999'}</p>
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => router.push('/customer/wallet')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-blue-500 transition-colors group">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900">Wallet & Payments</h3>
                <p className="text-xs text-slate-500 mt-1">Manage balances</p>
              </button>

              <button onClick={() => router.push('/customer/addresses')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-blue-500 transition-colors group">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900">Saved Addresses</h3>
                <p className="text-xs text-slate-500 mt-1">Home, Office, etc.</p>
              </button>

              <button onClick={() => router.push('/customer/notifications')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-blue-500 transition-colors group">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500 mt-1">Updates & alerts</p>
              </button>

              <button onClick={() => router.push('/customer/support')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-blue-500 transition-colors group">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900">Help & Support</h3>
                <p className="text-xs text-slate-500 mt-1">Raise a ticket</p>
              </button>
            </div>

            <button className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors">
              Log Out
            </button>
          </motion.div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-xl mx-auto flex justify-around p-2">
          <button onClick={() => router.push('/customer/home')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => router.push('/customer/bookings')} className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span className="text-[10px] font-bold">Bookings</span>
          </button>
          <button onClick={() => router.push('/customer/account')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-[10px] font-bold">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
