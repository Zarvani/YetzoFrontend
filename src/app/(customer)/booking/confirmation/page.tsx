import * as React from "react"
import Link from "next/link"
import { CheckCircle2, ChevronRight, MapPin, Zap } from "lucide-react"

export default function BookingConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="h-20 w-20 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_0_12px_rgba(22,163,74,0.1)]">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight mb-3">Booking Confirmed</h1>
        <p className="text-[16px] text-[#475569]">Your payment of <strong className="text-[#0F172A]">₹1,738</strong> was successful.<br/>We've sent the receipt to your email.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden mb-8">
        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] p-5 flex justify-between items-center">
          <div>
            <p className="text-[13px] text-[#64748B] font-bold uppercase tracking-wider mb-1">Booking ID</p>
            <p className="text-[16px] font-bold text-[#0F172A]">YZ-102938</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-[#06B6D4] text-[12px] font-bold uppercase tracking-wider rounded-full">
              <Zap className="h-3.5 w-3.5" /> Instant Dispatch
            </span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Your Professional</h2>
          <div className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-[12px] bg-[#F8FAFC]">
            {/* The professional photo generated earlier */}
            <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
              <img src="/assets/images/ac-service.jpg" alt="Rahul Kumar" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-[#0F172A]">Rahul Kumar</h3>
              <p className="text-[14px] text-[#64748B] mt-0.5">AC Technician • ★ 4.9</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-semibold text-[#16A34A] bg-green-50 px-2 py-0.5 rounded">Verified</span>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="mt-1">
              <MapPin className="h-5 w-5 text-[#64748B]" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-[#0F172A]">Home</p>
              <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">
                B-104, Sunrise Apartments<br />
                Kargil Petrol Pump Road, Sikandra
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/bookings/YZ-102938/track" className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 px-6 rounded-[10px] text-[15px] font-bold transition-colors shadow-sm text-center flex items-center justify-center gap-2">
          Track Live Status <ChevronRight className="h-4 w-4" />
        </Link>
        <Link href="/home" className="flex-1 bg-white border border-[#CBD5E1] text-[#0F172A] py-3.5 px-6 rounded-[10px] text-[15px] font-semibold hover:bg-slate-50 transition-colors text-center">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
