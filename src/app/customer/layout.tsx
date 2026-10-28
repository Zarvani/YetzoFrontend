'use client';

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { User, ShoppingBag, Wallet, MapPin, Bell, LogOut, ChevronRight, Zap } from "lucide-react"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarLinks = [
    { name: "My Profile", href: "/customer/profile", icon: User },
    { name: "My Bookings & Live Track", href: "/customer/bookings", icon: ShoppingBag },
    { name: "Yetzo Wallet", href: "/customer/wallet", icon: Wallet },
    { name: "Saved Addresses", href: "/customer/addresses", icon: MapPin },
    { name: "Notifications", href: "/customer/notifications", icon: Bell },
  ]

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-body">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Customer Sidebar (Desktop) */}
          <aside className="hidden md:flex w-64 flex-col gap-1 shrink-0">
            <div className="mb-4 px-3">
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
                Customer Portal
              </span>
              <h2 className="text-xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">Account & Chores</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage visits, tracking & passes</p>
            </div>
            
            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium text-slate-700 hover:bg-white hover:text-emerald-700 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all font-heading"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                  </Link>
                )
              })}
              
              <div className="mt-6 px-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 text-xs font-medium text-rose-600 hover:text-rose-700 transition font-heading"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
          
        </div>
      </main>
      
      {/* Mobile Bottom Navigation (Visible only on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[58px] bg-white border-t border-slate-200 z-50 flex items-center justify-around px-2 pb-safe">
        {[
          { name: "Home", href: "/", icon: User, active: false },
          { name: "Instant Help", href: "/customer/booking", icon: Zap, active: true },
          { name: "Bookings", href: "/customer/bookings", icon: ShoppingBag, active: false },
          { name: "Wallet", href: "/customer/wallet", icon: Wallet, active: false },
          { name: "Account", href: "/customer/profile", icon: User, active: false }
        ].map((item, i) => (
          <Link key={i} href={item.href} className={`flex flex-col items-center justify-center w-full h-full gap-0.5 ${item.active ? 'text-[#05AC5F]' : 'text-slate-500'}`}>
            <item.icon className={`h-4 w-4 ${item.active ? 'text-[#05AC5F]' : ''}`} />
            <span className="text-[10px] font-heading font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
