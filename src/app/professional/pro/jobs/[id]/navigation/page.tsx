'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Navigation, Phone, CheckCircle2, MapPin, Clock, Loader2 } from 'lucide-react';
import { LiveTrackingMap } from '@/components/tracking/LiveTrackingMap';
import { apiClient } from '@/lib/apiClient';

function ProJobNavigationContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data: any = await apiClient(`bookings/${jobId}/`);
        setBooking(data);
      } catch (e) {
        console.warn('Booking load error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [jobId]);

  const handleArrived = async () => {
    try {
      setArrived(true);
      await apiClient(`bookings/${jobId}/`, {
        method: 'PATCH',
        body: { status: 'ARRIVED' },
      }).catch(() => null);
      router.push(`/professional/pro/jobs/${jobId}`);
    } catch (e) {
      router.push(`/professional/pro/jobs/${jobId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
          Connecting GPS Telemetry...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">In Transit</span>
            <h1 className="text-sm font-bold text-slate-900">
              Navigating to {booking?.customer?.first_name || 'Customer'}
            </h1>
          </div>
        </div>

        <a
          href={`tel:${booking?.customer?.phone || ''}`}
          className="px-3 py-1.5 bg-emerald-50 text-[#059669] hover:bg-emerald-100 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Customer</span>
        </a>
      </header>

      {/* Map */}
      <div className="flex-1 w-full relative">
        <LiveTrackingMap
          customerLocation={{ lat: 28.5355, lng: 77.3910 }}
          professionalLocation={{ lat: 28.5420, lng: 77.3970 }}
        />

        {/* Floating ETA and Arrival Card */}
        <div className="absolute bottom-6 left-4 right-4 max-w-md mx-auto z-20 bg-white border border-slate-200 p-5 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900">8 Mins Remaining</span>
                <span className="text-[11px] text-slate-500 block">Distance: 2.1 km • 15m SLA</span>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full">
              ON TIME
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
            <span className="text-slate-700 font-medium line-clamp-1">
              {booking?.address?.address_line_1 || 'Flat 301, Tower C, Prateek Laurel, Sector 120'}
            </span>
          </div>

          <button
            onClick={handleArrived}
            className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Have Arrived at Doorstep</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalJobNavigationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <ProJobNavigationContent />
    </Suspense>
  );
}
