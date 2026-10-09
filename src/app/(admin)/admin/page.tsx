import * as React from "react"
import Link from "next/link"
import { TrendingUp, Users, Briefcase, IndianRupee, AlertTriangle, ChevronRight } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Platform Command Center</h1>
          <p className="text-[15px] text-[#64748B] mt-1">Live metrics and operational status.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#16A34A] bg-green-50 px-3 py-1.5 rounded-[8px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
            </span>
            System Healthy
          </span>
          <select className="bg-white border border-[#CBD5E1] text-[#0F172A] px-4 py-2 rounded-[8px] text-[13px] font-bold focus:outline-none">
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      {/* Top 4 Metrics - As per spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Gross Revenue</p>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center"><IndianRupee className="h-4 w-4 text-[#2563EB]" /></div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">₹1,42,850</h2>
            <span className="text-[13px] font-medium text-[#16A34A] flex items-center mb-1"><TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +14%</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Bookings</p>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center"><Briefcase className="h-4 w-4 text-[#2563EB]" /></div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">284</h2>
            <span className="text-[13px] font-medium text-[#16A34A] flex items-center mb-1"><TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +8%</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Active Pros</p>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center"><Users className="h-4 w-4 text-[#2563EB]" /></div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">156</h2>
            <span className="text-[13px] font-medium text-[#16A34A] flex items-center mb-1">Online now</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Completed Jobs</p>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center"><Briefcase className="h-4 w-4 text-[#2563EB]" /></div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">192</h2>
            <span className="text-[13px] font-medium text-[#0F172A] mb-1">67% Completion</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Unassigned / Delayed Jobs */}
        <div className="lg:col-span-2">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Urgent Operations</h2>
          
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-[#E2E8F0] bg-red-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
                <span className="text-[14px] font-bold text-[#DC2626]">Unassigned Bookings (3)</span>
              </div>
              <Link href="/admin/dispatch" className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8]">Manual Dispatch →</Link>
            </div>
            
            <table className="w-full text-left border-collapse">
              <tbody className="text-[14px]">
                <tr className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#0F172A]">YZ-102941</td>
                  <td className="py-3 px-4 text-[#475569]">AC Service (Instant)</td>
                  <td className="py-3 px-4 text-[#DC2626] font-medium">Waiting 14 mins</td>
                  <td className="py-3 px-4 text-right"><button className="px-3 py-1 bg-[#0F172A] text-white rounded-[6px] text-[12px] font-bold">Assign</button></td>
                </tr>
                <tr className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#0F172A]">YZ-102942</td>
                  <td className="py-3 px-4 text-[#475569]">Plumbing (Instant)</td>
                  <td className="py-3 px-4 text-[#DC2626] font-medium">Waiting 12 mins</td>
                  <td className="py-3 px-4 text-right"><button className="px-3 py-1 bg-[#0F172A] text-white rounded-[6px] text-[12px] font-bold">Assign</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Live Activity Stream</h2>
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-4 h-[250px] overflow-hidden relative">
             <div className="space-y-4">
               <div className="flex items-start gap-3">
                 <div className="h-2 w-2 rounded-full bg-[#16A34A] mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-[14px] font-medium text-[#0F172A]">Rahul Kumar completed job YZ-102891</p>
                   <p className="text-[12px] text-[#64748B]">2 mins ago</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="h-2 w-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-[14px] font-medium text-[#0F172A]">New booking YZ-102950 (Home Cleaning)</p>
                   <p className="text-[12px] text-[#64748B]">5 mins ago</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="h-2 w-2 rounded-full bg-[#06B6D4] mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-[14px] font-medium text-[#0F172A]">Pro Amit Singh came online</p>
                   <p className="text-[12px] text-[#64748B]">8 mins ago</p>
                 </div>
               </div>
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </div>
        
        {/* Right Column: Chart Placeholders */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-5 h-[200px] flex flex-col">
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">Bookings by Category</h3>
            <p className="text-[12px] text-[#64748B] mb-4">Today</p>
            <div className="flex-1 flex items-end gap-2 justify-center pb-2">
              <div className="w-8 bg-[#2563EB] rounded-t-[4px]" style={{ height: "100%" }}></div>
              <div className="w-8 bg-[#06B6D4] rounded-t-[4px]" style={{ height: "60%" }}></div>
              <div className="w-8 bg-[#94A3B8] rounded-t-[4px]" style={{ height: "40%" }}></div>
              <div className="w-8 bg-[#CBD5E1] rounded-t-[4px]" style={{ height: "20%" }}></div>
            </div>
            <div className="flex justify-center gap-4 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-2 border-t border-[#E2E8F0] pt-2">
              <span>AC</span>
              <span>Clean</span>
              <span>Plumb</span>
              <span>Other</span>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-[16px] shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB] opacity-20 blur-[40px] rounded-full pointer-events-none"></div>
            <h3 className="text-[16px] font-bold mb-2">System Analytics</h3>
            <p className="text-[13px] text-slate-400 mb-6 leading-relaxed">
              Dispatch algorithms are running optimally. No server lag detected.
            </p>
            <Link href="/admin/analytics" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#06B6D4] hover:text-white transition-colors">
              View Detailed Reports <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  )
}
