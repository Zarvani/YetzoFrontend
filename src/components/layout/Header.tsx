"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MapPin, ChevronDown, ShieldCheck, Zap, User, LogOut } from "lucide-react"
import { useLocationStore, CITIES_DATA } from "@/store/useLocationStore"

export function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { selectedCity, setSelectedCity, openLocationModal } = useLocationStore()
  const [userLoggedIn, setUserLoggedIn] = React.useState(false)

  const cities = [
    "Bengaluru",
    "Mumbai",
    "Delhi NCR",
    "Gurgaon",
    "Noida",
    "Pune",
    "Hyderabad",
    "Faridabad",
    "Ghaziabad",
    "Navi Mumbai",
    "Thane",
  ]

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    const checkAuth = () => {
      if (typeof window !== "undefined") {
        setUserLoggedIn(Boolean(localStorage.getItem("access_token")))
      }
    }
    checkAuth()
    window.addEventListener("storage", checkAuth)
    window.addEventListener("auth-state-changed", checkAuth)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("auth-state-changed", checkAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUserLoggedIn(false)
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { loggedIn: false } }))
    window.location.href = "/"
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md ${isScrolled ? 'border-b border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]' : 'border-b border-slate-200/80'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        {/* Left: Brand & City Selector */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="Yetzo Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-[300] tracking-[0.16em] text-xl text-slate-900 uppercase">
                YETZO
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#2563EB] font-bold -mt-1 font-body">
                INSTANT 15-MIN FLEET
              </span>
            </div>
          </Link>

          {/* Market Benchmark: Quick-Commerce 15-Min & Address Pill */}
          <div className="relative">
            <button
              onClick={() => openLocationModal()}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100/70 text-left transition group shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 font-heading">
                15m
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-black text-slate-900 tracking-tight flex items-center gap-1 font-heading">
                    Instant Dispatch in 15 Mins
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                  {selectedCity ? `${selectedCity}, India` : 'Set your location'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-700 font-body">
            <Link href="/#instant-dispatch" className="hover:text-[#2563EB] transition flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
              Instant 15m Dispatch
            </Link>
            <Link href="/#task-stacking" className="hover:text-[#2563EB] transition">
              Task Stacking
            </Link>
            <Link href="/services" className="hover:text-[#2563EB] transition">
              All Services
            </Link>
            <Link href="/customer/booking/schedule" className="hover:text-[#2563EB] transition">
              Daily Maid Pass
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {userLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/customer/bookings"
                className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 transition hidden sm:flex items-center gap-1.5 border border-slate-200 rounded-sm hover:bg-slate-50"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>My Bookings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 border border-slate-200 rounded-sm hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-2 transition hidden sm:flex items-center gap-1.5 hover:bg-slate-50 rounded-sm"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Login</span>
            </Link>
          )}

          <Link
            href="/customer/booking"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-2 rounded-sm text-xs font-semibold tracking-wide transition shadow-sm flex items-center gap-2 font-heading uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-white/90 animate-ping"></span>
            <span>Book Instant Help</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
export default Header;
