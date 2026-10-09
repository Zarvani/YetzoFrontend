import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Minimal Booking Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[#64748B] hover:text-[#0F172A] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href="/" className="flex items-center">
              <img src="/assets/images/logo.png" alt="Yetzo" className="h-[28px] w-auto object-contain" />
            </Link>
          </div>
          <div className="text-[14px] font-medium text-[#64748B] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
