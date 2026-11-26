'use client';

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { User, ShoppingBag, Wallet, MapPin, Bell, LogOut, ChevronRight, Zap } from "lucide-react"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  // Check if current route is part of the booking flow
  const isBookingRoute = pathname?.startsWith('/customer/booking');

  const sidebarLinks = [
    { name: "My Profile", href: "/customer/profile", icon: User },
    { name: "My Bookings & Live Track", href: "/customer/bookings", icon: ShoppingBag },
    { name: "Yetzo Wallet", href: "/customer/wallet", icon: Wallet },
    { name: "Saved Addresses", href: "/customer/addresses", icon: MapPin },
    { name: "Notifications", href: "/customer/notifications", icon: Bell },
  ];

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(Boolean(token));

      // If user is on an account management route (not booking) and has no token, redirect to login
      if (!isBookingRoute && !token) {
        router.replace('/auth/login?redirect=' + encodeURIComponent(pathname || '/customer/bookings'));
      }
    }
  }, [pathname, isBookingRoute, router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth/login";
  };

  // If on booking route, render full-width without the Customer Account sidebar
  if (isBookingRoute) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-body">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </div>
    );
  }

  // If on account routes and checking authentication
  if (isAuthenticated === false) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-body">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-heading">Redirecting to secure login...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-body">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Customer Sidebar (Desktop) - Only shown to authenticated users on account pages */}
          <aside className="hidden md:flex w-64 flex-col gap-1 shrink-0">
            <div className="mb-4 px-3">
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                Customer Account
              </span>
              <h2 className="text-xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">Account & Chores</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage visits, tracking & passes</p>
            </div>
            
            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium transition-all font-heading ${
                      isActive 
                        ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' 
                        : 'text-slate-700 hover:bg-white hover:text-blue-700 hover:shadow-xs border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
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
      
      {/* Mobile Bottom Navigation (Visible only on mobile for authenticated customer portal) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[58px] bg-white border-t border-slate-200 z-50 flex items-center justify-around px-2 pb-safe">
        {[
          { name: "Home", href: "/", icon: User, active: pathname === '/' },
          { name: "Instant Help", href: "/customer/booking", icon: Zap, active: pathname?.startsWith('/customer/booking') },
          { name: "Bookings", href: "/customer/bookings", icon: ShoppingBag, active: pathname === '/customer/bookings' },
          { name: "Wallet", href: "/customer/wallet", icon: Wallet, active: pathname === '/customer/wallet' },
          { name: "Account", href: "/customer/profile", icon: User, active: pathname === '/customer/profile' }
        ].map((item, i) => (
          <Link key={i} href={item.href} className={`flex flex-col items-center justify-center w-full h-full gap-0.5 ${item.active ? 'text-[#2563EB]' : 'text-slate-500'}`}>
            <item.icon className={`h-4 w-4 ${item.active ? 'text-[#2563EB]' : ''}`} />
            <span className="text-[10px] font-heading font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
