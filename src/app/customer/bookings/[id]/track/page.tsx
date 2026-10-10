'use client';

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LiveTrackingMap } from "@/components/tracking/LiveTrackingMap"
import { ProfessionalLocation } from "@/components/tracking/ProfessionalLocation"
import { ETACard } from "@/components/tracking/ETACard"
import { apiClient } from "@/lib/apiClient"
import { motion } from "framer-motion"

export default function BookingTrackPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiClient<any>(`bookings/${params.id}/`);
        setBooking(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Locating Professional...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Tracking Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/customer/bookings/${params.id}`} className="text-[#64748B] hover:text-[#0F172A] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-[16px] font-bold text-[#0F172A]">Track Professional</h1>
              <p className="text-[12px] text-[#64748B] font-medium">Booking #{booking?.id?.substring(0,8).toUpperCase()}</p>
            </div>
          </div>
          <Link href="/help" className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8]">
            Need Help?
          </Link>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Map */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-2 rounded-[20px] shadow-sm border border-[#E2E8F0]">
              <LiveTrackingMap />
            </div>
            
            {/* Timeline */}
            <div className="bg-white p-6 rounded-[16px] shadow-sm border border-[#E2E8F0] hidden lg:block relative overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, delay: 0.5 }} className="absolute top-2.5 left-0 h-1 bg-[#16A34A] -z-10" style={{ marginTop: '55px', marginLeft: '24px' }}></motion.div>
              <h3 className="text-[15px] font-bold text-[#0F172A] mb-6">Service Timeline</h3>
              <div className="flex justify-between relative">
                <div className="absolute top-2.5 left-0 w-full h-1 bg-[#E2E8F0] -z-20"></div>
                
                <div className="flex flex-col items-center gap-2">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-6 w-6 rounded-full bg-[#16A34A] flex items-center justify-center text-white text-[10px]">✓</motion.div>
                  <span className="text-[12px] font-medium text-[#0F172A]">Confirmed</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="h-6 w-6 rounded-full bg-[#16A34A] flex items-center justify-center text-white text-[10px]">✓</motion.div>
                  <span className="text-[12px] font-medium text-[#0F172A]">Assigned</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-6 w-6 rounded-full border-4 border-[#2563EB] bg-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"></motion.div>
                  <span className="text-[12px] font-bold text-[#2563EB]">{booking?.status === 'in_progress' ? 'Service Ongoing' : 'On the way'}</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <div className="h-6 w-6 rounded-full border-2 border-[#CBD5E1] bg-white"></div>
                  <span className="text-[12px] font-medium text-[#64748B]">Completed</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column: Status & Profile */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 flex flex-col gap-6">
            <ETACard 
              time="12 Min"
              distance="2.4 km"
              status={booking?.status === 'in_progress' ? 'Professional arrived' : 'Professional on the way'}
            />
            
            <ProfessionalLocation />
            
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-5 hover:border-blue-200 transition-colors">
              <h3 className="text-[15px] font-bold text-[#0F172A] mb-4">Service Details</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-slate-100 rounded-[8px] flex items-center justify-center text-[18px]">
                  📋
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0F172A] capitalize">{booking?.service?.name || 'Service Booking'}</p>
                  <p className="text-[12px] text-[#64748B]">Scheduled for: {new Date(booking?.scheduled_time || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="border-t border-[#E2E8F0] pt-4 flex justify-between items-center">
                <span className="text-[13px] text-[#64748B]">Amount to pay</span>
                <span className="text-[15px] font-bold text-[#16A34A]">₹{booking?.total_amount || '0'}</span>
              </div>
            </div>
            
            <button className="w-full py-3.5 bg-white border border-red-200 text-red-600 rounded-[10px] text-[14px] font-bold hover:bg-red-50 transition-colors shadow-sm">
              Cancel Booking
            </button>
          </motion.div>
          
        </div>
      </main>
    </div>
  )
}
