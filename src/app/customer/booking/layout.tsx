import * as React from "react"

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body">
      {/* Main Booking Content */}
      <main className="flex-1 py-6">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
