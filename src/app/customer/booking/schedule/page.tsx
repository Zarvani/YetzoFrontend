'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Clock, Zap, Calendar, Check, ArrowRight, 
  ShieldCheck, Loader2, Repeat, Sparkles, MapPin, CheckCircle2 
} from 'lucide-react';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { useBookingStore } from '@/store/useBookingStore';
import { apiClient } from '@/lib/apiClient';
import { BookingSlotItem } from '@/types/booking';

function BookingScheduleContent() {
  const router = useRouter();
  const { service, isInstant: storedInstant, scheduledDate: storedDate, scheduledTime: storedTime, setSchedule } = useBookingStore();

  // Mode: 'instant' | 'later' | 'recurring' (Yetzo daily pass)
  const [bookingMode, setBookingMode] = useState<'instant' | 'later' | 'recurring'>('instant');
  const [selectedDate, setSelectedDate] = useState(storedDate || '');
  const [selectedTime, setSelectedTime] = useState(storedTime || '10:00:00');
  const [selectedSlotLabel, setSelectedSlotLabel] = useState('10:00 AM - 12:00 PM');
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'alternate' | 'weekdays'>('daily');
  const [availableSlots, setAvailableSlots] = useState<BookingSlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [nextDays, setNextDays] = useState<Array<{ dateStr: string; dayName: string; dateNum: number; month: string }>>([]);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (!selectedDate) {
      setSelectedDate(todayStr);
    }

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        dateStr: d.toISOString().split('T')[0],
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
      };
    });
    setNextDays(days);
  }, []);

  // Production curated time windows matching Yetzo hyper-local dispatch
  const fallbackWindows = [
    { id: 'slot-morning-1', time: '08:00:00', label: '08:00 AM - 09:30 AM', period: 'Morning Rush' },
    { id: 'slot-morning-2', time: '10:00:00', label: '10:00 AM - 11:30 AM', period: 'Mid Morning' },
    { id: 'slot-afternoon-1', time: '13:00:00', label: '01:00 PM - 02:30 PM', period: 'Afternoon' },
    { id: 'slot-afternoon-2', time: '16:00:00', label: '04:00 PM - 05:30 PM', period: 'Late Afternoon' },
    { id: 'slot-evening-1', time: '18:00:00', label: '06:00 PM - 07:30 PM', period: 'Evening Prep' },
    { id: 'slot-evening-2', time: '20:00:00', label: '08:00 PM - 09:30 PM', period: 'Dinner Service' },
  ];

  useEffect(() => {
    if (bookingMode === 'later' && selectedDate && service?.id) {
      const fetchSlots = async () => {
        try {
          setLoadingSlots(true);
          const res = await apiClient<any>(`scheduling/available/?service_id=${service.id}&date=${selectedDate}`);
          const list: BookingSlotItem[] = res?.data || (Array.isArray(res) ? res : []);
          setAvailableSlots(list);
          if (list.length > 0) {
            setSelectedTime(list[0].start_time);
            setSelectedSlotLabel(`${list[0].start_time.slice(0, 5)} - ${list[0].end_time.slice(0, 5)}`);
          }
        } catch {
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [bookingMode, selectedDate, service?.id]);

  const handleConfirmSchedule = () => {
    const isInstant = bookingMode === 'instant';
    const finalDate = isInstant ? new Date().toISOString().split('T')[0] : selectedDate;
    const finalSlot = isInstant 
      ? '10-15 Min Instant Doorstep Arrival' 
      : bookingMode === 'recurring' 
        ? `Daily Pass (${recurringFrequency.toUpperCase()}) - ${selectedSlotLabel}` 
        : selectedSlotLabel;

    setSchedule(
      isInstant,
      finalDate,
      isInstant ? '10:00:00' : selectedTime,
      finalSlot
    );
    router.push('/customer/booking/address');
  };

  const [onlineProsCount, setOnlineProsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPros = async () => {
      try {
        const res: any = await apiClient('professionals/').catch(() => ({ data: [] }));
        const list = res?.data || (Array.isArray(res) ? res : []);
        const count = list.filter((p: any) => p.is_available).length;
        setOnlineProsCount(count > 0 ? count : list.length);
      } catch {
        setOnlineProsCount(null);
      }
    };
    fetchPros();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-body pb-16">
      <BookingStepper currentStep={2} />

      {/* Top Back & SLA Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/customer/booking')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chore Selection</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span>15-Minute Instant Arrival SLA Guaranteed</span>
        </div>
      </div>

      {/* Main Scheduling Card (Crisp, Luxury Border) */}
      <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-7">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-blue-600 font-bold font-heading">
            Step 02 · Timing & Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-1">
            When do you need help?
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xl">
            Choose instant dispatch for immediate doorstep arrival in 10-15 minutes, or reserve your preferred regular slot with a verified partner.
          </p>
        </div>

        {/* 3 Dispatch Mode Options (Yetzo Competitor Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* 1. Instant Dispatch */}
          <div
            onClick={() => setBookingMode('instant')}
            className={`p-4 rounded-md border cursor-pointer transition relative ${
              bookingMode === 'instant'
                ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {bookingMode === 'instant' && (
              <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                Fastest
              </span>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-sm bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <h3 className="font-heading font-medium text-sm text-slate-900">Instant Dispatch</h3>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed font-body">
              Partner dispatched immediately. Doorstep arrival in <strong className="text-blue-700 font-semibold">10–15 mins</strong>.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-blue-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                <span>{onlineProsCount !== null && onlineProsCount > 0 ? `${onlineProsCount} Pros Online` : 'Cluster Fleet Active'}</span>
              </span>
              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                bookingMode === 'instant' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
              }`}>
                {bookingMode === 'instant' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* 2. Schedule for Later */}
          <div
            onClick={() => setBookingMode('later')}
            className={`p-4 rounded-md border cursor-pointer transition relative ${
              bookingMode === 'later'
                ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-sm bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-medium text-sm text-slate-900">Schedule Later</h3>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed font-body">
              Pick your exact day & 90-minute time window across the upcoming 7 days.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Any Date & Window</span>
              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                bookingMode === 'later' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
              }`}>
                {bookingMode === 'later' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* 3. Daily Maid Pass (Yetzo Recurring Subscription) */}
          <div
            onClick={() => setBookingMode('recurring')}
            className={`p-4 rounded-md border cursor-pointer transition relative ${
              bookingMode === 'recurring'
                ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="absolute -top-2.5 right-3 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
              Save 25%
            </span>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-sm bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Repeat className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-medium text-sm text-slate-900">Daily Maid Pass</h3>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed font-body">
              Recurring daily or weekday house help with dedicated replacement guarantee.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-amber-700 font-medium">Zero Cancellation Hassle</span>
              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                bookingMode === 'recurring' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
              }`}>
                {bookingMode === 'recurring' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Detail Configurations */}

        {/* 1. Instant Mode Information Box */}
        {bookingMode === 'instant' && (
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-sm flex items-start gap-3">
            <div className="w-6 h-6 rounded-sm bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 font-heading text-sm">
                Hyper-Local 15-Minute Instant Arrival
              </p>
              <p className="mt-0.5">
                Our automated dispatch engine matches you with the nearest certified partner within a 3km radius. Once confirmed, you will receive real-time GPS tracking and partner credential details.
              </p>
            </div>
          </div>
        )}

        {/* 2. Schedule Later Mode: Date and Slot Pickers */}
        {bookingMode === 'later' && (
          <div className="space-y-5 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                1. Select Preferred Date
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {nextDays.map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-2.5 rounded-sm border text-center transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white font-semibold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`text-[10px] uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {d.dayName}
                      </div>
                      <div className="text-base font-heading font-medium leading-snug">
                        {d.dateNum}
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {d.month}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                2. Select 90-Minute Arrival Window
              </label>
              {loadingSlots ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Checking live partner capacity in your locality...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fallbackWindows.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          setSelectedTime(slot.time);
                          setSelectedSlotLabel(slot.label);
                        }}
                        className={`p-3 rounded-sm border text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-emerald-950 font-semibold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span>{slot.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                          isSelected ? 'bg-blue-200/60 text-blue-900 font-bold' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {slot.period}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Daily Maid Pass Mode */}
        {bookingMode === 'recurring' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Select Routine Cadence
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'daily', label: 'Every Day (7 Days)', sub: 'Complete peace of mind' },
                  { id: 'weekdays', label: 'Weekdays Only (Mon-Fri)', sub: 'Working professionals' },
                  { id: 'alternate', label: 'Alternate Days (3x/wk)', sub: 'Light maintenance' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setRecurringFrequency(f.id as any)}
                    className={`p-3 rounded-sm border text-left transition ${
                      recurringFrequency === f.id
                        ? 'border-blue-600 bg-blue-50/60 text-emerald-950'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold font-heading">{f.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold font-heading">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Yetzo Daily Pass Benefits:</span>
              </div>
              <p className="pl-6">• 25% discounted recurring hourly rate.</p>
              <p className="pl-6">• Guaranteed replacement partner dispatched if your regular helper is ever unwell.</p>
              <p className="pl-6">• Pause or reschedule any individual day with 2 hours advance notice.</p>
            </div>
          </div>
        )}

        {/* Safety & Quality Guarantee */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>100% Police Verified · SOP Certified · Optional Encrypted Bodycam Session</span>
          </div>
          <span className="font-medium text-slate-700">₹10,000 Damage Cover Included</span>
        </div>

        {/* Continue Button (Crisp Corner, Emerald) */}
        <button
          type="button"
          onClick={handleConfirmSchedule}
          className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm rounded-sm shadow-sm transition flex items-center justify-center gap-2 font-heading tracking-wide"
        >
          <span>Continue to Address Confirmation</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

export default function BookingSchedulePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-body">Loading scheduling module...</div>}>
      <BookingScheduleContent />
    </Suspense>
  );
}

