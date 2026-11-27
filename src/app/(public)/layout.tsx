import * as React from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { LocationPromptModal } from "@/components/location/LocationPromptModal"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <LocationPromptModal />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
