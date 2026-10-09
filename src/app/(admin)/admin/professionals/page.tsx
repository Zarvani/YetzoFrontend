import * as React from "react"
import Link from "next/link"
import { Search, Filter, MoreVertical, Eye, Edit2, Ban } from "lucide-react"

export default function AdminProfessionalsPage() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-[#0F172A]">Professional Management</h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">Manage and onboard service providers.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Search name, phone, or ID..." 
              className="w-[250px] bg-[#F8FAFC] border border-[#CBD5E1] pl-9 pr-4 py-2 rounded-[8px] text-[13px] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <button className="h-[38px] px-3 bg-white border border-[#CBD5E1] rounded-[8px] text-[#0F172A] flex items-center justify-center hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
          <button className="h-[38px] px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[8px] text-[13px] font-bold transition-colors">
            + Add Pro
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Professional</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Category</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Status</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Rating</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Earnings</th>
              <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {[
              { id: "YP-9923", name: "Rahul Kumar", cat: "AC Services", status: "Online", rating: 4.9, earnings: "₹42,850", color: "bg-[#16A34A]" },
              { id: "YP-8841", name: "Amit Sharma", cat: "Plumbing", status: "On Job", rating: 4.7, earnings: "₹38,200", color: "bg-[#2563EB]" },
              { id: "YP-7732", name: "Vikram Singh", cat: "Cleaning", status: "Offline", rating: 4.5, earnings: "₹24,100", color: "bg-[#94A3B8]" },
              { id: "YP-9988", name: "Suresh Patel", cat: "AC Services", status: "Suspended", rating: 3.2, earnings: "₹8,450", color: "bg-[#DC2626]" },
              { id: "YP-4431", name: "Mohit Verma", cat: "Electrical", status: "Online", rating: 4.8, earnings: "₹51,900", color: "bg-[#16A34A]" },
            ].map((pro, i) => (
              <tr key={i} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-[#E2E8F0] bg-slate-200 shrink-0">
                      {i === 0 ? (
                        <img src="/assets/images/ac-service.jpg" alt={pro.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[12px] font-bold text-[#64748B]">{pro.name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">{pro.name}</p>
                      <p className="text-[12px] text-[#64748B] font-medium">{pro.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-[#475569] font-medium">{pro.cat}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold text-white ${pro.color}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-white opacity-80"></span>
                    {pro.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-[#0F172A] font-bold flex items-center gap-1">
                  <span className="text-[#F59E0B]">★</span> {pro.rating}
                </td>
                <td className="py-4 px-6 text-[#0F172A] font-bold">{pro.earnings}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded transition-colors"><Eye className="h-4 w-4" /></button>
                    <button className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors"><Ban className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
        <p className="text-[13px] text-[#64748B] font-medium">Showing 1 to 5 of 156 professionals</p>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-[#CBD5E1] rounded-[6px] text-[13px] font-medium text-[#0F172A] bg-white opacity-50 cursor-not-allowed">Prev</button>
          <button className="px-3 py-1 border border-[#CBD5E1] rounded-[6px] text-[13px] font-medium text-[#0F172A] bg-white hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  )
}
