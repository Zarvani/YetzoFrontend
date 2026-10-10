"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function BookingSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      
      <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight mb-2 text-center">
        Booking Confirmed!
      </h1>
      
      <p className="text-[16px] text-slate-500 mb-8 text-center max-w-md">
        Your service has been successfully scheduled. A professional will be assigned to you shortly.
      </p>

      <div className="bg-white border border-slate-200 rounded-[12px] p-6 w-full max-w-md shadow-sm mb-8">
        <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Booking Details</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-slate-900">Scheduled Date & Time</p>
              <p className="text-[14px] text-slate-500">Waiting for assignment (Instant)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-slate-900">Service Location</p>
              <p className="text-[14px] text-slate-500">Home (Default Address)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/bookings" className="flex-1">
          <Button variant="secondary" className="w-full h-12">
            View Bookings
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="primary" className="w-full h-12">
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
