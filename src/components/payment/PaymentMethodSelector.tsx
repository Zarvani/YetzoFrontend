import * as React from "react"
import { CreditCard, Wallet } from "lucide-react"

export function PaymentMethodSelector() {
  return (
    <div className="space-y-4">
      <label className="relative flex cursor-pointer rounded-[12px] border-2 border-[#2563EB] bg-blue-50/30 p-5 focus:outline-none hover:bg-blue-50 transition-colors">
        <input type="radio" name="payment" value="upi" className="sr-only" defaultChecked />
        <span className="flex flex-1 items-center justify-between">
          <span className="flex items-center gap-4">
            <div className="h-8 w-12 bg-white border border-[#E2E8F0] rounded-[4px] flex items-center justify-center font-bold text-[#0F172A] text-[11px] shrink-0">
              UPI
            </div>
            <span className="text-[15px] font-bold text-[#0F172A]">UPI / QR Code</span>
          </span>
          <span className="h-5 w-5 rounded-full border-[5px] border-[#2563EB] bg-white"></span>
        </span>
      </label>

      <label className="relative flex cursor-pointer rounded-[12px] border-2 border-[#E2E8F0] bg-white p-5 focus:outline-none hover:border-[#CBD5E1] transition-colors">
        <input type="radio" name="payment" value="card" className="sr-only" />
        <span className="flex flex-1 items-center justify-between">
          <span className="flex items-center gap-4">
            <div className="h-8 w-12 bg-white border border-[#E2E8F0] rounded-[4px] flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-[#64748B]" />
            </div>
            <span className="flex flex-col">
              <span className="text-[15px] font-bold text-[#0F172A]">Credit / Debit Card</span>
              <span className="text-[12px] text-[#64748B] mt-0.5">Visa, Mastercard, RuPay</span>
            </span>
          </span>
          <span className="h-5 w-5 rounded-full border-2 border-[#CBD5E1] bg-white"></span>
        </span>
      </label>
      
      <label className="relative flex cursor-pointer rounded-[12px] border-2 border-[#E2E8F0] bg-white p-5 focus:outline-none hover:border-[#CBD5E1] transition-colors opacity-60">
        <input type="radio" name="payment" value="wallet" className="sr-only" disabled />
        <span className="flex flex-1 items-center justify-between">
          <span className="flex items-center gap-4">
            <div className="h-8 w-12 bg-white border border-[#E2E8F0] rounded-[4px] flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5 text-[#64748B]" />
            </div>
            <span className="flex flex-col">
              <span className="text-[15px] font-bold text-[#0F172A]">Yetzo Wallet</span>
              <span className="text-[12px] text-[#DC2626] mt-0.5">Insufficient Balance (₹0)</span>
            </span>
          </span>
          <span className="h-5 w-5 rounded-full border-2 border-[#CBD5E1] bg-slate-100"></span>
        </span>
      </label>
    </div>
  )
}
