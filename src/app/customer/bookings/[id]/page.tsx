'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

function BookingDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  const fetchBooking = async () => {
    try {
      const res: any = await apiClient(`bookings/${params.id}/`);
      setBooking(res?.data || res);
    } catch (e) {
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason) return alert('Please provide a reason');
    try {
      await apiClient(`bookings/${params.id}/status/`, {
        method: 'PATCH',
        body: { new_status: 'CANCELLED', reason: cancelReason }
      });
      setShowCancelModal(false);
      fetchBooking();
    } catch (e) {
      alert('Failed to cancel booking');
    }
  };

  const statusColor: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-700',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-indigo-100 text-indigo-700',
    ON_THE_WAY: 'bg-blue-100 text-blue-700',
    ARRIVED: 'bg-indigo-100 text-indigo-700',
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-400 font-bold">Loading...</div>;
  }
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-6 text-center">
        <h2 className="text-xl font-black text-slate-900 mb-2">Booking Not Found</h2>
        <p className="text-slate-500 mb-6">The booking you are looking for doesn't exist.</p>
        <button onClick={() => router.back()} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-5 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-black text-slate-900">Booking Details</h1>
        </div>
        <button onClick={() => router.push('/customer/support')} className="text-blue-600 font-bold text-sm">Help</button>
      </header>

      <main className="px-4 py-6 space-y-4">
        {/* Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
          <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide mb-3 ${statusColor[booking.status] || 'bg-slate-100 text-slate-700'}`}>
            {booking.status?.replace(/_/g, ' ')}
          </span>
          <h2 className="text-xl font-black text-slate-900 mb-1">{booking.service?.name}</h2>
          <p className="text-slate-500 text-sm font-medium">{booking.booking_reference}</p>

          {(booking.start_otp || booking.end_otp) && ['ARRIVED', 'ON_THE_WAY', 'ACCEPTED', 'ASSIGNED', 'CONFIRMED', 'IN_PROGRESS'].includes(booking.status) && (
            <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-around">
              {booking.start_otp && booking.status !== 'IN_PROGRESS' && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Start OTP</p>
                  <p className="text-2xl font-black text-slate-900 tracking-[0.2em]">{booking.start_otp}</p>
                </div>
              )}
              {booking.end_otp && booking.status === 'IN_PROGRESS' && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">End OTP</p>
                  <p className="text-2xl font-black text-slate-900 tracking-[0.2em]">{booking.end_otp}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pro Info */}
        {booking.assigned_professional && (
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl border-2 border-blue-200">
              👷
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 text-sm">{booking.assigned_professional.user?.first_name || 'Professional'}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-yellow-500 text-xs font-black flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {booking.assigned_professional.rating || 'New'}
                </span>
                <span className="text-slate-400 text-[10px]">•</span>
                <span className="text-slate-500 text-xs font-medium">{booking.assigned_professional.total_jobs_completed || 0} jobs</span>
              </div>
            </div>
            <a href={`tel:${booking.assigned_professional.user?.phone || ''}`} className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 hover:bg-green-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </a>
          </div>
        )}

        {/* Schedule & Address */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">📅</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Schedule</p>
              <p className="font-bold text-slate-900 text-sm">
                {booking.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric'}) : 'Unscheduled'}
                {booking.scheduled_time ? ` at ${booking.scheduled_time.substring(0,5)}` : ''}
              </p>
              {booking.is_instant && <p className="text-xs text-blue-600 font-bold mt-1">Instant Booking (Max 90 mins)</p>}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 flex gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">📍</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
              <p className="font-bold text-slate-900 text-sm">{booking.address?.house_flat}, {booking.address?.building}</p>
              <p className="text-slate-500 text-xs mt-0.5">{booking.address?.street}, {booking.address?.city}</p>
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-4">Payment Summary</h3>
          <div className="space-y-2 text-sm font-medium">
            <div className="flex justify-between text-slate-600">
              <span>Service Base Price</span>
              <span>₹{((booking.base_price || 0)/100).toLocaleString('en-IN')}</span>
            </div>
            {booking.addons_price > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Addons & Packages</span>
                <span>₹{((booking.addons_price || 0)/100).toLocaleString('en-IN')}</span>
              </div>
            )}
            {booking.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{((booking.discount || 0)/100).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Taxes & Fee</span>
              <span>₹{((booking.taxes || 0) > 5000 ? (booking.taxes || 0)/100 : (booking.taxes || 0)).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
              <span className="font-black text-slate-900">Total Amount</span>
              <span className="font-black text-slate-900 text-lg">
                ₹{((booking.total_amount || 0) > 50000 ? (booking.total_amount || 0)/100 : (booking.total_amount || 0)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Hub: Tracking, Warranty, Invoice */}
        <div className="space-y-2.5">
          {['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'CONFIRMED', 'SEARCHING'].includes(booking.status) && (
            <button
              onClick={() => router.push(`/customer/bookings/${booking.id}/track`)}
              className="w-full py-3.5 px-4 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2"
            >
              <span>📡 Live Track Professional on Map</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => router.push(`/customer/bookings/${booking.id}/invoice`)}
              className="py-3 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>📄 Tax Invoice</span>
            </button>

            <button
              onClick={() => router.push(`/customer/bookings/${booking.id}/warranty`)}
              className="py-3 px-3 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>🛡️ 30-Day Warranty</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        {['CONFIRMED', 'PENDING_PAYMENT', 'SEARCHING', 'ASSIGNED'].includes(booking.status) && (
          <button onClick={() => setShowCancelModal(true)} className="w-full py-3.5 text-red-500 font-bold text-xs bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
            Cancel Booking
          </button>
        )}
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6">
            <h3 className="text-xl font-black text-slate-900 mb-2">Cancel Booking?</h3>
            <p className="text-sm text-slate-500 mb-4">Please let us know why you are cancelling.</p>
            <div className="space-y-2 mb-6">
              {['Change of plans', 'Found a better price', 'Booked by mistake', 'Pro taking too long', 'Other'].map(r => (
                <label key={r} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer">
                  <input type="radio" name="reason" value={r} checked={cancelReason === r} onChange={(e) => setCancelReason(e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">{r}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl">Keep</button>
              <button onClick={handleCancel} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl">Cancel It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-400 font-bold">Loading booking...</div>}>
      <BookingDetailPageContent />
    </React.Suspense>
  );
}

