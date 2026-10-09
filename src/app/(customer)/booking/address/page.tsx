import * as React from "react"
import Link from "next/link"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { BookingSummary } from "@/components/booking/BookingSummary"
import { BookingAddressSelector } from "@/components/booking/BookingAddressSelector"
import { Navigation } from "lucide-react"

export default function BookingAddressPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-8">
        <BookingStepper currentStep={3} />
        
        <div className="mb-10 mt-8">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">Where do you need the service?</h1>
          <p className="text-[15px] text-[#64748B]">Select an existing address or add a new one.</p>
        </div>

        <div className="mb-8">
          <BookingAddressSelector />
        </div>
        
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-5">
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 border border-[#E2E8F0] rounded-full shadow-sm shrink-0">
              <Navigation className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">Serviceability Check</h3>
              <p className="text-[14px] text-[#475569] leading-relaxed">
                Good news! You are in a high-density service zone. There are currently <strong className="text-[#0F172A]">8 professionals</strong> available near this location for immediate dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
          <Link href="/booking/schedule" className="text-[15px] font-medium text-[#475569] hover:text-[#0F172A]">
            Back
          </Link>
          <Link href="/booking/payment" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-[10px] text-[15px] font-bold transition-colors shadow-sm">
            Continue to Payment
          </Link>
        </div>
      </div>
      
      <div className="lg:col-span-4 relative">
        <BookingSummary />
      </div>
    </div>
  )
}
