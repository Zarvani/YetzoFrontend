'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion } from 'framer-motion';

export default function MyBookingsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const payload = await apiClient<any>('bookings/');
        if (payload?.results) {
          setBookings(payload.results);
        } else {
          setBookings([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-50">
        <button onClick={() => router.back()} className="mr-4 text-slate-600 hover:text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">My Bookings</h1>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        
        {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <div className="w-full">
                <h3 className="font-semibold text-red-900">Failed to Load</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
        )}

        {isLoading ? (
           <div className="animate-pulse space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-200 rounded-3xl w-full"></div>)}
           </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No active bookings</h3>
            <p className="text-slate-500 mt-2 font-medium">When you book a service, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any, idx: number) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Header: Status and ID */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</span>
                    <span className="font-medium text-slate-900">#{booking.id.substring(0,8)}</span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    booking.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {booking.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="p-6">
                  {/* Service Info */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-extrabold text-xl text-slate-900 mb-1">{booking.service?.name || 'Premium Service'}</h3>
                      <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {booking.scheduled_time ? new Date(booking.scheduled_time).toLocaleString() : 'Pending Assignment'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">₹{booking.total_price}</span>
                    </div>
                  </div>

                  {/* OTP / Escrow Status */}
                  {(booking.status === 'scheduled' || booking.status === 'in_progress') && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mt-4">
                      <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Security verification
                      </h4>
                      <div className="flex gap-4">
                        {booking.status === 'scheduled' && booking.start_otp && (
                          <div className="flex-1 bg-white p-3 rounded-xl border border-blue-100 text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Start OTP</p>
                            <p className="text-2xl font-black tracking-[0.25em] text-blue-700">{booking.start_otp}</p>
                          </div>
                        )}
                        {booking.status === 'in_progress' && booking.end_otp && (
                          <div className="flex-1 bg-white p-3 rounded-xl border border-yellow-100 text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">End OTP</p>
                            <p className="text-2xl font-black tracking-[0.25em] text-yellow-600">{booking.end_otp}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 font-medium mt-4">
                        Please share the relevant OTP with the professional to {booking.status === 'scheduled' ? 'start' : 'complete'} the job. Payment is safely held in Escrow.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-xl mx-auto flex justify-around p-2">
          <button onClick={() => router.push('/customer/home')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => router.push('/customer/bookings')} className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span className="text-[10px] font-bold">Bookings</span>
          </button>
          <button onClick={() => router.push('/customer/account')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-[10px] font-bold">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
