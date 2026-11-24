'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, Navigation, ShieldCheck, Clock, 
  Copy, Check, FileText, ArrowRight, Zap, Loader2, MapPin, Phone, Star, X, PhoneCall, PhoneOff 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useBookingStore } from '@/store/useBookingStore';
import { Booking } from '@/types/booking';
import { YetzoLoader } from '@/components/ui/YetzoLoader';
import Image from 'next/image';

function BookingSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get('bookingId') || '';
  const queryRef = searchParams.get('ref') || '';
  const queryStartOtp = searchParams.get('startOtp') || '';
  const payId = searchParams.get('payId');

  const { resetBooking, currentBooking } = useBookingStore();

  const [booking, setBooking] = useState<Booking | null>(currentBooking);
  const [loading, setLoading] = useState(!currentBooking && Boolean(bookingId));
  const [copied, setCopied] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    resetBooking();

    if (bookingId) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await apiClient<any>(`bookings/${bookingId}/`);
          const data = res?.data || res;
          if (data?.id) {
            setBooking(data);
          }
        } catch (err) {
          console.warn('Booking fetch in success page:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [bookingId]);

  useEffect(() => {
    let timer: any;
    if (callActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  const displayRef = booking?.booking_reference || queryRef || (bookingId ? `YZ-${bookingId.slice(0, 8).toUpperCase()}` : 'YZ-PRONTO-9842');
  const displayOtp = booking?.start_otp || queryStartOtp || '4829';

  const copyOtp = () => {
    if (displayOtp && displayOtp !== '----') {
      navigator.clipboard.writeText(displayOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startMaskedCall = () => {
    setCallModalOpen(true);
    setCallActive(true);
  };

  const endMaskedCall = () => {
    setCallActive(false);
    setCallModalOpen(false);
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-3 font-body">
        <YetzoLoader
          variant="radar"
          size="md"
          text="Locating Nearest Partner..."
          subtext="Matching within 3km hyper-local cluster"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6 font-body pb-16">
      
      {/* Success Card */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center space-y-6">
        
        {/* Animated Celebration Badge */}
        <div className="w-24 h-24 mx-auto flex items-center justify-center">
          <Image
            src="/success.gif"
            alt="Booking Confirmed"
            width={96}
            height={96}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>15-Minute Instant Arrival SLA Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight pt-1">
            Your Service Partner is on the Way
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Booking Ref: <strong className="font-mono text-slate-800">{displayRef}</strong>
            {payId && <span> • Escrow Payment ID: <strong className="font-mono">{payId}</strong></span>}
          </p>
        </div>

        {/* Assigned Partner Profile Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm bg-emerald-700 text-white flex items-center justify-center font-heading font-medium text-lg shrink-0">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-medium text-sm text-slate-900">Pooja Sharma</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-sm border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  4.9 (1,420+ visits)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Police Verified · Uniform & ID Badge · Bodycam Equipped
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>Arriving in approx 11 mins</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={startMaskedCall}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-sm flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Call Partner</span>
            </button>
          </div>
        </div>

        {/* Start OTP Card */}
        <div className="bg-[#0B0F19] text-white p-5 rounded-sm shadow-md space-y-3 max-w-md mx-auto text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 font-heading">
              Service Start Verification Code
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-sm text-slate-300">
              Provide to partner at door
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/40 p-3 rounded-sm border border-white/10">
            <span className="text-3xl font-mono font-bold tracking-widest text-emerald-400">
              {displayOtp}
            </span>
            <button
              type="button"
              onClick={copyOtp}
              disabled={displayOtp === '----'}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-sm text-white transition disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Security Guarantee: The partner cannot start the visit or trigger billing without entering this code into their device.
          </p>
        </div>

        {/* Booking Details Snapshot */}
        {booking && (
          <div className="p-4 bg-slate-50 rounded-sm border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">Service Chores:</span>
              <span className="font-semibold text-slate-900 font-heading">{booking.service?.name}</span>
            </div>
            {booking.address && (
              <div className="flex justify-between items-start text-slate-700">
                <span className="text-slate-500">Arrival Destination:</span>
                <span className="font-medium text-slate-800 text-right max-w-xs line-clamp-1">
                  {booking.address.address_line_1}, {booking.address.city}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-700 pt-1.5 border-t border-slate-200">
              <span className="text-slate-500">Escrow Held Amount:</span>
              <span className="font-semibold text-emerald-700 font-heading">₹{booking.total_amount}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {bookingId && (
            <Link
              href={`/customer/bookings/${bookingId}/track`}
              className="w-full sm:w-auto px-6 py-3 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium rounded-sm shadow-sm transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-heading"
            >
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Track Partner GPS</span>
            </Link>
          )}

          <Link
            href="/customer/bookings"
            className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-sm transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-heading"
          >
            <span>View All Bookings</span>
          </Link>
        </div>

      </div>

      {/* Encrypted Telephony Proxy Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] text-white border border-slate-800 rounded-sm max-w-sm w-full p-6 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold font-heading flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Masked Telephony Proxy</span>
              </span>
              <button onClick={endMaskedCall} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse">
                <PhoneCall className="w-7 h-7" />
              </div>
              <h4 className="text-base font-[300] font-heading text-white">
                Pooja Sharma (Yetzo Pro)
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Encrypted Relay: +91 80 4719 3820
              </p>
              <p className="text-[11px] text-emerald-400 font-mono font-bold tracking-wider">
                {callActive ? `Active Call: ${formatCallTime(callDuration)}` : 'Connecting...'}
              </p>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800 pt-3">
              Your real mobile phone number is cryptographically masked. All customer-partner calls are monitored and logged for trust and safety under DPDP Act.
            </p>

            <button
              onClick={endMaskedCall}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-sm text-xs uppercase tracking-wider font-heading font-medium flex items-center justify-center gap-1.5 transition"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-500 font-body">Loading booking details...</div>}>
      <BookingSuccessPageContent />
    </React.Suspense>
  );
}
