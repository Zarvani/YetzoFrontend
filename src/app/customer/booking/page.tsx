"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ShieldCheck } from "lucide-react"
import { apiClient } from "@/lib/apiClient"
import { CreateBookingPayload } from "@/types/booking"

export default function BookingFlowPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both a date and time.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("yetzo_access_token")
      if (!token) throw new Error("Please log in to book a service.")

      // Mock service ID for demonstration. In a real flow, this comes from URL/Context.
      const serviceId = "00000000-0000-0000-0000-000000000001" 
      
      // Combine date and time to ISO format (simplified for demo)
      const scheduledTime = new Date().toISOString() 

      const payload: CreateBookingPayload = {
        service: serviceId,
        scheduled_time: scheduledTime,
      }

      await apiClient("/bookings/", {
        method: "POST",
        body: payload,
        token
      })

      // Move to next step (e.g. success page or payment)
      router.push("/profile?booking_success=true")
    } catch (err: any) {
      setError(err.message || "Failed to create booking.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      
      {/* LEFT: Dynamic Step Content */}
      <div className="flex-1">
        <h1 className="text-[24px] font-bold text-[#0F172A] mb-6 tracking-tight">
          Select Date & Time
        </h1>
        
        {error && (
          <div className="mb-6 rounded-[8px] bg-red-50 p-4 text-[14px] text-red-600 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-6 shadow-sm mb-6">
           <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">When do you need the service?</h3>
           
           {/* Date Picker Mock */}
           <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
             {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15'].map((date, i) => (
               <button 
                 key={i} 
                 onClick={() => setSelectedDate(date)}
                 className={`flex flex-col items-center justify-center p-3 rounded-[10px] border transition-colors ${selectedDate === date ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569]'}`}
               >
                 <span className="text-[12px] font-medium uppercase mb-1">{date.split(' ')[0]}</span>
                 <span className="text-[16px] font-bold">{date.split(' ')[1]}</span>
               </button>
             ))}
           </div>

           <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Select Time</h3>
           {/* Time Slots Mock */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {['09:00 AM', '11:00 AM', '01:00 PM', '04:00 PM'].map((time, i) => (
               <button 
                 key={i} 
                 onClick={() => setSelectedTime(time)}
                 className={`px-4 py-3 rounded-[8px] text-[14px] font-medium border transition-colors ${selectedTime === time ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-[#E2E8F0] text-[#475569] hover:bg-slate-50'}`}
               >
                 {time}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* RIGHT: Sticky Booking Summary */}
      <div className="w-full lg:w-[380px]">
        <div className="sticky top-[140px]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[15px] font-medium text-[#0F172A]">AC Deep Cleaning</h4>
                    <p className="text-[13px] text-[#64748B]">Qty: 1</p>
                  </div>
                  <span className="text-[15px] font-medium text-[#0F172A]">₹499</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[15px] font-medium text-[#0F172A]">Gas Pressure Check</h4>
                    <p className="text-[13px] text-[#64748B]">Add-on</p>
                  </div>
                  <span className="text-[15px] font-medium text-[#0F172A]">₹199</span>
                </div>
              </div>

              <hr className="border-[#E2E8F0] mb-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#475569]">Item Total</span>
                  <span className="font-medium text-[#0F172A]">₹698</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#16A34A]">Yetzo Discount</span>
                  <span className="font-medium text-[#16A34A]">-₹50</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#475569]">Taxes & Fee</span>
                  <span className="font-medium text-[#0F172A]">₹35</span>
                </div>
              </div>
              
              <hr className="border-[#E2E8F0] mb-4" />
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-[16px] font-bold text-[#0F172A]">Total Amount</span>
                <span className="text-[20px] font-bold text-[#0F172A]">₹683</span>
              </div>

              <Button variant="primary" className="w-full text-[16px]" onClick={handleContinue} isLoading={isLoading}>
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-[#64748B]">
            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
            Secure Encrypted Checkout
          </div>
        </div>
      </div>

    </div>
  )
}
