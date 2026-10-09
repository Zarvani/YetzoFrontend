import * as React from "react"
import Link from "next/link"
import { Search, Filter, Eye, MoreHorizontal, Calendar, MapPin } from "lucide-react"

export default function AdminBookingsPage() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-[#0F172A]">Bookings Log</h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">Real-time view of all platform bookings.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Search ID or Customer..." 
              className="w-[250px] bg-[#F8FAFC] border border-[#CBD5E1] pl-9 pr-4 py-2 rounded-[8px] text-[13px] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <button className="h-[38px] px-3 bg-white border border-[#CBD5E1] rounded-[8px] text-[#0F172A] flex items-center justify-center hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Booking ID / Service</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Customer</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Professional</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Time & Location</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Status</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {[
              { id: "YZ-102941", srv: "AC Deep Cleaning", cust: "Amit Sharma", pro: "Rahul Kumar", time: "Instant", loc: "Sikandra", status: "In Progress", color: "bg-[#06B6D4]", amt: "₹1,738" },
              { id: "YZ-102940", srv: "Sofa Cleaning", cust: "Priya Desai", pro: "Vikram Singh", time: "Today, 2PM", loc: "Taj Ganj", status: "Scheduled", color: "bg-[#2563EB]", amt: "₹899" },
              { id: "YZ-102939", srv: "Electrician", cust: "Ravi Teja", pro: "Mohit Verma", time: "Instant", loc: "Dayalbagh", status: "Completed", color: "bg-[#16A34A]", amt: "₹450" },
              { id: "YZ-102938", srv: "Plumbing", cust: "Neha Gupta", pro: "Unassigned", time: "Instant", loc: "Khandari", status: "Delayed", color: "bg-[#DC2626]", amt: "₹299" },
            ].map((bk, i) => (
              <tr key={i} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-[#0F172A]">{bk.id}</p>
                  <p className="text-[13px] text-[#475569] font-medium">{bk.srv}</p>
                </td>
                <td className="py-4 px-6 font-medium text-[#0F172A]">{bk.cust}</td>
                <td className="py-4 px-6">
                  {bk.pro === "Unassigned" ? (
                    <span className="text-[12px] font-bold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded">Unassigned</span>
                  ) : (
                    <span className="font-medium text-[#0F172A]">{bk.pro}</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-[#475569] text-[13px] font-medium mb-0.5">
                    <Calendar className="h-3.5 w-3.5" /> {bk.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-[#64748B] text-[12px]">
                    <MapPin className="h-3 w-3" /> {bk.loc}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold text-white ${bk.color}`}>
                    {bk.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-bold text-[#0F172A]">{bk.amt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
        <p className="text-[13px] text-[#64748B] font-medium">Showing 4 of 284 bookings</p>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-[#CBD5E1] rounded-[6px] text-[13px] font-medium text-[#0F172A] bg-white opacity-50 cursor-not-allowed">Prev</button>
          <button className="px-3 py-1 border border-[#CBD5E1] rounded-[6px] text-[13px] font-medium text-[#0F172A] bg-white hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  )
}
