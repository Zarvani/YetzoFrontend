'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function CustomerHomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    Promise.all([
      apiClient('categories/').catch(() => []),
      apiClient('cms/banners/').catch(() => []),
      apiClient('bookings/').catch(() => ({ data: [] })),
      apiClient('auth/me/').catch(() => null),
    ]).then(([cats, bans, bkgs, me]) => {
      setCategories((cats as any)?.results || cats || []);
      setBanners((bans as any)?.results || bans || []);
      const bookingList = (bkgs as any)?.data || [];
      setBookings(bookingList.slice(0, 3));
      setUser((me as any)?.data?.user || null);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, [banners]);

  const statusColor: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-700',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white px-4 pt-5 pb-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-slate-500 font-medium text-sm">Good morning 👋</p>
            <h1 className="text-lg font-black text-slate-900">
              {loading ? 'Loading...' : user ? `${user.first_name || 'Welcome back'}` : 'Welcome to Yetzo'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/customer/notifications')} className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </button>
            <button onClick={() => router.push('/customer/profile')} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </button>
          </div>
        </div>
        {/* Search bar */}
        <button onClick={() => router.push('/search')} className="w-full bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-400 font-medium text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          Search for a service...
        </button>
      </header>

      <main className="px-4 space-y-6 pt-4">
        {/* Banners */}
        {banners.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl aspect-[16/6] bg-slate-200">
            {banners.map((b: any, i: number) => (
              <div key={b.id || i} className={`absolute inset-0 transition-opacity duration-700 ${i === bannerIdx ? 'opacity-100' : 'opacity-0'}`}>
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                {b.cta_text && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-end p-5">
                    <div>
                      <h3 className="text-white font-black text-xl leading-tight">{b.title}</h3>
                      <button onClick={() => b.cta_url && router.push(b.cta_url)} className="mt-2 bg-white text-slate-900 font-bold text-xs px-3 py-1.5 rounded-xl">{b.cta_text}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-3 right-4 flex gap-1">
                {banners.map((_: any, i: number) => (
                  <div key={i} onClick={() => setBannerIdx(i)} className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${i === bannerIdx ? 'bg-white w-4' : 'bg-white/50'}`} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active booking banner */}
        {bookings.filter((b: any) => ['IN_PROGRESS','ON_THE_WAY','ASSIGNED','ARRIVED'].includes(b.status)).length > 0 && (
          <div onClick={() => router.push(`/customer/bookings/${bookings[0].id}`)} className="bg-blue-600 p-4 rounded-2xl flex items-center gap-4 cursor-pointer shadow-lg shadow-blue-600/30">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-blue-100 font-bold text-xs">Active Job</p>
              <p className="text-white font-black">{bookings[0]?.service?.name || 'Service in progress'}</p>
              <p className="text-blue-200 text-xs font-medium mt-0.5 capitalize">{bookings[0]?.status?.replace(/_/g,' ').toLowerCase()}</p>
            </div>
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        )}

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-900">Services</h2>
            <button onClick={() => router.push('/services')} className="text-blue-600 font-bold text-sm">See all</button>
          </div>
          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {Array(8).fill(0).map((_,i) => <div key={i} className="flex flex-col items-center gap-2"><div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse"/><div className="h-2 w-12 bg-slate-200 rounded animate-pulse"/></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat: any) => (
                <button key={cat.id} onClick={() => router.push(`/services?category=${cat.slug}`)} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden group-hover:bg-blue-100 transition-colors border border-blue-100">
                    {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-2xl"/> : <span className="text-2xl">{cat.icon_name || '🔧'}</span>}
                  </div>
                  <p className="text-xs font-bold text-slate-700 text-center leading-tight line-clamp-2">{cat.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-900">Recent Bookings</h2>
            <button onClick={() => router.push('/customer/bookings')} className="text-blue-600 font-bold text-sm">View all</button>
          </div>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-black text-slate-900 mb-1">No bookings yet</p>
              <p className="text-slate-500 text-sm font-medium mb-4">Book your first service in seconds</p>
              <button onClick={() => router.push('/services')} className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm">Browse Services</button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b: any) => (
                <div key={b.id} onClick={() => router.push(`/customer/bookings/${b.id}`)} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-colors">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    {b.service?.image_url ? <img src={b.service.image_url} alt="" className="w-full h-full object-cover rounded-xl"/> : <span className="text-xl">🔧</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 truncate">{b.service?.name || 'Service'}</p>
                    <p className="text-slate-500 text-xs font-medium">{b.booking_reference} · ₹{((b.total_amount || 0)/100).toLocaleString('en-IN')}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusColor[b.status] || 'bg-slate-100 text-slate-600'}`}>{b.status?.replace(/_/g,' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-50">
        {[
          { label:'Home', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path:'/customer/home', active:true },
          { label:'Bookings', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', path:'/customer/bookings', active:false },
          { label:'Cart', icon:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', path:'/customer/cart', active:false },
          { label:'Profile', icon:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path:'/customer/profile', active:false },
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
