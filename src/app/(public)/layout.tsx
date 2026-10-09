import * as React from "react"
import { Header } from "@/components/layout/Header"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {/* Footer will go here */}
      <footer className="border-t border-[#E2E8F0] bg-white py-12 text-center text-[#64748B]">
        <p className="text-[14px]">© 2026 Yetzo. Instant Services • Instant Shopping.</p>
      </footer>
    </div>
  )
}
