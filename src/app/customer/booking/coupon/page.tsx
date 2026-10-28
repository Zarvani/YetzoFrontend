'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Tag, Check, AlertCircle, Percent, Sparkles, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useBookingStore } from '@/store/useBookingStore';

interface CouponItem {
  id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_value?: number;
  max_discount_amount?: number;
  description?: string;
  valid_until?: string;
}

function CouponPageContent() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const data = await apiClient<any>('admin-core/coupons/');
        const list = Array.isArray(data) ? data : data?.results || [];
        setCoupons(list);
      } catch (err) {
        console.warn('Could not fetch coupons list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleApply = async (codeToApply: string) => {
    if (!codeToApply.trim()) return;
    try {
      setApplying(true);
      setError(null);
      setSuccessMsg(null);

      const res = await apiClient<any>('admin-core/coupons/apply/', {
        method: 'POST',
        body: { code: codeToApply.trim().toUpperCase() },
      });

      setAppliedCoupon(res.code || codeToApply.toUpperCase());
      setSuccessMsg(`Coupon ${res.code || codeToApply} applied successfully!`);

      sessionStorage.setItem('applied_coupon', JSON.stringify(res));
      useBookingStore.getState().setCoupon(res);

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired coupon code.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Checkout
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Apply Promo Code</h1>
              <p className="text-xs text-slate-500">Save extra on your home services with active Yetzo vouchers.</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Coupon Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApply(inputCode);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="ENTER PROMO CODE"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-xs font-bold uppercase tracking-wider text-slate-900 placeholder:normal-case placeholder:font-normal"
            />
            <button
              type="submit"
              disabled={applying || !inputCode.trim()}
              className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition disabled:opacity-50 flex items-center gap-2"
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </button>
          </form>

          {/* Available Coupons List */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Available Offers
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : coupons.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-500">No public promotional coupons currently active.</p>
                <p className="text-[11px] text-slate-400 mt-1">Check back later or enter your partner referral code above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="p-4 border border-slate-200 hover:border-emerald-300 rounded-2xl transition bg-gradient-to-r from-white to-slate-50 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-lg tracking-wider border border-emerald-200">
                          {coupon.code}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {coupon.discount_type === 'PERCENTAGE'
                            ? `${coupon.discount_value}% OFF`
                            : `₹${coupon.discount_value} FLAT OFF`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {coupon.description || (coupon.min_order_value ? `On orders above ₹${coupon.min_order_value}` : 'Valid on all services')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApply(coupon.code)}
                      disabled={applying || appliedCoupon === coupon.code}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                        appliedCoupon === coupon.code
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {appliedCoupon === coupon.code ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CouponPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <CouponPageContent />
    </Suspense>
  );
}
