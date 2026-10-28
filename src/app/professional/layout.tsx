'use client';

import * as React from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Briefcase, 
  CalendarDays, 
  Clock, 
  IndianRupee, 
  Wallet, 
  Award, 
  FileText, 
  Star, 
  LifeBuoy, 
  Settings,
  Bell
} from "lucide-react"

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar - Dark Navy */}
      <aside className="w-[260px] bg-[#0F172A] text-slate-300 flex-shrink-0 flex flex-col hidden md:flex h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-slate-800/50 mb-4">
          <Link href="/professional/pro" className="flex items-center gap-2">
            <span className="text-[22px] font-bold text-white tracking-tight">YETZO <span className="text-[#2563EB]">PRO</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 pb-8">
          <Link href="/professional/pro" className="flex items-center gap-3 px-3 py-2.5 bg-[#1E293B] text-white rounded-[8px] font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5 text-[#2563EB]" /> Dashboard
          </Link>
          <Link href="/professional/pro/jobs" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Briefcase className="h-5 w-5" /> Jobs
            <span className="ml-auto bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
          </Link>
          <Link href="/professional/pro/calendar" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <CalendarDays className="h-5 w-5" /> Calendar
          </Link>
          <Link href="/professional/pro/availability" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Clock className="h-5 w-5" /> Availability
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800/50 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Finance</div>
          
          <Link href="/professional/pro/earnings" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <IndianRupee className="h-5 w-5" /> Earnings
          </Link>
          <Link href="/professional/pro/payouts" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Wallet className="h-5 w-5" /> Payouts
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800/50 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Profile</div>
          
          <Link href="/professional/pro/training" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Award className="h-5 w-5" /> Training
          </Link>
          <Link href="/professional/pro/documents" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <FileText className="h-5 w-5" /> Documents
          </Link>
          <Link href="/professional/pro/reviews" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Star className="h-5 w-5" /> Reviews
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800/50 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">System</div>
          
          <Link href="/professional/pro/support" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <LifeBuoy className="h-5 w-5" /> Support
          </Link>
          <Link href="/professional/pro/settings" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E2E8F0] h-[72px] flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A]"></span>
              </span>
              <span className="text-[14px] font-bold text-[#0F172A]">Online & Accepting Jobs</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-[#64748B] hover:text-[#0F172A] transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#DC2626] border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[#E2E8F0] pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-bold text-[#0F172A]">Rahul Kumar</p>
                <p className="text-[12px] text-[#64748B]">ID: YP-9923</p>
              </div>
              <div className="h-9 w-9 rounded-full overflow-hidden border border-[#E2E8F0]">
                <img src="/assets/images/ac-service.jpg" alt="Profile" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
