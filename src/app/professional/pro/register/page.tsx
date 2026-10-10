'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PartnerRegistrationScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div>
           <h1 className="text-lg font-bold">Partner Registration</h1>
           <p className="text-xs text-slate-400 mt-0.5">Partner Portal</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1.5 border border-slate-700">
           <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
           <span className="text-xs font-bold">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 mt-4 space-y-6">
        {/* Job Card Example */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-xl">New Request</div>
           <h3 className="font-bold text-slate-900 text-lg mb-1">Deep House Cleaning</h3>
           <p className="text-sm text-slate-500 mb-4">Andheri West, Mumbai • 5.2 km away</p>
           
           <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
             <div>
               <p className="text-xs text-slate-500 font-medium">Est. Payout</p>
               <p className="font-black text-slate-900 text-lg">₹850</p>
             </div>
             <div className="text-right">
               <p className="text-xs text-slate-500 font-medium">Time</p>
               <p className="font-bold text-slate-900">Today, 2:00 PM</p>
             </div>
           </div>

           <div className="flex gap-3">
             <button className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Decline</button>
             <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20">Accept Job</button>
           </div>
        </div>
      </main>

      {/* Partner Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-xl mx-auto flex justify-around p-2">
          <button onClick={() => router.push('/professional/pro')} className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span className="text-[10px] font-bold">Jobs</span>
          </button>
          <button onClick={() => router.push('/professional/pro/earnings')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-[10px] font-bold">Earnings</span>
          </button>
          <button onClick={() => router.push('/professional/pro/profile')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
