import * as React from "react"
import Link from "next/link"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { BookingSummary } from "@/components/booking/BookingSummary"
import { Zap, Calendar as CalendarIcon, Clock } from "lucide-react"

export default function BookingSchedulePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-8">
        <BookingStepper currentStep={2} />
        
        <div className="mb-10 mt-8">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">When do you need the service?</h1>
          <p className="text-[15px] text-[#64748B]">Choose an instant booking or schedule for later.</p>
        </div>

        {/* Booking Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <label className="relative flex cursor-pointer rounded-[12px] border-2 border-[#2563EB] bg-blue-50/30 p-5 focus:outline-none hover:bg-blue-50 transition-colors">
            <input type="radio" name="booking_type" value="instant" className="sr-only" defaultChecked />
            <span className="flex flex-1 flex-col">
              <span className="flex items-center justify-between mb-2">
                <span className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#06B6D4]" />
                  Instant Booking
                </span>
                <span className="h-5 w-5 rounded-full border-[5px] border-[#2563EB] bg-white"></span>
              </span>
              <span className="text-[14px] text-[#475569]">
                A professional will be dispatched immediately. Usually arrives within <strong className="text-[#0F172A]">15-30 minutes</strong>.
              </span>
            </span>
          </label>

          <label className="relative flex cursor-pointer rounded-[12px] border-2 border-[#E2E8F0] bg-white p-5 focus:outline-none hover:border-[#CBD5E1] transition-colors">
            <input type="radio" name="booking_type" value="scheduled" className="sr-only" />
            <span className="flex flex-1 flex-col">
              <span className="flex items-center justify-between mb-2">
                <span className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                  Schedule for Later
                </span>
                <span className="h-5 w-5 rounded-full border-2 border-[#CBD5E1] bg-white"></span>
              </span>
              <span className="text-[14px] text-[#475569]">
                Choose a specific date and time that works best for your schedule.
              </span>
            </span>
          </label>
        </div>

        {/* Note Box */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-5">
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 border border-[#E2E8F0] rounded-full shadow-sm shrink-0">
              <Clock className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">Instant Dispatch Active</h3>
              <p className="text-[14px] text-[#475569] leading-relaxed">
                You have selected an instant booking. Once payment is confirmed, the nearest available professional will be assigned to your location immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
          <Link href="/booking/details" className="text-[15px] font-medium text-[#475569] hover:text-[#0F172A]">
            Back
          </Link>
          <Link href="/booking/address" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-[10px] text-[15px] font-bold transition-colors shadow-sm">
            Continue to Address
          </Link>
        </div>
      </div>
      
      <div className="lg:col-span-4 relative">
        <BookingSummary />
      </div>
    </div>
  )
}
