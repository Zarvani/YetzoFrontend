import * as React from "react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Panel - Branding/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-block text-[32px] font-bold tracking-tight">
            YETZO
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-24">
          <h1 className="text-[40px] font-bold leading-[1.15] mb-6">
            Instant Services.<br />Instant Shopping.
          </h1>
          <p className="text-[18px] text-blue-100 font-normal leading-relaxed">
            Join thousands of users who trust Yetzo for verified professionals, transparent pricing, and instant bookings.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-[14px] text-blue-200">
          <span>© 2026 Yetzo</span>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-6">
          <Link href="/" className="text-[24px] font-bold tracking-tight text-[#0B2D8F]">
            YETZO
          </Link>
        </div>
        
        <main className="w-full max-w-sm mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
