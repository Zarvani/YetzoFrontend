"use client"
import * as React from "react"
import Link from "next/link"
import { MapPin, Search } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 bg-white ${isScrolled ? 'shadow-[0_2px_12px_rgba(15,23,42,0.06)]' : 'border-b border-[#E2E8F0]'}`}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
        
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center">
            <img src="/assets/images/logo.png" alt="Yetzo" className="h-[34px] w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-[15px] font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors">Services</Link>
            <Link href="/how-it-works" className="text-[15px] font-medium text-[#475569] hover:text-[#2563EB] transition-colors">How It Works</Link>
            <Link href="/offers" className="text-[15px] font-medium text-[#475569] hover:text-[#2563EB] transition-colors">Offers</Link>
            <Link href="/help" className="text-[15px] font-medium text-[#475569] hover:text-[#2563EB] transition-colors">Help</Link>
          </nav>
        </div>

        {/* Center: Search (Visible on large screens) */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="flex w-full items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] h-[48px] overflow-hidden focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all">
            <div className="flex items-center pl-4 pr-3 border-r border-[#E2E8F0]">
              <MapPin className="h-4 w-4 text-[#64748B] mr-2" />
              <span className="text-[14px] text-[#0F172A] font-medium">Agra</span>
            </div>
            <div className="flex-1 flex items-center px-3">
              <Search className="h-4 w-4 text-[#64748B] mr-2" />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="w-full bg-transparent text-[14px] outline-none text-[#0F172A] placeholder:text-[#64748B]"
              />
            </div>
          </div>
        </div>

        {/* Right: Auth & Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[15px] font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/register" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-[8px] text-[14px] font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
