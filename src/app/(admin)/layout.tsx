import * as React from "react"
import Link from "next/link"
import { Users, Briefcase, Map, ShieldAlert, BarChart3, Settings, Search, Bell } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Live Dispatch", href: "/admin/dispatch", icon: Map },
    { name: "Bookings", href: "/admin/bookings", icon: Briefcase },
    { name: "Professionals", href: "/admin/professionals", icon: Users },
    { name: "Fraud & Audit", href: "/admin/audit", icon: ShieldAlert },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Heavy Admin Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0F172A] text-slate-300 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0B2D8F]">
          <Link href="/admin" className="text-[20px] font-bold tracking-tight text-white flex items-center gap-2">
            YETZO <span className="text-[10px] bg-white text-[#0B2D8F] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="flex flex-col gap-1 px-3">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5 opacity-80" />
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search bookings, professionals, or customers..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-[#0B2D8F] text-white flex items-center justify-center text-sm font-bold">
              AD
            </div>
          </div>
        </header>
        
        {/* Scrollable Dashboard Area */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
