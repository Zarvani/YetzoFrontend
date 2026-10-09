"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Search, Filter, Download } from "lucide-react"
import { BookingTable } from "@/components/admin/BookingTable"
import { apiClient } from "@/lib/apiClient"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("yetzo_access_token")
      if (!token) return
      
      try {
        const res = await apiClient<any>("/bookings/", { token })
        setBookings(res.data)
      } catch (err) {
        console.error("Failed to load bookings", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookings()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Booking Management</h1>
          <p className="text-[15px] text-slate-500 mt-1">View and manage all customer bookings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-white">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Booking ID, Customer, or Professional..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        
        <BookingTable bookings={bookings} isLoading={isLoading} />
      </Card>
    </div>
  )
}
