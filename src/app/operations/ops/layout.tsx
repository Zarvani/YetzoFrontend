'use client';

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  Radio, 
  Map, 
  Activity, 
  Briefcase, 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  XCircle, 
  RotateCcw, 
  ShieldCheck, 
  Bell, 
  Search
} from "lucide-react"

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { title: "Operations Hub", href: "/operations/ops", icon: Radio },
    { title: "Live Dispatch", href: "/operations/ops/dispatch", icon: Activity, badge: "3" },
    { title: "Fleet Radar Map", href: "/operations/ops/map", icon: Map },
    { title: "Active Telemetry", href: "/operations/ops/live", icon: Radio },
  ];

  const fleetLinks = [
    { title: "All Bookings", href: "/operations/ops/bookings", icon: Briefcase },
    { title: "Field Professionals", href: "/operations/ops/professionals", icon: Users },
  ];

  const safetyLinks = [
    { title: "Escalations & SLA", href: "/operations/ops/escalations", icon: AlertTriangle, badge: "1", badgeColor: "bg-amber-500" },
    { title: "Issues & Claims", href: "/operations/ops/issues", icon: ShieldAlert },
    { title: "Cancellations", href: "/operations/ops/cancellations", icon: XCircle },
    { title: "Warranty & Reworks", href: "/operations/ops/warranty", icon: ShieldCheck },
    { title: "Refund Processing", href: "/operations/ops/refunds", icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* Sidebar - Dark Navy Command Center */}
      <aside className="w-[260px] bg-[#0F172A] text-slate-300 flex-shrink-0 flex flex-col hidden md:flex h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="p-5 border-b border-slate-800/60 bg-[#0B1221] flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 flex-shrink-0">
            <Image src="/logo.jpg" alt="Yetzo" fill className="object-cover" priority />
          </div>
          <div>
            <span className="text-[17px] font-bold text-white tracking-tight">YETZO <span className="text-[#38BDF8]">OPS</span></span>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">15-Min Fleet Dispatch</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 py-4">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Live Dispatch Fleet</div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                  isActive ? "bg-[#1E293B] text-white" : "text-slate-400 hover:bg-[#1E293B]/70 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#38BDF8]" : "text-slate-400"}`} /> 
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#2563EB] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-3 border-t border-slate-800/50 mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Fleet Operations</div>
          {fleetLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                  isActive ? "bg-[#1E293B] text-white" : "text-slate-400 hover:bg-[#1E293B]/70 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#38BDF8]" : "text-slate-400"}`} /> 
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-3 border-t border-slate-800/50 mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Safety & Resolution</div>
          {safetyLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                  isActive ? "bg-[#1E293B] text-white" : "text-slate-400 hover:bg-[#1E293B]/70 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#38BDF8]" : "text-slate-400"}`} /> 
                <span>{item.title}</span>
                {item.badge && (
                  <span className={`ml-auto ${item.badgeColor || 'bg-red-500'} text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#F1F5F9]">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E2E8F0] h-[64px] flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
          <div className="flex-1">
            <div className="relative max-w-md hidden lg:block">
              <input 
                type="text" 
                placeholder="Search active orders, telemetry GPS, partner IDs..." 
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-1.5 rounded-[8px] text-[13px] focus:outline-none focus:border-[#2563EB] transition-colors font-body"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full text-[11px] font-semibold text-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>15-Min Live SLA Dispatch Online</span>
            </div>
            
            <button className="relative text-[#64748B] hover:text-[#0F172A] transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[#DC2626] border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[#E2E8F0] pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-[#0F172A]">Operations Controller</p>
                <p className="text-[11px] text-[#64748B]">Duty Control</p>
              </div>
              <div className="h-8 w-8 rounded-[8px] bg-[#2563EB] text-white flex items-center justify-center text-[13px] font-bold shadow-sm">
                OP
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
