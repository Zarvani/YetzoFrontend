"use client"
import * as React from "react"
import Link from "next/link"
import { MapPin, Search, ChevronDown, ShieldCheck, Zap, User, Grid, LogOut, Radio, Wrench, ShieldAlert } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [selectedCity, setSelectedCity] = React.useState("Bengaluru")
  const [cityOpen, setCityOpen] = React.useState(false)
  const [portalOpen, setPortalOpen] = React.useState(false)
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

  const portals = [
    {
      title: "Customer Hub",
      desc: "Instant chores, tracking & bookings",
      href: "/customer/bookings",
      icon: User,
      badge: "Customer",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Operations Dispatch",
      desc: "Live telemetry, auto-assign & radar",
      href: "/operations/ops/dispatch",
      icon: Radio,
      badge: "Operations",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      title: "Pro Partner Hub",
      desc: "Incoming job queue & earnings",
      href: "/professional/pro/jobs",
      icon: Wrench,
      badge: "Partner",
      badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      title: "Admin Command",
      desc: "Roles, pricing, audit logs & catalog",
      href: "/admin",
      icon: ShieldAlert,
      badge: "Super Admin",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ]

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    if (typeof window !== "undefined") {
      setUserLoggedIn(Boolean(localStorage.getItem("access_token")))
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUserLoggedIn(false)
    window.location.href = "/"
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md ${isScrolled ? 'border-b border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]' : 'border-b border-slate-200/80'}`}>
      {/* Top micro-bar */}
      <div className="bg-[#0B0F19] text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-body">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              15-Minute Instant House Help SLA
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Over 500,000+ homes serviced across 11 cities</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Police Verified & Bodycam Insured
            </span>
            <Link href="/customer/support" className="hover:text-white transition">24/7 Helpline</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        {/* Left: Brand & City Selector */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-sm bg-[#05AC5F] flex items-center justify-center text-white shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-[300] tracking-[0.16em] text-xl text-slate-900 uppercase">
                YETZO
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#05AC5F] font-bold -mt-1 font-body">
                BY PRONTO SPEED
              </span>
            </div>
          </Link>

          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setCityOpen(!cityOpen)
                setPortalOpen(false)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs font-medium text-slate-800 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-[#05AC5F]" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {cityOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-sm shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 font-heading">
                  Select Coverage City
                </div>
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCity(c);
                      setCityOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition flex items-center justify-between ${
                      selectedCity === c ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c}</span>
                    {selectedCity === c && <span className="w-1.5 h-1.5 rounded-full bg-[#05AC5F]"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-700 font-body">
            <Link href="/customer/booking" className="hover:text-[#05AC5F] transition flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#05AC5F]" />
              Instant 15m Dispatch
            </Link>
            <Link href="/customer/booking" className="hover:text-[#05AC5F] transition">
              Task Stacking
            </Link>
            <Link href="/services" className="hover:text-[#05AC5F] transition">
              All Services
            </Link>
            <Link href="/customer/booking/schedule" className="hover:text-[#05AC5F] transition">
              Daily Maid Pass
            </Link>
          </nav>
        </div>

        {/* Right: Portals Switcher & Actions */}
        <div className="flex items-center gap-3">
          {/* Portals Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setPortalOpen(!portalOpen)
                setCityOpen(false)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 transition font-heading"
            >
              <Grid className="w-3.5 h-3.5 text-slate-500" />
              <span>Portals</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {portalOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-sm shadow-xl p-2 z-50 font-body space-y-1">
                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 font-heading">
                  Yetzo Marketplace Portals
                </div>
                {portals.map((p) => {
                  const Icon = p.icon
                  return (
                    <Link
                      key={p.title}
                      href={p.href}
                      onClick={() => setPortalOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-sm hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group"
                    >
                      <div className="p-1.5 bg-slate-100 rounded-sm text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-heading font-medium text-xs text-slate-900 group-hover:text-emerald-700">
                            {p.title}
                          </span>
                          <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded-sm border ${p.badgeColor}`}>
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.desc}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {userLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/customer/bookings"
                className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 transition hidden sm:flex items-center gap-1.5 border border-slate-200 rounded-sm hover:bg-slate-50"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>My Chores</span>
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
              className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-2 transition hidden sm:flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Login</span>
            </Link>
          )}

          <Link
            href="/customer/booking"
            className="bg-[#05AC5F] hover:bg-[#049652] text-white px-3.5 py-2 rounded-sm text-xs font-semibold tracking-wide transition shadow-sm flex items-center gap-2 font-heading uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-white/90 animate-ping"></span>
            <span>Book Instant Help</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
