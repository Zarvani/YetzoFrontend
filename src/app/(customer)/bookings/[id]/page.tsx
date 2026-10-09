import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { ArrowLeft, CheckCircle2, Clock, MapPin, Receipt, ShieldCheck } from "lucide-react"

export default function BookingDetailPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-[800px] mx-auto px-4 py-8">
        <Link href="/bookings" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#0F172A] mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to bookings
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-50 text-[#06B6D4] text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">In Progress</span>
              <span className="text-[13px] text-[#64748B] font-semibold">Booking #YZ-102938</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">AC Deep Cleaning</h1>
          </div>
          <Link href="/bookings/YZ-102938/track" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-[8px] text-[14px] font-bold transition-colors text-center shadow-sm">
            Track Live Status
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Professional Info */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Assigned Professional</h2>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0]">
                  <img src="/assets/images/ac-service.jpg" alt="Rahul Kumar" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0F172A]">Rahul Kumar</h3>
                  <p className="text-[13px] text-[#64748B] mt-0.5">★ 4.9 (1.2k reviews)</p>
                </div>
              </div>
            </div>

            {/* Service Address & Time */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Schedule & Location</h2>
              
              <div className="flex gap-4 mb-6">
                <div className="mt-0.5"><Clock className="h-5 w-5 text-[#64748B]" /></div>
                <div>
                  <p className="text-[14px] font-medium text-[#0F172A]">Today, 10:00 AM</p>
                  <p className="text-[13px] text-[#64748B] mt-0.5">Instant Dispatch</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-0.5"><MapPin className="h-5 w-5 text-[#64748B]" /></div>
                <div>
                  <p className="text-[14px] font-medium text-[#0F172A]">Home</p>
                  <p className="text-[13px] text-[#64748B] mt-0.5 leading-relaxed">
                    B-104, Sunrise Apartments<br />
                    Kargil Petrol Pump Road, Sikandra
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/bookings/YZ-102938/support" className="bg-white border border-[#CBD5E1] text-[#0F172A] rounded-[10px] p-4 text-center hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#64748B]" />
                <span className="text-[14px] font-semibold">Help & Support</span>
              </Link>
              <Link href="/bookings/YZ-102938/invoice" className="bg-white border border-[#CBD5E1] text-[#0F172A] rounded-[10px] p-4 text-center hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2">
                <Receipt className="h-5 w-5 text-[#64748B]" />
                <span className="text-[14px] font-semibold">View Invoice</span>
              </Link>
            </div>

          </div>

          <div className="md:col-span-1">
            {/* Payment Summary */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-5 sticky top-24">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Payment Summary</h2>
              
              <div className="space-y-3 text-[14px] mb-4">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">AC Deep Cleaning</span>
                  <span className="font-medium text-[#0F172A]">₹499</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Gas Top-up</span>
                  <span className="font-medium text-[#0F172A]">₹1,200</span>
                </div>
                <div className="flex justify-between text-[#16A34A]">
                  <span>Discount</span>
                  <span className="font-medium">-₹50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Taxes</span>
                  <span className="font-medium text-[#0F172A]">₹89</span>
                </div>
              </div>
              
              <div className="border-t border-[#E2E8F0] pt-4 flex justify-between items-center mb-4">
                <span className="text-[14px] font-bold text-[#0F172A]">Total Paid</span>
                <span className="text-[18px] font-bold text-[#0F172A]">₹1,738</span>
              </div>
              
              <div className="bg-green-50 text-[#16A34A] px-3 py-2 rounded-[6px] text-[12px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" /> Paid via UPI
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
