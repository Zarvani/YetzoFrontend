import * as React from "react"
import Link from "next/link"
import { Building2, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function ProfessionalPayoutsPage() {
  return (
    <div className="max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Payouts</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Manage your bank accounts and withdrawal history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bank Accounts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6">
            <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Payout Method</h2>
            
            <div className="border border-[#2563EB] bg-blue-50/30 rounded-[12px] p-4 flex gap-4 items-start relative mb-4">
              <div className="absolute top-4 right-4 h-5 w-5 bg-[#2563EB] rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              <div className="h-10 w-10 bg-white border border-[#E2E8F0] rounded-[8px] flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#2563EB] uppercase tracking-wider mb-0.5">Primary Account</p>
                <p className="text-[15px] font-bold text-[#0F172A]">HDFC Bank</p>
                <p className="text-[13px] text-[#64748B] mt-1 font-medium">•••• •••• •••• 4092</p>
              </div>
            </div>

            <button className="w-full py-3 bg-white border border-[#CBD5E1] text-[#0F172A] rounded-[8px] text-[13px] font-bold hover:bg-slate-50 transition-colors">
              Add New Bank Account
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4 flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-[13px] text-blue-900 leading-relaxed">
              <strong>Weekly Payouts</strong>: Your available balance is automatically transferred to your primary bank account every Monday morning.
            </p>
          </div>
        </div>

        {/* Right Column: Payout History */}
        <div className="lg:col-span-7">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Payout History</h2>
          
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-[#64748B]" />
                </div>
                <div>
                  <p className="font-bold text-[#0F172A]">Processing</p>
                  <p className="text-[13px] text-[#64748B] mt-0.5">Expected by Oct 14</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-[#0F172A]">₹14,250</p>
              </div>
            </div>

            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-[#16A34A]" />
                </div>
                <div>
                  <p className="font-bold text-[#0F172A]">Paid to HDFC •••• 4092</p>
                  <p className="text-[13px] text-[#64748B] mt-0.5">Oct 05, 2026</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-[#0F172A]">₹22,100</p>
              </div>
            </div>

            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-[#16A34A]" />
                </div>
                <div>
                  <p className="font-bold text-[#0F172A]">Paid to HDFC •••• 4092</p>
                  <p className="text-[13px] text-[#64748B] mt-0.5">Sep 28, 2026</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-[#0F172A]">₹18,450</p>
              </div>
            </div>
            
            <div className="p-4 bg-[#F8FAFC] text-center">
              <button className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8]">Load earlier payouts</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
