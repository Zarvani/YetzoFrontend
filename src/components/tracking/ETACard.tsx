import * as React from "react"
import { Clock } from "lucide-react"

interface ETACardProps {
  time: string
  distance: string
  status: string
}

export function ETACard({ time, distance, status }: ETACardProps) {
  return (
    <div className="bg-[#0F172A] rounded-[16px] p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative gradient pulse */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#06B6D4] opacity-20 blur-[40px] rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#2563EB] opacity-30 blur-[40px] rounded-full"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[13px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
            <p className="text-[18px] font-bold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#06B6D4]"></span>
              </span>
              {status}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[13px] text-slate-400 font-bold uppercase tracking-wider mb-1">Arriving In</p>
            <div className="flex items-center gap-1.5 text-[#06B6D4]">
              <Clock className="h-5 w-5" />
              <span className="text-[24px] font-bold leading-none">{time}</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] h-1.5 rounded-full w-[75%] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>
        </div>
        
        <div className="flex justify-between text-[12px] text-slate-400 font-medium">
          <span>{distance} away</span>
          <span>Almost there</span>
        </div>
      </div>
    </div>
  )
}
