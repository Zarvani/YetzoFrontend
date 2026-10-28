'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function OffersPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    apiClient('admin-core/coupons/?is_active=true').then((d: any) => {
      setCoupons(d?.results || d || []);
    }).catch(() => setCoupons([])).finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const discountTypeLabel = (type: string, value: string) =>
    type === 'PERCENTAGE' ? `${value}% OFF` : `₹${value} OFF`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <title>Offers & Coupons — Yetzo</title>
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl font-black text-slate-900">Offers & Coupons</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-6 rounded-3xl text-white shadow-xl shadow-orange-500/30">
          <p className="text-orange-100 font-bold text-sm uppercase tracking-wider mb-2">🎉 Limited Time</p>
          <h2 className="text-3xl font-black mb-1">Save Big on Your First Booking!</h2>
          <p className="text-orange-100 font-medium">Use code YETZO50 and get flat ₹50 off on your first service.</p>
        </div>

        <h3 className="font-black text-slate-900 text-lg">All Active Offers</h3>

        {loading ? Array(4).fill(0).map((_,i) => <div key={i} className="bg-white h-32 rounded-3xl animate-pulse border border-slate-200"></div>)
        : coupons.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🎁</div>
            <h3 className="font-black text-slate-900 text-xl">No active offers</h3>
            <p className="text-slate-500 font-medium mt-2">Check back soon for new deals!</p>
          </div>
        ) : coupons.map((coupon: any) => (
          <div key={coupon.id} className="bg-white p-5 rounded-3xl border-2 border-dashed border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
            <div className="pl-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {discountTypeLabel(coupon.discount_type, coupon.discount_value)}
                  </span>
                  <h4 className="font-black text-slate-900 text-lg mt-2">{coupon.title || coupon.code}</h4>
                  {coupon.description && <p className="text-slate-500 font-medium text-sm mt-0.5">{coupon.description}</p>}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="bg-slate-100 px-4 py-2 rounded-xl">
                  <span className="font-black text-slate-900 text-sm tracking-widest">{coupon.code}</span>
                </div>
                <button
                  onClick={() => copyCode(coupon.code, coupon.id)}
                  className={`font-bold px-4 py-2 rounded-xl text-sm transition-all ${copiedId === coupon.id ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {copiedId === coupon.id ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>
              {coupon.valid_until && <p className="text-xs text-slate-400 font-medium mt-2">Expires: {new Date(coupon.valid_until).toLocaleDateString('en-IN')}</p>}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
