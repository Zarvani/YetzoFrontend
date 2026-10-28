'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { BookingAddressSelector } from '@/components/booking/BookingAddressSelector';
import { useBookingStore } from '@/store/useBookingStore';
import { AddressItem } from '@/types/booking';

export default function BookingAddressPage() {
  const router = useRouter();
  const { address, setAddress } = useBookingStore();

  const handleSelectAddress = (addr: AddressItem) => {
    setAddress(addr);
  };

  const handleProceedToPayment = () => {
    if (!address) {
      alert('Please select or add a service address to proceed.');
      return;
    }
    router.push('/customer/booking/payment');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-body pb-16">
      <BookingStepper currentStep={3} />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/customer/booking/schedule')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Timing</span>
        </button>

        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
          Step 3 of 4 · Service Location
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[10px] uppercase tracking-[0.16em] text-emerald-600 font-bold font-heading">
            Step 03 · Doorstep Dispatch Location
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-1">
            Where should our partner arrive?
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Ensure your flat number and gate entry notes are accurate for our 15-minute express arrival SLA.
          </p>
        </div>

        {/* Live Address Selector Component */}
        <BookingAddressSelector
          selectedAddressId={address?.id}
          onSelectAddress={handleSelectAddress}
        />

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted GPS dispatch · Zero contact sharing</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={!address}
          className="w-full py-3.5 bg-[#05AC5F] hover:bg-[#049652] disabled:opacity-50 text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition flex items-center justify-center gap-2 font-heading"
        >
          <span>Continue to Review & Secure Payment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

