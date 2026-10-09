import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { ArrowLeft, MessageSquare, Phone, AlertCircle, HelpCircle } from "lucide-react"

export default function BookingSupportPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-[800px] mx-auto px-4 py-8">
        <Link href="/bookings/YZ-102938" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Booking
        </Link>
        
        <div className="mb-10">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Help & Support</h1>
          <p className="text-[15px] text-[#64748B] mt-1">How can we assist you with Booking #YZ-102938?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Quick Contact Options */}
          <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col items-center text-center hover:border-[#2563EB] transition-colors cursor-pointer group">
            <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
              <MessageSquare className="h-6 w-6 text-[#2563EB] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">Chat with Support</h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Get instant help from our support agents via live chat. Usually replies in under 2 minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col items-center text-center hover:border-[#2563EB] transition-colors cursor-pointer group">
            <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
              <Phone className="h-6 w-6 text-[#2563EB] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">Request a Call</h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Drop your number and our escalation team will call you back within 15 minutes.
            </p>
          </div>
        </div>

        <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Common Issues</h2>
        
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
          <Link href="#" className="flex items-center justify-between p-5 border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#475569]" />
              <span className="text-[15px] font-semibold text-[#0F172A]">I have an issue with the service quality</span>
            </div>
            <ArrowLeft className="h-4 w-4 text-[#CBD5E1] rotate-180" />
          </Link>
          
          <Link href="#" className="flex items-center justify-between p-5 border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#475569]" />
              <span className="text-[15px] font-semibold text-[#0F172A]">Professional hasn't arrived yet</span>
            </div>
            <ArrowLeft className="h-4 w-4 text-[#CBD5E1] rotate-180" />
          </Link>
          
          <Link href="#" className="flex items-center justify-between p-5 border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#475569]" />
              <span className="text-[15px] font-semibold text-[#0F172A]">I was overcharged or want a refund</span>
            </div>
            <ArrowLeft className="h-4 w-4 text-[#CBD5E1] rotate-180" />
          </Link>
          
          <Link href="#" className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-[#475569]" />
              <span className="text-[15px] font-semibold text-[#0F172A]">Claim service warranty</span>
            </div>
            <ArrowLeft className="h-4 w-4 text-[#CBD5E1] rotate-180" />
          </Link>
        </div>
        
      </main>
    </div>
  )
}
