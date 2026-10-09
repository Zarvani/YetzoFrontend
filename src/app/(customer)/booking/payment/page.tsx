"use client";

import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { BookingSummary } from "@/components/booking/BookingSummary"
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector"
import { RazorpayButton } from "@/components/payment/RazorpayButton"
import { ShieldCheck } from "lucide-react"
import { useBookingStore } from "@/store/useBookingStore"
import { apiClient } from "@/lib/apiClient"

export default function BookingPaymentPage() {
  const router = useRouter();
  const { currentBookingId } = useBookingStore();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentBookingId) {
      // If no booking is in state, they shouldn't be on the payment page
      // In a real flow, they'd be redirected to cart/home
      // router.push("/"); 
      // For dev, we will just stop loading
      setIsLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = (await apiClient(`/api/v1/bookings/${currentBookingId}/`)) as any;
        if (response.success) {
          setBookingData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch booking details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [currentBookingId]);

  if (isLoading) {
    return <div className="p-12 text-center text-[#64748B]">Loading secure checkout...</div>;
  }

  // Fallback for dev if they bypass the flow
  const displayAmount = bookingData ? bookingData.total_amount : 1738;
  const displayId = bookingData ? bookingData.id : "DEV_MOCK_ID";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-8">
        <BookingStepper currentStep={4} />
        
        <div className="mb-10 mt-8 flex justify-between items-end">
          <div>
            <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">Select Payment Method</h1>
            <p className="text-[15px] text-[#64748B]">All transactions are secure and encrypted.</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#475569]">
            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
            100% Secure
          </div>
        </div>

        <div className="mb-8">
          <PaymentMethodSelector />
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
          <Link href="/booking/address" className="text-[15px] font-medium text-[#475569] hover:text-[#0F172A]">
            Back
          </Link>
          <RazorpayButton bookingId={displayId} amount={displayAmount} />
        </div>
      </div>
      
      <div className="lg:col-span-4 relative">
        <BookingSummary bookingData={bookingData} />
      </div>
    </div>
  )
}
