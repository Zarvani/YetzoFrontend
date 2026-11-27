'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck, MapPin, User, Phone, CheckCircle2, Building, HeartHandshake } from 'lucide-react';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { BookingAddressSelector } from '@/components/booking/BookingAddressSelector';
import { useBookingStore } from '@/store/useBookingStore';
import { AddressItem } from '@/types/booking';

export default function BookingAddressPage() {
  const router = useRouter();
  const { address, setAddress } = useBookingStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Market Standard Feature: Booking for Yourself vs Booking for Someone Else / Another Place
  const [bookingForWhom, setBookingForWhom] = useState<'self' | 'other'>('self');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [gateEntryNotes, setGateEntryNotes] = useState('');

  const handleSelectAddress = (addr: AddressItem) => {
    setAddress(addr);
    setErrorMsg(null);
  };

  const handleProceedToPayment = () => {
    if (!address) {
      setErrorMsg('Please select or add a verified service address to proceed.');
      return;
    }
    if (bookingForWhom === 'other' && (!recipientName.trim() || recipientPhone.length < 10)) {
      setErrorMsg('Please enter the recipient name and 10-digit mobile number so our professional can reach them.');
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

        <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200">
          Step 3 of 4 · Service Location
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[10px] uppercase tracking-[0.16em] text-blue-600 font-bold font-heading">
            Step 03 · Doorstep Dispatch Location
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-1">
            Where should our partner arrive?
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Choose your address or schedule service for parents, friends, tenants or another place.
          </p>
        </div>

        {/* Market Benchmark: "Who is this booking for?" Toggle */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-heading">
            Booking For
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBookingForWhom('self')}
              className={`p-3 rounded-md border text-left transition flex items-center gap-3 ${
                bookingForWhom === 'self'
                  ? 'border-blue-600 bg-white text-blue-900 shadow-sm'
                  : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-md ${bookingForWhom === 'self' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">For Myself</p>
                <p className="text-[10px] text-slate-500">My registered number & address</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setBookingForWhom('other')}
              className={`p-3 rounded-md border text-left transition flex items-center gap-3 ${
                bookingForWhom === 'other'
                  ? 'border-blue-600 bg-white text-blue-900 shadow-sm'
                  : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-md ${bookingForWhom === 'other' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Someone Else / Other Place</p>
                <p className="text-[10px] text-slate-500">Parents, tenants, friends</p>
              </div>
            </button>
          </div>

          {/* Recipient Details if Booking for Other Place / Person */}
          {bookingForWhom === 'other' && (
            <div className="pt-3 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-200">
              <p className="text-[11px] font-semibold text-blue-700">
                Service partner will call this person upon arrival and share the 4-digit start OTP:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Recipient Phone *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="e.g. 9876543210"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Address Selector Component */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}
        <BookingAddressSelector
          selectedAddressId={address?.id}
          onSelectAddress={handleSelectAddress}
        />

        {/* Delivery / Gate Entry Instructions */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-heading">
            Gate / Entry Instructions (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Tower B, Ring the bell twice, Leave shoes outside"
            value={gateEntryNotes}
            onChange={(e) => setGateEntryNotes(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Encrypted GPS dispatch · Verified 4-digit doorstep OTP</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={!address}
          className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition flex items-center justify-center gap-2 font-heading"
        >
          <span>Continue to Review & Secure Payment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

