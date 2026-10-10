import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { User, ShoppingBag, Wallet, MapPin, Bell, LogOut, ChevronRight } from "lucide-react"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarLinks = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "My Bookings", href: "/bookings", icon: ShoppingBag },
    { name: "Yetzo Wallet", href: "/wallet", icon: Wallet },
    { name: "Saved Addresses", href: "/addresses", icon: MapPin },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Header />
      
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Customer Sidebar (Desktop) */}
          <aside className="hidden md:flex w-64 flex-col gap-1 shrink-0">
            <div className="mb-6 px-4">
              <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">Account</h2>
              <p className="text-[14px] text-[#64748B] mt-1">Manage your details & bookings</p>
            </div>
            
            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-[8px] text-[15px] font-medium text-[#475569] hover:bg-white hover:text-[#2563EB] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {link.name}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                )
              })}
              
              <div className="mt-8 px-4">
                <button className="flex items-center gap-3 text-[15px] font-medium text-[#DC2626] hover:opacity-80 transition-opacity">
                  <LogOut className="h-5 w-5" />
                  Log Out
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
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[64px] bg-white border-t border-[#E2E8F0] z-50 flex items-center justify-around px-2 pb-safe">
        {[
          { name: "Home", icon: User, active: false },
          { name: "Services", icon: ShoppingBag, active: false },
          { name: "Bookings", icon: ShoppingBag, active: true },
          { name: "Wallet", icon: Wallet, active: false },
          { name: "Me", icon: User, active: false }
        ].map((item, i) => (
          <button key={i} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${item.active ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
            <item.icon className={`h-6 w-6 ${item.active ? 'fill-blue-50' : ''}`} />
            <span className="text-[11px] font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
