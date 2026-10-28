'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, Clock, CreditCard, Tag, Sparkles, ChevronRight, Loader2, Video } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useBookingStore } from '@/store/useBookingStore';
import { ServiceItem } from '@/types/booking';

function BookingReviewContent() {
  const router = useRouter();
  const {
    service,
    additionalServices,
    address: selectedAddress,
    isInstant,
    isProntoVerified,
    scheduledDate,
    scheduledSlotLabel,
    appliedCoupon,
    getPricing,
    setAddress
  } = useBookingStore();

  const [loading, setLoading] = useState(true);
  const [address, setLocalAddress] = useState<any>(selectedAddress);

  useEffect(() => {
    const loadBookingState = async () => {
      try {
        setLoading(true);
        if (selectedAddress) {
          setLocalAddress(selectedAddress);
        } else {
          try {
            const addrRes: any = await apiClient('locations/addresses/');
            const list = Array.isArray(addrRes) ? addrRes : addrRes?.results || [];
            if (list.length > 0) {
              setLocalAddress(list[0]);
              setAddress(list[0]);
            }
          } catch (e) {
            console.warn('Could not load address from API:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookingState();
  }, [selectedAddress, setAddress]);

  const pricing = getPricing();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-body">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#05AC5F]" />
          Reviewing your service telemetry...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 font-body text-slate-900">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 hover:text-slate-900 uppercase transition font-heading"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Scheduling
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-5">
            <div>
              <span className="text-[10px] tracking-widest font-heading font-medium text-[#05AC5F] uppercase">
                Step 3 of 4 • Pre-Dispatch Audit
              </span>
              <h1 className="text-2xl font-heading font-light text-slate-900 tracking-tight mt-1">
                Booking Review & Escrow Summary
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Verify stacked chores, precision arrival SLA, and payment breakdown.
              </p>
            </div>
            <div className="w-10 h-10 rounded border border-[#E5E7EB] flex items-center justify-center text-[#05AC5F] bg-[#ECFDF5] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Booked Services & Stacking Card */}
          <div className="p-4 bg-slate-50/60 rounded border border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-heading font-medium text-slate-400 uppercase tracking-wider">
              <span>Selected Chores & Tasks</span>
              <span>Unit Price</span>
            </div>
            
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-medium text-slate-800">
                {service?.name || 'Primary House Help Service'}
              </span>
              <span className="font-heading font-medium text-slate-900">
                ₹{service?.base_price || 499}
              </span>
            </div>

            {additionalServices.map((chore: ServiceItem) => (
              <div key={chore.id} className="flex justify-between items-center text-xs text-slate-700 pl-3 border-l-2 border-[#05AC5F]">
                <span>+ {chore.name}</span>
                <span className="font-heading font-medium">₹{chore.base_price || 149}</span>
              </div>
            ))}
          </div>

          {/* Location & Arrival Timing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 border border-[#E5E7EB] rounded bg-white flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#05AC5F] shrink-0 mt-0.5" />
              <div>
                <span className="font-heading font-medium text-slate-900 block text-xs">Service Address</span>
                <p className="text-slate-500 mt-0.5 line-clamp-2 text-[11px]">
                  {address ? `${address.address_line_1}, ${address.city} - ${address.pincode}` : 'Primary address on file'}
                </p>
              </div>
            </div>

            <div className="p-4 border border-[#E5E7EB] rounded bg-white flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#05AC5F] shrink-0 mt-0.5" />
              <div>
                <span className="font-heading font-medium text-slate-900 block text-xs">
                  {isInstant ? '15-Minute Instant Dispatch' : 'Scheduled Arrival Window'}
                </span>
                <p className="text-slate-500 mt-0.5 text-[11px]">
                  {isInstant ? 'En route within 15 mins of OTP confirmation' : `${scheduledDate || 'Today'} • ${scheduledSlotLabel}`}
                </p>
              </div>
            </div>
          </div>

          {/* Pronto Verified Bodycam Status */}
          {isProntoVerified && (
            <div className="p-3 bg-[#ECFDF5] border border-[#05AC5F]/20 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#05AC5F]" />
                <span className="font-medium text-[#064E3B]">
                  Yetzo Verified: Encrypted Bodycam Session Active
                </span>
              </div>
              <span className="text-[10px] font-heading font-semibold text-[#05AC5F] uppercase tracking-wider">
                COMPLIMENTARY
              </span>
            </div>
          )}

          {/* Coupon / Voucher Bar */}
          <div
            onClick={() => router.push('/customer/booking/coupon')}
            className="p-3.5 border border-dashed border-[#E5E7EB] hover:border-[#05AC5F] rounded bg-white flex items-center justify-between cursor-pointer transition text-xs"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#05AC5F]" />
              <span className="font-medium text-slate-800">
                {appliedCoupon ? `Voucher Applied: ${appliedCoupon.code}` : 'Apply Coupon or Enterprise Corporate Pass'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#05AC5F] font-heading font-medium text-xs">
              <span>{appliedCoupon ? 'Change' : 'Select'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Transparent Rate Card & Escrow Summary */}
          <div className="space-y-2 pt-3 border-t border-[#E5E7EB] text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Base Subtotal</span>
              <span className="font-heading font-medium text-slate-900">₹{pricing.subtotal}</span>
            </div>

            {pricing.discount > 0 && (
              <div className="flex justify-between text-[#05AC5F] font-medium">
                <span>Task Stacking Bundle Savings</span>
                <span className="font-heading font-medium">-₹{pricing.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>GST & Municipal Service Cess</span>
              <span className="font-heading font-medium text-slate-900">₹{pricing.taxes}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Safety & Dispatch Platform Fee</span>
              <span className="font-heading font-medium text-slate-900">₹{pricing.platformFee}</span>
            </div>

            <div className="flex justify-between items-baseline text-sm font-heading font-medium text-slate-900 pt-3 border-t border-[#E5E7EB]">
              <div>
                <span>Total Escrow Deposit</span>
                <p className="text-[10px] text-slate-400 font-body font-normal">
                  Held securely until you supply 4-digit start OTP to your pro
                </p>
              </div>
              <span className="text-xl font-heading font-light text-[#05AC5F]">
                ₹{pricing.totalAmount}
              </span>
            </div>
          </div>

          {/* Escrow & Warranty Assurance */}
          <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded flex items-center gap-2 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#05AC5F] shrink-0" />
            <span>Includes 100% money-back guarantee if pro arrives later than 15 minutes.</span>
          </div>

          <button
            onClick={() => router.push('/customer/booking/payment')}
            className="w-full h-12 bg-[#05AC5F] hover:bg-[#049451] text-white font-heading font-medium text-xs tracking-wider uppercase rounded shadow-xs transition flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>CONFIRM & PROCEED TO PAYMENT • ₹{pricing.totalAmount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-slate-500 font-body text-xs">Loading telemetry...</div>}>
      <BookingReviewContent />
    </Suspense>
  );
}
