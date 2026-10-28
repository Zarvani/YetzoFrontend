'use client';

import * as React from "react"
import Link from "next/link"
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  CreditCard, 
  Tag, 
  ShieldCheck, 
  Settings, 
  Bell, 
  Activity, 
  Map
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* Sidebar - Dark Navy Command Center */}
      <aside className="w-[260px] bg-[#0F172A] text-slate-300 flex-shrink-0 flex flex-col hidden md:flex h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-slate-800/50 mb-4 bg-[#0B1221]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-[22px] font-bold text-white tracking-tight">YETZO <span className="text-[#06B6D4]">ADMIN</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 pb-8">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 bg-[#1E293B] text-white rounded-[8px] font-medium transition-colors">
            <BarChart3 className="h-5 w-5 text-[#06B6D4]" /> Dashboard
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800/50 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Ops</div>
          
          <Link href="/operations/ops/dispatch" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Activity className="h-5 w-5" /> Live Dispatch
            <span className="ml-auto bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </Link>
          <Link href="/admin/zones" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Map className="h-5 w-5" /> Heatmap & Zones
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800/50 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Management</div>
          
          <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Briefcase className="h-5 w-5" /> Bookings
          </Link>
          <Link href="/operations/ops/professionals" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Users className="h-5 w-5" /> Professionals
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Users className="h-5 w-5" /> Customers
          </Link>
          <Link href="/admin/services" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Tag className="h-5 w-5" /> Service Catalog
          </Link>
          <Link href="/admin/coupons" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Tag className="h-5 w-5" /> Coupons & Promos
          </Link>
          <Link href="/admin/payments" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <CreditCard className="h-5 w-5" /> Finance & Payouts
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800/50 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Security & System</div>
          
          <Link href="/admin/roles" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <ShieldCheck className="h-5 w-5" /> Roles & Perms
          </Link>
          <Link href="/admin/audit-logs" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <ShieldCheck className="h-5 w-5" /> Audit Logs
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1E293B] hover:text-white rounded-[8px] font-medium transition-colors">
            <Settings className="h-5 w-5" /> System Settings
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#F1F5F9]">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E2E8F0] h-[72px] flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
          <div className="flex-1">
            <div className="relative max-w-md hidden lg:block">
              <input 
                type="text" 
                placeholder="Search bookings, users, or professionals (CMD+K)" 
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2 rounded-[8px] text-[14px] focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-[#64748B] hover:text-[#0F172A] transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#DC2626] border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[#E2E8F0] pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-bold text-[#0F172A]">Super Admin</p>
                <p className="text-[12px] text-[#64748B]">System Control</p>
              </div>
              <div className="h-9 w-9 rounded-[8px] bg-[#0F172A] text-white flex items-center justify-center text-[14px] font-bold">
                SA
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
