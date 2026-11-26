'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Sparkles, Check, Copy } from 'lucide-react';
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
      

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-2xl text-white shadow-xl shadow-blue-700/20">
          <p className="text-sky-300 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Benefit</span>
          </p>
          <h2 className="text-2xl font-[300] font-heading mb-1">Save Big on Your First Booking!</h2>
          <p className="text-blue-100 text-xs font-medium">Use code YETZO50 and get flat ₹50 off on your first doorstep service.</p>
        </div>

        <h3 className="font-heading font-medium text-slate-900 text-base">All Active Offers</h3>

        {loading ? Array(4).fill(0).map((_,i) => <div key={i} className="bg-white h-32 rounded-2xl animate-pulse border border-slate-200"></div>)
        : coupons.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-medium text-slate-900 text-base">No active seasonal offers</h3>
            <p className="text-slate-500 text-xs">Standard 15% task stacking discount is permanently active during checkout!</p>
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
