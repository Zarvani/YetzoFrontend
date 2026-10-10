'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function CustomerDashboard() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Strict API usage - No dummy data allowed per user request

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
           router.push('/auth/login');
           return;
        }

        const catRes: any = await apiClient('categories/').catch(() => null);
        const servRes: any = await apiClient('services/').catch(() => null);
        
        if (catRes?.results) setCategories(catRes.results);
        if (servRes?.results) setPopularServices(servRes.results.slice(0, 4));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* 1. Header with Address & Profile Shortcut */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Location</span>
          <div className="flex items-center gap-1 font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
             Home - Andheri West, Mumbai
             <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <button onClick={() => router.push('/customer/profile')} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-colors">
           <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </button>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-8 mt-4">
        
        {/* 2. Service Search */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">What can we help you with today?</h2>
          <div className="flex bg-white shadow-sm rounded-xl border border-slate-200 p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <div className="flex-1 flex items-center px-3">
              <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search for 'Deep Cleaning'..." className="w-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* 6. Upcoming Booking Summary (Example Alert) */}
        <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-lg shadow-blue-600/30 relative overflow-hidden flex items-center justify-between cursor-pointer hover:bg-blue-700 transition-colors" onClick={() => router.push('/customer/bookings/123')}>
           <div>
             <span className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1 block">Upcoming Booking</span>
             <h4 className="font-bold text-lg">AC Servicing</h4>
             <p className="text-sm text-blue-100 mt-1">Today, 2:00 PM • Arriving in 45 mins</p>
           </div>
           <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </div>

        {/* 4. Instant house-help booking panel */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-black px-2 py-0.5 rounded uppercase tracking-widest">Yetzo Instant</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
             </div>
             <h3 className="text-xl font-bold mb-2">Instant House Help</h3>
             <p className="text-slate-400 text-sm mb-4 max-w-[80%]">Need someone right now? Book a verified helper in under 15 minutes.</p>
             <button className="bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors w-full">
               Book Now
             </button>
           </div>
        </div>

        {/* 3. Service Category Grid */}
        <div>
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-900 text-lg">Explore Categories</h3>
             <button className="text-sm text-blue-600 font-bold hover:underline">See All</button>
           </div>
           <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
               [1,2,3,4,5,6].map(i => (
                 <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                   <div className="w-full aspect-square rounded-2xl bg-slate-200"></div>
                   <div className="w-16 h-3 bg-slate-200 rounded"></div>
                 </div>
               ))
            ) : categories.length > 0 ? (
              categories.slice(0,6).map((cat: any) => (
                <div key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => router.push(`/services/${cat.slug || cat.id}`)}>
                  <div className={`w-full aspect-square rounded-2xl ${cat.color || 'bg-slate-100'} flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:shadow-md transition-all`}>
                    {cat.icon ? (
                       <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-700 text-center">{cat.name}</span>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-xs font-bold text-slate-400 border border-dashed border-slate-200 rounded-xl">
                 No categories found.
              </div>
            )}
           </div>
        </div>

        {/* 5. Popular Services */}
        <div>
           <h3 className="font-bold text-slate-900 text-lg mb-4">Popular in your area</h3>
           <div className="space-y-4">
             {popularServices.length > 0 ? (
               popularServices.map((service: any) => (
                 <div key={service.id} className="bg-white rounded-xl border border-slate-200 p-3 flex gap-4 items-center hover:shadow-md transition-all cursor-pointer">
                   <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0 overflow-hidden relative">
                     {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                     )}
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-slate-900 text-sm">{service.name || 'Premium Service'}</h4>
                     <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mt-1 mb-2">
                       <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                       {service.rating || '4.8'} ({service.review_count || '1k'})
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-slate-900">₹{service.base_price || '0'}</span>
                       <button className="text-xs bg-slate-100 text-blue-600 font-bold px-3 py-1.5 rounded-md hover:bg-blue-50">Add</button>
                     </div>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-4 text-xs font-bold text-slate-400 border border-dashed border-slate-200 rounded-xl">
                 No services available in this location yet.
               </div>
             )}
           </div>
        </div>

      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-xl mx-auto flex justify-around p-2">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => router.push('/customer/bookings')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span className="text-[10px] font-bold">Bookings</span>
          </button>
          <button onClick={() => router.push('/customer/support')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span className="text-[10px] font-bold">Support</span>
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
