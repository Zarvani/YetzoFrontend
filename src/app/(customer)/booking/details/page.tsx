import * as React from "react"
import Link from "next/link"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { BookingSummary } from "@/components/booking/BookingSummary"
import { Info, Plus } from "lucide-react"

export default function BookingDetailsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-8">
        <BookingStepper currentStep={1} />
        
        <div className="mb-10 mt-8">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">Service Details</h1>
          <p className="text-[15px] text-[#64748B]">Review your service details and add any extras you might need.</p>
        </div>

        {/* Selected Services */}
        <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-6 mb-6">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Included in your service</h2>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#16A34A] mt-0.5">✓</span>
              <p className="text-[14px] text-[#475569]">Comprehensive cleaning of AC filters, coils, and drain tray</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#16A34A] mt-0.5">✓</span>
              <p className="text-[14px] text-[#475569]">Gas pressure check and cooling performance evaluation</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#16A34A] mt-0.5">✓</span>
              <p className="text-[14px] text-[#475569]">Deep cleaning of outdoor unit with high-pressure washer</p>
            </li>
          </ul>
        </div>

        {/* Add-ons */}
        <div>
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Frequently added together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-4 flex flex-col hover:border-[#2563EB] transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[15px] font-bold text-[#0F172A]">Gas Top-up</h3>
                <span className="text-[14px] font-bold text-[#0F172A]">₹1,200</span>
              </div>
              <p className="text-[13px] text-[#64748B] mb-4 flex-1">Complete gas refill up to 1.5 tons.</p>
              <button className="w-full flex items-center justify-center gap-2 border border-[#E2E8F0] bg-[#F8FAFC] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] text-[#0F172A] font-semibold text-[13px] py-2 rounded-[6px] transition-colors">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            
            <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-4 flex flex-col hover:border-[#2563EB] transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[15px] font-bold text-[#0F172A]">Capacitor Change</h3>
                <span className="text-[14px] font-bold text-[#0F172A]">₹450</span>
              </div>
              <p className="text-[13px] text-[#64748B] mb-4 flex-1">Replace faulty starting capacitor.</p>
              <button className="w-full flex items-center justify-center gap-2 border border-[#E2E8F0] bg-[#F8FAFC] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] text-[#0F172A] font-semibold text-[13px] py-2 rounded-[6px] transition-colors">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

          </div>
        </div>

        {/* Warning/Info Box */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-[8px] p-4 flex gap-3 items-start">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[13px] text-amber-800 leading-relaxed">
            Please ensure that there is adequate space around the AC unit for the technician to work safely. The final price may vary slightly if additional spare parts are required after inspection.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
          <Link href="/" className="text-[15px] font-medium text-[#475569] hover:text-[#0F172A]">
            Cancel
          </Link>
          <Link href="/booking/schedule" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-[10px] text-[15px] font-bold transition-colors shadow-sm">
            Continue to Schedule
          </Link>
        </div>
      </div>
      
      <div className="lg:col-span-4 relative">
        <BookingSummary />
      </div>
    </div>
  )
}
