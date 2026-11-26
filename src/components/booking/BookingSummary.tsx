import * as React from "react"
import { ShieldCheck, Tag } from "lucide-react"

interface BookingSummaryProps {
  bookingData?: any;
}

export function BookingSummary({ bookingData }: BookingSummaryProps) {
  if (!bookingData) {
    return (
      <div className="bg-white rounded-md border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sticky top-24 font-body">
        <h3 className="text-sm font-semibold font-heading text-slate-900 uppercase tracking-wider mb-4">
          Visit Summary
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-3.5 bg-slate-100 rounded-sm w-3/4"></div>
          <div className="h-3.5 bg-slate-100 rounded-sm w-1/2"></div>
          <div className="h-3.5 bg-slate-100 rounded-sm w-5/6"></div>
          <div className="h-7 bg-slate-100 rounded-sm w-full mt-3"></div>
        </div>
      </div>
    );
  }

  const subtotal = bookingData.base_price || bookingData.subtotal || 0;
  const taxes = bookingData.taxes || bookingData.tax || 0;
  const total = bookingData.total_amount || bookingData.total || 0;
  const discount = bookingData.discount || 0; 
  const serviceName = bookingData.service_name || bookingData.service?.name || "Selected Chores";
  const refText = bookingData.booking_reference ? `Ref: ${bookingData.booking_reference}` : "";

  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sticky top-24 font-body space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
          Order Review
        </span>
        <h3 className="text-base font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
          Visit Summary
        </h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-start text-xs">
          <div>
            <p className="font-semibold text-slate-900 font-heading">
              {serviceName}
            </p>
            {refText && (
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                {refText}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 font-heading">₹{subtotal}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Chores Subtotal</span>
          <span className="font-heading">₹{subtotal}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-blue-800 bg-blue-50 p-1.5 rounded-sm font-semibold">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> Stacking Discount
            </span>
            <span className="font-heading">-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>GST & Platform Fee</span>
          <span className="font-heading">₹{taxes}</span>
        </div>
        
        <div className="flex justify-between items-center border-t border-slate-200 pt-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 font-heading">Total Payable</span>
          <span className="text-lg font-semibold text-blue-700 font-heading">₹{total}</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-sm p-3 flex gap-2.5 items-start border border-slate-200 text-xs">
        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Includes <strong className="text-slate-900">₹10,000 damage protection</strong> & free partner replacement if not satisfied.
        </p>
      </div>
    </div>
  )
}
