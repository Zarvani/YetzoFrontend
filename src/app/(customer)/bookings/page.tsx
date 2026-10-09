"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Calendar, ChevronRight, CheckCircle2 } from "lucide-react"
import { apiClient } from "@/lib/apiClient"

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiClient<any>('/api/v1/bookings/');
        if (response.success && Array.isArray(response.data)) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error("Failed to load bookings", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getFilteredBookings = () => {
    return bookings.filter(b => {
      if (activeTab === 'upcoming') {
        return !['COMPLETED', 'CANCELLED'].includes(b.status);
      } else if (activeTab === 'completed') {
        return b.status === 'COMPLETED';
      } else {
        return b.status === 'CANCELLED';
      }
    });
  };

  const filteredBookings = getFilteredBookings();
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-[800px] mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">My Bookings</h1>
          <p className="text-[15px] text-[#64748B] mt-1">View and manage your service history.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0] mb-6">
          <button onClick={() => setActiveTab('upcoming')} className={`px-6 py-3 border-b-2 text-[15px] font-bold transition-colors ${activeTab === 'upcoming' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('completed')} className={`px-6 py-3 border-b-2 text-[15px] font-bold transition-colors ${activeTab === 'completed' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'}`}>Completed</button>
          <button onClick={() => setActiveTab('cancelled')} className={`px-6 py-3 border-b-2 text-[15px] font-bold transition-colors ${activeTab === 'cancelled' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'}`}>Cancelled</button>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 font-medium">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-[16px] border border-slate-200">No {activeTab} bookings found.</div>
          ) : (
            filteredBookings.map(booking => (
              <Link key={booking.id} href={`/bookings/${booking.id}`} className="block bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm hover:border-[#2563EB] transition-colors group">
                <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${['IN_PROGRESS', 'ASSIGNED'].includes(booking.status) ? 'bg-cyan-50 text-[#06B6D4]' : 'bg-blue-50 text-[#2563EB]'}`}>
                        {booking.status}
                      </span>
                      <span className="text-[13px] text-[#64748B] font-semibold">{booking.booking_reference}</span>
                    </div>
                    <h3 className="text-[18px] font-bold text-[#0F172A]">{booking.service_details?.name || 'Service Booking'}</h3>
                    <p className="text-[14px] text-[#64748B] mt-1 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {new Date(booking.scheduled_start).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold text-[#0F172A]">₹{booking.total_amount}</p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-b-[16px] flex justify-between items-center transition-colors ${['IN_PROGRESS', 'ASSIGNED'].includes(booking.status) ? 'bg-[#F8FAFC] group-hover:bg-blue-50/50' : 'bg-white group-hover:bg-slate-50'}`}>
                  {booking.professional_details ? (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {booking.professional_details.name.charAt(0)}
                      </div>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{booking.professional_details.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#475569]">
                      <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                      <span className="text-[13px] font-medium">Professional will be assigned soon</span>
                    </div>
                  )}
                  <span className={`text-[14px] font-bold flex items-center gap-1 ${['IN_PROGRESS', 'ASSIGNED'].includes(booking.status) ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
                    {['IN_PROGRESS', 'ASSIGNED'].includes(booking.status) ? 'Track Live' : 'View Details'} <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))
          )}
          
        </div>
      </main>
    </div>
  )
}
