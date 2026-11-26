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
  const { selectedCity, setSelectedCity } = useLocationStore()
  const [cityOpen, setCityOpen] = React.useState(false)
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

          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs font-medium text-slate-800 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {cityOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-sm shadow-xl py-1 z-50 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 font-heading">
                  Select Coverage City
                </div>
                {CITIES_DATA.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCity(c.name);
                      setCityOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between ${
                      selectedCity === c.name ? 'bg-blue-50 text-blue-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {!c.isOperational && (
                        <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded">
                          Soon
                        </span>
                      )}
                    </div>
                    {selectedCity === c.name && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>}
                  </button>
                ))}
              </div>
            )}
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
