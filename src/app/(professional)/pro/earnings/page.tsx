import * as React from "react"
import Link from "next/link"
import { TrendingUp, IndianRupee, ArrowDownRight, ArrowUpRight, Calendar as CalendarIcon, Download } from "lucide-react"

export default function ProfessionalEarningsPage() {
  return (
    <div className="max-w-[1000px]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Earnings</h1>
          <p className="text-[15px] text-[#64748B] mt-1">Track your income and transaction history.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-[#CBD5E1] text-[#0F172A] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <CalendarIcon className="h-4 w-4" /> This Month
          </button>
          <button className="bg-white border border-[#CBD5E1] text-[#0F172A] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0F172A] p-6 rounded-[16px] text-white shadow-lg relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2563EB] opacity-40 blur-[40px] rounded-full pointer-events-none"></div>
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">Net Earnings</p>
          <div className="flex items-end gap-2 mb-4 relative z-10">
            <h2 className="text-[36px] font-bold leading-none">₹42,850</h2>
          </div>
          <div className="flex justify-between items-center text-[13px] font-medium border-t border-slate-700/50 pt-4 relative z-10">
            <span className="text-slate-400">Oct 1 - Oct 12, 2026</span>
            <span className="text-[#16A34A] flex items-center"><TrendingUp className="h-4 w-4 mr-1" /> +18.2%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Jobs Completed</p>
            <h2 className="text-[32px] font-bold text-[#0F172A] leading-none">48</h2>
          </div>
          <div className="border-t border-[#E2E8F0] pt-4 mt-4 text-[13px] font-medium flex justify-between">
            <span className="text-[#64748B]">Average per job</span>
            <span className="text-[#0F172A] font-bold">₹892</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Tips & Bonuses</p>
            <h2 className="text-[32px] font-bold text-[#0F172A] leading-none">₹2,150</h2>
          </div>
          <div className="border-t border-[#E2E8F0] pt-4 mt-4 text-[13px] font-medium flex justify-between">
            <span className="text-[#64748B]">Incentives achieved</span>
            <span className="text-[#0F172A] font-bold">3/4</span>
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Recent Transactions</h2>
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="py-4 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Transaction</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">ID</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            <tr className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-[#16A34A]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">Service Payment</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">AC Deep Cleaning</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-[#64748B] font-medium">YZ-102938</td>
              <td className="py-4 px-6 text-[#64748B] font-medium hidden sm:table-cell">Today, 11:30 AM</td>
              <td className="py-4 px-6 text-right font-bold text-[#16A34A]">+₹420.00</td>
            </tr>

            <tr className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-[#16A34A]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">Customer Tip</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">Excellent Service</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-[#64748B] font-medium">YZ-102938</td>
              <td className="py-4 px-6 text-[#64748B] font-medium hidden sm:table-cell">Today, 11:30 AM</td>
              <td className="py-4 px-6 text-right font-bold text-[#16A34A]">+₹100.00</td>
            </tr>

            <tr className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="h-5 w-5 text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">Platform Fee</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">Commission (15%)</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-[#64748B] font-medium">YZ-102938</td>
              <td className="py-4 px-6 text-[#64748B] font-medium hidden sm:table-cell">Today, 11:30 AM</td>
              <td className="py-4 px-6 text-right font-bold text-[#0F172A]">-₹63.00</td>
            </tr>

            <tr className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-[#16A34A]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">Service Payment</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">Bathroom Deep Cleaning</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-[#64748B] font-medium">YZ-102812</td>
              <td className="py-4 px-6 text-[#64748B] font-medium hidden sm:table-cell">Yesterday, 04:15 PM</td>
              <td className="py-4 px-6 text-right font-bold text-[#16A34A]">+₹350.00</td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 border-t border-[#E2E8F0] text-center">
          <Link href="#" className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8]">View all transactions</Link>
        </div>
      </div>

    </div>
  )
}
