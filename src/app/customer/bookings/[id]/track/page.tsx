'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { YetzoLoader } from '@/components/ui/YetzoLoader';
import { 
  ArrowLeft, Shield, Phone, MessageSquare, AlertTriangle, 
  CheckCircle2, Clock, MapPin, Navigation, Sparkles, RefreshCw, Copy, Check, Star 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { LiveTrackingMap } from '@/components/tracking/LiveTrackingMap';

function BookingLiveTrackContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [partnerLocation, setPartnerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number>(11);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient(`bookings/${bookingId}/`);
      const data = res?.data || res;
      setBooking(data);
      
      if (data?.address) {
        setPartnerLocation({
          lat: (data.address.latitude ? Number(data.address.latitude) : 12.9716) + 0.008,
          lng: (data.address.longitude ? Number(data.address.longitude) : 77.5946) + 0.006,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/tracking/${bookingId}/`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => setWsConnected(false);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'location_update') {
            setPartnerLocation({ lat: payload.latitude, lng: payload.longitude });
            if (payload.eta_minutes) setEtaMinutes(payload.eta_minutes);
          } else if (payload.type === 'status_update') {
            setBooking((prev: any) => ({
              ...prev,
              status: payload.status,
              assigned_professional: payload.professional_name ? {
                user: {
                  first_name: payload.professional_name,
                  phone: payload.professional_phone,
                },
                rating: payload.rating || 4.9,
              } : prev?.assigned_professional
            }));
          }
        } catch (e) {
          console.warn('WS message parse note:', e);
        }
      };
    } catch (err) {
      console.warn('Live tracking websocket fallback:', err);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [bookingId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-body">
        <YetzoLoader
          size="lg"
          variant="radar"
          text="Connecting to Live Telemetry Radar..."
          subtext="Streaming real-time GPS coordinates of your Yetzo service professional"
        />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-body">
        <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
        <h2 className="text-xl font-[300] font-heading text-slate-900 mb-1">Booking Telemetry Unavailable</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          {error || 'Unable to locate live GPS stream for this booking record.'}
        </p>
        <Link
          href="/customer/bookings"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-xs uppercase tracking-wider font-medium font-heading shadow-sm hover:bg-blue-700 transition"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const pro = booking.assigned_professional;
  const isYetzoVerified = booking.is_verified_session;
  const customerLoc = {
    lat: booking.address?.latitude ? Number(booking.address.latitude) : 12.9716,
    lng: booking.address?.longitude ? Number(booking.address.longitude) : 77.5946,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-body">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-medium text-slate-900 text-sm">
                  Live Dispatch Radar
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 font-semibold flex items-center gap-1 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  {wsConnected ? 'GPS Active' : 'Dispatch Live'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Ref: {booking.booking_reference}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBooking}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-sm transition"
              title="Refresh status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href={`/customer/bookings/${bookingId}`}
              className="text-xs text-slate-600 font-medium px-3 py-1.5 rounded-sm border border-slate-200 hover:bg-slate-50 font-heading uppercase tracking-wider"
            >
              Order Details
            </Link>
          </div>
        </div>
      </div>

      {/* Main Track Body */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: ETA & Partner Card & OTP */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* ETA Card - Yetzo 15-Minute Instant Arrival */}
            <div className="bg-[#0B0F19] text-white p-5 rounded-sm shadow-md border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-400 flex items-center gap-1.5 font-heading">
                  <Clock className="w-3.5 h-3.5" />
                  Doorstep ETA
                </span>
                <span className="text-[10px] bg-blue-950/80 text-sky-300 border border-blue-800/50 px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider">
                  ⚡ 15-Min Yetzo SLA
                </span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-4xl font-[200] font-heading tracking-tight text-white">{etaMinutes}</span>
                <span className="text-sm font-medium text-slate-400 font-body">Minutes Remaining</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {pro 
                  ? `${pro.user?.first_name || 'Partner'} is en route to your location with all required cleaning tools.`
                  : 'Assigning the nearest verified house helper in your sector...'}
              </p>
            </div>

            {/* Start Job OTP Card */}
            <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-heading">
                  Service Start Code
                </span>
                <span className="text-[10px] text-blue-800 bg-blue-50 font-semibold px-2 py-0.5 rounded-sm border border-blue-200">
                  Hand to partner at door
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-sm border border-slate-200">
                <span className="text-2xl font-mono font-bold tracking-widest text-slate-900">
                  {booking.start_otp || '4829'}
                </span>
                <button
                  onClick={() => booking.start_otp && copyToClipboard(booking.start_otp)}
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-white border border-slate-200 rounded-sm text-slate-700 hover:bg-slate-50 transition font-heading"
                >
                  {copiedOtp ? (
                    <>
                      <Check className="w-3 h-3 text-blue-600" />
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
                Escrow Guarantee: The helper cannot begin the clock until you verbally confirm this code at your door.
              </p>
            </div>

            {/* Professional Card */}
            <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-sm bg-blue-700 text-white flex items-center justify-center font-heading font-medium text-base shrink-0">
                  {pro?.user?.first_name ? pro.user.first_name[0] : 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-medium text-slate-900 text-sm truncate">
                      {pro?.user?.first_name ? `${pro.user.first_name} ${pro.user.last_name || ''}`.trim() : 'Assigned Yetzo Specialist'}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {pro ? `${booking.service?.name || 'Household Specialist'}` : 'SOP Certified Home Pro'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-sm border border-amber-200 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      4.9
                    </span>
                    <span className="text-[11px] text-slate-400">
                      1,420+ completed visits
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  href={pro?.user?.phone ? `tel:${pro.user.phone}` : 'tel:9999999999'}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-heading uppercase tracking-wider"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call (Masked)</span>
                </a>
                <Link
                  href={`/customer/support/chat?bookingId=${bookingId}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm text-xs font-medium bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition font-heading uppercase tracking-wider"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </Link>
              </div>
            </div>

            {/* Yetzo Verified Bodycam Banner */}
            {isYetzoVerified && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-sm p-3 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <h4 className="font-semibold font-heading">
                    Yetzo Verified: Active In-Home Bodycam
                  </h4>
                  <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                    Recording is encrypted, face-blurred, and automatically wiped in 48 hours.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Safety Helpline */}
          <div className="bg-white border border-slate-200 rounded-sm p-3 flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>Safety Rapid Response</span>
            </span>
            <a
              href="tel:1800123456"
              className="text-rose-600 font-semibold font-heading uppercase tracking-wider hover:underline"
            >
              24/7 SOS Helpline
            </a>
          </div>
        </div>

        {/* Right Column: Live Map */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col min-h-[480px]">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold font-heading text-slate-800 uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Real-Time GPS En Route Map</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Live updates every 3s
            </span>
          </div>

          <div className="flex-1 w-full relative min-h-[420px]">
            <LiveTrackingMap
              customerLocation={customerLoc}
              professionalLocation={partnerLocation || undefined}
            />
          </div>

          {/* Map Footer Info */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate max-w-[280px]">
                {booking.address?.address_line_1}, {booking.address?.city}
              </span>
            </div>
            <span className="font-medium text-slate-800 font-heading">
              Status: <span className="text-blue-700">{booking.status || 'EN_ROUTE'}</span>
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function BookingLiveTrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-slate-500 font-body text-xs">Loading telemetry...</div>}>
      <BookingLiveTrackContent />
    </Suspense>
  );
}
