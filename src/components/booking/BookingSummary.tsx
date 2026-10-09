import * as React from "react"
import { ShieldCheck, Tag } from "lucide-react"

interface BookingSummaryProps {
  bookingData?: any;
}

export function BookingSummary({ bookingData }: BookingSummaryProps) {
  // If we have real API data, use it. Otherwise fallback to mock visual for dev
  const subtotal = bookingData ? bookingData.base_price : 1699;
  const taxes = bookingData ? bookingData.taxes : 89;
  const total = bookingData ? bookingData.total_amount : 1738;
  const discount = bookingData ? 0 : 50; // Mocking discount

  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm p-6 sticky top-24">
      <h3 className="text-[18px] font-bold text-[#0F172A] mb-6">Booking Summary</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[15px] font-medium text-[#0F172A]">
              {bookingData?.service_name || "AC Deep Cleaning"}
            </p>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              {bookingData?.booking_reference ? `Ref: ${bookingData.booking_reference}` : "Split AC • 1.5 Ton"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 border border-[#E2E8F0] rounded-[6px]">
              <span className="text-[13px] font-bold">1</span>
            </div>
            <p className="text-[15px] font-semibold text-[#0F172A]">₹{subtotal}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E2E8F0] pt-4 mb-4">
        <div className="flex justify-between text-[14px] mb-3">
          <span className="text-[#64748B]">Subtotal</span>
          <span className="font-medium text-[#0F172A]">₹{subtotal}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-[14px] mb-3 text-[#16A34A]">
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" /> Discount Applied
            </span>
            <span className="font-medium">-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between text-[14px] mb-4">
          <span className="text-[#64748B]">Taxes & Fee</span>
          <span className="font-medium text-[#0F172A]">₹{taxes}</span>
        </div>
        <div className="flex justify-between items-center border-t border-dashed border-[#E2E8F0] pt-4">
          <span className="text-[16px] font-bold text-[#0F172A]">Total Amount</span>
          <span className="text-[20px] font-bold text-[#0F172A]">₹{total}</span>
        </div>
      </div>

      <div className="bg-[#F8FAFC] rounded-[8px] p-3 flex gap-3 items-start border border-[#E2E8F0]">
        <ShieldCheck className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#475569] leading-relaxed">
          Includes <strong className="text-[#0F172A]">30-day service warranty</strong>. If you face any issues, we will fix it for free.
        </p>
      </div>
    </div>
  )
}
